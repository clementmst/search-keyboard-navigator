# Initial Acceptance-Test Matrix

Layers: **U** pure unit, **D** deterministic DOM fixture, **C** production extension in a named Chrome/Chrome for Testing browser build, **M** documented manual branded Chrome/AT, **S** static/artifact review.

Stage 1B private-test applicability: pure policy/static fixture checks plus one narrow live-page adapter and a documented human Chrome procedure are in scope. A production DOM/controller browser lane, broad or universal Google layout support, MutationObserver batching, and Stage 2 selector hardening remain deferred; they are not silently counted as passes. Dynamic correctness remains action-time recomputation with same-node preservation, not observer-driven refresh.

| ID | Layer | Scenario | Pass condition |
|---|---|---|---|
| KEY-01 | C | First unmodified ArrowDown from defined neutral document focus | First eligible native result anchor owns DOM focus; one movement and one minimal instant scroll. |
| KEY-02 | C | ArrowDown/ArrowUp sequence | Exactly one eligible result per accepted physical keypress in fresh DOM/logical order. |
| KEY-03 | U,C | Initial Up, no candidates, and active first/last boundaries | No wrap or extension cancellation; at active boundaries focus/session remain and native scroll is permitted but not required. |
| KEY-04 | C,M | Escape with active session, stale prior focus, outside focus, and page dialog | Extension state clears; restoration occurs only to a safe prior target; no propagation stop or trap; page/AT Escape remains observable. |
| KEY-05 | C | Tab/Shift+Tab after arrow focus | Extension never handles/cancels/synthesizes Tab and has not changed `tabindex`; native navigation continues from the extension-focused result, not the pre-session origin. |
| KEY-06 | C,M | Plain Enter on focused supported result | No extension Enter handler/cancellation/synthetic click; observed native activation/disposition is recorded without claiming atomic URL validation or universal current-tab behavior. |
| KEY-07 | U,C | Modified ArrowUp/ArrowDown | Ctrl/Meta/Alt/AltGraph/Shift arrows cause no extension focus, cancellation, or scroll. |
| KEY-08 | U,C | defaultPrevented, composition, untrusted event, and repeat | No extension action for prevented/composing/untrusted events; active available-direction repeats do not move or scroll, while neutral/boundary repeats remain fail-open. |
| KEY-09 | U,C,M | YouTube viewport positioning | Up and Down scroll instantly and symmetrically only when needed, retaining enough space above and below to show the complete selected title. |
| KEY-09 | C | Native Tab or pointer already focused eligible result | Up/Down moves relative to that result rather than restarting at the first. |
| KEY-10 | C | A non-arrow-owning page link, button, disclosure, checkbox, switch, or custom focusable control owns focus | ArrowDown may start at the first title result; controls that genuinely own arrow behavior remain inert. |
| KEY-11 | C,M | Search submission, search input retention, suggestion dismissal, and back navigation | Entry behavior is recorded; arrows remain native while editing; inability to reach a predictable start state is treated as failed product evidence, not bypassed by stealing focus. |
| KEY-12 | C,M | Ctrl/Meta/Shift/Alt+Enter on focused result | Extension performs no cancellation, synthesis, URL rewrite, or forced disposition; platform/browser result is recorded only. |
| EDIT-01 | D,C | Input, textarea, select, searchbox, textbox, combobox | Arrow and Enter remain native; extension inert. |
| EDIT-02 | D,C | Nested contenteditable, designMode, open Shadow DOM editing path, and closed-shadow interactive host | Inert through composed-path/host fail-closed detection. |
| WID-01 | D,C | Menu/listbox/tree/grid/tablist/radio/slider/spinbutton/toolbar/application/media/dialog context | Extension does not consume widget arrows. |
| DET-01 | D | Visible native link containing one `h3` inside `#search` | The title link is a candidate in DOM order. |
| DET-02 | D | Ads, shopping, carousels, maps/local, and other Google modules | Qualifying title links are candidates; non-title controls are not. |
| DET-03 | D | Generated/empirical classes removed, renamed, or randomized | Candidate detection remains unchanged because it does not use them. |
| DET-04 | D | Hidden, inert, disabled, aria-hidden, missing/empty href, disconnected | Excluded. |
| DET-05 | D | Translation links, sitelinks, rich modules, and sponsored modules around title links | Visible native links containing one `h3` are enumerated; surrounding non-title controls do not disqualify or become candidates. |
| DET-06 | D | Missing/hidden `#search`, no title links, consent/login/captcha/no-results/interstitial page | Zero candidates and no key cancellation. |
| DET-07 | D | Sampled locales and translated module labels | Language does not change title-link eligibility. |
| DET-08 | D | DOM order differs from perceived multi-column order | Navigation follows DOM order; no geometry inference is attempted. |
| DET-09 | U,S,D | Fixture oracle independence | Expected candidates live in reviewer-approved sidecars invisible to production; no fixture-only token or selector occurs in production code. Stage 1A currently executes only the dependency-free pure-policy/static portion; production DOM execution remains not run. |
| DET-10 | D | Wrapper-depth/class randomization and surrounding extra links | Title-link eligibility remains stable. |
| DET-11 | U,S,M | Stage 1B live adapter | Pure evidence policy accepts visible genuine title links on the exact route/root without language, ad, rich-module, secondary-link, layout, target, or negative-tabindex exclusions; it still rejects hidden, disabled, download, non-HTTP(S), unnamed, or out-of-root links. |
| URL-01 | U | Relative/absolute/encoded HTTP(S) destinations | Parsed and accepted consistently without rewriting page content. |
| URL-02 | U | javascript/data/blob/file/extension/malformed destination | Excluded; no focus as eligible result and no activation authority. |
| URL-03 | D,C | Direct link, Google redirect link, `download`, target `_blank`, `<base target>`, and target mutation | Direct/redirect links are not decoded/rewritten; download links are ineligible; target disposition remains page/browser owned. |
| DYN-01 | C | Results appended/reordered/replaced | Action-time recomputation uses the current DOM order and eligibility. |
| DYN-02 | C | Focused node replaced by a lookalike with same URL/name/position | No automatic focus transfer; extension state/style clears. |
| DYN-03 | C | Focused node removed, hidden, or made ineligible | Session clears without unrelated jump or automatic prior-focus restoration. |
| DYN-04 | C | Extension styling mutation | Observer reaches quiescence; no callback loop. |
| DYN-05 | C | Same node reorders or a result appends after the prior last result | Same connected eligible node remains the origin; fresh DOM order makes the appended result reachable. |
| DYN-06 | C | Supported results root is replaced | Action-time recomputation yields correct new state; an observer bound only to the old root is never authoritative. |
| ADV-01 | D,C | IDs/names shadow location, URL, config, or selection names | No control-flow change; no named-property authority. |
| ADV-02 | C | Page forges extension styling attribute | Forged node is never authoritative selection state. |
| ADV-03 | C | Page mutates href/visibility after focus | Next extension-owned movement revalidates and clears/ignores unsafe state; no atomic guarantee is claimed for untouched native Enter. |
| A11Y-01 | C,M | Light/dark, zoom 100/200/400%, forced colors | Indicator remains visible, non-color-only, and not fully obscured. |
| A11Y-02 | C | Automated accessibility tree | Intended link owns DOM/AX focus with existing non-empty name and link role; no faux selection, application role, or live region. No speech claim is made. |
| A11Y-03 | M | NVDA browse/focus; VoiceOver Quick Nav on/off; ChromeVox; braille where available | Key delivery, DOM focus versus virtual/cursor focus, name/role speech, duplicates, mode transitions, Tab/Escape exits, and limitations are recorded without overclaim. |
| PERF-01 | C | Candidate profiles 0/1/2/10/50/100 on named reference environment | No trace-reviewed extension task reaches 50 ms; under-16 ms p95 remains a documented benchmark target with warmup/sample/method metadata. |
| PERF-02 | C | Burst of 1,000 decoys plus repeated replacement | Refresh coalesces, page stays responsive, final eligible set correct. |
| PRIV-01 | S,C | Representative session | Zero extension-originated network requests and persistent storage writes. |
| PRIV-02 | S | Logs, fixtures, build files, package | No query/result content, credentials, identifiers, DOM dumps, or local machine paths. |
| MV3-01 | S,C | Manifest and loaded extension | MV3, approved narrow match prefix, top frame/isolated/document_idle, only the declared content-script site access, no unapproved surface or error. |
| ROUTE-01 | C | `/search`, `/searchfoo`, query/hash changes, vertical parameters, same-document route exit, consent/account/regional redirect | Actions occur only on exact `.com/search`; query and vertical parameters do not disqualify it, while other paths/origins yield zero and teardown without cancellation. |
| PERM-01 | C,M | Site access allowed, denied, and user-set on-click | Behavior and warning are captured; denied/on-click access fails safely without errors or misleading claims. |
| BROWSER-01 | C | Automation-runtime validation | Pinned Chrome for Testing uses a fresh profile, receives the production extension, serves the intercepted matching-origin main document, aborts every other request, and leaks no real query/cookie/account state. |
| PKG-01 | S,C | Production ZIP | Allowlisted files only, manifest at root, readable packaged logic, exact artifact passes Chrome tests. |
| PKG-02 | S | Two clean builds from same commit | Byte-identical SHA-256 or documented approved variance. |
| STORE-01 | M,S | Listing/privacy/permission/reviewer material | Claims match exact behavior and transient local DOM handling; no submission occurs. |

