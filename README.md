# ArrowKey Search Navigator

ArrowKey Search Navigator (formerly Search Keyboard Navigator) is a Manifest V3 Chrome extension for moving through supported result-title links on desktop Google Search with the arrow keys.

Version 0.1.1 is publicly available in the Chrome Web Store under the former name. This repository now contains the 0.1.2 rename, revised Store materials, a static instruction popup, and a tracker-free landing-page draft. Store updates, external deployment, and publication remain human-approved actions.

## Current behavior

- Inject only on `https://www.google.com/search*` in the top frame, then require the exact runtime `www.google.com` origin and `/search` pathname.
- Move real DOM focus to the next or previous recognized result-title link with unmodified Arrow Down and Arrow Up.
- Use native Enter to open a result and Chrome's native new-tab shortcut where supported (Ctrl+Enter in the user's tested Windows setup); the extension never intercepts or synthesizes these keys or guarantees link disposition.
- Preserve native Tab and Shift+Tab. Native Tab continues from the result focused by the extension, so the prior Tab origin is not preserved.
- Use Escape to end the active extension session and restore prior focus only when it is still safe.
- Ignore editing, composition, modifier, already-cancelled, embedded, and genuine arrow-owning widget contexts.
- Never wrap, rewrite links, retain or transmit page data, use a backend, or load executable code remotely.

The unmodified-arrow design can conflict with native page scrolling and screen-reader browse commands. Screen-reader compatibility has not been established. The live adapter enumerates visible native links containing one `h3` result title inside `#search`; sponsored or rich-result titles can be included when they use the same structure.

## Architecture

The extension uses packaged content scripts plus a static, script-free instruction popup. It has no service worker, named Chrome API permissions, separate `host_permissions`, storage, extension network activity, or runtime dependencies. The static content-script match is still persistent site access and must not be described as permission-free.

The optional public website under `website/` is also static and dependency-free. It includes structured data, social metadata, a sitemap, and no scripts other than inert JSON-LD metadata. It has no analytics, forms, cookies, or tracking.

## Project map

- [PRODUCT_SPEC.md](PRODUCT_SPEC.md) — behavior, architecture, and acceptance criteria
- [PROJECT_CHARTER.md](PROJECT_CHARTER.md) — mission, scope, and governance
- [AUTONOMY_POLICY.md](AUTONOMY_POLICY.md) and [AGENTS.md](AGENTS.md) — authority and agent workflow
- [QUALITY_GATES.md](QUALITY_GATES.md) and [ACCEPTANCE_TEST_MATRIX.md](ACCEPTANCE_TEST_MATRIX.md) — release evidence requirements
- [DECISIONS/README.md](DECISIONS/README.md) — material decisions and revisit triggers
- [COMPLIANCE.md](COMPLIANCE.md) and [compliance/register.yaml](compliance/register.yaml) — non-certifying compliance register
- [store/LISTING.md](store/LISTING.md) — 0.1.2 Store listing draft
- [store/SCREENSHOT_CAPTURE_REQUEST.md](store/SCREENSHOT_CAPTURE_REQUEST.md) — optional genuine popup screenshot improvement
- [PRIVACY_POLICY.md](PRIVACY_POLICY.md) — public privacy-policy source
- [SEO_GEO_PLAN.md](SEO_GEO_PLAN.md) — discovery plan and measures
- [website/README.md](website/README.md) — local landing page and one-time GitHub Pages setup
- `manifest.json`, `src/`, `fixtures/`, and `tests/` — extension source and dependency-free validation
- `release/` and `dist/` — reproducible packaging and retained release artifacts
- [research/sources.yaml](research/sources.yaml) — evidence ledger

## Current release status

The user confirmed live navigation, the visual indicator, the instruction popup, and native Ctrl+Enter behavior in one Windows Chrome setup. Those observations do not establish universal layout, platform, link-disposition, or assistive-technology compatibility. Version 0.1.2 is a local draft until its exact ZIP, listing, hosted privacy-name update, and dashboard changes are reviewed and submitted through a separately approved release workflow; a new popup screenshot is optional.
