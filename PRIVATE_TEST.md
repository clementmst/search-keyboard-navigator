# Private Chrome test

Status: ready only after the final frozen-tree reviews reported by the operator. This is a private, unpublished experiment, not a finished extension.

## Before you start

- Allow about 5-10 minutes.
- Use a fresh Chrome profile with sync off and do not sign in.
- Use one non-personal query, such as `keyboard navigation accessibility`.
- The adapter does not restrict language, result type, or surrounding Google layout modules.
- Do not use personal, medical, financial, work, or account-specific searches.
- The extension asks for access to `www.google.com` search pages because its packaged content script is available there. Its only named Chrome API permission is `storage`, used for one local consent choice. It has no backend, telemetry, page-data storage, or extension network activity.

## Install the unpacked extension

1. Open Chrome and enter `chrome://extensions` in the address bar.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select this exact folder:

   `C:\Users\68810\Documents\Codex\search-keyboard-navigator`

5. Confirm that **ArrowKey Search Navigator** appears. Expected access is `www.google.com` plus local storage for the consent setting. Stop if Chrome reports any other permission.

## Run the live test

1. Before enabling the extension, open `https://www.google.com`, submit the non-personal query, and press `ArrowDown` from ordinary page focus. The extension must remain inactive.
2. Click the extension icon. Read the disclosure, choose **Enable keyboard navigation**, close the popup, and reopen it once to confirm that the enabled choice persisted.
3. While the search box has the cursor, press `ArrowDown` and `ArrowUp`. They must keep their normal search-box behavior; the extension must not move focus to a result.
4. First test keyboard entry: press `Tab` once to leave the search field for any ordinary page control, then press `ArrowDown`. The first visible result-title link should receive focus.
5. Separately, click any blank part of the page and press `ArrowDown`. It should produce the same first-result behavior.
6. The first visible result-title link inside the Google results area receives real keyboard focus and a clear blue outline. The page may scroll just enough to show it.
7. Press `ArrowDown` once more, then `ArrowUp` once. Focus should move by one visible result title each time. Translation links, menus, and other non-title controls must not receive focus.
8. Hold an arrow briefly. The active session must not race through many results.
9. Press `Tab`. Chrome must continue its normal tab order from the focused result. The extension does not intercept Tab.
10. Return to a focused ordinary result, press `Enter`, and observe native browser navigation. Use Back to return. The extension does not handle or guarantee Enter disposition.
11. Start arrow navigation again and press `Escape`. The blue outline must clear. Focus restoration is best-effort and must never create a trap.
12. At the first or last reachable eligible result, another outward arrow must not wrap. Native page scrolling may occur.
13. Use the popup to select **Disable keyboard navigation**. The outline must clear, arrows must become native immediately, and reopening the popup must show the disabled state.

## Stop immediately if

- an arrow takes focus out of the search box or another control;
- a non-title page control receives extension focus;
- a key causes accidental navigation, repeated runaway movement, a focus trap, or a broken page;
- Chrome shows a broader permission request than the single approved Google Search site access.

## Record the result

Send the operator only:

- Chrome version and the Google interface language used;
- whether Chrome described the extension's site access as only `www.google.com`; the packaged content script itself injects only on `https://www.google.com/search*`;
- pass/fail for search-box non-interference, start from ordinary page focus, blank-page start, one-step Up/Down, Tab, Enter, Escape, boundary behavior, and non-title-control skipping;
- any unexpected behavior in plain language, without screenshots, page source, URLs containing the query, or personal result content.

If no result ever receives focus, also state whether the address began with `https://www.google.com/search`, whether the page was showing ordinary web results, and whether native Tab could visibly focus an ordinary result title. That is the minimum observation needed before considering a bounded adapter revision.

## Remove it

1. Return to `chrome://extensions`.
2. Choose **Remove** for the private-test extension.
3. Delete the fresh Chrome profile if it is no longer needed.

The user confirmed the main live navigation and revised visual indicator in one environment on 2026-08-31. That observation does not establish other layouts, runtime privacy, forced-colors, zoom, or assistive-technology compatibility; record each separately when tested.
