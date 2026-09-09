# SEO and answer-engine discovery plan

Status: approved local preparation; external deployment and Store update remain user actions.

## Positioning

Product name: **ArrowKey Search Navigator**.

One-sentence promise: Navigate Google Search result titles with Arrow Up and Arrow Down, then use Enter or Chrome's native new-tab shortcut where supported.

Primary discovery phrases:

- keyboard navigation for Google Search
- navigate Google results with arrow keys
- Chrome extension for keyboard search navigation
- open Google result in new tab with keyboard
- Google Search accessibility keyboard extension

Use these phrases only where they answer a real user question. Do not repeat them mechanically or claim proven accessibility compatibility.

## Surfaces

1. Chrome Web Store: clearer title, outcome-led summary, shortcut-led description, Accessibility category, honest scope, and genuine screenshots.
2. Public landing page: concise feature explanation, exact shortcuts, privacy facts, limitations, FAQ, canonical URL, social metadata, and SoftwareApplication structured data.
3. Privacy policy: retain the former product name once so existing links and references remain understandable after the rename.
4. Future supporting content: add only when user questions justify it; avoid thin, duplicated, or keyword-stuffed pages.

## Measures

Use privacy-safe aggregate sources already supplied by the platforms before considering product telemetry:

- Chrome Web Store impressions, listing-page visitors if exposed, installs, uninstalls, and ratings.
- GitHub Pages/Search Console impressions and clicks only if separately connected and reviewed.
- Branded versus non-branded search queries, landing-page click-through rate, and Store install conversion.

Record a baseline after 14 days and compare again after 30 days. Do not attribute changes to the rename without enough traffic and a stable comparison period.

## Current user actions

1. Approve and submit the 0.1.2 Store metadata/package update.
2. Connect this repository to GitHub and enable GitHub Pages once if automatic website deployment is desired.
3. Optionally supply a genuine, non-personal Chrome screenshot with the extension popup open as a later listing improvement.

## Deferred automation

After the GitHub connection, reviewed website updates can deploy automatically on pushes to `main`. Chrome Web Store API automation is technically possible but remains deferred because it requires Google Cloud credentials, Store API authorization, and explicit approval for credential handling and automated publication authority. Start with website automation; keep Store publishing human-confirmed until the workflow has justified stronger authority.
