# Stage 1A fixtures

These fixtures are deterministic evidence for the disposable interaction experiment. They are not snapshots of Google markup and are not selector promises.

- `ordinary-results.html` represents the only supported semantic contract: one `main`, direct `article` children, and exactly one native HTTP(S) title anchor associated with one `h2` or `h3` in each article. Its external `.test` links are paired with the manually installed capture listener in `pointer-guard.js`, which cancels primary click navigation without changing focus or scrolling. Its blocks deliberately exceed one viewport.
- `ambiguous-results.html` documents block-level examples that must fail closed, including a hidden-only title.
- `editing-context.html`, `widget-context.html`, `modal-context.html`, and `interactive-role-context.html` document whole-layout or role-override contexts that must return zero candidates.
- `secondary-role-link-context.html` and `secondary-focusable-anchor-context.html` are minimal-pair regressions: an otherwise valid title anchor plus a custom ARIA link or focusable secondary anchor must fail closed.
- `role-token-context.html` covers ordered WAI-ARIA fallback tokens, recognized non-link precedence, legitimate primary-link fallback, and a result container whose own effective role is `link`.
- `contracts/result-policy-cases.json` and `contracts/selector-scenarios.json` are executable pure-policy sidecar oracles consumed by the built-in Node tests. They evaluate expected eligibility without a DOM implementation. Production code never reads fixture IDs or test metadata, and these tests do not claim browser or real-DOM execution.

The local HTML files cannot directly exercise the extension because Stage 1A intentionally grants only `https://www.google.com/search*`. Follow `MANUAL_TESTING.md` to install the fixture markup temporarily on an in-scope page using Chrome DevTools.
