# Stage 1A evidence record

Status: **authorized bounded Stage 1A static correction complete; 45 dependency-free tests passed; final whole-tree checksums and frozen-tree review pending; all real-DOM, Chrome, privacy-runtime, visual, and assistive-technology checks remain not run; Stage 1B blocked**.

## Authorization boundary

Stage 1A is a disposable fixture-first experiment. One temporary writer was authorized for each serialized implementation/correction pass. The only site-access grant is the static MV3 content-script match `https://www.google.com/search*`, narrowed at runtime to exact origin `https://www.google.com`, pathname `/search`, and a deliberately narrow semantic synthetic-layout guard. No named Chrome API permission, separate host permission, optional permission, service worker, action, storage, messaging, web-accessible resource, extension network activity, remote configuration, runtime dependency, telemetry, or Store work was added.

## Implemented experiment

- `manifest.json`: MV3 static content script with one declared site-access match, top frame, isolated world, and no named API permissions.
- `src/policy.js`: pure route, modifier, origin, boundary, and repeat decisions.
- `src/result-policy.js`: pure fail-closed result and destination evidence policy.
- `src/navigator.js`: real native-anchor focus, extension-owned session state, strict semantic discovery, fresh action-time recomputation, no observer, native Tab/Enter behavior, safe Escape clearing.
- `src/navigator.css`: supplemental focus indicator including forced-colors behavior.
- `fixtures/`: supported and excluded synthetic markup plus an independent sidecar oracle.
- `tests/`: dependency-free Node tests for the manifest, movement policy, result contract, and prohibited-source surfaces.
- `MANUAL_TESTING.md`: branded Chrome, dynamic DOM, native-scroll, privacy, zoom/contrast, and assistive-technology procedures.

Production logic contains no test case IDs or fixture-only selector tokens. Fixtures are synthetic and contain no copied Google markup, queries, cookies, accounts, or personal data.

## Initial-pass deterministic execution

Environment: Windows, repository checkout, bundled Node executable supplied by the Codex desktop workspace runtime. No package installation or dependency download occurred.

Installed browser discovered without launching it: Google Chrome `151.0.7922.174` at `C:\Program Files\Google\Chrome\Application\chrome.exe`. It was not launched or claimed as tested because the fixture procedure requires an interactive DevTools/manual run and raw browser automation would exceed the approved dependency-free experiment.

Initial command:

```powershell
node --test tests
```

Result: failed before test execution with `spawn EPERM` because the sandbox disallowed the test runner's default child-process isolation. This is an environment execution limitation, not a test assertion failure.

Applicable command using Node's built-in no-isolation mode:

```powershell
node --test --test-isolation=none tests\policy.test.cjs tests\result-policy.test.cjs tests\manifest.test.cjs tests\source-guard.test.cjs
```

Final result after source-guard expansion: **22 passed, 0 failed, 0 skipped**, duration approximately 40 ms on 2026-08-28. JavaScript syntax checks and `git diff --check` also passed; no package manifest or lockfile exists.

Coverage included exact runtime route, modifiers/composition/already-cancelled guards, neutral and eligible-focus origins, boundaries, repeat behavior, all sidecar result cases, URL/target policy, exact manifest surface, forbidden APIs, no Enter handler, no propagation stop, and production/fixture separation.

## Initial-pass SHA-256 inventory

Hashes were calculated after the final deterministic run. Documentation outside this inventory remains planning/governance material, not the executable experiment.

```text
7af8a998ec677b3735805df4127017bf212e5cd32a3195d519e55d77d8a9bf1f  manifest.json
afea9e4dc159662f16ca4d664f421c989ed81bb10241e1eea475581d8dea6b8d  src/policy.js
c9000562bca845359d958a308f3e35dfcbf7157ac1e4752c2aad0e1334ac5544  src/result-policy.js
f85a29f6f5220a2e11ca5db193f751c6430c26a2e64f5a57ce644dedbf29bcfb  src/navigator.js
1571cd47514d5216944d012447e207dae9c79759faeff1527b03fdd893356a80  src/navigator.css
80edada7a6e64ae2bf0c61ef46edd51d7f96a62e652f8adccbe27c26fd708b4b  fixtures/ordinary-results.html
b91ff15f8e8632e5d1e85618faa31fb448b2ca023efb90f03fe1e9d5f705e939  fixtures/ambiguous-results.html
16f48e4f3cfb1c0000a87674966a7d26a98f617abed05a4e06b34cc6aec69b1d  fixtures/contracts/result-policy-cases.json
4067d02b218833d0b04659f32f6c28def05708d3b0f81704218f1ec65a195b35  tests/policy.test.cjs
d5dae94944ec85b70bc0e060e92c766050e7ed5b9e10f82855e73f3024396d95  tests/result-policy.test.cjs
d0bd3fa4aed25dd5495d6e5583c703ab5484026ac112967a51f5705d220dda8c  tests/manifest.test.cjs
e42eb5985b751ef41dbd5cd65f8907e804a5f4d263c8732e1e4e93f13e8e1c9a  tests/source-guard.test.cjs
d7a58245b4027ac9e7a819c5688129b95ad4dedcd7fd8f152e7c702c40f6f6e2  MANUAL_TESTING.md
```

