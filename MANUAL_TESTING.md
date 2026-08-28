# Stage 1A local and manual Chrome checks

## Purpose and limits

This procedure evaluates the Arrow-key interaction hypothesis with synthetic markup. It does not validate selectors against live Google result markup, claim screen-reader compatibility, or authorize Stage 1B. Use a fresh Chrome profile with no personal account, cookies, or personal query. Do not capture page contents containing personal data.

The extension intentionally has no file-scheme access. The synthetic markup must therefore be installed temporarily into an already in-scope `https://www.google.com/search` document. Do not widen the manifest to make fixture loading easier.

## Install the unpacked experiment

1. Open `chrome://extensions` in desktop Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this repository root.
4. Record the exact Chrome version and the site-access warning. Confirm the extension has no named API permission and only the declared `www.google.com` search-page site access.
5. Keep all account sync disabled. If consent, login, CAPTCHA, a redirect, a vertical, or another interstitial appears during any check, record the state and stop; do not change the runtime guard.

## Observe the real search-entry path before replacing markup

This observation tests product reachability, not live-result selection.

1. With the unpacked extension disabled, open `https://www.google.com/`, enter the fixed non-personal query `skn-stage1a-fixture`, dismiss suggestions with Escape, and submit. Record the focused element category after results load (neutral document, search input, result link, or other control), whether an unmodified arrow scrolls, and whether back navigation restores input focus. Do not record the query DOM or page contents.
2. Repeat from a fresh tab with the extension enabled. The live layout is expected to fail closed unless it exactly matches the synthetic Stage 1A contract; do not count zero candidates as a selector failure in this interaction experiment.
3. Compare the entry/focus observations. If focus stays in the search input or another control, record that neutral Arrow entry is not immediately reachable. Do not manufacture a product pass by clicking whitespace.
4. Continue only on the exact `https://www.google.com/search` pathname. Close any personalized or redirected tab.

## Install the supported synthetic layout

In DevTools **Elements**, select the existing `body`, choose **Edit as HTML**, and replace only its contents with the contents inside `<body>` from `fixtures/ordinary-results.html`. Include the fixture's body-level style element. Do not reload: reloading restores the live page. Confirm the address remains the exact HTTPS `www.google.com/search` route.

For the pointer-origin row only, use DevTools **Sources > Snippets** to run the reviewed contents of `fixtures/pointer-guard.js` after installing the fixture. The capture listener calls only `preventDefault()` for pointing-device fixture-result clicks (`event.detail > 0`); it does not stop propagation, change focus, scroll, affect keyboard-generated clicks, or run as extension code. Record `location.href` and `scrollY` immediately before and after the click and require both to remain identical. If the guard is not installed or either value changes, mark the pointer row not run/failed rather than clicking a live destination.

This approach preserves the already-installed content-script listeners but replaces the page-controlled result DOM. It makes no extension-originated request. Close the tab when finished.

## Interaction record

For every check, record date, OS, Chrome product/channel/version, extension source SHA-256 list from `STAGE1A_EVIDENCE.md`, zoom/contrast state, steps, observed result, console errors, and tester. Use **pass**, **fail**, or **not run**; never infer a pass.

