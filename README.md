# eBike fleet test server

Local demonstration only. Requires Node.js. Run `npm install`, then `npm start`, and visit http://127.0.0.1:3000. Stop with Ctrl+C.

The MQTT 3.1.1 test broker listens on 127.0.0.1:1883 only. A simulated client publishes four sample bikes to demo/bikes/<id>/telemetry every 15 seconds; the dashboard displays sample data and an MQTT message counter. This is not Alan's protocol and no real bike is connected. Dashboard navigation and map are illustrative; no lock commands are implemented. Broker has no authentication or TLS and must not be exposed to a network. Real hardware, SIM/APN, supplier protocol, hosting, access control, durability, and production security require further work and testing.

## VPS scaffold (not deployed)

Docker Compose defines an authenticated Mosquitto broker and an independent demo dashboard. Both host ports bind to the VPS loopback interface only: broker 1884, dashboard 3000. The dashboard runs its own simulated local broker; it is not connected to the separate Mosquitto service. No device access or remote lock commands are configured.

On a chosen Linux VPS with Docker Compose, create the untracked `deploy/mosquitto/secrets` directory and a password file owned/readable by the container. For example, run `docker run --rm -it -v "$PWD/deploy/mosquitto/secrets:/work" eclipse-mosquitto:2.0.22 mosquitto_passwd -c /work/passwd ebike-test`, and enter a strong password interactively; do not commit or print it. Set appropriate file permissions on the host. Then run `docker compose up -d --build`. Access through an authenticated SSH tunnel, e.g. `ssh -L 3000:127.0.0.1:3000 -L 1884:127.0.0.1:1884 <vps-user>@<vps-host>`. The account has read/write access only to `test/ebike/#`.

These instructions are a scaffold. Confirm port availability, permissions, firewall and existing services on the target first. Do not expose the broker to the internet: TLS, device-specific credentials and access rules, monitoring and supplier compatibility must be designed and verified before any external device can connect.

## VPS Node service

`deploy/broker.js` is an independent MQTT 3.1.1 test broker with password authentication, access restricted to `test/ebike/`, and a loopback-only listener (default 1884). Supply `EBIKE_BROKER_CONFIG` as the path to a private JSON file containing `username` and a random `password` of at least 24 characters. `deploy/test-broker.js` checks an authenticated roundtrip, wrong-password rejection and unrelated topic denial. The dashboard remains a separate static-data demo and does not use this broker. Neither is a real-bike integration; no public endpoint, TLS or APN is configured.

## Integrated VPS test dashboard

`fleet-server.js` connects to the separately running authenticated test broker and subscribes to `test/ebike/+/telemetry`. It validates synthetic payloads and saves the last simulated status and planning-only SIM settings to `EBIKE_STATE_PATH`. It requires `EBIKE_BROKER_CONFIG`, optional `EBIKE_MQTT_URL` and `DASHBOARD_PORT`; it binds HTTP to loopback. `deploy/simulate.js` publishes four explicitly simulated bikes. The JSON format is a test contract, not Alan's device protocol. No locking, real-device provisioning, historical data, or operational map is implemented. Access through SSH only.

### Dashboard access

Open the fleet overview and select **Settings**, or go directly to `/settings`. The settings page remains usable when the MQTT broker is disconnected. It records the SIM provider and APN for the selected plan.

For browser access without an SSH tunnel, the VPS administrator can route an approved company hostname through the existing HTTPS edge to `127.0.0.1:3185` (or the equivalent host address if the edge runs in a container). Put staff authentication in front of every route, including `/api/*`. Set `EBIKE_DASHBOARD_ORIGIN` on the dashboard service to the exact HTTPS origin, such as `https://ebikes.example.com`, and restart the service with the updated environment. Verify that an unauthenticated external request is rejected and that a signed-in user can load and save Settings. MQTT routing and device onboarding are separate.

### HTTPS on the existing VPS

The hostname `ebike.srv938083.hstgr.cloud` resolves to the VPS. The deployment uses the existing Traefik HTTPS entrypoint and certificate resolver. A dedicated Nginx container requires a staff login on every page and API request and reaches the existing dashboard over a Unix socket. The database file and MQTT broker remain with the existing service.

From the VPS deployment account, run `bash ~/ebike-test/repo/deploy/https/activate.sh` in a terminal with sudo access. OpenSSL prompts to create the initial `fleet` login password. The activation script stores only its hash in a private directory outside Git. After certificate issuance, check the external HTTPS Settings URL without credentials for HTTP 401, then sign in and verify save and reload. Keep test credentials separate from supplier credentials.

### Next.js dashboard deploy

The public dashboard and Settings pages are built with Next.js and exported into the HTTPS Docker image. The same Traefik router handles TLS, and the same staff login protects the pages, assets and API. Nginx forwards /api/ to the existing VPS service over its Unix socket. That service owns persisted Settings and the MQTT subscription.

Run `npm ci` and `npm run build` to build the dashboard. The VPS activation script rebuilds the web image from the checkout. For a staged rollout, set EBIKE_WEB_TAG to the release commit, build the edge service first and verify the image, then use Compose up with --no-build. The legacy HTML remains available on the loopback backend for rollback.

### Fitcoo MQTT pilot verification

The VPS test broker accepts simulated Fitcoo reports on the supplier's `bike` topic using a dedicated publish-only account. In the private broker configuration, set `fitcooFixture` to an object with its own `username` and randomly generated `password` of at least 24 characters. Keep the file outside Git and readable only by the deployment account. Restart the broker and fleet service using the existing PM2 home. Run `deploy/test-fitcoo.js` with the existing broker configuration and local MQTT URL. It publishes the registered synthetic fixture and verifies dashboard readback.

The adapter accepts heartbeat (27), GPS (19) and vehicle parameter (16) reports for the fixture. The dashboard displays it as simulated. GPS reports without an explicit direction are retained as raw reports and shown as unconfirmed. The broker remains on loopback. Confirm the shipping firmware, MQTT transport security, per-device provisioning, GPS encoding and Vodacom APN before testing a physical scooter. Device commands and firmware changes are outside this stage.