## Correction-pass evidence

The authorized correction pass coded and statically asserted the following changes without widening product scope; none is claimed as observed browser behavior:

- Result discovery is coded to return zero for editing, widget, application, modal, active popover, embedded, and relevant ancestor/descendant contexts.
- Visible-text naming is coded to ignore hidden/inert/non-rendered text; empty explicit labels and complex `aria-labelledby` cases are intended to fail closed pending DOM/AX evidence.
- Extension-owned movement requests `scrollIntoView({ behavior: "instant" })`.
- The supported fixture declares 75-vh blocks, uses external `.test` links with a separately installed click-default guard for non-navigating pointer testing, and includes representative editing/widget/popover/embedded controls.
- Separate editing, application-widget, and open-modal ancestor fixtures plus a hidden-only title case document fail-closed expectations.
- Manual procedure now separates real search-submission reachability from synthetic neutral focus, specifies non-navigating pointer checks and scroll measurements, and compares all request initiators/storage against a disabled-extension baseline.
- Governance now describes the match as site access, records the correction authority, and keeps live versioned selector work in Stage 1B.

Final deterministic command:

```powershell
node --test --test-isolation=none tests\policy.test.cjs tests\result-policy.test.cjs tests\manifest.test.cjs tests\source-guard.test.cjs tests\fixture-contract.test.cjs
```

Result on 2026-08-28: **27 passed, 0 failed, 0 skipped**. All packaged JavaScript passed `node --check`; manifest and sidecar JSON parsed; the listed static regression tripwires passed; no package manifest, lockfile, runtime dependency, or temporary Chrome profile remained. These checks are not comprehensive security analysis or real-DOM evidence. The repository was all-untracked, so `git diff --check` was not treated as meaningful whitespace evidence; later validation uses a direct scan of every project file.

The new fixture test is a static contract test, not a DOM execution claim. The bundled Node runtime reports no `document` or `DOMParser`. Adequate execution of the production controller with trusted keyboard input would require a browser-automation dependency or custom Chrome controller, neither of which was authorized. No inadequate fake DOM or hidden controller was added.

`BROWSER_AUTOMATION_PROPOSAL.md` records the separately gated recommended validation spike and custom-controller alternative. It is a proposal only; no installation or automation implementation occurred.

Branded Chrome `151.0.7922.174` was attempted only as an offline `about:blank` headless load smoke. The sandboxed attempt failed internally; an elevated launch produced a DOM dump, but a follow-up disposable-profile inspection did not find the unpacked extension registration. It is therefore **not** an extension-load pass. Interactive Chrome, DevTools privacy/storage, install-warning, visual, and AT checks are all recorded **not run** in `STAGE1A_MANUAL_RESULTS.md`.

### Correction-pass SHA-256 inventory

