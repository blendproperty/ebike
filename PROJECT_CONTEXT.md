# Project context

## 2026-11-26 — Local e-bike test server and dashboard

- Implementation: Created a loopback-only MQTT 3.1.1 broker and local dashboard with four simulated bikes, illustrative map and static fleet data. Simulator publishes telemetry over MQTT; the dashboard shows a received-message count. Navigation is illustrative and commands are not implemented.
- Testing: `npm test` passed HTTP fleet endpoint checks and an MQTT publish/subscribe roundtrip; the browser showed the connected dashboard and simulated message count. `npm audit --omit=dev` reported zero vulnerabilities at validation time.
- Commit and push: Not committed or pushed; this checkout has no commits and no remote configured.
- Merge: Not applicable; no merge performed.
- Deployment and configuration: Local test process only, bound to 127.0.0.1 ports 1883 and 3000; not deployed or configured for external connections. Broker has no TLS or authentication and must not be exposed.
- Live production verification: Not performed; no production environment or real bikes connected.
- Outstanding: Alan's device protocol, MQTT version, SIM and APN, network bands, credentials and TLS support, and test hardware are unconfirmed. Device integration, actual telemetry handling, security, persistence, hosting, lock/unlock, operational testing, staff UAT and approval remain open.

## 2026-11-26 — VPS deployment preparation (incomplete)

- Implementation: Added Docker Compose scaffold for a separate password-protected Mosquitto test broker and the independent simulated dashboard. Both host ports bind to loopback. The dashboard is not integrated with Mosquitto or real devices. Test account is restricted to a test topic; no password is committed.
- Testing: `docker compose config -q` passed; dashboard image built; a local container served the fleet endpoint with four simulated bikes and connected local simulator. `npm audit --omit=dev` reported zero vulnerabilities. Mosquitto container authentication/ACL and the complete Compose stack have not been exercised.
- Commit and push: No commit or push; no remote configured. Connected GitHub account identified as blendproperty, repository destination unresolved.
- Merge: None.
- Deployment and configuration: VPS target not identified; no VPS deployment or secrets configured. Do not expose broker to the internet without TLS, access controls, and integration review.
- Live production verification: None. Supplier protocol, SIM and APN, device compatibility, real-device testing, security, staff UAT and approval remain outstanding.

## 2026-11-26 — GitHub destination

- Repository: `blendproperty/ebike`, public and empty when inspected. Initial scaffold prepared for its `main` branch; no secrets or real device data included.
- Testing: Docker Compose configuration validated and dashboard container smoke-tested locally; standalone MQTT roundtrip previously passed. Mosquitto authentication and complete deployment remain unverified.
- Commit/push: Initial scaffold prepared for push; consult repository history for exact commit. VPS selection remains outstanding.
- Merge: No merge performed. Deployment and live production verification: none. All supplier, SIM, device integration, security and acceptance gates remain open.

- Push evidence: Initial scaffold commit `3a6e3c7` was pushed to `blendproperty/ebike` `main` on 2026-11-26. This follow-up records the push; exact current head is available in Git history. No VPS deployment or production verification has occurred.

## 2026-11-26 — Authenticated Node broker preparation

- Implementation: Added a separate MQTT broker bound to loopback with mandatory credentials and a restricted `test/ebike/` namespace. Dashboard remains simulated and separate. External listener, TLS, real-device integration, persistence and commands remain unimplemented.
- Testing: Local broker accepted a synthetic publish/subscribe roundtrip, rejected incorrect credentials and denied an unrelated topic subscription. VPS deployment is in progress; no live device verification.
- Commit and push: See Git history for the prepared deployment. Merge: none. Deployment: pending. Supplier protocol, SIM/APN, security review, uptime and hardware tests remain outstanding.

## 2026-11-26 — VPS test services (partial deployment)

- Implementation: Authenticated MQTT 3.1.1 test broker in `deploy/broker.js`; demo dashboard remains separate with simulated values. No supplier protocol, real-bike ingestion, control, persistent telemetry or SIM/APN integration.
- Testing: Locally and on the VPS, synthetic MQTT publish/subscribe succeeded, wrong credentials were rejected and an unrelated subscription denied. VPS dashboard API returned four simulated bikes and a connected simulator. SSH tunnel from this workstation to the VPS dashboard verified. These checks do not verify real devices.
- Commit and push: Application commit `696733e` pushed to `blendproperty/ebike` main; this context update follows. Merge: none.
- Deployment and configuration: On the existing VPS as `brett-admin`, isolated PM2 home `~/ebike-test/.pm2`; `ebike-test-broker` listens only on 127.0.0.1:3184 with a generated credential in `~/ebike-test/private/broker.json` (restricted permissions); `ebike-demo-dashboard` listens on 127.0.0.1:3185 with its independent simulator. Processes online at verification. SSH tunnel maps workstation port 13185 to dashboard. No public MQTT or dashboard endpoint, DNS, TLS or external supplier access configured. Sudo and Docker daemon unavailable to this account. PM2 process list saved, but boot persistence is not established (`Linger=no`); services may require manual restart after reboot.
- Live production verification: None. VPS synthetic test only; not a production release or real-bike acceptance. Supplier protocol, hardware and SIM/APN configuration, public secure connection, telemetry persistence, device authorization, external integration, uptime/reboot recovery, UAT and business approval remain open.

