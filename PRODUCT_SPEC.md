# Product Specification

Status: Stage 1A disposable interaction experiment and correction pass authorized; G3-G4 evidence pending; Stage 1B not authorized.

## User problem

Keyboard-oriented users must repeatedly traverse or point at search results. The extension should make movement between ordinary results fast without taking over native tab navigation, changing search providers, or observing users beyond transient local DOM processing.

## Supported environment

- Desktop Google Chrome, current stable plus the previous stable release during release qualification.
- Top-level documents injected by `https://www.google.com/search*` only when a runtime guard confirms origin `https://www.google.com`, pathname exactly `/search`, and a supported default-web-results layout.
- One canonical primary title link per supported ordinary organic-result block on versioned layouts represented by approved fixtures and live-test records.

Stage 1A does not claim a live Google layout adapter. Its deliberately synthetic `main > article` contract exists only to falsify the interaction model. Versioned live-layout classification and selector-robustness claims begin no earlier than separately authorized Stage 1B.

Regional Google domains are not implied. Chrome match patterns cannot wildcard country-code TLDs, so every added domain is a reviewed scope and permission change.

## Interaction model

### Start and movement

- Neutral focus means that no page control owns focus, normally `body` or `documentElement`, and no modal, dialog, popover, editable, or other interactive context is active.
- From neutral focus, a qualifying `ArrowDown` focuses the first eligible result. Initial `ArrowUp` remains native.
- If an eligible result already owns focus through native Tab, pointer use, or prior extension movement, it is the origin even when no extension session exists.
- If any other interactive or focusable element owns focus, the extension remains inert. It never steals focus from an unrelated link, button, disclosure, checkbox, switch, custom control, embedded content, or closed-shadow host.
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

Listen for `keydown` with a non-passive bubbling listener at the latest practical ancestor and use `event.key`. Accept non-operation when the page stops propagation. Ignore the event without cancellation when any of these apply:

- `event.defaultPrevented`, `event.isComposing`, an active composition session, or an untrusted event.
- Any Ctrl, Meta/Command, Alt, AltGraph, or Shift modifier.
- The composed path includes an input, textarea, select, contenteditable region, document editing surface, searchbox, textbox, combobox, or another widget whose arrows have native meaning.
- The path includes listbox, menu, menubar, tree, treegrid, grid, tablist, radio group, slider, spinbutton, toolbar, application, media controls, embedded content, dialog/popover controls, or a closed-shadow interactive host.
- A non-result interactive or focusable element owns focus.
- No eligible movement exists.

Only after focus succeeds and `document.activeElement` is the intended result may the extension call `preventDefault()` for the arrow. It must never call `stopPropagation()` or `stopImmediatePropagation()`.

Held-key repeat is disabled for Stage 1A: the initial accepted keydown moves one result. While an active session owns that direction and another movement is available, repeated keydowns do not advance and are canceled to avoid scroll/speech flooding. With no session or at a boundary, repeats follow the ordinary fail-open boundary rule. This policy is reversible and must be user-tested.

## Eligible-result policy

There is no standardized “organic result” role. Detection therefore uses strict, versioned layout adapters for observed structures rather than a universal semantic selector.

A supported adapter must recognize both a main-results root and an ordinary-result block using multiple independent signals. It returns exactly one canonical native primary title anchor per block. The anchor must be connected, rendered/perceivable, sequentially focusable, non-empty in accessible name, outside hidden/inert/disabled/widget/navigation ancestry, free of `download`, have an effective target absent/empty/`_self`, and resolve through the platform URL parser to `http:` or `https:`. Direct and Google redirect anchors may be used without decoding or rewriting them.

Exclude ads/sponsored regions, shopping/product units, carousels, maps/local packs, rich/vertical result units, page navigation, tabs, menus, account controls, consent/login/captcha/interstitial content, related searches, unrelated links, sitelinks, hidden/inert/disabled content, unsafe/empty destinations, and ambiguous blocks. Generated classes or empirical attributes may corroborate a versioned adapter but are never the sole positive signal. Localized text such as “Sponsored” is never the sole exclusion signal.

Unknown roots, unknown blocks, multiple plausible primary anchors, DOM/visual-order disagreement in an unsupported layout, or insufficient exclusion evidence yield zero candidates. False negatives are preferred to false-positive navigation.

