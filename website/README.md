# ArrowKey Search Navigator website

This folder contains the static, tracker-free landing page prepared for GitHub Pages. It uses no remote scripts, analytics, cookies, forms, accounts, or build dependency.

Intended public URL: `https://clementmst.github.io/search-keyboard-navigator/`

The repository is not connected to GitHub yet. Before deployment, the user must create or select the `clementmst/search-keyboard-navigator` repository, approve the first push, and enable GitHub Pages with **GitHub Actions** as the source. After that one-time setup, ordinary reviewed pushes to the release branch can deploy this folder through `.github/workflows/deploy-pages.yml`.

The proposed workflow follows GitHub's official Pages example and uses four official actions by mutable major-version tag. Before enabling it, recheck those versions and either pin reviewed immutable commits or consciously retain GitHub's official-tag update model. No custom secret is required; the workflow requests only `contents: read`, `pages: write`, and `id-token: write`.

The Chrome Web Store install link uses the current extension ID `eifanigljpfnmmdfeefjdioelblkgmeja`. Update `softwareVersion` and the sitemap date with each public release.

Before first deployment, verify the final repository name and therefore the canonical URL. If it differs, update the canonical, Open Graph, JSON-LD, robots, and sitemap URLs together.