```text
7af8a998ec677b3735805df4127017bf212e5cd32a3195d519e55d77d8a9bf1f  manifest.json
afea9e4dc159662f16ca4d664f421c989ed81bb10241e1eea475581d8dea6b8d  src/policy.js
c9000562bca845359d958a308f3e35dfcbf7157ac1e4752c2aad0e1334ac5544  src/result-policy.js
3449c8d2703d30664545b255e6d56694e5599710d7c33991c57b4115377387dc  src/navigator.js
1571cd47514d5216944d012447e207dae9c79759faeff1527b03fdd893356a80  src/navigator.css
0d344cde7e69d13395162bb000cc78ce772bfde7c8524d0a63956cedbc932344  fixtures/ordinary-results.html
6a1f03c8e187a89ac8df1f778f43c75992b97de3f8cfa8d88cff795ae2cfca8f  fixtures/ambiguous-results.html
5f6c9c7e184a8c4774a7c5dc298a41eafbb1e6e632d67ebc0850667a542f425a  fixtures/editing-context.html
6e7d8f862a3ee0c925ba3948fb71387f76f1df894b591875782b881f9c0d4560  fixtures/widget-context.html
48a50c7dde143970b04c25fd7bab07ea7c60cd792d7966e8d87e133e756696ce  fixtures/modal-context.html
7f9554522f1dd03cde0cf31de7519fb08d4d0b6efd47ee075e3015916dbeb75b  fixtures/contracts/result-policy-cases.json
fa6df94a63690b9c83f388139678310747e988babfcc845801474cf2d9bdb424  fixtures/README.md
4067d02b218833d0b04659f32f6c28def05708d3b0f81704218f1ec65a195b35  tests/policy.test.cjs
d5dae94944ec85b70bc0e060e92c766050e7ed5b9e10f82855e73f3024396d95  tests/result-policy.test.cjs
d62f2c3677b55ed0bfbf4f54833e6ae79babc3de1e98c77db6b0e4244ea0ac36  tests/manifest.test.cjs
2adc9a412c4350e9bf2eb649a4c54fff21951e3d6564c0b8e36856076cda3ee1  tests/source-guard.test.cjs
cf44878cc27110e219e6327a9ab27a37a1ee1ccfb0056ecfd8694170889eae20  tests/fixture-contract.test.cjs
a67dff1efe44c36cf02e7f9464209f1295c6f150d7140d61b3e1aaf2755a51fb  MANUAL_TESTING.md
759056d1a1158a1cf459bcb45b96352802d08e430cadfa51ceb440d058c23753  STAGE1A_MANUAL_RESULTS.md
```

## Final bounded static-correction pass

The final authorized writer corrected only the validated frozen-tree findings:

- any `aria-labelledby` attribute now fails closed before `aria-label` is considered;
- non-link explicit role overrides and remaining relevant native/ARIA arrow-widget contexts are statically excluded, including scrollbars and focusable separators;
- focus is followed by a fresh route/layout/candidate recomputation, and state commits only when the exact connected target still owns focus and remains eligible; otherwise the old session/indicator clears;
- pointer-origin fixtures use external `.test` URLs plus a fixture-only capture listener that cancels pointing-device click default without stopping propagation or affecting keyboard-generated clicks;
- the charter and evaluation guide describe current Stage 1A rather than a documentation-only Stage 0;
- `evals/STAGE1A_USER_VALUE_PROTOCOL.md` defines reachability, unaided diagnostic, instructed learnability, recovery, accidental-action, boundary-comprehension, evidence, and stopping rules;
- source/CSS assertions are explicitly described as a listed static tripwire set, not comprehensive security or runtime privacy evidence.

Final dependency-free result on 2026-08-28: **29 passed, 0 failed, 0 skipped**. Every project `.js`/`.cjs` file passed `node --check`; all JSON and TOML parsed; the constrained `research/sources.yaml` ledger schema validated with 37 unique complete records; exact manifest permission-boundary assertions passed; direct all-file whitespace/NUL/final-newline validation passed; Markdown links resolved; and no package manifest, lockfile, runtime dependency, browser controller, DOM package, Playwright code, or temporary Chrome profile was present.

These results are static only. No production DOM/controller, trusted input, Chrome extension load, privacy runtime, visual state, or AT behavior was executed or inferred. `STAGE1A_MANUAL_RESULTS.md` remains unchanged and all its manual families remain **not run**.

### Superseded pre-selector-correction SHA-256 inventory

