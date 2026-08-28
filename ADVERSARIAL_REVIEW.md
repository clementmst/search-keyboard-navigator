# Adversarial Review Synthesis

Date: 2026-08-28

Stage: pre-implementation

Method: four independent read-only reviews covering product value, accessibility/native keyboard behavior, Chrome architecture/privacy/Store policy, and test/selector robustness.

## Verdict

The content-script-only architecture remains a strong candidate for a disposable interaction experiment, but the previous documents overstated selector resilience, permission absence, current-tab activation, Tab preservation, and dynamic replacement safety. Always-on unmodified arrows are not approved release UX; they are a hypothesis that Stage 1A must try to falsify.

## Conservative corrections resolved autonomously

- Say that Tab is never handled and `tabindex` is never changed, while acknowledging that real focus changes where native Tab continues.
- Start only from neutral document focus or an already focused eligible result; remain inert on every other interactive/focusable element.
- Keep actual native-anchor focus plus a supplemental visual indicator; do not create an ARIA selection model or live region.
- Never handle unmodified or modified Enter. Native activation and disposition remain browser/page/user owned; current-tab behavior is only a supported-layout expectation for plain Enter.
- Preserve only the same connected eligible DOM node across updates. Replacement, removal, hiding, or ineligibility ends the session without inferred focus transfer.
- Recompute candidates at each extension-owned movement. Treat `MutationObserver` as an optional invalidation/performance optimization, not the correctness mechanism.
- Use DOM/logical order within a supported single-column layout contract; do not geometry-sort.
- Recognize one canonical primary title anchor per versioned supported ordinary-result block. Unknown or ambiguous structures yield zero candidates.
- Allow empirical classes/attributes only as secondary versioned evidence; never as the sole inclusion signal. Localized text is never the sole exclusion signal.
- Add an exact runtime `www.google.com` origin and `/search` pathname/default-web-layout guard; the manifest `/search*` pattern is only an injection prefix.
- Describe the manifest accurately: no named Chrome API permissions or separate `host_permissions`, but one persistent site-access grant comes from `content_scripts.matches` and may produce a warning.
- Disclose local and ephemeral page URL/result-DOM processing while stating there is no retention, transmission, analytics, sale, or sharing.
- Treat zero extension network activity, remote configuration, and runtime dependencies as stricter project choices, not all as Store mandates.
- Separate automated AX-tree assertions from real assistive-technology announcements and key-delivery evidence.

## Material choice matrix

| Choice | Recommended default | Strongest alternative | Main tradeoff | Confidence | Reversibility |
|---|---|---|---|---|---|
| Arrow activation | Always-on unmodified arrows only in disposable Stage 1A; require renewed approval for release UX | Explicit/remappable navigation mode from the outset | Zero activation friction versus loss of native scrolling and unreliable AT key delivery | High | Medium |
| Start origin | First result only from neutral document focus; otherwise move relative to an already focused eligible result; inert on other controls | Start at first from any non-editing context | Composes with native focus and avoids hijacking unrelated controls versus a slightly more complex rule | High | High |
| Active boundary | Do not wrap or cancel when no movement exists; document that native scroll may occur while focus stays on the boundary result | Consume boundary arrows until Tab/Escape | Preserves native behavior versus stronger spatial consistency | Medium | High |
| Focus representation | Native anchor focus plus supplemental visible indicator | Visual-only cursor with custom activation/announcement | Native semantics and AT exposure versus preserving the old Tab origin | High | Medium |
| Eligible result | One primary title anchor in a versioned supported ordinary organic-result block; fail closed | Broad heading-link heuristic and richer units | Lower coverage versus sharply lower false-positive risk | High | Medium |
| Selector evidence | Multiple independent signals; empirical classes only as corroboration | Ban all class evidence or rely heavily on current classes | Better observed-layout precision versus some drift sensitivity | High | High |
| Candidate order | Fresh DOM/logical order in supported single-column layouts | Bounding-box visual sorting | Predictability and accessibility relationship versus support for complex visual rearrangement | High | High |
| Dynamic replacement | Same connected eligible node only; otherwise clear without focus transfer | Match replacement by URL/name/position | Conservative interruption versus risk of unsolicited/wrong focus | High | High |
| Enter and modifiers | No Enter handler; all variants remain native; plain current-context activation is tested, not guaranteed | Intercept plain Enter and force `location.assign()` | Preserves anchor/browser semantics versus strict disposition control | High | Medium |
| Domain and locale | `www.google.com` only; language-neutral signals with sampled locales; unknown layouts yield zero | English-only promise or named regional-domain allowlist | Narrow permissions with broader layout testing versus narrower usefulness or linear domain growth | Medium-high | High |
| Static injection | Static content script for the always-ready experiment | User action/command with `activeTab` and `scripting` | Least code and immediate behavior versus greater ambient site access and warning | High | Medium |
| Screen-reader bar | Require non-interference, native-focus correctness, and candid compatibility evidence; do not promise arrow delivery | Make first-class screen-reader arrow operation an MVP gate | Keeps experiment feasible versus requiring a different activation/remapping design | High | Medium |
| Browser automation | Validate a pinned Chrome for Testing lane, then separately test branded stable Chrome and real AT manually | Bundled Chromium automation only | Higher-fidelity evidence versus simpler tooling | High | Medium |
| Held repeat | One movement on initial keydown; cancel repeats only while an active session owns an available movement | Rate-limited repeat | Avoids speech/focus flooding versus faster held navigation | Medium | High |

## Reviewer disagreement resolved

