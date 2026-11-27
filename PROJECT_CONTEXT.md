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

## 2026-11-26 — Next.js dashboard migration

- Implementation: Ported the overview and Settings pages to Next.js App Router. The static export is built inside the e-bike web image. The deployed Traefik host, authentication, broker and persisted Settings backend remain in place.
- Testing: Next.js production build generated both routes. Deployment and public acceptance evidence follows.
- Commit and push: Recorded in Git history. Merge: none.
- Deployment and configuration: Existing e-bike Traefik route is the target. The app backend remains available on the VPS Unix socket. No APN value or actual bike integration configured.
- Live production verification: Pending public check of the new Next.js build and Settings.

- Migration verification: Built release `6633f75` locally and on the VPS. Nginx configuration validated under the deployed container UID before Compose replaced only the e-bike web container with `ebike-fleet-web:6633f75`. The same Traefik hostname and trusted certificate served the Next.js overview, Settings and a client script over authenticated HTTPS. The unauthenticated Settings API returned 401. A temporary login saved a test provider through the public API, read it back in a fresh request, and restored the original settings. The temporary login was removed. Settings saving was tested through the API, not by clicking the form in a browser. Application commit pushed to main and deployed. No merge. SIM selection and APN provisioning, supplier protocol, real-device verification and staff acceptance remain open.

## 2026-11-26 — Dashboard stylesheet delivery

- Implementation: Loaded the Nginx MIME types table so the Next.js export serves stylesheets as text/css. The previous migration verified a JavaScript response but missed the stylesheet media type.
- Testing: Rebuilt the image locally and validated Nginx configuration under the deployment UID. Public rollout and browser verification follow.
- Commit/push: Recorded in Git history. Merge: none.
- Deployment/configuration and live verification: Pending. SIM/APN and actual bike integration remain open.

- Deployment and live browser verification: Releases dfd7a7d and c144a83 were pushed to main and deployed by replacing the e-bike web container on the existing VPS. The latter emitted a fresh stylesheet URL after the MIME correction. The signed-in Edge browser showed the restored dashboard styling at the public HTTPS address. In the live Settings form, saved a temporary SIM provider, observed Saved, refreshed and confirmed it persisted, cleared it through the form, saved again and refreshed to confirm both fields were blank. VPS state confirmed blank; APN provisioning and actual bike integration remain pending. No merge.

## 2026-11-26 — Vodacom pilot SIM request

- Operations: Sent a request to Vodacom's IoT team for one pilot SIM, the exact APN and authentication settings for its plan, outbound connectivity confirmation, and activation instructions. Copied the project stakeholder and verified the message in Outlook Sent Items. Provider response and SIM supply are pending.
- Implementation and testing: No application changes or device tests for this outreach. APN and bike integration remain pending.
- Commit and push: Context record only. No merge, deployment, configuration change or live production verification for this outreach.

## 2026-11-26 — Fitcoo MQTT telemetry pilot

- Implementation: Added read-only parsing for Fitcoo heartbeat, GPS and vehicle parameter reports and a separate simulator publisher restricted to the supplier telemetry topic on the private broker. The dashboard persists and labels the registered test fixture as simulated. Directionless GPS remains unconfirmed. The supplier PDF stays outside the public repository.
- Testing: Local broker regression and Fitcoo MQTT-to-dashboard checks passed, covering valid reports, invalid battery, unregistered ID, subscription denial and Settings preservation. VPS evidence follows.
- Commit and push: Recorded in Git history. Merge: none.
- Deployment and configuration: Target is the existing private VPS broker and dashboard backend. External MQTT ingress and real-device credentials are pending.
- Live production verification: No real scooter, SIM/APN, supplier firmware or acceptance verification. Vodacom response, TLS compatibility, physical test, UAT and approval remain pending.

- VPS deployment and live synthetic verification: Application commit ff786e3 was pushed to GitHub main and fast-forwarded onto the VPS. Added a separate generated simulator credential to the private broker configuration and restarted the existing PM2 broker and fleet backend. The broker regression and Fitcoo test passed on the VPS, including persisted battery and GPS, invalid/unregistered reports ignored, simulator subscribe denied and Settings preserved. The signed-in HTTPS dashboard displayed FITCOO-SIM-01 with 76% battery and synthetic coordinates. MQTT and the backend remain loopback-only. No merge, external supplier test, physical hardware verification, device commands, or SIM/APN changes. All supplier, cellular, external MQTT security and acceptance gates remain open.

## 2026-11-26 — Supplier MQTT endpoint prepared

- Implementation: Added an isolated Mosquitto pilot with a publish-only supplier account for `bike`, a separate read-only observer, and a hostname-specific Traefik TLS route on the existing port 443. The project uses the pilot hostname `mqtt-ebike.srv938083.hstgr.cloud`. Pilot reports can be observed on the dedicated broker. Dashboard ingestion of physical devices remains open.
- Testing: DNS resolved to the existing VPS. Docker Compose configuration and Bash syntax passed locally. Mosquitto 2.0.22 accepted an authenticated MQTT 3.1.1 publish on `bike`, delivered it to the observer, and rejected anonymous and invalid credentials. Supplier subscriptions received no messages, and disallowed supplier and observer publishes were dropped.
- Commit and push: Deployment files and this evidence are recorded together in Git history. Merge: none.
- Deployment and configuration: Administrator activation, credential generation, and certificate issuance pending. The approved SSH deployment account requires interactive sudo for Docker.
- Live production verification: Pending external TLS and authorized publication verification, Fitcoo firmware TLS/SNI confirmation, supplier bench test, Vodacom SIM/APN validation, physical scooter telemetry, staff UAT and approval.

## 2026-11-27 — Supplier MQTT pilot activated and externally verified

- Implementation: Activated the dedicated Mosquitto pilot from release `24fd94d`. The supplier account publishes only to `bike`. A separate observer receives the pilot reports. Dashboard ingestion of physical-unit telemetry remains open.
- Testing: From outside the VPS, the hostname validated against a trusted Let's Encrypt certificate. TLS 1.3 negotiated in a standalone handshake and a TLS 1.2 MQTT 3.1.1 roundtrip delivered one synthetic heartbeat to the observer. Anonymous and wrong-password connections were rejected. Supplier read access and unauthorized publishes were blocked. The existing dashboard Settings URL continued to return HTTP 401 to an unauthenticated request.
- Commit and push: Deployment configuration was pushed to GitHub `main` in `24fd94d` and fast-forwarded to the VPS. This verification entry is a documentation follow-up. Merge: no merge commit.
- Deployment and configuration: Administrator ran the activation script. The pilot container started and Traefik serves native MQTT over TLS on `mqtt-ebike.srv938083.hstgr.cloud:443` using hostname SNI. VPS credential files have mode 0600. The supplier-only handoff was saved in a restricted local file outside Git. No credentials sent to the supplier.
- Live production verification: Public pilot transport and authorization verified with a synthetic MQTT client. Shipping firmware TLS/SNI compatibility and supplier bench test, Vodacom SIM and APN verification, physical scooter and dashboard telemetry, VPS reboot recovery, staff UAT and business approval remain open.