```text
7af8a998ec677b3735805df4127017bf212e5cd32a3195d519e55d77d8a9bf1f  manifest.json
2b30c17efdeac5aed3f5347b8524436c9770644eb4e3d9b72dccf74a981e7f25  src/policy.js
c9000562bca845359d958a308f3e35dfcbf7157ac1e4752c2aad0e1334ac5544  src/result-policy.js
02247991a63e64f1b5a4fbf249ebf70f81c32f7e62d02d22c3be5e1513fe7eaa  src/navigator.js
1571cd47514d5216944d012447e207dae9c79759faeff1527b03fdd893356a80  src/navigator.css
87647895ec92c422652461aa64cae16e2a225701cc340f7f03456b49c6397c82  fixtures/ordinary-results.html
d803a96003a904e76b3e677bf42d3ea1f1882447ce4773af9e47a9c4b1140d52  fixtures/ambiguous-results.html
5f6c9c7e184a8c4774a7c5dc298a41eafbb1e6e632d67ebc0850667a542f425a  fixtures/editing-context.html
6e7d8f862a3ee0c925ba3948fb71387f76f1df894b591875782b881f9c0d4560  fixtures/widget-context.html
48a50c7dde143970b04c25fd7bab07ea7c60cd792d7966e8d87e133e756696ce  fixtures/modal-context.html
e2c1316246c5ecb3242ef942df817b14316ecf2343809fa2f71b148d2e7b4988  fixtures/interactive-role-context.html
74fd6b3234be12c935747135ffac32a8ef5da4eaa0116c1f962eb2f7895ce7d6  fixtures/pointer-guard.js
7f9554522f1dd03cde0cf31de7519fb08d4d0b6efd47ee075e3015916dbeb75b  fixtures/contracts/result-policy-cases.json
4cc3921ec753b5f23ad1393bb00942c89ca125215aa5271e288fc8d205e74359  fixtures/README.md
0dce79156fdf02a0a0e7c02cb6612b01433959901ce7a459265700a2a0968100  tests/policy.test.cjs
d5dae94944ec85b70bc0e060e92c766050e7ed5b9e10f82855e73f3024396d95  tests/result-policy.test.cjs
d62f2c3677b55ed0bfbf4f54833e6ae79babc3de1e98c77db6b0e4244ea0ac36  tests/manifest.test.cjs
ee2d8ea937b6dfb5dc017b8b6bf6c50433469864bdd5d609575c5d61fd471f1c  tests/source-guard.test.cjs
6aa2d16e62503a5378f582372e2f2cf43e5f524bab23f0ee2e8422f8976e2f29  tests/fixture-contract.test.cjs
39a486ac3378d5cb8534fca09e89ec7465e690afd3acaf53d78f3e1c7da702b6  MANUAL_TESTING.md
759056d1a1158a1cf459bcb45b96352802d08e430cadfa51ceb440d058c23753  STAGE1A_MANUAL_RESULTS.md
e13ecb0a469a31379a6e4be8ae1c75ad01c3b4b1c1816e855504776a5abdb2b7  evals/STAGE1A_USER_VALUE_PROTOCOL.md
5e1508aed9732dcc5b5841b0fc53d6675e98043cceee082dbb9f69d7150d009a  BROWSER_AUTOMATION_PROPOSAL.md
8c455e3f314cc95280958d87825f67d05548171f67f8a3e2cbc274128bac056b  PROJECT_CHARTER.md
cbd7fc5d82ba511647a4e463696dbe86fe353037ce77d34f0ff2a0bbae0f3482  evals/README.md
c3ae4bbfd4c8f68e414b2f97d36a80763d7e23a094eac4dad7766c9c531865a5  DECISIONS/README.md
66910d2ae9637a4902728d462a38795dd1549c5e679c993b038aa8332a84690b  RISK_REGISTER.md
5bee2c2a25bf193225ca4fb486c69b6d58e945fd9a1e7b3a83c798ad4aa68477  README.md
```

## Last bounded Stage 1A selector correction

The frozen-tree reviews reproduced one remaining ambiguity: a block with one valid title anchor plus a custom ARIA link or focusable/role-overridden secondary anchor could remain eligible. The authorized correction now treats a descendant as a secondary interactive link candidate when it is not the primary link and either has semantic `role="link"`, or is an anchor with `href`, `tabindex`, or any explicit role. The intended primary title anchor is excluded from that secondary-candidate predicate, so the exact-one-title contract remains eligible while either counterexample fails closed.

Dependency-free regressions cover a custom `[role="link"]` descendant, a secondary `<a tabindex="0">`, role-overridden anchors, the existing scrollbar/focusable-separator exclusions, and the legitimate single-title-anchor case. The complete result on 2026-08-28 is **31 passed, 0 failed, 0 skipped**. All nine `.js`/`.cjs` files passed `node --check`; two JSON and eleven TOML files parsed; the dependency-free constrained YAML check found 37 complete unique records; the exact manifest permission boundary passed; no package manifest, lockfile, runtime dependency, DOM package, Playwright code, custom browser controller, or temporary Chrome profile was present; all 21 Markdown files had resolving local links; and the direct whitespace/NUL/final-newline scan passed (allowing only intentional two-space CommonMark hard breaks).

