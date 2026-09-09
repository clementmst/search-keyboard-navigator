# Version 0.1.2 discovery-update evidence

Date: 2026-09-09

Status: local release candidate prepared; external website deployment, Store upload, submission, and publication have not been performed in this pass.

## Authorized changes

- Rename the product from Search Keyboard Navigator to ArrowKey Search Navigator.
- Rewrite the Store listing for plain-language value and discoverability without unsupported claims.
- Add an original 1200 × 630 social/landing visual in the established project style.
- Add a static, tracker-free landing page with matching visible copy, canonical metadata, SoftwareApplication structured data, FAQ, robots file, and sitemap.
- Prepare an inactive GitHub Pages deployment workflow and defer credentialed Chrome Web Store API automation.

No product behavior, content-script match, browser permission, runtime dependency, data collection, backend, telemetry, monetization, or account feature changed.

## Validation

- Dependency-free Node policy and artifact tests: **66 passed, 0 failed**, run by direct file invocation because this Windows sandbox denied the test runner's child-process spawning with `EPERM`.
- Manifest JSON parsed and exact name/version/description/permission boundary passed.
- Governance source ledger and compliance register structural tests passed.
- Website metadata, Store link, shortcut statements, evidence limitations, local assets, static-only script boundary, tracker tripwire, skip link, structured-data category, and normal/hover button contrast passed.
- PNG dimension checks passed for the 128 × 128 website icon and both 1200 × 630 social-card copies.
- Release ZIP built twice byte-identically with an allowlisted 12-file payload and `manifest.json` at its root.
- Release SHA-256: `09c0ed53f0ef49d21f69452aeb339e06da9d4b81b21c34a7a4b3e674329e0aea`.
- No Git remote is configured and GitHub CLI is unavailable, so no push or deployment occurred.

## Evidence limits and human checks

- The user previously confirmed version 0.1.1 navigation, popup, and native Ctrl+Enter behavior in branded Chrome. This pass does not claim new Chrome, visual, accessibility, screen-reader, or Store-dashboard validation for 0.1.2.
- The landing page is verified statically, not through a deployed URL or browser-rendering matrix.
- The newly generated social card was visually inspected locally. Its prompt, reference, processing, dimensions, and constraints are recorded in `store/ASSET_PROVENANCE.md`.
- The existing published screenshots show the core behavior. A genuine non-personal Chrome screenshot with the popup open is an optional later improvement and does not block 0.1.2; instructions are in `store/SCREENSHOT_CAPTURE_REQUEST.md`.
- The public Google Sites privacy page still needs the user to replace the displayed product name with the updated policy text before submitting the renamed Store version.
- GitHub repository connection and Pages activation are one-time user actions. Chrome Web Store upload/publication and any future API credential setup remain separately controlled.
