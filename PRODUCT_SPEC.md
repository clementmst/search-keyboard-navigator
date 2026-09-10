# Product Specification

Status: Stage 1B bounded live-page private-test adapter authorized and implemented; deterministic and independent-review evidence pending; live Chrome and assistive-technology evidence not yet run.

## User problem

Keyboard-oriented users must repeatedly traverse or point at search results. The extension should make movement between ordinary results fast without taking over native tab navigation, changing search providers, or observing users beyond transient local DOM processing.

## Supported environment

- Desktop Google Chrome, current stable plus the previous stable release during release qualification.
- Top-level documents injected by `https://www.google.com/search*` only when a runtime guard confirms origin `https://www.google.com` and pathname exactly `/search`.
- Visible native links containing one `h3` result title inside the rendered `#search` root.

Stage 1B uses a minimal, language-neutral live-page adapter: on the exact supported route, it enumerates rendered native `a[href]` elements containing exactly one `h3` inside one rendered `#search` root. Surrounding translation links, sitelinks, sponsored markers, rich modules, target disposition, and vertical parameters do not disqualify an otherwise usable result-title link. The synthetic `main > article` contract remains only as a fixture-first interaction oracle.

Regional Google domains are not implied. Chrome match patterns cannot wildcard country-code TLDs, so every added domain is a reviewed scope and permission change.

## Interaction model

### Start and movement

- Start focus may be the page body or any page element that does not genuinely own ArrowUp/ArrowDown behavior. A qualifying `ArrowDown` focuses the first eligible result; initial `ArrowUp` remains native.
- If an eligible result already owns focus through native Tab, pointer use, or prior extension movement, it is the origin even when no extension session exists.
- If an editable or genuine arrow-owning widget owns focus, the extension remains inert. Ordinary links, buttons, disclosures, checkboxes, switches, and other non-arrow-owning page focus do not prevent ArrowDown from starting result navigation.
- In a session, `ArrowDown` and `ArrowUp` focus the next or previous eligible result in fresh DOM/logical order within the supported single-column layout contract.
- Movement never wraps. At either boundary, focus/session remain on the boundary result, the extension does not cancel the key, and native scrolling may occur. A newly appended result becomes reachable on the next movement.

### Focus and selection semantics

The current result is the native anchor that owns real DOM focus. There is no separate ARIA selection model.

- Call `focus({ preventScroll: true })` on the eligible native link.
- Apply a namespaced supplemental focus class or attribute only for styling; it is never authoritative state.
- Scroll with `scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" })`.
- Do not add or change `tabindex`, roles, accessible names, `aria-selected`, `aria-current`, or `aria-activedescendant`.
- Do not create `role="application"` or recast the document as a composite widget.

This changes the current focus location, so the next native Tab proceeds from the focused result rather than the pre-session element. “Preserve Tab” means only that the extension never listens for, cancels, synthesizes, or reimplements Tab/Shift+Tab and never modifies `tabindex` or the page's tab order.

### Activation and clearing

- Do not register an Enter handler. Unmodified Enter and Ctrl/Meta/Shift/Alt-modified variants remain entirely browser/page/user owned. Plain Enter is expected to activate supported primary links in the current context, but the extension does not guarantee disposition or atomically revalidate a page-controlled destination at activation time.
- On session start, remember the previously focused element without persisting it.
- `Escape` acts only when the extension session is active and its result still owns focus. It clears extension styling/state and restores prior focus with `preventScroll` only when that element remains same-document, connected, perceivable, enabled, non-inert, and focusable. Otherwise native focus may remain on the result. Escape is not the sole exit, is not propagation-stopped, and remains available to page/AT behavior.
- Pointer interaction or focus moving outside the current result ends extension styling/state without restoring prior focus. If an overlay or page-owned control supersedes focus, clear without restoration.

### Key-event guards

Listen for `keydown` with a non-passive capture listener and use `event.key`, so page components cannot hide otherwise eligible arrow events before the guarded handler sees them. Ignore the event without cancellation when any of these apply:

- `event.defaultPrevented`, `event.isComposing`, an active composition session, or an untrusted event.
- Any Ctrl, Meta/Command, Alt, AltGraph, or Shift modifier.
- The composed path includes an input, textarea, select, contenteditable region, document editing surface, searchbox, textbox, combobox, or another widget whose arrows have native meaning.
- The path includes listbox, menu, menubar, tree, treegrid, grid, tablist, radio group, slider, spinbutton, toolbar, application, media controls, embedded content, dialog/popover controls, or a closed-shadow interactive host.
- A non-result interactive or focusable element owns focus.
- No eligible movement exists.

Only after focus succeeds and `document.activeElement` is the intended result may the extension call `preventDefault()` for the arrow. It must never call `stopPropagation()` or `stopImmediatePropagation()`.

Held-key repeat is disabled for the private-test hypothesis: the initial accepted keydown moves one result. While an active session owns that direction and another movement is available, repeated keydowns do not advance and are canceled to avoid scroll/speech flooding. With no session or at a boundary, repeats follow the ordinary fail-open boundary rule. This policy is reversible and must be user-tested.