This remains static evidence only. No production DOM/controller, trusted input, Chrome extension load, runtime privacy, visual state, or assistive-technology behavior was executed or inferred. `STAGE1A_MANUAL_RESULTS.md` remains unchanged with every manual family **not run**.

### Superseded partial 30-file SHA-256 inventory

This historical inventory is retained for audit continuity but is not the current freeze mechanism. It covered only the listed product/evidence subset. The current correction replaces it with the complete, precisely scoped `STAGE1A_SHA256SUMS.txt` manifest described below.

```text
7af8a998ec677b3735805df4127017bf212e5cd32a3195d519e55d77d8a9bf1f  manifest.json
2b30c17efdeac5aed3f5347b8524436c9770644eb4e3d9b72dccf74a981e7f25  src/policy.js
2744ede6525f34707106fba14d3d9be412c24c2634e232065dae37b6962eb148  src/result-policy.js
7bdb4ea7e8c7bc311915cd880af1495ef8501db03b825ddb05ebdf9b2c16a6ae  src/navigator.js
1571cd47514d5216944d012447e207dae9c79759faeff1527b03fdd893356a80  src/navigator.css
87647895ec92c422652461aa64cae16e2a225701cc340f7f03456b49c6397c82  fixtures/ordinary-results.html
d803a96003a904e76b3e677bf42d3ea1f1882447ce4773af9e47a9c4b1140d52  fixtures/ambiguous-results.html
5f6c9c7e184a8c4774a7c5dc298a41eafbb1e6e632d67ebc0850667a542f425a  fixtures/editing-context.html
6e7d8f862a3ee0c925ba3948fb71387f76f1df894b591875782b881f9c0d4560  fixtures/widget-context.html
48a50c7dde143970b04c25fd7bab07ea7c60cd792d7966e8d87e133e756696ce  fixtures/modal-context.html
e2c1316246c5ecb3242ef942df817b14316ecf2343809fa2f71b148d2e7b4988  fixtures/interactive-role-context.html
97b482e39e5a2776f480dd224c17a69a2225ce6263f50b36c46712ec07a6f061  fixtures/secondary-role-link-context.html
86b25175cf58370d8a233aee3bef7270bd7dda55873c372e78257b567c049ca1  fixtures/secondary-focusable-anchor-context.html
74fd6b3234be12c935747135ffac32a8ef5da4eaa0116c1f962eb2f7895ce7d6  fixtures/pointer-guard.js
7f9554522f1dd03cde0cf31de7519fb08d4d0b6efd47ee075e3015916dbeb75b  fixtures/contracts/result-policy-cases.json
3a58c6cbede725592ee6262bf0ba351ea01a5b79f1c3615779404faf5776ce71  fixtures/README.md
0dce79156fdf02a0a0e7c02cb6612b01433959901ce7a459265700a2a0968100  tests/policy.test.cjs
4ff453fa9e0d1c8255120f2b9622b0a2a1dce7989c98387be2ceb49ce7a71b2a  tests/result-policy.test.cjs
d62f2c3677b55ed0bfbf4f54833e6ae79babc3de1e98c77db6b0e4244ea0ac36  tests/manifest.test.cjs
df846f72f314320fca9206a510f2a8f386eea18648d95171cd7b4ee61a131068  tests/source-guard.test.cjs
b3f8f9e35c8859548b2d812b05754223351e3ac01dd34080d3897b4fd25e183d  tests/fixture-contract.test.cjs
39a486ac3378d5cb8534fca09e89ec7465e690afd3acaf53d78f3e1c7da702b6  MANUAL_TESTING.md
759056d1a1158a1cf459bcb45b96352802d08e430cadfa51ceb440d058c23753  STAGE1A_MANUAL_RESULTS.md
e13ecb0a469a31379a6e4be8ae1c75ad01c3b4b1c1816e855504776a5abdb2b7  evals/STAGE1A_USER_VALUE_PROTOCOL.md
5e1508aed9732dcc5b5841b0fc53d6675e98043cceee082dbb9f69d7150d009a  BROWSER_AUTOMATION_PROPOSAL.md
8c455e3f314cc95280958d87825f67d05548171f67f8a3e2cbc274128bac056b  PROJECT_CHARTER.md
cbd7fc5d82ba511647a4e463696dbe86fe353037ce77d34f0ff2a0bbae0f3482  evals/README.md
c3ae4bbfd4c8f68e414b2f97d36a80763d7e23a094eac4dad7766c9c531865a5  DECISIONS/README.md
66910d2ae9637a4902728d462a38795dd1549c5e679c993b038aa8332a84690b  RISK_REGISTER.md
5bee2c2a25bf193225ca4fb486c69b6d58e945fd9a1e7b3a83c798ad4aa68477  README.md
```

