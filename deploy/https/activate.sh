#!/usr/bin/env bash
set -euo pipefail

edge_dir="$HOME/ebike-test/private/https"
install -d -m 700 "$edge_dir"
if [[ ! -s "$edge_dir/staff.htpasswd" ]]; then
    umask 077
    password_hash=$(openssl passwd -6)
    test -n "$password_hash"
    printf 'fleet:%s\n' "$password_hash" > "$edge_dir/staff.htpasswd"
fi

export PM2_HOME="$HOME/ebike-test/.pm2"
export EBIKE_DASHBOARD_ORIGIN=https://ebike.srv938083.hstgr.cloud
export EBIKE_DASHBOARD_SOCKET="$edge_dir/dashboard.sock"
pm2 restart ebike-fleet-dashboard --update-env
pm2 save

curl --retry 4 --retry-all-errors --fail --silent --show-error \
    --unix-socket "$EBIKE_DASHBOARD_SOCKET" http://localhost/settings >/dev/null

sudo env EBIKE_UID="$(id -u)" EBIKE_GID="$(id -g)" EBIKE_EDGE_DIR="$edge_dir" \
    docker compose -p ebike-https -f "$HOME/ebike-test/repo/deploy/https/compose.yaml" up -d --build
