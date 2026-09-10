# Roadmap

Each stage begins only after the previous exit criteria pass. Publication is not part of this roadmap without a separate approved stage.

## Stage 0 — Foundation (complete for experiment entry)

Deliver research, charter, product spec, autonomy and research policies, agent roles, quality gates, decision log, sources, risk register, acceptance matrix, evaluation governance, and skill lifecycle.

Exit: G0 passes and the user resolves or explicitly defers blocking decisions.

## Stage 1A — Disposable interaction experiment (frozen baseline complete)

Implement only the smallest readable content-script experiment and synthetic ordinary-result fixtures needed to falsify the unmodified-arrow interaction model. Evaluate neutral versus native-Tab/pointer origin, search-input entry, native Tab continuation, focus plus styling, fail-open boundaries, Escape/recovery, disabled repeat, discoverability, native-scroll loss, and AT key delivery/non-interference. Use a deliberately narrow primary-title fixture contract; do not spend this stage hardening live-Google selectors, Store material, or browser automation dependencies.

Exit: the Stage 1A subset of G1-G4 passes; product-value questions in [ADVERSARIAL_REVIEW.md](ADVERSARIAL_REVIEW.md) have documented local/manual evidence; all temporary writer authority is revoked; the user explicitly chooses whether to stop, revise the interaction, or authorize Stage 1B.

The frozen baseline is preserved by local commit `5b26eb7`. Optional privacy-minimized telemetry is deferred and cannot delay the private test.

## Stage 1B — Bounded live-page private-test adapter (implemented; one live layout confirmed)

Implement a minimal adapter for visible Google result-title links using the positive `#search a[href] h3` rule without relying on the synthetic `main > article` contract. Retain action-time recomputation and same-node-only dynamic preservation. Do not add language, sponsored, rich-module, secondary-link, target, or vertical exclusions that reject normal Google layouts. Give the user a simple live test; their observation is required evidence.

Exit: dependency-free G1-G4 static subset passes, five independent read-only reviews find no private-test safety/privacy blocker, the exact tree is frozen, and the user receives the unpacked-extension path and test procedure. Stage 1B does not pass live behavior until the user records the real Chrome observation.

## Stage 2 — Hardened MVP

Add adversarial fixtures, a validated pinned Chrome for Testing automation lane, mutation/performance controls, URL/DOM hardening, privacy assertions, branded-Chrome/manual AT evidence, and independent security/code/accessibility review. Keep zero runtime dependencies and no named Chrome API permission beyond the approved `storage` permission for one local consent Boolean; retain no separate host permissions unless separately approved and continue to disclose the static content-script site access.

Exit: G2-G6 pass and no high/critical risk lacks an effective control.

## Stage 3 — Artifact and live qualification

Create a reproducible, allowlisted package; test the exact artifact on stable/previous-stable Chrome and representative live Google layouts; document screen-reader results and supported-layout limitations.

Exit: G7-G8 pass with independent review.

## Stage 4 — Store preparation only (current; authorized)

Prepare accurate listing copy, icons/screenshots, reviewer instructions, permission rationale, first-use consent, privacy policy, dashboard-answer draft, ownership/2SV plan, artifact hash, and rollback notes. Do not upload or submit without the exact separate approval.

Exit: G9 passes and unresolved dashboard/privacy interpretation questions are documented.

## Post-live reminders (not current authorization)

After the extension is fully live, the operator must remind the user to:

1. Set up an approval-gated support address and workflow with defined ownership, access, retention, privacy, escalation, and security controls. An agent may triage or draft later but never sends publicly or externally without explicit user approval.
2. Set up the separately reviewed optional donation page/link, including provider, France/worldwide payment and tax, consumer, privacy, placement, and Store-policy checks; it must not gate features, nag, or mislead.

Only after those reminders may the user consider a marketing/SEO role, which requires separate scope, authority, claims, privacy, platform-policy, rights, and external-communication review. No support automation, donation/payment setup, marketing work, account access, or publication is authorized by this roadmap entry.

## Future candidates (not commitments)

- Explicit navigation mode or remappable shortcut for screen-reader and native-scroll compatibility.
- Named regional Google domains after per-domain fixtures, disclosure, and approval.
- Sitelink policy, configurable indicator, onboarding/help, other result verticals, and other search engines.
- Evaluated project skills for fixture auditing, manifest permission diffing, and release evidence assembly.
- A separately authorized privacy-minimized first-party telemetry architecture; the direction is selected, but design and implementation remain deferred.

Every candidate requires evidence, scope review, risks, acceptance criteria, and the applicable approval before implementation.
