# Stage 1B private-test evidence

Status: minimal language-neutral title-link adapter implemented after the user's live French-layout test exposed over-restrictive exclusions. A subsequent live screenshot exposed a fragmented inline-link focus outline; the indicator now targets only the result title and adds a small left marker. On 2026-08-31 the user confirmed that the revised live behavior and indicator work in that environment. **53 dependency-free tests passed** before Store-preparation changes. This single observation does not establish broad layout, browser, runtime-privacy, forced-colors, zoom, or assistive-technology compatibility.

## Authorized boundary

Stage 1B adds a minimal adapter for visible Google result-title links on the existing MV3 content-script surface. The exact manifest match remains `https://www.google.com/search*`; runtime code requires origin `https://www.google.com` and pathname `/search`, but does not restrict language, query parameters, vertical type, sponsored status, rich modules, secondary links, or target disposition. There are no named Chrome API permissions, separate host permissions, optional permissions, service worker, action, storage, messaging, web-accessible resources, extension network activity, runtime dependencies, telemetry, backend, accounts, monetization, Store work, or publication.

## Implemented change

- `src/google-adapter-policy.js` contains the exact origin/path guard and minimal genuine-link classification without language or module exclusions.
- `src/navigator.js` retains keyboard/session safeguards and discovers rendered native `a[href]` elements containing one `h3` inside the rendered `#search` root, without generated Google class selectors.
- A candidate must be connected, rendered, programmatically focusable, named, enabled, non-inert, non-download, HTTP(S), and inside the search root. Negative tab order and surrounding page metadata do not disqualify it.
- ArrowDown may start from any page focus that does not genuinely own arrow behavior, and the guarded key listener runs in capture phase so Google components cannot hide the key before it arrives. Editing and arrow-owning widgets remain inert; Tab and Enter remain untouched.
- Candidate order and eligibility are recomputed before each extension-owned movement. Node replacement, removal, hiding, or ineligibility clears the session without focus transfer. No `MutationObserver` was added.
- `fixtures/live-google-default.html` is synthetic and sanitized. It contains ordinary, translated, sponsored, and rich-grid title-link scenarios without copied queries, result content, Google generated classes, cookies, accounts, or personal data.
- `tests/google-adapter-policy.test.cjs`, the fixture contract, manifest test, and source guard cover the authorized live-adapter policy and authority boundary. These are static/pure-policy tests, not production DOM or browser execution.
- `src/navigator.css` outlines only the focused result's `h3` title and adds a non-interactive CSS triangle on its left, with separate dark-theme and forced-colors treatment. It does not alter the link's DOM or accessibility semantics.

## Deterministic result

On 2026-08-31, the seven `tests/*.test.cjs` files ran directly with the bundled Node runtime because this environment denies the built-in test runner's child-process fan-out. Result after the indicator correction: **53 passed, 0 failed, 0 skipped**. Exact route, permission, genuine-link, keyboard non-interference, source, and indicator guards remain. No package manifest, lockfile, runtime dependency, DOM package, Playwright code, custom browser controller, Chrome profile, new origin, or new permission was added.

`STAGE1B_SHA256SUMS.txt` is generated only after this evidence record is final and the temporary implementation role is read-only. It enumerates every other non-Git project file by repository-relative path and SHA-256; its only exclusion is itself because a file cannot contain its own stable hash. Reviewers must reject a missing, extra, or mismatched file. The operator's final report supplies the independent-review verdict, branch, and exact commit; this file does not pre-claim those outcomes.

## Evidence limits

No browser automation, DOM package, custom controller, dependency installation, live Google markup capture, Chrome launch, extension load, install-warning observation, runtime network/storage observation, visual check, accessibility-tree check, speech, key-delivery, or assistive-technology test is claimed. Static source tripwires are intentionally limited and are not comprehensive security evidence. The required first live observation is `PRIVATE_TEST.md`.

## Private-test decision rule

The user may begin the bounded fresh-profile test only if the operator reports the tree review-clean. Focus movement from an editable or genuine arrow-owning control, focus on a non-title control as a destination, accidental navigation, runaway repeat, focus trap, broader permission warning, or developer-visible retention/transmission is a stop condition.
