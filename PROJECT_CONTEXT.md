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