## Fixture families

- Versioned supported ordinary-result blocks; minimal pairs; misleading headings; duplicates; sitelinks; unknown blocks.
- Minimal exclusions only: non-title controls, hidden/disabled/download links, non-HTTP(S) destinations, and links outside the search root.
- Hidden/inert/ARIA-disabled/malformed/adversarial DOM.
- Editing and native/ARIA widget contexts, including open Shadow DOM.
- Locales, verticals, consent/login/captcha/no-results/interstitials, redirects, targets/downloads, and route changes.
- Dynamic append/reorder/replace/remove/root-replacement and mutation-storm fixtures.
- Light/dark, sticky header, zoom, and forced-color visual fixtures.

Fixtures are synthetic and sanitized. They record the layout assumption and purpose, not real query or personalized page content. Expected candidates are kept in independently reviewed sidecar contracts that production code cannot see. Fixtures are authored before selectors where practical and include minimal-pair, randomized-irrelevant-markup, and signal-removal cases.

## Deterministic Chrome strategy

Before adopting a tool or dependency, run a validation spike proving a pinned Chrome for Testing instance with a fresh persistent profile can load the production unpacked extension, navigate to a matching `https://www.google.com/search?q=fixture` origin, fulfill the main document from a local synthetic fixture, and abort every other request before network escape. Record the exact product/build/channel and prove injection, origin preservation, zero leaked query/cookie/account state, and clean teardown. Keep branded stable Chrome, representative live Google layouts, forced colors, and real assistive technology as separately documented manual evidence; do not label bundled Chromium results as branded Chrome.

## Manual record template

Record test ID, date, OS, Chrome version/channel, assistive technology/version/settings, layout description without personal data, artifact SHA-256, steps, expected/actual result, console/network observations, sanitized evidence, tester, and linked issue/decision.
