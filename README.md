# eBike fleet test server

Local demonstration only. Requires Node.js. Run `npm install`, then `npm start`, and visit http://127.0.0.1:3000. Stop with Ctrl+C.

The MQTT 3.1.1 test broker listens on 127.0.0.1:1883 only. A simulated client publishes four sample bikes to demo/bikes/<id>/telemetry every 15 seconds; the dashboard displays sample data and an MQTT message counter. This is not Alan's protocol and no real bike is connected. Dashboard navigation and map are illustrative; no lock commands are implemented. Broker has no authentication or TLS and must not be exposed to a network. Real hardware, SIM/APN, supplier protocol, hosting, access control, durability, and production security require further work and testing.

## VPS scaffold (not deployed)

Docker Compose defines an authenticated Mosquitto broker and an independent demo dashboard. Both host ports bind to the VPS loopback interface only: broker 1884, dashboard 3000. The dashboard runs its own simulated local broker; it is not connected to the separate Mosquitto service. No device access or remote lock commands are configured.

On a chosen Linux VPS with Docker Compose, create the untracked `deploy/mosquitto/secrets` directory and a password file owned/readable by the container. For example, run `docker run --rm -it -v "$PWD/deploy/mosquitto/secrets:/work" eclipse-mosquitto:2.0.22 mosquitto_passwd -c /work/passwd ebike-test`, and enter a strong password interactively; do not commit or print it. Set appropriate file permissions on the host. Then run `docker compose up -d --build`. Access through an authenticated SSH tunnel, e.g. `ssh -L 3000:127.0.0.1:3000 -L 1884:127.0.0.1:1884 <vps-user>@<vps-host>`. The account has read/write access only to `test/ebike/#`.

These instructions are a scaffold. Confirm port availability, permissions, firewall and existing services on the target first. Do not expose the broker to the internet: TLS, device-specific credentials and access rules, monitoring and supplier compatibility must be designed and verified before any external device can connect.
