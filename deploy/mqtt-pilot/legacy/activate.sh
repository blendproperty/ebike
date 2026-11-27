#!/usr/bin/env bash
set -euo pipefail
umask 077

test "$(id -u)" -eq 0
test "$(hostname -f)" = srv2205848.hstgr.cloud
here="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
private=/etc/ebike-mqtt-1883
export MQTT_LEGACY_SECRETS="$private/secrets"
compose=(docker compose -p ebike-mqtt-legacy -f "$here/compose.yaml")
rule=(ufw-user-input -p tcp --dport 1883 -m comment --comment ebike-mqtt-1883-pilot -j ACCEPT)

stop() {
    if iptables -w -C "${rule[@]}" 2>/dev/null; then
        iptables -w -D "${rule[@]}"
    fi
    systemctl stop ebike-mqtt-1883-expiry.timer 2>/dev/null || true
    "${compose[@]}" down
    rm -f -- "$private/credentials" "$MQTT_LEGACY_SECRETS/passwd"
}

if [[ "${1:-}" == stop ]]; then
    stop
    exit
fi

# Neither the runtime-only firewall rule nor this container is restored after reboot.
iptables -w -S ufw-user-input >/dev/null
if systemctl is-active --quiet ebike-mqtt-1883-expiry.timer || [[ -n "$(ss -ltnH 'sport = :1883')" ]]; then
    echo 'The legacy listener or its expiry timer is already active' >&2
    exit 1
fi

install -d -o root -g 1883 -m 0750 "$private" "$MQTT_LEGACY_SECRETS"
scratch="$(mktemp -d /run/ebike-mqtt-1883.XXXXXXXX)"
trap 'rm -f -- "$scratch/passwd"; rmdir -- "$scratch"' EXIT
printf 'fitcoo-1883:%s\nfitcoo-1883-observer:%s\n' \
    "$(openssl rand -hex 16)" "$(openssl rand -hex 16)" > "$private/credentials"
cp -- "$private/credentials" "$scratch/passwd"
chown 1883:1883 "$scratch" "$scratch/passwd"
image="$("${compose[@]}" config --images)"
docker run --rm --user 1883:1883 \
    --mount "type=bind,source=$scratch,target=/stage" \
    --entrypoint mosquitto_passwd "$image" -U /stage/passwd
install -o 1883 -g 1883 -m 0600 "$scratch/passwd" "$MQTT_LEGACY_SECRETS/passwd"

trap 'stop' ERR
"${compose[@]}" up -d
timeout 10 bash -c 'until ss -ltnH "sport = :1883" | grep -q LISTEN; do sleep 0.25; done'
systemd-run --unit=ebike-mqtt-1883-expiry --on-active=2h /bin/bash "$here/activate.sh" stop
iptables -w -I "${rule[0]}" 1 "${rule[@]:1}"