## Eligible-result policy

Google exposes result titles as heading links. The live adapter therefore uses a small positive rule: a candidate is a native `a[href]` inside the rendered `#search` root containing exactly one `h3` whose closest link is that anchor. It must be connected, rendered, programmatically focusable, named, enabled, non-inert, free of `download`, and resolve through the platform URL parser to `http:` or `https:`. A negative `tabindex` does not disqualify it.

Page language, sponsored status, surrounding secondary links, rich modules, target disposition, query parameters, result vertical, and negative tab order do not exclude a valid title link. Non-title controls never become candidates because they do not satisfy the positive title-link rule. Hidden, disabled, unnamed, download, non-HTTP(S), and out-of-root links remain excluded.

Recompute and revalidate candidates before enumeration and every extension-owned movement/focus transfer. Native Enter activation remains browser/page owned; the extension does not claim atomic validation at that instant. Page DOM, attributes, events, order, timing, and URLs are untrusted.

## Dynamic results

- Action-time recomputation is the correctness mechanism. Stage 1B adds no `MutationObserver`; any observer remains separately justified by measured invalidation or performance need.
- If used, observe the smallest supported root while also handling root replacement, coalesce bursts, avoid per-record rescans, and filter extension-owned styling mutations.
- Preserve the current target only while the exact same DOM node remains connected and eligible. Same-node reorder is allowed and subsequent movement uses fresh DOM order.
- If the target is removed, replaced, hidden, or becomes ineligible, end the session and remove styling without transferring focus or automatically restoring prior focus.
- Stop observation on teardown and reach quiescence when the page stops changing.

## Visual treatment

The selected anchor receives real native DOM focus. Because Google's inline title links can produce a fragmented browser outline, the current CSS suppresses that anchor outline and substitutes a title-only outline plus a small left marker. The replacement treatment still requires validation for contrast, light/dark page themes, forced colors, clipping, and 100%, 200%, and 400% zoom; it is not yet an accessibility-compliance claim.

## Privacy and security

- Process the current supported page URL and result DOM locally and ephemerally only for eligibility and focus control.
- Do not retain, transmit, log, analyze, monetize, sell, or share queries, URLs, result text, interactions, or identifiers.
- No fetch/XHR/WebSocket/beacon, page-data storage, cookies, analytics, telemetry, backend, accounts, messaging, remote configuration, or remote executable code. Persist only one versioned local boolean for the user's consent choice.
- No `eval`, `new Function`, string timers, dynamic remote import, unsafe HTML sinks, implicit globals, or named `window`/`document` property access.
- Keep state in extension-owned lexical variables/collections, never in page-controlled attributes.

## Proposed MV3 architecture

1. `manifest.json`: MV3, narrow static content-script prefix, top frame, isolated world, `document_idle`, only the approved `storage` API permission, and no separate `host_permissions`, optional permissions, background context, or web-accessible resource. The content-script match still grants persistent site access and may produce a warning.
2. Key policy: pure guards for modifiers, composition, prior cancellation, editing/widget contexts, boundaries, and repeat.
3. Result policy: the minimal positive `#search a[href] h3` title-link rule plus genuine-link usability and URL validation.
4. DOM adapter: enumeration, visibility/connection checks, focus styling, and minimal scrolling.
5. Navigation controller: ephemeral session state and deterministic boundary/clear transitions.
6. Optional mutation scheduler: narrow observation, root-replacement handling, batching, invalidation, and same-node-only preservation.

The production package should remain readable source with zero runtime dependencies if implementation validates that choice.

## Accessibility limitation

Unmodified arrows are native scroll keys and screen readers may reserve them for virtual-cursor or Quick Nav behavior. A content script cannot guarantee receipt. Stage 1A requires non-interference, native-focus/AX correctness when keys arrive, and candid reporting—not first-class screen-reader arrow operation. The extension must not claim to replace screen-reader link/heading navigation. Manual NVDA, VoiceOver, ChromeVox, and where available braille cursor/focus testing is required. Any release decision needs renewed approval; first-class operation would require an explicit activation mode or remappable shortcut.

## MVP acceptance summary

- Correct start from non-arrow-owning page focus, already-focused-result continuation, first/next/previous/boundary behavior, and inertness in editing or arrow-owning controls, with no wrapping.
- Native DOM focus on each qualifying visible result-title anchor.
- Native Tab/Shift+Tab and every Enter/modifier variant are never intercepted; claims distinguish pass-through from unchanged focus origin or guaranteed disposition.
- Complete editing/widget/modifier/composition/default-prevented guards.
- The adapter avoids layout-specific exclusions; missing genuine title-link markup yields zero candidates, and dynamic replacement never transfers focus.
- Perceivable focus at required zoom/theme/forced-color conditions.
- Zero persistent page/user activity data, extension network activity, runtime dependencies, and unnecessary permissions; only the consent boolean persists locally.
- Deterministic fixture, real-Chrome, accessibility, performance, security, artifact, and live manual gates pass.

See [ACCEPTANCE_TEST_MATRIX.md](ACCEPTANCE_TEST_MATRIX.md) for executable coverage.
