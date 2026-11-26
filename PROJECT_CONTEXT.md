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
