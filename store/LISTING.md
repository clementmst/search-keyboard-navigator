# Chrome Web Store listing draft — version 0.1.2

## Name

ArrowKey Search Navigator

## Summary

Navigate Google Search results with ↑ and ↓. Open links with Enter or Chrome's native new-tab shortcut—without tracking.

## Single purpose

Enable keyboard movement among recognized result-title links on supported desktop Google Search pages.

## Detailed description

Move through Google Search results without reaching for the mouse.

ArrowKey Search Navigator gives you a clear keyboard position and keeps Chrome's familiar link controls:

- ↓ moves to the next recognized result title.
- ↑ moves to the previous recognized result title.
- Enter opens the focused result.
- Chrome's native new-tab shortcut can open the focused result in a new tab where supported (Ctrl+Enter in the tested Windows Chrome setup).
- Esc clears the extension's active navigation session.

The selected title receives a clear outline and a small right-pointing marker. The extension stays inactive while you type in the search box or interact with controls that use arrow keys. Tab, Shift+Tab, Enter, and new-tab shortcuts remain handled by Chrome and the page; link disposition can vary by browser setup.

Privacy comes first. The extension works locally on your device. It has no accounts, analytics, telemetry, advertising, backend, remote configuration, or remote code. It does not persistently store or transmit your searches, browsing activity, page content, or keyboard activity.

Current scope and limitations:

- Supports compatible desktop layouts at `www.google.com/search` only.
- Google can change its page structure, so some layouts or result types may not be recognized.
- Sponsored or rich-result titles may be included when Google presents them with the same title-link structure.
- Navigation does not wrap from the last result to the first.
- Arrow keys retain native behavior at a boundary and may conflict with page scrolling or assistive-technology browse commands.
- Screen-reader compatibility has not been established.

To provide its single purpose, the extension temporarily examines the current Google Search page address, visible result-title links, page structure, focus state, and relevant key-event metadata on your device. It does not record typed text, keep this information, or send it anywhere.

ArrowKey Search Navigator was formerly named Search Keyboard Navigator. It is independent and is not affiliated with, endorsed by, or sponsored by Google LLC. Google Search and Chrome are referenced only to describe compatibility.

## Category

Recommended dashboard category: Accessibility.

## Language and markets

Primary listing language: English. Intended markets: worldwide, with the limitation that the extension supports only `www.google.com`, not regional Google domains. Translate the listing only after the English claims are frozen and reviewed.
