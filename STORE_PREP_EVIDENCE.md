# Chrome Web Store preparation evidence

Date: 2026-09-08

Status: version 0.1.0 is publicly available. Version 0.1.1 is a local, user-authorized update that adds only a static instruction popup. No account was accessed and the update has not been uploaded or submitted.

## Exact release candidate

- ZIP: `dist/search-keyboard-navigator-0.1.1.zip`
- SHA-256: `fcabfa8a583a88e48e0272e2abed4d92a27db1fd2ddca41949611d170672ac5a`
- Allowlist: `release/ALLOWLIST.txt`
- Store-material inventory: `release/STORE_MATERIALS_SHA256.txt` with an explicit scope and exclusions
- Manifest is at ZIP root.
- Two independent local builds from the same tree produced the same SHA-256.
- The ZIP contains only the manifest, four packaged icons, four JavaScript files, two CSS files, and one HTML popup. It excludes tests, fixtures, governance, listing assets, screenshots, logs, dependencies, and machine-local paths.

## Validation

- 59 dependency-free tests passed, including a focused static popup test.
- The popup now identifies Ctrl + Enter as the new-tab shortcut. On 2026-09-08, the user confirmed in live Chrome that Ctrl + Enter opened an extension-focused Google result in a new tab before the popup update was reloaded. This establishes the behavior as Chrome's existing native handling rather than extension-owned logic. Production code continues not to handle or synthesize Enter.
- All production JavaScript passed Node syntax checks.
- `manifest.json` parsed as JSON and retained exactly one `https://www.google.com/search*` static content-script grant, with no named API permission, separate host permission, optional permission, service worker, storage, messaging, or web-accessible resource. Its `action` contains only packaged icons and the static instruction popup.
- The source and compliance ledgers passed dependency-free structural completeness and uniqueness checks. A full third-party YAML parser was unavailable and was not installed.
- Project TOML files parsed with Python's standard-library `tomllib`.
- Permission/dependency/remote-code/static privacy tripwires passed.
- Icon PNG signatures and 16/32/48/128 dimensions passed; the small promotional tile is 440x280 and the marquee promotional tile is 1400x560.
- `git diff --check`, document-link checks, release-entry comparison, and artifact scans passed.

## Evidence limits and blockers

- The user confirmed core live behavior and the revised indicator in one Chrome/Google layout. This is not stable/previous-stable, broad-layout, forced-colors, zoom, runtime-privacy, accessibility-tree, or assistive-technology evidence.
- Three user-supplied actual-experience screenshot candidates are preserved at 1280x800 with source captures and exact crop/resizing provenance. The preferred humorous `67` capture resolves the political/controversial-query issue, but remains blocked pending Google attribution/brand treatment and a documented permission or other defensible rights basis for depicted Wikipedia and Dictionary.com material. The political candidate remains local-only. No screenshot is currently approved for submission.
- The privacy policy is public at `https://sites.google.com/view/search-keyboard-navigator-pp` with an August 31, 2026 effective date, monitored public support/privacy email, explicit key-event filtering disclosure, support-communication handling, and a Chrome Web Store Limited Use statement.
- The live dashboard's exact data categories, Limited Use certification, trader declaration, and publisher slot/account requirements require authorized human readback.
- Google Search screenshot/brand/content rights and the unresolved Google Terms/robots interpretation remain public-release blockers under project governance.
- This update package is prepared for human testing and review, not yet approved for upload, and is not a legal-compliance certification.
