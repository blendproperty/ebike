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

### Supplier MQTT pilot

The isolated Mosquitto pilot uses MQTT 3.1.1 over TLS on `mqtt-ebike.srv938083.hstgr.cloud:443`. The device must use the hostname and send it as TLS SNI. Use `fitcoo-pilot` to publish to `bike`. A separate observer can read `bike` for bench verification. The existing dashboard and its simulator use their own broker.

On the VPS deployment account, run `bash ~/ebike-test/repo/deploy/mqtt-pilot/activate.sh` in an interactive terminal with sudo access. The script sets up the pilot container and stores its random credentials under `~/ebike-test/private/mqtt-pilot` outside Git. Share only the supplier credential through an approved private channel.

From outside the VPS, confirm that TLS validates for the pilot hostname and that a message on `bike` reaches the observer. Check that the publisher cannot receive messages, the observer cannot publish, and an unrelated publish is dropped. Confirm the HTTPS dashboard still returns its usual authentication prompt. After the pilot, the administrator can remove only the pilot container and route with `sudo docker compose -p ebike-mqtt-pilot down` from `deploy/mqtt-pilot` with the same UID, GID and private-directory variables used for activation.

#### Optional factory-test port 8883

`deploy/mqtt-pilot/compose.8883.yaml` defines a temporary TCP relay for the same TLS hostname and credentials. It limits traffic to one approved source IPv4 address and forwards only TLS connections whose SNI is `mqtt-ebike.srv938083.hstgr.cloud`. It uses the host network so the VPS input firewall applies. The broker on 443 remains the TLS endpoint behind the relay.

Before the test, confirm the actual test network's public IPv4 and coordinate the expected STOR24 security alert. The shared host check fingerprints `/etc/ufw`. Confirm current firewall rules and any provider firewall before adding an allow rule for **only that IPv4** on TCP 8883. On the VPS, use `sudo env MQTT_PILOT_SOURCE=<approved-ipv4> docker compose -p ebike-mqtt-pilot-8883 -f deploy/mqtt-pilot/compose.8883.yaml up -d` from the repository checkout. Verify the pilot certificate and MQTT login from the allowed source and confirm unrelated sources cannot use the new port. After the test, use the same Compose invocation with `down`, remove only the temporary firewall rule and verify that 8883 is externally inaccessible and the STOR24 monitor has recovered. If the unit cannot send SNI, this relay will reject the handshake.

#### Dedicated Hostinger VPS on port 8883

On the new VPS, copy `deploy/mqtt-pilot/acl` and the `standalone` directory together. The Compose service binds native MQTT over TLS to TCP port 8883 on IPv4 and IPv6. It presents a single certificate, so a client that supports TLS 1.2 but omits SNI can still verify the configured hostname. Use the host firewall and apply any Hostinger firewall policy only to the dedicated VPS.

Create `/etc/ebike-mqtt-pilot/secrets` with root ownership, group 1883 and mode 0750. Generate fresh, separate credentials for `fitcoo-pilot` and `fleet-pilot-observer`. Use Mosquitto's password-file utility to write the hashes to `passwd` in that directory, owned by the container user and group 1883 with mode 0600. Keep the plaintext credentials separately under root-only access.

Issue an ACME certificate for the verified broker hostname. For Certbot standalone validation, permit inbound TCP 80 on the dedicated VPS for issuance and renewal. Run `install-certificate.sh /etc/letsencrypt/live/<hostname>` as root and configure the same script as the renewal deploy hook for that certificate. It copies the certificate and key into the broker's private directory and reloads the running container after renewal.

Start the deployment from the `standalone` directory with `MQTT_PILOT_DIR=/etc/ebike-mqtt-pilot/secrets docker compose -p ebike-mqtt-standalone up -d` as the server administrator. Verify from outside the VPS on 8883 with the supplier and observer credentials before supplying the new hostname and fresh supplier credential. Confirm that TCP 1883 stays unavailable. The shared-host relay and the existing dashboard use separate configuration.

#### Temporary plaintext factory test on port 1883

On the dedicated broker VPS only, copy `deploy/mqtt-pilot/mosquitto.conf` and the `legacy` directory together. As root run `bash /opt/ebike-mqtt-pilot/legacy/activate.sh`. It creates separate one-time credentials, starts an IPv4 plain-MQTT listener, adds the runtime-only firewall rule, and schedules teardown after two hours. Verify approval for each additional test window and distribute only the `fitcoo-1883` credential. Retain use of encrypted 8883 for ongoing service.

To end a test early, run `bash /opt/ebike-mqtt-pilot/legacy/activate.sh stop`. This removes only the temporary rule, the temporary broker container, and its credentials. Verify the scheduled expiry with `systemctl list-timers ebike-mqtt-1883-expiry.timer` and confirm the port is inaccessible after shutdown.

## Rider PWA preview

Run `npm run dev` and open `/rider/` to try the rider dashboard, sample battery level and timed demo ride. Use the install instructions on the page to add it to a phone's home screen from a secure origin. The production-style static export is built with `npm run build` and the preview is packaged in the existing authenticated HTTPS image.

The preview is self-contained and uses simulated values. Live rider access requires individual accounts, authorization for the bike assigned to each rider, and verified telemetry from that bike. Live ride controls require separate bench and handset testing against the shipping hardware.