| Check | Procedure | Expected Stage 1A observation |
|---|---|---|
| Discovery and neutral entry | After the fixture replacement leaves body/document focus neutral, press ArrowDown once. Repeat after setting `scroll-behavior: smooth` on the page. | Alpha link receives real DOM focus, visible supplemental outline, and one nearest **instant** scroll even when page CSS requests smooth scrolling. Initial neutral ArrowUp remains native. This synthetic neutral setup is reported separately from the real entry observation above. |
| Search-input and editing entry | Focus the input, textarea, select, contenteditable, slider, scrollbar, focusable separator, tree, toolbar control, and embedded-frame host in turn; press Up/Down. For IME, name the installed IME, begin a visible composition in the search input, and press an arrow before committing. | No extension focus, cancellation, or scroll. Each context retains native/page/IME behavior. Record unavailable IME as not run. |
| Popover/modal/ancestor contexts | Open the fixture popover and press arrows from its control/content. Separately install each of `editing-context.html`, `widget-context.html`, and `modal-context.html` as body contents and press arrows. | Zero extension candidates/actions in every context. The extension does not close or modify the context. |
| Other controls | Focus each ordinary button, the toolbar button, and a temporary custom `tabindex="-1"` control; press Up/Down. | Extension remains inert. |
| Native Tab and pointer origins | From neutral focus, ArrowDown to Alpha, then press Tab and Shift+Tab. Separately Tab to Bravo and press an Arrow. With the reviewed pointer guard installed, record URL/scroll, click Bravo, confirm both are unchanged, then press an Arrow. | Extension never handles Tab. Tab continues from Alpha in native order. The guarded click focuses Bravo without navigation or scrolling, and an eligible link reached by Tab or pointer is the relative Arrow origin. |
| Boundaries/native scroll | Use the 75-vh result blocks. Activate Alpha and press ArrowUp; activate Charlie and press ArrowDown. Record `scrollY` before/after and whether focus/outline remain. | No wrap and no extension cancellation at a boundary. Focus/session/outline remain; native page scrolling is allowed and is recorded rather than required. |
| Held repeat | In an active session with an available next result, hold ArrowDown. Repeat at Charlie. | Available-direction repeats do not cause additional result moves or extension scroll. At the boundary, repeats remain native/fail-open. |
| Escape recovery | Start from body, ArrowDown, then Escape. Repeat after starting from Bravo via Tab/pointer. Repeat after removing the saved prior node. | Only an active session clears. Safe prior focus is restored without a propagation stop; stale/unsafe prior focus is not targeted. Escape outside a session remains page-owned. |
| Dynamic same-node reorder | While Bravo is selected, move its existing `article` before Alpha in Elements, then press an Arrow. | The same connected eligible anchor remains the origin; fresh DOM order controls the next movement. |
| Dynamic replacement/removal/hiding | While Bravo is selected, separately replace its anchor with a clone, remove it, add `hidden`, add a second link, or change target to `_blank`; then press an Arrow. | Session/indicator clear with no automatic focus transfer. The same key does not jump to another result. |
| Unknown/ambiguous/context layouts | Install `ambiguous-results.html` and each context fixture; press arrows from neutral focus. | Zero eligible results and no extension key cancellation, including for hidden-only title text. |
| Route exit | Establish a session, then use `history.replaceState({}, "", "/")` and press an Arrow. | Session clears and the extension remains inert. Restore `/search` only by closing/restarting the disposable tab. |
| Native Enter | Focus an eligible link and try plain and modified Enter variants. | Behavior is entirely browser/page/user owned. The extension has no Enter handler and makes no disposition guarantee. |
| Zoom and contrast | Repeat focus checks at 100%, 200%, and 400%, light/dark page colors, and Windows forced colors. | Focus remains visible and not fully obscured. Record failures rather than adjusting semantics. |

## Screen-reader and keyboard-delivery matrix

Run these manually because an automated accessibility tree cannot prove speech, browse-mode delivery, virtual-cursor synchronization, or braille behavior.

| Environment | Required observations |
|---|---|
| NVDA, browse and focus modes | Whether Up/Down reaches the page; link name/role announcement after movement; virtual cursor versus DOM focus; Tab and Escape exits; duplicate or missing speech. |
| VoiceOver, Quick Nav on and off | Whether unmodified arrows are intercepted by Quick Nav; DOM focus versus VoiceOver cursor; announcement; Tab/Escape recovery. |
| ChromeVox | Key delivery, focus ring, name/role speech, ChromeVox cursor relationship, and exit behavior. |
| Braille display, if available | Braille focus/cursor synchronization and whether the result name is presented once. |

Any environment in which the assistive technology owns unmodified arrows is evidence against a universal interaction claim. Do not enable application mode, rewrite roles, add live regions, or intercept additional keys to force a pass.

## Privacy/network check

Use two fresh-profile runs: a baseline with the extension disabled and a second run with it enabled. In each run, enable DevTools Network **Preserve log**, clear the log immediately before the same fixed-query and fixture sequence, and retain only counts/origin/initiator categories—never response bodies, cookies, query DOM, or a HAR containing personal data.

Inspect **all** requests, not only URLs containing the extension ID. Compare the request list and use the Initiator column/stack to identify any content-script source. Page requests may legitimately differ, so an unexplained difference is not automatically attributed to the extension; investigate it and mark the result unresolved if attribution is uncertain. Static source review remains separate evidence.

In Application/Storage, inspect the page origin for Local Storage, Session Storage, IndexedDB, Cache Storage, cookies, and service workers before and after the fixture sequence. Also confirm `chrome://extensions` shows no extension service worker. The expected extension-attributable delta is zero, but only an observed, attributable run may be marked pass.

## Current execution availability

If this procedure is being run in an environment without interactive control of branded Chrome or the named assistive technologies, record each check as **not run**. Finding an installed executable, passing Node tests, or inspecting CSS/source must never be converted into a manual-browser or AT pass.

## Teardown

Close the disposable tab, remove the unpacked extension, and delete the fresh Chrome profile if one was created. Do not publish, package for Store submission, or continue to Stage 1B.
