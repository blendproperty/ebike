#!/usr/bin/env bash
set -euo pipefail

# Certbot supplies the renewed certificate directory. The activation can also pass it explicitly.
lineage="${1:-${RENEWED_LINEAGE:?Provide the pilot certificate directory}}"
secrets=/etc/ebike-mqtt-pilot/secrets
test "$(id -u)" -eq 0
test -d "$secrets"

install -m 0640 -o root -g 1883 "$lineage/fullchain.pem" "$secrets/fullchain.pem"
install -m 0640 -o root -g 1883 "$lineage/privkey.pem" "$secrets/privkey.pem"

container=$(docker ps --quiet --filter label=com.docker.compose.project=ebike-mqtt-standalone \
    --filter label=com.docker.compose.service=broker)
if [[ -n "$container" ]]; then
    docker kill --signal HUP "$container" >/dev/null
fi
