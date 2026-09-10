# Chrome Web Store dashboard reconciliation — version 0.1.2

Status: prepared locally on 2026-09-10. **Do not upload or submit version 0.1.2 yet.** The required in-product privacy disclosure and consent flow has not been designed, approved, implemented, or tested.

This is a human readback sheet, not authority for an agent to certify statements or accept Store terms.

## Exact package

- File: `dist/arrowkey-search-navigator-0.1.2.zip`
- Version: `0.1.2`
- SHA-256: `09c0ed53f0ef49d21f69452aeb339e06da9d4b81b21c34a7a4b3e674329e0aea`
- Name: `ArrowKey Search Navigator`
- Package summary: `Navigate Google Search results with Arrow Up and Arrow Down. Open links with Enter or Chrome's native new-tab shortcut.`
- Category: `Accessibility`

The full Store copy is in `store/LISTING.md`. Reviewer steps are in `store/REVIEWER_INSTRUCTIONS.md`.

## Privacy fields to reconcile

- Single purpose: `Enable keyboard movement among recognized result-title links on supported desktop Google Search pages.`
- Site access: only the static content-script match `https://www.google.com/search*`, narrowed at runtime to the exact `https://www.google.com` origin and `/search` path.
- Named Chrome API permissions: none.
- Remote code: **No**.
- Conservative data categories: **Web history/page address**, **Website content**, and **User activity**. Processing is transient and local; the extension does not retain or transmit it.
- Privacy-policy URL: `https://sites.google.com/view/search-keyboard-navigator-pp`
- Limited Use statements: the human publisher must read the current certifications and confirm that the dashboard, hosted policy, package, and listing agree before checking them.

The complete explanations are in `store/PRIVACY_PRACTICES.md`. The hosted Google Sites page must be manually checked against `PRIVACY_POLICY.md` after its 2026-09-10 update.

## Listing assets

- Keep the currently published screenshots unchanged for this metadata-only update only if the dashboard confirms that they still show the real extension experience accurately **and** their Google/third-party rights and requested attribution treatment are resolved.
- Do not upload the political/Trump screenshot.
- Do not add the neutral Search screenshots until third-party-content rights and Google's requested attribution treatment are resolved.
- Original extension icons and abstract promotional artwork have recorded provenance and are suitable candidates after a final dashboard preview.

## Required human observations before release authorization

1. Confirm the exact dashboard text, privacy categories, privacy-policy URL, and currently attached screenshots.
2. Load the exact 0.1.2 package in current stable Chrome and confirm access is limited to `www.google.com`.
3. Verify the popup opens without navigation and remains readable at 200% zoom and in a quick forced-colors check.
4. On one signed-out, non-personal query, verify search-box non-interference, one-step Arrow Up/Down movement, the visible marker, native Tab and Enter, Escape recovery, and no wrapping.
5. Record the result. Previous-stable Chrome, broader zoom/forced-colors coverage, accessibility-tree inspection, and assistive-technology testing remain documented quality debt; no compatibility pass is implied.

## Release decision still required

Before 0.1.2 can be submitted, the user must choose and authorize a minimal in-product disclosure and affirmative-consent design that completes before any page data is handled. This is a product change and will require a new package, tests, browser observation, policy reconciliation, and exact hash. The present 0.1.2 ZIP therefore must not be submitted.
