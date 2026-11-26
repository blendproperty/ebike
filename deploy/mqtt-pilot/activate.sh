#!/usr/bin/env bash
set -euo pipefail
umask 077

compose_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
pilot_dir="$HOME/ebike-test/private/mqtt-pilot"
install -d -m 700 "$pilot_dir"
sudo -v

if [[ ! -s "$pilot_dir/credentials" ]]; then
    credentials_tmp=$(mktemp "$pilot_dir/credentials.XXXXXX")
    trap 'rm -f -- "${credentials_tmp:-}" "${password_tmp:-}"' EXIT
    printf 'fitcoo-pilot:%s\nfleet-pilot-observer:%s\n' \
        "$(openssl rand -hex 18)" "$(openssl rand -hex 18)" > "$credentials_tmp"
    mv -- "$credentials_tmp" "$pilot_dir/credentials"
fi

if [[ ! -s "$pilot_dir/passwd" ]]; then
    password_tmp=$(mktemp "$pilot_dir/passwd.XXXXXX")
    trap 'rm -f -- "${credentials_tmp:-}" "${password_tmp:-}"' EXIT
    cp -- "$pilot_dir/credentials" "$password_tmp"
    # Convert the file in place so passwords never appear in process arguments.
    sudo docker run --rm --user "$(id -u):$(id -g)" \
        --mount "type=bind,source=$pilot_dir,target=/pilot" \
        --entrypoint mosquitto_passwd eclipse-mosquitto:2.0.22 \
        -U "/pilot/${password_tmp##*/}"
    mv -- "$password_tmp" "$pilot_dir/passwd"
fi

sudo env MQTT_PILOT_UID="$(id -u)" MQTT_PILOT_GID="$(id -g)" MQTT_PILOT_DIR="$pilot_dir" \
    docker compose -p ebike-mqtt-pilot -f "$compose_dir/compose.yaml" up -d
