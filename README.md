# Search Keyboard Navigator

Search Keyboard Navigator is a planned Manifest V3 Chrome extension for fast, keyboard-focused navigation of ordinary organic results on desktop Google Search, with explicit assistive-technology limitations under evaluation.

This repository contains the authorized **bounded Stage 1B private-test adapter** built on the Stage 1A interaction experiment. Its deterministic subset is not a substitute for branded-Chrome or assistive-technology evidence. It is not an MVP release or Store artifact.

## Proposed MVP

- Inject only on the narrow `https://www.google.com/search*` prefix in the top frame, then require an exact runtime `www.google.com` origin, `/search` pathname, and supported default-web-results layout.
- Move real DOM focus to the next or previous eligible organic-result link with unmodified `ArrowDown` and `ArrowUp`.
- Never handle `Tab`, `Shift+Tab`, or any Enter/modifier variant. Native Tab continues from the result focused by the extension, so the prior Tab origin is not preserved.
- Use `Escape` to end the extension navigation session and restore the prior focus when it is still safe to do so.
- Ignore editing, composition, modifier, already-cancelled, embedded, and page-widget contexts.
- Never wrap, rewrite links, retain or transmit page data, use a backend, or load executable code remotely.

The unmodified-arrow design conflicts with native page scrolling and some screen-reader browse commands. It is a falsifiable Stage 1A experiment, not accepted release UX. See [ADVERSARIAL_REVIEW.md](ADVERSARIAL_REVIEW.md), [PRODUCT_SPEC.md](PRODUCT_SPEC.md), and [DECISIONS/README.md](DECISIONS/README.md).

## Proposed architecture

The experiment is a packaged, content-script-only extension: readable packaged source, the default isolated world, no service worker, no named Chrome API permissions, no separate `host_permissions`, no storage, no extension network activity, and no runtime dependencies. The static `content_scripts.matches` entry still grants persistent site access and may produce a warning; it is not permission-free. Pure policy functions, a deliberately synthetic fail-closed contract, one versioned narrow desktop adapter, a focus controller, and action-time recomputation keep the compatibility hypothesis separable.

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
- [PRIVATE_TEST.md](PRIVATE_TEST.md) — fresh-profile, non-personal private-test procedure and result form
- [STAGE1B_EVIDENCE.md](STAGE1B_EVIDENCE.md) — bounded implementation, deterministic evidence, review, and remaining limits
- `manifest.json`, `src/`, `fixtures/`, and `tests/` — the dependency-free Stage 1A experiment and deterministic corpus
- [research/sources.yaml](research/sources.yaml) — structured evidence ledger
- [evals/README.md](evals/README.md) — evaluation governance
- [skills/active/README.md](skills/active/README.md) and [skills/candidates/README.md](skills/candidates/README.md) — skill promotion boundaries
- `.codex/agents/` — project-scoped role definitions, including the required read-only compliance reviewer; implementation authority is temporary and serialized

## Current status

The authorized dependency-free bounded Stage 1B private-test adapter is implemented and statically reviewed. Source and regression checks cover its versioned structural signals, exact title-link and secondary-link ambiguity, ordered WAI-ARIA effective-role processing, referenced-name precedence, widget exclusions, two-phase focus commit, and qualified security tripwires. The fixtures and pure-policy oracles do not claim production DOM execution. The compliance register is an issue-spotting release gate, not legal advice or certification; public release remains blocked on current policy reconciliation and unresolved legal questions. Real Chrome observation is still required before calling the private-test behavior observed; assistive-technology, runtime privacy, install-warning, visual, and real-DOM evidence are not claimed. Publication, deployment, Store submission, paid services, telemetry, expanded permissions, dependencies, broader layouts, and deferred backlog items remain separate approval gates.
