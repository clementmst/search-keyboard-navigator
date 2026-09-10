# Store release checklist — version 0.2.0

Status: implementation candidate; not yet uploaded.

- [x] Google remains the sole static site grant.
- [x] YouTube and GitHub access are separate optional origin grants.
- [x] `scripting` is optional and used only to register packaged local files.
- [x] Packaged controllers register across each granted origin so SPA navigation works; exact runtime guards act only on YouTube `/results` and GitHub `/search?type=repositories`.
- [x] Revocation messages every open granted-origin tab before unregistering and removing access.
- [x] No telemetry, backend, accounts, remote code, or extension networking.
- [x] Candidate package: `dist/arrowkey-search-navigator-0.2.0.zip`; SHA-256 `c406090c906f38cbdf2d88ea3941bb628dc8434bf00e8ae1ee49e1d8bd3e4bcb`.
- [ ] Live Chrome confirmation on YouTube video search and GitHub repository search.
- [ ] Dashboard listing, permission justifications, hosted privacy policy, and reviewer instructions reconciled by the human publisher.
- [ ] Separate exact-package Store submission authorization.

Known limitation: enabling an optional site requires one reload of an already-open matching search page. Selectors are deliberately narrow and may fail closed when either site changes its markup.