## WAI-ARIA role-token, container, oracle, and evidence correction

The authorized writer implemented one ordered effective-role resolver from the WAI-ARIA 1.2 concrete-role taxonomy. It skips unrecognized and abstract tokens, stops at the first recognized non-abstract role, and is used consistently for primary-link role validation, secondary interactive-link classification, container-self `link` rejection, blocked result roles, and keyboard/widget contexts. Thus `foo link` resolves to `link`, while `button link` resolves to `button`; the code does not treat every occurrence of the token `link` as effective.

`fixtures/contracts/selector-scenarios.json` is an executable dependency-free pure-policy oracle covering 11 scenario/fixture pairs: exact and fallback secondary links, a focusable secondary anchor, a role-overridden secondary anchor, recognized non-link precedence, legitimate primary fallback/link-first cases, a rejected non-link primary, container-self fallback link, and a legitimate recognized non-link container before a fallback `link`. `tests/selector-oracle.test.cjs` evaluates eligibility and reason for each sidecar outcome and verifies an exact built-in import allowlist. It reads fixture markers only to bind the sidecar to the intended synthetic file. It does not parse or execute a DOM and is not browser, production-controller, visual, privacy-runtime, accessibility-tree, speech, key-delivery, or assistive-technology evidence.

Project communication governance now treats the operator chat as the sole normal human interface. Project tasks and agents report findings and choices to the operator rather than asking the user to coordinate agents or follow technical discussions. Defined material choices, safety/privacy/security issues, new permissions or credentials, costs/dependencies, irreversible external actions, and human-only browser/accessibility validation escalate through the operator. Only unsolicited operator progress updates to the user use `What we did -> What it achieved -> Next step`; direct answers remain natural, and internal agent reviews, briefs, and technical reports use whatever precise format best supports execution. `AGENTS.md`, `AUTONOMY_POLICY.md`, `PROJECT_CHARTER.md`, `.codex/agents/orchestrator.toml`, `DECISIONS/README.md`, `README.md`, and `RECAP_TEMPLATE.md` record these rules without changing any authority or quality gate.

The complete dependency-free result on 2026-08-28 is **45 passed, 0 failed, 0 skipped**. All ten `.js`/`.cjs` files passed `node --check`; three JSON and eleven TOML files parsed; the constrained source-ledger check found 37 complete unique records and the recorded WAI-ARIA role rule; the exact manifest permission/dependency boundary passed; all 22 Markdown files had resolving local links; and the direct whitespace/NUL/final-newline check passed while allowing only intentional two-space CommonMark hard breaks. No package manifest, lockfile, runtime dependency, DOM package, Playwright code, custom browser controller, temporary Chrome profile, new permission, or new origin exists.

### Complete frozen-tree SHA-256 inventory

`STAGE1A_SHA256SUMS.txt` records the relative path and SHA-256 of every other non-Git project file, including this evidence record, all governance and compliance documents, both YAML registers, every source/fixture/test file, `.codex/config.toml`, and all eleven project role definitions in their final read-only state. Its sole exclusion is `STAGE1A_SHA256SUMS.txt` itself, because a file cannot contain its own stable cryptographic hash. The final freeze procedure verifies every recorded path, rejects missing or extra files, and separately confirms all eleven role definitions remain read-only.

These results remain static only. No production DOM/controller, trusted input, Chrome extension load, runtime privacy, visual state, or assistive-technology behavior was executed or inferred. `STAGE1A_MANUAL_RESULTS.md` remains unchanged with every manual family **not run**.

## Compliance, operator, and telemetry governance pass