## 2026-11-26 — Connected telemetry and SIM settings

- Implementation: Added loopback-only dashboard service subscribing to the authenticated test broker, validating and persisting explicitly simulated test telemetry; added saved SIM provider/APN planning fields. Saving a setting does not provision a SIM. Device integration, commands and operational map are not implemented.
- Testing: Local synthetic publish through broker was observed in dashboard API and planning settings saved. Deployment and further VPS verification pending.
- Commit/push: see Git history. Merge: none. Deployment: pending. Production/real-device verification: none. Supplier protocol, APN selection, external TLS/authorization, real-device connectivity, operations, UAT, reboot recovery and approval gates remain open.

## 2026-11-26 — VPS integrated test dashboard

- Implementation: VPS dashboard now subscribes to its authenticated MQTT broker and saves validated synthetic last-known telemetry and SIM provider/APN planning settings. Dashboard map is illustrative and the APN fields do not configure a bike or SIM. Only explicitly simulated test payloads are accepted; real supplier integration and controls are absent.
- Testing: On VPS, four synthetic bike messages published via MQTT appeared in the API and browser; test APN/provider settings and telemetry survived a dashboard process restart, then test settings were cleared. Wrong MQTT credentials and unrelated topic subscriptions were rejected in the earlier VPS check. Browser observed connected state and four simulated records.
- Commit and push: Application `bfab1e3` pushed to `main`; this evidence follows in a context-only commit. Merge: none.
- Deployment and configuration: Running as isolated PM2 processes on existing VPS, broker at loopback 3184 and connected dashboard at loopback 3185; workstation SSH tunnel 13185. `@reboot` user crontab invokes PM2 resurrect from the dedicated PM2 home; configuration installed but actual VPS reboot not tested. Private credentials and state stay outside repository. No public endpoint or TLS.
- Live production verification: None. All bike data is simulated. Real supplier MQTT version, payloads, hardware, SIM/APN selection, public secure ingress, per-device access, device telemetry storage, backup/recovery, staff UAT and approval remain open. System is not ready to give Alan a public server address.

## 2026-11-26 — Settings navigation and web access preparation

- Implementation: Added a visible Settings link and dedicated page with persisted SIM provider and APN, independent of broker status. Added a configurable dashboard origin for future HTTPS routing. Supplier integration remains pending.
- Testing: Node syntax and Git diff checks passed before VPS promotion. Runtime evidence follows.
- Commit/push: Recorded in Git history. Merge: none.
- Deployment/configuration: Existing private VPS service is the promotion target. Public HTTPS still requires the approved hostname, staff authentication and authorized edge configuration.
- Live production verification: Pending. No real bikes, SIM/APN provisioning, secure supplier ingress, staff UAT or approval.

- VPS evidence for `194ae0b`: deployed to the existing dashboard service and verified the overview Settings link, page response, API save/readback and rejection of an unapproved origin through the SSH tunnel. Temporary values were restored. GitHub main and VPS checkout received the application commit. No merge. The VPS SSH login lacks noninteractive sudo for the shared HTTPS edge. Browser access from outside the tunnel and real-device acceptance remain open.

## 2026-11-26 — External HTTPS preparation

- Implementation: Prepared a dedicated authenticated HTTPS route at the existing VPS edge for the fleet dashboard and Settings API. Its Nginx service uses a private Unix socket to reach the current dashboard and leaves the broker independent.
- Testing: Node syntax and Compose validation passed. External HTTPS baseline presented an untrusted certificate, so the hostname is not usable yet.
- Commit and push: Recorded in Git history. Merge: none.
- Deployment and configuration: Hostinger hostname resolves to the VPS. The SSH account cannot access the Docker socket and sudo requires an interactive password. Edge activation and certificate issuance are outstanding.
- Live production verification: Pending authenticated HTTPS access and Settings save/readback. APN provisioning and supplier hardware integration remain pending by request.

- Follow-up evidence: Nginx configuration passed `nginx -t` under the intended non-root container UID; the activation script passed `bash -n` on the VPS. The dashboard is deployed with the planned HTTPS origin and a mode-0600 Unix socket. The VPS Settings page and API respond through that socket. The Docker edge container, trusted certificate and authenticated external access remain pending interactive sudo.

## 2026-11-26 — Verified public HTTPS Settings

- Implementation: Activated the existing Docker Nginx edge behind the VPS's shared Traefik HTTPS router. The dashboard application remains Node.js with the authenticated MQTT test broker and a private Unix socket.
- Testing: From the workstation over public DNS and trusted HTTPS, unauthenticated requests to /settings and /api/settings returned 401. A temporary verification login loaded Settings, saved a test provider through the public API with the HTTPS origin, and read the saved value back in a fresh request. Restored the original blank provider and APN and removed the temporary login. The owner's fleet password was not used for verification.
- Commit and push: HTTPS configuration was already on GitHub main and the VPS. This record follows in a documentation commit. Merge: none.
- Deployment and configuration: The unprivileged activation prepared the password hash and socket. Its sudo step had no terminal, so the authorized Hostinger root console started only the e-bike edge container using the checked-in Compose definition. Public hostname is ebike.srv938083.hstgr.cloud.
- Live verification: Public dashboard authentication and Settings persistence verified without an SSH tunnel. Dashboard bike data remains simulated. SIM/APN selection and provisioning, real hardware integration, supplier ingress and acceptance remain pending.
