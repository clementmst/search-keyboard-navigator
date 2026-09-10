# Chrome Web Store dashboard reconciliation — version 0.1.2

Status: consent-corrected package prepared locally on 2026-09-10. **Do not upload or submit version 0.1.2 yet.** Static review is pending completion, followed by the required human Chrome/dashboard/hosted-policy checks and exact release authorization.

This is a human readback sheet, not authority for an agent to certify statements or accept Store terms.

## Exact package

- File: `dist/arrowkey-search-navigator-0.1.2.zip`
- Version: `0.1.2`
- SHA-256: `56d6e542fc62875819723d3edbf7bfff1e9d28d434c65e32b1901eaf77dd26ed`
- Name: `ArrowKey Search Navigator`
- Package summary: `Navigate Google Search results with Arrow Up and Arrow Down. Open links with Enter or Chrome's native new-tab shortcut.`
- Category: `Accessibility`

The full Store copy is in `store/LISTING.md`. Reviewer steps are in `store/REVIEWER_INSTRUCTIONS.md`.

## Privacy fields to reconcile

- Single purpose: `Enable keyboard movement among recognized result-title links on supported desktop Google Search pages.`
- Site access: only the static content-script match `https://www.google.com/search*`, narrowed at runtime to the exact `https://www.google.com` origin and `/search` path.
- Named Chrome API permissions: `storage`, solely for one versioned local consent Boolean.
- Storage justification: `Used only to remember one versioned local Boolean indicating whether the user enabled keyboard navigation. It does not store page addresses, searches, results, content, focus history, or key activity, and the extension never syncs or transmits the setting.`
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
2. Load the exact 0.1.2 package in current stable Chrome and confirm access is limited to `www.google.com` plus local storage for the consent setting.
3. Before enabling, confirm arrows remain native. Verify the popup disclosure is readable at 200% zoom and in a quick forced-colors check, choose **Enable keyboard navigation**, and confirm the enabled choice persists when the popup is reopened.
4. On one signed-out, non-personal query, verify search-box non-interference, one-step Arrow Up/Down movement, the visible marker, native Tab and Enter, Escape recovery, and no wrapping.
5. Select **Disable keyboard navigation** and confirm the marker clears, arrows become native immediately, and the disabled choice persists.
6. Record the result. Previous-stable Chrome, broader zoom/forced-colors coverage, accessibility-tree inspection, and assistive-technology testing remain documented quality debt; no compatibility pass is implied.

## Release decision still required

The user authorized the minimal in-product disclosure and consent design on 2026-09-10. The rebuilt package remains unapproved for upload until static review completes and the user performs the Chrome, hosted-policy, dashboard, and screenshot readback described above. Upload and submission remain separate approvals.
