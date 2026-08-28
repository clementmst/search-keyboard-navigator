# Search Keyboard Navigator

Search Keyboard Navigator is a planned Manifest V3 Chrome extension for fast, keyboard-focused navigation of ordinary organic results on desktop Google Search, with explicit assistive-technology limitations under evaluation.

This repository contains the authorized **Stage 1A disposable, fixture-first interaction experiment and correction pass**. Its deterministic subset is not a substitute for branded-Chrome or assistive-technology evidence. It is not an MVP release, Store artifact, or authorization for Stage 1B.

## Proposed MVP

- Inject only on the narrow `https://www.google.com/search*` prefix in the top frame, then require an exact runtime `www.google.com` origin, `/search` pathname, and supported default-web-results layout.
- Move real DOM focus to the next or previous eligible organic-result link with unmodified `ArrowDown` and `ArrowUp`.
- Never handle `Tab`, `Shift+Tab`, or any Enter/modifier variant. Native Tab continues from the result focused by the extension, so the prior Tab origin is not preserved.
- Use `Escape` to end the extension navigation session and restore the prior focus when it is still safe to do so.
- Ignore editing, composition, modifier, already-cancelled, embedded, and page-widget contexts.
- Never wrap, rewrite links, retain or transmit page data, use a backend, or load executable code remotely.

The unmodified-arrow design conflicts with native page scrolling and some screen-reader browse commands. It is a falsifiable Stage 1A experiment, not accepted release UX. See [ADVERSARIAL_REVIEW.md](ADVERSARIAL_REVIEW.md), [PRODUCT_SPEC.md](PRODUCT_SPEC.md), and [DECISIONS/README.md](DECISIONS/README.md).

## Proposed architecture

The experiment is a packaged, content-script-only extension: readable packaged source, the default isolated world, no service worker, no named Chrome API permissions, no separate `host_permissions`, no storage, no extension network activity, and no runtime dependencies. The static `content_scripts.matches` entry still grants persistent site access and may produce a warning; it is not permission-free. Pure policy functions, a deliberately synthetic fail-closed semantic contract, a focus controller, and action-time recomputation keep the Stage 1A hypothesis separable. Versioned live-Google adapters remain Stage 1B work.

## Project map

- [PROJECT_CHARTER.md](PROJECT_CHARTER.md) — mission, scope, success measures, and governance
- [PRODUCT_SPEC.md](PRODUCT_SPEC.md) — behavior, architecture, and acceptance criteria
- [AUTONOMY_POLICY.md](AUTONOMY_POLICY.md) — authority boundaries and approval gates
- [AGENTS.md](AGENTS.md) — instructions for Codex agents working in this repository
- [RECAP_TEMPLATE.md](RECAP_TEMPLATE.md) — operator-only unsolicited progress-update template
- [COMPLIANCE.md](COMPLIANCE.md) — non-certifying compliance and platform-policy gap assessment
- [COMPLIANCE_INTAKE.md](COMPLIANCE_INTAKE.md) — minimal operator-routed user intake at testing/distribution gates
- [TELEMETRY_DECISION.md](TELEMETRY_DECISION.md) — future privacy decision gate; no telemetry is authorized now
- [compliance/register.yaml](compliance/register.yaml) — versioned applicability and release-blocker register
- [QUALITY_GATES.md](QUALITY_GATES.md) — required evidence before stage transitions
- [RESEARCH_POLICY.md](RESEARCH_POLICY.md) — source, provenance, and untrusted-content rules
- [ROADMAP.md](ROADMAP.md) — staged plan with exit criteria
- [DECISIONS/README.md](DECISIONS/README.md) — decision log and unresolved decisions
- [ADVERSARIAL_REVIEW.md](ADVERSARIAL_REVIEW.md) — pre-implementation challenges, tradeoffs, and approval checklist
- [RISK_REGISTER.md](RISK_REGISTER.md) — initial product, security, accessibility, and release risks
- [ACCEPTANCE_TEST_MATRIX.md](ACCEPTANCE_TEST_MATRIX.md) — initial deterministic and manual coverage
- [STAGE1A_EVIDENCE.md](STAGE1A_EVIDENCE.md) — authorization boundary, deterministic results, and gate status
- [MANUAL_TESTING.md](MANUAL_TESTING.md) — branded Chrome and assistive-technology procedures
- [STAGE1A_MANUAL_RESULTS.md](STAGE1A_MANUAL_RESULTS.md) — observed execution availability and explicit not-run evidence
- [BROWSER_AUTOMATION_PROPOSAL.md](BROWSER_AUTOMATION_PROPOSAL.md) — separately gated production DOM/controller lane; not authorized
- `manifest.json`, `src/`, `fixtures/`, and `tests/` — the dependency-free Stage 1A experiment and deterministic corpus
- [research/sources.yaml](research/sources.yaml) — structured evidence ledger
- [evals/README.md](evals/README.md) — evaluation governance
- [skills/active/README.md](skills/active/README.md) and [skills/candidates/README.md](skills/candidates/README.md) — skill promotion boundaries
- `.codex/agents/` — project-scoped role definitions, including the required read-only compliance reviewer; implementation authority is temporary and serialized

## Current status

The authorized dependency-free Stage 1A static-correction pass is implemented. Source and static regression checks cover ordered WAI-ARIA effective-role processing, container/secondary-link ambiguity, referenced-name precedence, widget exclusions, two-phase focus commit, a fixture-only non-navigating pointer guard, explicit user-value stopping rules, and qualified security-tripwire claims. An executable pure-policy sidecar oracle evaluates synthetic selector scenarios without claiming production DOM execution. The compliance register is an issue-spotting release gate, not legal advice or certification; public release remains blocked on publisher/market facts, current policy reconciliation, and the unresolved Google Terms/`robots.txt` question. Manual Chrome, assistive-technology, runtime privacy, install-warning, real-DOM, and independent frozen-tree review evidence remain required before any verdict can advance the interaction hypothesis. Publication, deployment, Store submission, paid services, telemetry, expanded permissions, dependencies, and material scope changes remain separate approval gates.
