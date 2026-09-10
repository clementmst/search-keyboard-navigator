# Chrome Web Store release automation

This folder contains a narrow, keyless workflow for the existing ArrowKey Search Navigator Store item. It removes repetitive dashboard mechanics without giving an agent standing permission to release updates.

## Safety boundary

- `Status` is the default and is read-only.
- `Validate` checks the approved package name, version, location, and SHA-256 without authentication or an external write.
- `Release` requires the user's release-specific approval, `-ConfirmRelease`, the approved manifest version, the exact ZIP SHA-256, and an explicit publication mode.
- `STAGED_PUBLISH` waits for a later developer publication action after Store approval. `DEFAULT_PUBLISH` publishes automatically after Store approval.
- Submission always requests normal Store review (`skipReview: false`) and stops on validation warnings (`blockOnWarnings: true`).
- The workflow uses a short-lived impersonated token in memory. It does not create, read, or store a service-account key.
- `Release` hashes and inspects one bounded in-memory copy, uploads those same bytes, and submits only when that same response synchronously confirms `SUCCEEDED` and the approved version. It also stops while an earlier upload is still processing. If Google processes the new upload asynchronously, the command stops without submitting because the documented status response cannot bind an unsubmitted draft to a version or hash.
- The script cannot accept agreements, certify dashboard disclosures, alter legal/payment/tax details, or resolve a Store policy warning.

## Configured boundary

The nonsecret identifiers in `chrome-web-store-publisher-config.json` bind the tool to:

- Google Cloud project `arrowkey-cws-publishing`
- one publisher ID
- Store item `eifanigljpfnmmdfeefjdioelbkgmeja`
- service account `arrowkey-cws-publisher@arrowkey-cws-publishing.iam.gserviceaccount.com`
- extension name `ArrowKey Search Navigator`

Changing any identifier or the credential model requires a fresh security and compliance review.

## Operator commands

Read-only status:

```powershell
& .\release\manage-chrome-web-store-release.ps1
```

The exact release command is assembled only after the applicable release gate passes and the user explicitly approves the version, SHA-256, and publication mode. Do not save access tokens in scripts, shell history, files, CI variables, or repository settings.

On a new computer, install the official Google Cloud CLI, sign in as the authorized publisher operator, and retain the existing narrow Token Creator binding. No JSON credential download is needed.
