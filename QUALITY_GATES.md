# Quality Gates

Gates are cumulative. A failed required gate blocks advancement; it is not permission to weaken the requirement. Every gate records date, commit/artifact hash, environment, command or procedure, result, evidence location, reviewer, and exceptions.

## G0 — Research and governance

- Required documents exist and agree on mission, scope, approvals, roles, risks, tests, and roadmap.
- Every material current claim has a structured source record with retrieval date, version/date, confidence, impact, and conflicts.
- Project-scoped agents use least privilege; research/review are read-only and checkout writes are serialized.
- Open product decisions and assumptions are explicit.
- Adversarial review findings, disagreements, autonomous corrections, and material approval choices are recorded.

## G1 — Design readiness

- User authorizes the implementation stage and resolves blocking product decisions.
- Result eligibility, focus semantics, boundary behavior, editing/widget exclusions, mutation behavior, and privacy behavior are specified.
- Threat model and risk register controls map to tests or review procedures.
- Fixture acquisition/sanitization rules, the minimal positive title-link adapter, and independent sidecar oracles are approved.

## G2 — Manifest least privilege

- MV3; narrow approved static content-script prefix; top frame; isolated world; exact runtime origin/path/supported-layout guard, including same-document route exit.
- Only the approved `content_scripts.matches` site-access grant; no named API permissions, separate `host_permissions`, optional permissions, service worker, action, externally connectable surface, or web-accessible resources unless each is approved and justified.
- Manifest diff contains no future-proofing.
- Install warning is captured and reconciled with listing copy.

## G3 — Functional correctness

- Unit and DOM-fixture tests pass for eligibility, guards, neutral/native-focus origins, state transitions, boundaries, and safe invalidation.
- Independently reviewed fixture sidecars identify expected candidates without exposing test-only selector markers to production code; minimal-pair and selector-signal mutation cases pass.
- The validated browser lane loads the production extension and asserts user-visible behavior; evidence records the exact browser product/build rather than calling all automation “real Chrome.”
- No wrapping; genuine-link exclusions hold; candidate order is DOM/logical; replacement never receives inferred focus.
- Native Tab/Shift+Tab and every Enter/modifier variant are never intercepted or reimplemented.

## G4 — Accessibility and keyboard UX

- WCAG 2.2 AA keyboard/focus requirements pass; the project 2 px/3:1 indicator target passes.
- Indicator works at 100%, 200%, and 400% zoom, light/dark fixtures, and forced colors.
- No role, `tabindex`, accessible-name, `aria-selected`, `aria-current`, `aria-activedescendant`, or application-mode rewriting.
- Automated AX evidence verifies DOM focus, accessible name, and role. It does not claim speech or key delivery.
- Manual NVDA browse/focus, VoiceOver Quick Nav on/off, ChromeVox, and where available braille focus/cursor results and limitations are recorded, including DOM-focus/virtual-cursor divergence and Escape/Tab exits.
- Global-arrow conflicts and supported AT claims match the product/listing language.

## G5 — Security and privacy

- Static review finds no unapproved network API, persistent storage, telemetry, unsafe scheme, remote code, unsafe HTML sink, implicit global, or named-property authority. Current Stage 1B permits none of the first three.
- Runtime tests record zero unapproved extension-originated network requests and zero unapproved persistent writes; current Stage 1B expects exactly zero of both.
- Page-controlled DOM/state cannot forge authority; targets and URLs are revalidated for extension-owned enumeration and movement. Native Enter remains page/browser owned, so no atomic activation-time guarantee is claimed.
- Before any telemetry, [TELEMETRY_DECISION.md](TELEMETRY_DECISION.md) has a user-selected, separately authorized option and complete purpose/event/consent/lawful-basis/identifier/retention/processor/transfer/security/rights/permission/disclosure design. No authorization means zero telemetry.
- Privacy policy, prominent listing/in-product disclosure and consent treatment, and Store declarations accurately describe the selected architecture, including local ephemeral page URL/result-DOM processing and every approved retention, transmission, analytics, processor, and sharing fact.
- Independent security/privacy reviewer signs off or records blocking findings.