Recompute and revalidate candidates before enumeration and every extension-owned movement/focus transfer. Native Enter activation remains browser/page owned; the extension does not claim atomic validation at that instant. Page DOM, attributes, events, order, timing, and URLs are untrusted.

## Dynamic results

- Action-time recomputation is the correctness mechanism. `MutationObserver` is optional in Stage 1A and must be justified by measured invalidation or performance need.
- If used, observe the smallest supported root while also handling root replacement, coalesce bursts, avoid per-record rescans, and filter extension-owned styling mutations.
- Preserve the current target only while the exact same DOM node remains connected and eligible. Same-node reorder is allowed and subsequent movement uses fresh DOM order.
- If the target is removed, replaced, hidden, or becomes ineligible, end the session and remove styling without transferring focus or automatically restoring prior focus.
- Stop observation on teardown and reach quiescence when the page stops changing.

## Visual treatment

The indicator supplements, not suppresses, native/page focus. It targets a two-CSS-pixel perimeter and at least 3:1 contrast against adjacent colors, remains distinguishable without color alone, works in forced-colors mode, and is not entirely obscured by sticky content at 100%, 200%, and 400% zoom.

## Privacy and security

- Process the current supported page URL and result DOM locally and ephemerally only for eligibility and focus control.
- Do not retain, transmit, log, analyze, monetize, sell, or share queries, URLs, result text, interactions, or identifiers.
- No fetch/XHR/WebSocket/beacon, storage, cookies, analytics, telemetry, backend, accounts, messaging, remote configuration, or remote executable code.
- No `eval`, `new Function`, string timers, dynamic remote import, unsafe HTML sinks, implicit globals, or named `window`/`document` property access.
- Keep state in extension-owned lexical variables/collections, never in page-controlled attributes.

## Proposed MV3 architecture

1. `manifest.json`: MV3, narrow static content-script prefix, top frame, isolated world, `document_idle`, no named API permissions, separate `host_permissions`, optional permissions, background context, action, or web-accessible resource. The content-script match still grants persistent site access and may produce a warning.
2. Key policy: pure guards for modifiers, composition, prior cancellation, editing/widget contexts, boundaries, and repeat.
3. Result policy: strict versioned layout adapters with explicit evidence/rejection reasons, independent signals, fail-closed ambiguity, and URL validation.
4. DOM adapter: enumeration, visibility/connection checks, focus styling, and minimal scrolling.
5. Navigation controller: ephemeral session state and deterministic boundary/clear transitions.
6. Optional mutation scheduler: narrow observation, root-replacement handling, batching, invalidation, and same-node-only preservation.

The production package should remain readable source with zero runtime dependencies if implementation validates that choice.

## Accessibility limitation

Unmodified arrows are native scroll keys and screen readers may reserve them for virtual-cursor or Quick Nav behavior. A content script cannot guarantee receipt. Stage 1A requires non-interference, native-focus/AX correctness when keys arrive, and candid reporting—not first-class screen-reader arrow operation. The extension must not claim to replace screen-reader link/heading navigation. Manual NVDA, VoiceOver, ChromeVox, and where available braille cursor/focus testing is required. Any release decision needs renewed approval; first-class operation would require an explicit activation mode or remappable shortcut.

## MVP acceptance summary

- Correct neutral start, already-focused-result continuation, first/next/previous/boundary behavior, and inertness on unrelated controls, with no wrapping.
- Native DOM focus on the canonical organic-result anchor.
- Native Tab/Shift+Tab and every Enter/modifier variant are never intercepted; claims distinguish pass-through from unchanged focus origin or guaranteed disposition.
- Complete editing/widget/modifier/composition/default-prevented guards.
- Strict versioned adapters prefer false negatives, unknown layouts yield zero candidates, and dynamic replacement never transfers focus.
- Perceivable focus at required zoom/theme/forced-color conditions.
- Zero persistent data, extension network activity, runtime dependencies, and unnecessary permissions.
- Deterministic fixture, real-Chrome, accessibility, performance, security, artifact, and live manual gates pass.

See [ACCEPTANCE_TEST_MATRIX.md](ACCEPTANCE_TEST_MATRIX.md) for executable coverage.
