# Version 0.2.1 evidence

Date: 2026-09-12

- Candidate: `dist/arrowkey-search-navigator-0.2.1.zip`
- SHA-256: `33f19600d2613bc9fbaa6c81dbdcadbf625310819d87c81d6dbe49f45ec76282`
- Package: 15 allowlisted files; byte-identical to source at capture.
- Environment: Windows 11, dependency-free Node tests invoked directly, PowerShell 7 release checks.
- Automated result: 112 Node assertions passed; 3 PowerShell release checks passed; JavaScript, manifest JSON, package, permission, and whitespace checks passed after the final disclosure reconciliation.
- Covered: exact routes, optional permission denial/grant/rollback, stale state, registration and teardown, packaged-code boundary, Google regression policy, YouTube search/home selectors, responsive grid movement, all-arrow activation, complete-card scrolling, popup controls, and artifact structure.
- User-observed behavior: Google Search and YouTube navigation, visible focus, popup simplification, responsive homepage movement, and full selected-card visibility were confirmed during iterative Chrome testing. The final disclosure-bearing package still requires a brief popup/access-switch readback.
- Not claimed: universal Google/YouTube layouts, assistive-technology compatibility, hosted privacy-policy parity, live dashboard-field parity, Store approval, or legal compliance.
- External state before submission: Store API status reported public version 0.2.0 at 100%, no submitted revision, no policy warning, and no takedown.
