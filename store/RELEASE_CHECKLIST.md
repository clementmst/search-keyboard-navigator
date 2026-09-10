# Store release checklist

Status: version 0.1.1 is public; version 0.1.2 now includes the authorized local consent gate and is undergoing package review. Upload and submission remain separate release-specific approval gates.

## Prepared locally

- [x] MV3 manifest name, description, icons, exact Google Search content-script scope, and only the approved `storage` permission for one local consent Boolean
- [x] Original 16/32/48/128 icons, 440x280 small promotional tile, and 1400x560 marquee promotional tile
- [x] Listing, single-purpose, privacy-practices, reviewer, screenshot, provenance, and rollback drafts
- [x] Privacy-policy draft with effective date, monitored public support/privacy email, and affirmative Limited Use statement; publication readiness remains gated by consent handling and hosted-page verification
- [x] Three fresh actual-experience screenshot candidates at 1280x800, preserved with provenance; the neutral humorous capture is preferred
- [x] Existing public Store screenshots selected and uploaded by the user for version 0.1.1
- [ ] Optional, non-blocking: stronger future screenshot with the instruction popup open, captured from a genuine non-personal Chrome session
- [x] Public privacy-policy URL: `https://sites.google.com/view/search-keyboard-navigator-pp`
- [x] Monitored public support/privacy email: `searchkeyboardnavigator.support@gmail.com`
- [x] Publisher account, contact verification, and initial dashboard submission completed by the user
- [x] Exact version 0.1.2 package/listing/privacy readback sheet prepared in `store/DASHBOARD_RECONCILIATION.md`
- [ ] Human dashboard readback and hosted privacy-policy verification
- [x] In-product user-data disclosure and affirmative consent, approved and implemented before page handling; browser verification remains pending
- [ ] Current-stable Chrome smoke check on the exact replacement package, including 200% zoom and a quick forced-colors check
- [ ] Non-blocking quality debt: previous-stable Chrome, broader zoom/forced-colors, accessibility-tree, and assistive-technology evidence
- [ ] Screenshot dashboard identity and third-party-rights/Google-attribution treatment; no new screenshot upload is proposed for 0.1.2
- [ ] Final compliance/legal-risk resolution for worldwide release

## Account, approval, and external actions

Only the user may register or interactively access the publisher dashboard, enable/verify 2-Step Verification, pay the registration fee, accept agreements, enter legal/payment/tax details, or certify dashboard statements. The user must explicitly approve each exact ZIP version and SHA-256 and choose `DEFAULT_PUBLISH` or `STAGED_PUBLISH` before an agent releases it. After that bounded approval, the agent may upload the exact package and immediately submit it through the configured keyless service account; it may never create or store a service-account key. Halting, unpublishing, or changing a live rollout remains a separate user decision.

The guarded command is `release/manage-chrome-web-store-release.ps1`; its operating notes are in `release/CHROME_WEB_STORE_AUTOMATION.md`. Its default `Status` action uses the read-only OAuth scope and omits the Store public key from output. `Validate` checks the exact artifact without authentication or an external write. `Release` requires an explicit confirmation switch, version, SHA-256, and publication mode; it uploads and submits in one bounded operation only if Google synchronously confirms the same version. Submission always uses `skipReview: false` and `blockOnWarnings: true`, and stops on Store warnings or uncertainty.

Before any upload, independently compare the exact ZIP, hash, manifest, listing, privacy policy, dashboard answers, screenshots, rights/provenance, and test evidence. Record the live policy versions and all residual risks. Version 0.1.2 now gates page handling on the versioned local consent Boolean, but it must not be uploaded until independent static review and the required human checks are complete.

## Rollback

Retain the accepted ZIP and SHA-256. Chrome Web Store versions cannot be downgraded. A repair must use a higher version, pass the full release gates, and receive explicit user approval. For a serious first-release problem, the human publisher should halt or unpublish through the dashboard while a reviewed higher-version fix is prepared.
