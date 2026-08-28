# Project Charter

## Mission

Make desktop web search faster and more accessible for keyboard-oriented users through a trustworthy Chrome extension that complements, rather than replaces or hijacks, native browser and page behavior.

## Product promise

On supported Google Search result pages, a user can move predictably among ordinary organic results, see and perceive the current target, and activate it using native browser behavior. The extension processes the current page URL and result DOM locally and ephemerally, is narrowly scoped and minimally privileged, and is candid about limitations.

## Current Stage 1A scope

Stage 1A contains a disposable, dependency-free, fixture-first extension experiment plus research, governance, risk, evaluation, and test plans. It does not claim a live Google layout adapter, real-DOM/browser validation, assistive-technology compatibility, an MVP package, Store assets, uploads, publication, or deployment. Stage 1B remains separately gated.

## MVP scope boundary

### In scope

- Desktop Chrome and exact runtime `www.google.com/search` default-web-result pages represented by an approved layout contract.
- One canonical primary title link per supported ordinary organic-result block, in DOM/logical order.
- Arrow navigation, native link activation, escape/clear behavior, visible focus, and dynamic-result handling.
- Deterministic fixtures, real-Chrome automation, accessibility checks, security review, and documented live manual testing.
- Manifest V3, packaged logic, one narrow content-script site-access grant, and zero named Chrome API permissions or separate host permissions unless later evidence proves otherwise.

### Out of scope

- Advertisements, sponsored results, shopping, carousels, maps/local packs, image/video/news verticals, sitelinks unless explicitly specified, related searches, navigation, account controls, and unrelated links.
- Regional Google domains, mobile layouts, other search engines, Firefox/Safari/Edge-specific releases, and configurable keymaps.
- Accounts, backend, sync, analytics, telemetry, advertising, affiliate links, monetization, or retention/transmission of browsing activity, search queries, URLs, or page content. Transient local DOM processing is inherent and must be disclosed.
- Remote executable code, remote configuration, automatic publication, or continuous autonomous operation.

## Success measures

The MVP is successful when:

1. All required gates in [QUALITY_GATES.md](QUALITY_GATES.md) pass on the exact reviewed artifact.
2. The acceptance matrix passes on versioned fixtures and documented live layouts.
3. Native `Tab`, `Shift+Tab`, and link `Enter` behavior is not intercepted or reimplemented.
4. No extension network request or persistent write occurs during representative sessions.
5. Supported results are selected precisely enough that ads and unrelated links are never activated in the test corpus.
6. The focus indicator remains perceivable under zoom, forced colors, and representative themes.
7. The Store permission, privacy, single-purpose, and remote-code declarations match the code and artifact.
8. Stage 1A evidence shows that representative users can discover the model, reach a named result predictably, recover native scrolling, and understand boundary/session behavior without accidental activation.
9. Unsupported or ambiguous layouts produce zero candidates rather than a false-positive result.

## Operating principles

- Evidence before authority; evaluations before promotion.
- Smallest viable product and permission surface.
- One implementation writer per checkout at a time.
- Research and review are independent and normally read-only.
- Page DOM and downloaded material are untrusted input.
- A passing test does not justify weakening a safeguard.
- Audit history and provenance are append-only except for transparent corrections.

## Roles

The logical roles are orchestrator/project manager, product strategist, Chrome documentation researcher, accessibility and keyboard UX specialist, extension engineer, test/browser automation engineer, security/privacy reviewer, independent code reviewer, open-source research librarian, release/Chrome Web Store specialist, and Compliance & Platform Policy Reviewer. The compliance reviewer is read-only, is required at release gates, maintains the versioned applicability matrix, and may block release without certifying legal compliance or substituting for qualified counsel. Roles activate only when a task needs them. Normal complex work uses three to five agents total, with read-only work parallelized and writes serialized.

## Decision rights

The project may autonomously research public sources, maintain repository documentation, propose changes, add scoped tests, review diffs, and implement an approved roadmap item. The user retains approval over publication, external communication, paid services, data collection, telemetry, accounts, advertising, backends, broader permissions/domains, fundamental behavior changes, material licensing risk, destructive actions, expanded agent authority, skill promotion that expands authority, agreement acceptance, and choices about publisher entity, markets, distribution, and qualified legal advice.

## Human interface

The current operator chat is the sole normal human interface. Project tasks and agents execute and review work, then report findings and choices to the operator. The operator adapts subsequent briefs and communicates with the user; the user is not expected to coordinate agents or follow technical discussions. Escalation through the operator is reserved for material product choices, safety/privacy/security issues, new permissions or credentials, costs/dependencies, irreversible external actions, and human-only browser/accessibility validation.

## Governance review

Review this charter at each roadmap-stage exit, after any material permission/scope change, and before Store preparation. Conflicts are resolved in this order: user direction, applicable law/policy, [AUTONOMY_POLICY.md](AUTONOMY_POLICY.md), [AGENTS.md](AGENTS.md), accepted decisions, then the current roadmap.
