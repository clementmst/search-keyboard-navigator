# Stage 1A branded-Chrome and assistive-technology results

Date: 2026-08-28  
Environment: Windows; Google Chrome `151.0.7922.174` installed at `C:\Program Files\Google\Chrome\Application\chrome.exe`  
Artifact: correction-pass working tree; final hashes are recorded in `STAGE1A_EVIDENCE.md`

## Availability and execution boundary

This Codex environment has command-line process access but no interactive control of branded Chrome, Chrome DevTools, or assistive-technology speech/cursor output. NVDA was not found in the standard Program Files or current-user Programs locations. Windows Narrator exists, but it was not launched because the environment cannot observe or operate its interactive speech/focus output. VoiceOver is unavailable on Windows, and no ChromeVox test environment was established.

Therefore every interaction, DevTools privacy/storage, install-warning, zoom/forced-colors, and screen-reader row in `MANUAL_TESTING.md` is **not run**. No pass is inferred.

## Non-interactive branded-Chrome smoke attempts

1. A sandboxed headless Chrome launch with a disposable profile failed internally with Crashpad/Mojo `Access is denied` errors even though the process returned exit code 0. It is recorded as failed, not passed.
2. The same offline `about:blank` headless command outside the sandbox returned a DOM dump and exit code 0.
3. A follow-up run parsed the disposable profile's `Default/Preferences` and could not find the unpacked Stage 1A extension registration. That follow-up failed explicitly. Consequently the DOM dump proves only that branded Chrome launched; it does **not** prove that the extension loaded.
4. Each disposable profile directory was removed after the attempt. No search page or other network URL was visited.

## Manual matrix status

| Evidence family | Status | Reason |
|---|---|---|
| Real search submission, suggestion dismissal, back navigation, neutral-entry reachability | Not run | Requires interactive branded Chrome. |
| Synthetic discovery, native Tab/pointer origin, scroll/boundary/repeat, Escape, dynamic invalidation | Not run | Requires trusted input and interactive DOM/DevTools control. |
| Install warning, site access denied/on-click | Not run | Requires interactive extension UI. |
| Runtime request/storage comparison | Not run | Requires interactive DevTools initiator and storage inspection. |
| Zoom, dark/light, forced colors | Not run | Requires interactive visual observation. |
| NVDA, VoiceOver, ChromeVox, braille | Not run | Required environments or observable interactive output unavailable. |

These missing observations keep G2 runtime evidence pending and G3-G4 blocking partial. They are evidence gaps, not automated failures of the interaction hypothesis.
