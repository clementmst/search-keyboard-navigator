# Store release checklist — version 0.2.1

Status: implementation and automated checks complete; final human dashboard and disclosure readback pending.

- [x] Google remains the sole static site grant.
- [x] YouTube is the only optional origin grant; GitHub access is absent.
- [x] `scripting` is optional and registers packaged local files only.
- [x] Runtime guards act only on Google Search, YouTube search, and the YouTube homepage.
- [x] The popup presents separate Google Search and YouTube access switches plus a concise local-processing disclosure.
- [x] No telemetry, backend, accounts, remote code, advertising, or extension networking.
- [x] Dependency-free automated suite: 112 Node assertions and 3 PowerShell release checks passed.
- [x] The user observed Google Search, YouTube search, YouTube homepage grid navigation, visible focus, and full-card scrolling in Chrome during iterative 0.2.1 testing.
- [x] Candidate package: `dist/arrowkey-search-navigator-0.2.1.zip`; SHA-256 `33f19600d2613bc9fbaa6c81dbdcadbf625310819d87c81d6dbe49f45ec76282`.
- [ ] Reload the final disclosure-bearing package and confirm the popup remains readable and both access switches work.
- [ ] Update and read back the hosted privacy policy and exact dashboard listing/privacy fields.
- [ ] Approve the exact final version, SHA-256, and `DEFAULT_PUBLISH` submission.

Known limitations: compatible desktop layouts only; enabling YouTube may require one reload of an already-open page; selectors deliberately fail closed when YouTube or Google changes unsupported markup; navigation does not wrap; assistive-technology compatibility has not been established.
