# Separate browser-lane proposal — not authorized

Status: proposal only. No dependency, browser binary, controller, test code, network fixture, or permission has been added.

## Why a separate lane is required

The production controller depends on real DOM layout, focus, composed event paths, trusted keyboard delivery, scrolling, and accessibility-tree behavior. The bundled Node runtime has no `document` or `DOMParser`; a hand-built fake DOM would test the fake rather than Chrome. The correction pass's direct branded-Chrome headless attempt also failed to verify unpacked-extension registration.

Chrome removed `--load-extension` support from ordinary branded Chrome starting in Chrome 137 and directs testing use cases toward supported automation alternatives. Current Playwright guidance likewise says ordinary Google Chrome/Edge no longer accept the needed sideload flags and uses its bundled Chromium persistent context for extension tests. Evidence: `CHROME-TESTING-2025-001` and `PLAYWRIGHT-EXT-001` in `research/sources.yaml`.

## Recommended option

Approve a time-boxed validation spike using an exact, lockfile-pinned **development-only Playwright dependency and its pinned Chromium build**. Do not add any runtime dependency.

The spike must prove all of the following before the tool is adopted:

1. Launch the pinned Playwright Chromium in a fresh temporary persistent context with only the production unpacked extension loaded.
2. Navigate to the matching `https://www.google.com/search?q=skn-stage1a-fixture` URL while fulfilling the top-level document from a local synthetic fixture and aborting every other request before network escape.
3. Prove exact origin/path preservation, extension injection, zero cookies/account state, and zero escaped request.
4. Send trusted keyboard/pointer input and assert real DOM/AX focus, default cancellation, Tab continuation, instant scrolling, boundaries, repeats, Escape, editing/widget exclusions, active overlays, and same-node dynamic invalidation.
5. Test the exact packaged production files; prohibit test hooks, fixture tokens, semantic rewrites, and browser flags that alter the interaction under test.
6. Delete every temporary profile and preserve browser/tool versions, lockfile, commands, request audit, and artifact hashes.
7. Continue to treat branded stable Chrome and real assistive technologies as separate manual evidence.

Before installation, record the proposed exact Playwright version, downloaded browser build/hash, license, lifecycle scripts, dependency tree, cache location, and reviewed install command. The user must approve that exact installation and download.

## Strongest alternative

Build a small custom Chrome DevTools Protocol controller around a pinned Chrome for Testing binary. This avoids a framework dependency but creates security-sensitive browser lifecycle, network interception, trusted-input, protocol-version, timeout, cleanup, and evidence code that the project must own. It is not recommended for Stage 1A because its maintenance and validation burden is materially larger than the experiment.

## Decision requested later

Choose one of:

- approve a scoped Playwright validation spike after exact-version/install review;
- approve a separately designed custom-controller spike;
- decline automation and provide the documented interactive branded-Chrome/AT evidence manually.

None of these choices authorizes Stage 1B, broader site access, live-Google selector development, Store work, or publication.