One reviewer preferred consuming active boundary arrows for consistency; two preferred fail-open native behavior to avoid an arrow-scroll trap. The recommended default remains fail-open at boundaries because preserving native behavior is the stronger project principle. Stage 1A must measure whether the resulting focus/scroll split is confusing. This is explicitly reversible.

## Product-value questions Stage 1A must answer

- Can a user discover the behavior and explain when arrows are extension-owned?
- After submitting or editing a query, can the user reach a valid start state without surprising focus movement?
- Does navigation reduce effort to reach a named result compared with native Tab or pointer use?
- Can users recover native scrolling immediately with Tab, Escape, or another ordinary action?
- Do boundary behavior, disabled repeat, and dynamic-session clearing feel predictable?
- Do screen-reader and keyboard-only users experience non-interference even when arrows never reach the page?

No external recruitment, analytics, telemetry, or user-data collection is authorized. Evidence may come from deterministic fixtures, documented local/manual evaluation, and user-directed testing.

## Operating-model findings

- The ten role definitions are a catalog, not a standing team. Continue activating only three to five roles for a complex gate; do not make every role mandatory for every patch.
- The previous root `AGENTS.md` mixed hard safety invariants with unapproved UX hypotheses. It now separates non-negotiable authority/privacy guardrails from Stage 1A behavior hypotheses.
- All custom agents remain read-only until the user authorizes Stage 1A and explicitly promotes exactly one implementation writer. Reviewers remain read-only and independent.
- Stage 1A uses only the relevant subset of G1-G4. Requiring full selector hardening, Store readiness, reproducible packaging, and every release review before testing basic user value would create process theater and sunk cost.
- A Stage 1A result does not authorize Stage 1B. The orchestrator must stop, preserve evidence, and request the next decision.
- No candidate skill should be created merely to automate a one-off experiment. Repetition plus eval evidence, not role enthusiasm, justifies a skill proposal.

## Approval checklist

- [ ] Stage 1A is approved as disposable and fixture-first, not as release UX.
- [ ] Unmodified global arrows are approved only as the experiment hypothesis.
- [ ] Native focus plus supplemental indication is accepted despite moving the native Tab origin.
- [ ] Fail-open, no-wrap boundaries are accepted for the experiment.
- [ ] Strict versioned primary-title adapters, DOM order, and fail-closed ambiguity are accepted.
- [ ] Replacement ends the session; no semantic focus transfer is accepted.
- [ ] Every Enter variant remains native; strict current-tab control is not required.
- [ ] `www.google.com`-only site access and sampled language-neutral layouts are accepted.
- [ ] Screen-reader arrow delivery is not an MVP experiment gate; non-interference and candid reporting are required.
- [ ] No new dependency, named API permission, separate host permission, background, action, storage, network, or Store work is implied.

## Exact recommended implementation-authorization message

```text
Authorize Stage 1A only as a disposable, fixture-first interaction experiment in C:\Users\68810\Documents\Codex\search-keyboard-navigator.

Temporarily authorize exactly one extension implementation writer with workspace-write access in the existing checkout for Stage 1A; keep every research and review agent read-only, serialize all writes, and return the implementation role to read-only when Stage 1A ends.

Authorize a Manifest V3 static content script on https://www.google.com/search* for this experiment, with an exact runtime https://www.google.com origin, /search pathname, and supported default-web-layout guard. This is the only approved site-access grant. Do not add named Chrome API permissions, separate host permissions, optional permissions, a service worker, action, storage, messaging, web-accessible resources, extension network activity, remote configuration, runtime dependencies, telemetry, or Store work.

Test unmodified ArrowUp and ArrowDown only to falsify the interaction hypothesis. Start at the first eligible result only from neutral document focus; if native Tab or pointer use already focused an eligible result, move relative to it; remain inert on every other interactive or focusable element and in all editing, widget, composition, modified-key, or already-cancelled contexts.

Use real native-anchor focus plus a supplemental accessible indicator. Never change tabindex or ARIA semantics. Use fresh DOM/logical order. Do not wrap. At an active first/last boundary, keep focus/session, do not cancel the arrow, and allow native scrolling. Move once on the initial keydown; suppress held repeats only while an active session owns an available movement.

Never act on Tab or Shift+Tab, never register an Enter handler for any modifier variant, and never act on Escape outside an active session. Native Tab continues from the extension-focused result. Native Enter disposition remains browser/page/user owned and is not guaranteed by the extension. Escape may clear an active session and restore prior focus only when the target is still safe; never stop propagation.

For Stage 1A, support only one primary title anchor per deliberately narrow synthetic ordinary-result block. Fail closed on ambiguity, ads, sitelinks, rich/vertical units, and unknown layouts. Preserve only the same connected eligible DOM node; replacement, removal, hiding, or ineligibility ends the session without focus transfer. Recompute on each extension-owned movement; do not add MutationObserver complexity unless evidence requires it.

Implement only the smallest readable experiment, synthetic fixtures, built-in deterministic tests, and documented local/manual Chrome checks needed to evaluate discovery, search-input entry, native-Tab continuation, native-scroll loss, boundaries, repeat, Escape recovery, dynamic clearing, and screen-reader key delivery/non-interference. Do not add a browser-automation dependency without a separate proposal and approval.

Stop after Stage 1A, run the applicable G1-G4 subset, preserve the evidence, obtain independent read-only product/accessibility/security/test reviews, and report whether the interaction hypothesis should be rejected, revised, or advanced. Do not proceed to Stage 1B without separate approval.
```
