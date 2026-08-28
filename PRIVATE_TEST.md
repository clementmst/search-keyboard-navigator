# Private test

This build is only for a short, private observation. It supports one narrow
desktop Google Search structure and may safely do nothing when the page differs.
It is not published, does not claim universal compatibility, and has no
telemetry, storage, account, backend, or extension network activity. It does
locally inspect the current Search page URL and result structure while you use it.

## Load in a fresh Chrome profile

1. Create and open a fresh Chrome profile. Do not sign in or enable sync.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Select **Load unpacked** and choose this repository folder.
5. Confirm that **Search Keyboard Navigator - Private Test** appears. Do not
   continue if Chrome reports an unexpected permission or a load error.

## Make one non-personal test

1. In that profile, open `https://www.google.com/` and make one ordinary,
   non-personal query such as `keyboard navigation test`. Do not use a real name,
   account detail, health topic, address, or other sensitive information.
2. Dismiss the search suggestions so focus is not in the search box. If needed,
   click a blank, non-interactive part of the page.
3. Press `ArrowDown` once. **Pass:** a normal, unsponsored result-title link gets
   native focus and a clear blue outline. **Safe unsupported outcome:** nothing
   happens and the page scrolls normally. **Fail:** an ad, carousel, rich card,
   control, or unrelated link receives focus.
4. If navigation started, press `ArrowDown` and `ArrowUp` one at a time. Confirm
   focus moves without wrapping. At the first/last supported result, the arrow
   remains native and may scroll the page.
5. Press `Tab`, `Shift+Tab`, and `Enter` normally. The extension must not replace
   their browser behavior. Avoid activating a result if you do not want to leave
   the page.
6. Put focus in the search box and press both arrows. They must retain their
   editing/suggestion behavior. Repeat with any visible page control you can test.
7. Start result navigation again, then press `Escape`. The outline must clear;
   prior focus is restored only when it remains safe.

## Record only pass/fail

Do not record the query, result titles, result URLs, screenshots, page source, or
account information.

| Observation | Result |
|---|---|
| Extension loaded with the expected site access | Not run / Pass / Fail |
| Ordinary result navigation | Not run / Pass / Safe unsupported / Fail |
| Ads, rich modules, and controls were not focused | Not run / Pass / Fail |
| Tab, Shift+Tab, and Enter stayed native | Not run / Pass / Fail |
| Search-box arrows stayed native | Not run / Pass / Fail |
| Escape recovery | Not run / Pass / Fail |

Chrome version and date may be recorded without page data. Real Chrome
observation is required evidence, but this cloud implementation does not claim it
was performed.

## Uninstall and remove the profile

1. Return to `chrome://extensions` and select **Remove** for the extension.
2. Close the fresh profile and delete it using Chrome's profile picker.
3. Delete any manually saved notes that contain more than the pass/fail fields
   above.