## G6 — Performance and resilience

- Mutation work is scoped, coalesced, terminates, and does not loop on extension styling.
- No extension-attributable task reaches 50 ms in trace-reviewed representative/stress runs on the named reference environment.
- The under-16 ms p95 key-handler and under-50 ms refresh figures are benchmark targets, not universal CI thresholds. Evidence records hardware, OS, browser build, power mode, warmup, sample count, candidate profile, percentile method, and trace attribution.
- Candidate profiles 0/1/2/10/50/100, a 1,000-decoy burst, observer-root replacement, repeated styling mutation, and idle-after-storm cases leave correct, responsive, quiescent state.

## G7 — Supply chain and artifact

- Zero runtime dependencies unless a recorded decision approves otherwise.
- Development dependencies are exact-lockfile controlled; install method and reviewed lifecycle-script exceptions are recorded.
- Production artifact contains only allowlisted files, with `manifest.json` at ZIP root and no secrets, fixtures, logs, dev dependencies, or machine-local paths.
- Two clean builds are byte-identical or variance is explained and approved.
- SHA-256, source commit, dependency inventory, and source-to-artifact mapping are recorded.

## G8 — Independent release review

- Independent code, accessibility, security/privacy, and release-policy reviews have no unresolved blockers.
- Exact artifact passes a separately validated pinned Chrome for Testing stable/previous-stable deterministic lane. Branded stable Chrome, representative live layouts, forced colors, and real assistive technology are separately recorded manual evidence.
- No extension console errors; documentation, listing draft, permission rationale, privacy disclosures, and behavior agree.
- Rollback/recovery notes and support/security contact plan exist.

## G8A — Compliance and platform-policy review

- The dedicated read-only Compliance & Platform Policy Reviewer has reviewed the exact artifact, manifest, data-flow inventory, Store/dashboard/listing drafts, claims, licenses/notices, third-party assets, publisher/entity, markets, audiences, distribution, and monetization facts.
- [COMPLIANCE.md](COMPLIANCE.md), [compliance/register.yaml](compliance/register.yaml), and [research/sources.yaml](research/sources.yaml) record current primary sources, access dates, versions/change dates when available, exact applicability reasoning, evidence, conflicts, and unresolved facts.
- The current Chrome Web Store Developer Agreement and Program Policies, enforcement changes, Google Terms/service-specific rules and machine-readable automated-access signals, applicable privacy/consumer/accessibility/product-safety regimes, and intellectual-property/license rights have been rechecked at the release date.
- Artifact behavior, privacy policy, prominent disclosures/consent treatment, dashboard declarations, listing copy, screenshots, permission rationale, accessibility claims, non-affiliation wording, and supporting evidence agree.
- The telemetry decision is explicit; if telemetry is selected, France/CNIL, GDPR/ePrivacy, worldwide-market, Chrome user-data/Limited Use, processor, transfer, retention, security, permission, and opt-in/opt-out requirements are satisfied on the exact design and artifact.
- Every material row is internally `satisfied` or supported `not-applicable`; any `unresolved`, `legal-review-required`, stale policy, missing right, unsupported claim, or authority gap blocks release/external publication. Internal status is not legal certification.
- No agent has accepted an agreement, accessed a publisher account, represented itself as counsel, or communicated externally without specific user authority.

## G9 — Store preparation complete, not published

- Icons, screenshots, description, single-purpose statement, reviewer instructions, privacy-policy draft/URL plan, and dashboard answers are prepared and current.
- Publisher 2-Step Verification and ownership plan is documented without storing credentials.
- No upload or submission has occurred.
- Publication remains a separate user-approved action.

## Exception policy

An exception must identify the failed gate, evidence, user impact, compensating controls, owner, expiry, and required approval. Security, privacy, permission, remote-code, and publication gates cannot be self-excepted by an agent.