The user authorized a dedicated read-only Compliance & Platform Policy Reviewer and a non-certifying release gate. `.codex/agents/compliance-platform-policy-reviewer.toml`, `COMPLIANCE.md`, `COMPLIANCE_INTAKE.md`, `TELEMETRY_DECISION.md`, and `compliance/register.yaml` now distinguish confirmed repository facts, user-supplied facts, likely requirements, supported non-applicability, and unresolved or legal-review-required issues. `QUALITY_GATES.md` adds G8A; `AUTONOMY_POLICY.md`, `PROJECT_CHARTER.md`, `AGENTS.md`, `RESEARCH_POLICY.md`, `ROADMAP.md`, `RISK_REGISTER.md`, and the decision log record the read-only role, operator routing, release blocks, and post-live reminders.

The source ledger now contains 63 complete unique official/primary-source records. Material current additions cover the Chrome Web Store Developer Agreement, Program Policies, Limited Use, disclosure, listing, affiliate and payment rules; the 2026 Google Terms, service-specific terms, live `robots.txt`, Search automated-traffic guidance, and brand guidance; EU/France privacy, consumer, accessibility, provider and product-safety topics; U.S. accessibility/claims/privacy thresholds; and CNIL analytics, minimization, retention, and transfer guidance. This is issue-spotting evidence, not legal advice or certification. Public release remains blocked on the Google Terms/`robots.txt` ambiguity and every applicable unresolved register row.

User-supplied facts record an individual publisher in France, worldwide public availability after readiness/compliance review, a general-public product not specifically directed at children under 16, compatibility-only Google/Chrome marketing references, license-compliant open-source handling, later approval-gated support and donation work, and no external counsel planned. Optional privacy-minimized first-party analytics is the chosen future direction but is deferred; current Stage 1A has no telemetry, backend, accounts, data collection, new permission, or network activity. No telemetry, donation, support automation, marketing, payment, agreement acceptance, account access, or publication was implemented.

The complete dependency-free governance-freeze result on 2026-08-28 is **45 passed, 0 failed, 0 skipped**, executed as six in-process Node test files because the sandbox denied the test runner's child-process fan-out. All nine `.js`/`.cjs` files passed `node --check`; three JSON and twelve TOML files parsed; the constrained YAML checks found 63 complete unique source records and twelve complete compliance rows; the exact permission/dependency boundary passed; all 25 Markdown files had resolving local links; and whitespace/NUL validation passed. There is no package manifest, lockfile, runtime dependency, DOM package, Playwright code, custom browser controller, temporary Chrome profile, new permission, new origin, or product-source change in this governance pass.

This pass does not claim browser, live-Google, real-DOM, extension-load, runtime privacy, visual, accessibility-tree, speech, key-delivery, or assistive-technology evidence. The subsequently authorized bounded Stage 1B private-test adapter is a separate change after this freeze and review.

## Applicable G1-G4 subset

| Gate | Result | Evidence and remaining work |
|---|---|---|
| G1 design readiness | Pass for the authorized experiment | Interaction, exclusions, state invalidation, privacy boundary, correction decisions, and synthetic fixture contract are explicit. This does not authorize a live-layout adapter. |
| G2 manifest least privilege | Static pass; runtime blocks advancement | Exact manifest regression test passed. Headless Chrome did not prove extension registration; install warning, access-denied/on-click, and runtime route observations remain not run. |
| G3 functional correctness | Partial / blocks advancement | Pure policies, sidecar cases, fixture-contract assertions, listed source tripwires, and syntax checks passed. Production DOM extraction, trusted keys, focus, Tab, scrolling, Escape, privacy, and dynamic behavior require an approved browser lane or interactive run. Static tripwires are not comprehensive security evidence. |
| G4 accessibility and keyboard UX | Partial / blocks advancement | Native anchor focus, no semantic/tabindex rewrite, conservative name policy, instant scroll, and forced-colors CSS are statically present. Zoom, AX focus, speech, key delivery, virtual-cursor behavior, and real AT results are not run. |

G3 and G4 are deliberately not waived. The interaction hypothesis cannot advance solely from deterministic policy tests.

## Review and verdict status

Independent read-only product, accessibility, Chrome/security/privacy, compliance, and test/selector reviews are required before a private-test build is declared ready. The user has separately authorized one bounded Stage 1B live-page adapter after this governance freeze; it does not retroactively create browser evidence for Stage 1A.
