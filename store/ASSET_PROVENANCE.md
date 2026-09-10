# Asset provenance

The Store assets were generated on 2026-08-31 and the website/social card on 2026-09-09 with OpenAI's built-in image-generation tool. The assets are original project branding and intentionally exclude text, Google/Chrome logos, browser chrome, screenshots, and third-party marks. Final dimensions and transparency were produced locally with recorded image-processing tools; no extension runtime dependency was added.

## Icon

Files: `assets/store/icon-master.png`; `assets/icons/icon16.png`, `icon32.png`, `icon48.png`, and `icon128.png`.

Final edit prompt set:

> Use case: precise-object-edit. Asset type: Chrome extension icon master with genuine transparent background. Input image: edit target; preserve its polished rounded keyboard-key design, color palette, lighting, proportions, transparency, and Up/Down navigation symbols. Primary request: Move the small right-pointing triangular focus marker from the RIGHT side of the three central horizontal result lines to the LEFT side of those lines. The triangle must still point RIGHT, toward the lines, matching a focus marker placed to the left of a selected search result. Composition: Up arrow remains centered above; Down arrow remains centered below; the right-pointing focus marker sits clearly to the left of the central result lines. Balance spacing so all symbols remain readable at 16 px. Constraints: change only the focus-marker position and rebalance the central lines as necessary; preserve the rest of the icon; no left-pointing arrow anywhere; no text, letters, Google/Chrome/browser branding, watermark, or background; keep true alpha transparency and clean edges.

> Correction pass: Flip ONLY the small triangular focus marker on the LEFT side of the central horizontal result lines so that it points RIGHT, toward the lines. Its flat vertical edge must be on the left and its sharp apex must be on the right. Critical constraint: there must be NO left-pointing arrow or triangle anywhere. The marker stays on the left side of the lines but points right. Preserve the Up arrow, Down arrow, rounded key, colors, lighting, spacing, true transparent background, and all other details exactly. No text, branding, or watermark.

## Small promotional tile

File: `assets/store/promo-small.png` (440 x 280).

Final edit prompt:

> Use case: precise-object-edit. Asset type: Chrome Web Store 440x280 promotional illustration. Input image: edit target; preserve the exact deep-navy flat-vector style, palette, three result rows, cyan selected outline, composition quality, and text-free branding. Primary request: On the selected middle result row, move the cyan triangular focus marker from the RIGHT end to the LEFT side of the selected row. The marker must point RIGHT toward the row: flat vertical edge on the left, sharp apex on the right. Keyboard controls on the far left: remove the left-arrow key entirely. Show ONLY two keys, Up and Down, arranged cleanly and unmistakably. Do not add a left-arrow symbol. Do not add an Enter key in this version. Composition: keep the keyboard controls on the left and the three result rows on the right; rebalance spacing after removing the third key. The dotted motion cue may remain and should flow rightward toward the selected result. Critical constraints: no left-pointing arrow or triangle anywhere; the selected-row marker is on the left and points right; no marker at the right edge of the selected row; no text, letters, search queries, screenshots, browser chrome, Google/Chrome logos, branding, claims, or watermark. Preserve 440:280 landscape framing and readability at final size.

> Alignment correction: Align all three result cards to the exact same left edge and the exact same right edge. The selected middle card must not be shifted, indented, widened, or shortened. Place the small cyan right-pointing triangle outside the selected card, immediately beside its left edge with a small clear gap. Keep only the Up and Down keys; preserve the style and landscape composition; no left-pointing symbol, text, branding, or watermark.

> Final refinement: Replace the dotted curved motion arrow with one small solid cyan triangular focus marker immediately outside the selected card's left edge. Its flat edge is on the left and its apex points right. Keep all three cards exactly aligned; preserve the Up and Down keys, cyan selected outline, deep-navy style, and text-free design. No dotted trail, curved arrow, left-pointing symbol, marker inside the card, marker at the right edge, text, screenshots, browser chrome, Google/Chrome marks, claims, or watermark.

## Marquee promotional tile

Files: `assets/store/marquee-promotional-tile-generated-source-1983x793.png`; `assets/store/promo-marquee-1400x560.png`; human-facing upload copy under `chrome-web-store-submission-materials/marquee-promotional-tile-1400x560`.

Generation prompt:

> Use case: ads-marketing. Asset type: Chrome Web Store marquee promotional tile, exact final aspect ratio 1400 x 560 (2.5:1 landscape). Input image: reference image for the approved visual system and content. Primary request: create a wide marquee adaptation of the supplied small promotional tile, preserving its deep navy and royal-blue flat-vector style, cyan selection accent, soft depth, and clean polished composition. Composition: use the extra horizontal width naturally; place the two keyboard keys on the left and three perfectly aligned search-result cards on the center-right, with generous safe margins. The middle result card is selected with a bright cyan rounded outline. Place one small solid cyan triangular navigation marker immediately to the LEFT of the selected result card, pointing RIGHT toward it. Keys: show only Up and Down arrow keys, stacked vertically; white arrow symbols must point up and down. Keep all result rows aligned; the marker must not shift any row. Constraints: no text, letters, words, slogans, logos, browser chrome, Google/Chrome branding, screenshots, political content, people, watermark, dotted lines, dotted motion cue, left-pointing arrow, Enter key, or marker on the right edge. Preserve a clean readable hierarchy at Store thumbnail size and deliver a full-bleed 1400 x 560 composition.

The built-in tool produced a 1983 x 793 24-bit RGB source. It was resized to the exact 1400 x 560 Store dimension with PowerShell 7.6.4 on .NET 10.0.10, `System.Drawing.Common` 10.0.0.0, 24-bit RGB output, and `HighQualityBicubic`, `HighQuality` pixel-offset, and `HighQuality` compositing settings. No content was added, removed, rearranged, or retouched during resizing.

Before publication, a human must review the final assets in the dashboard and confirm that their presentation does not imply affiliation or endorsement.

## Website and social-sharing card

Files: `assets/marketing/arrowkey-search-navigator-social-card-1200x630.png` and identical website copy `website/assets/arrowkey-search-navigator-social-card-1200x630.png` (1200 x 630).

Generation prompt:

> Use case: ads-marketing. Asset type: social sharing and landing-page preview card, exact final aspect ratio 1200 x 630 landscape. Input image: style and composition reference; preserve its established deep navy and royal-blue flat-vector aesthetic, cyan focus accent, soft dimensional keycaps, rounded search-result cards, and polished minimal feel. Primary request: create a fresh 1200x630 adaptation representing keyboard navigation through search results. Place two large stacked keyboard keycaps with unmistakable white Up and Down arrow symbols on the left. Place three perfectly aligned abstract search-result cards on the center-right. Highlight the middle card with a bright cyan rounded outline and place one small solid cyan triangular navigation marker immediately outside its left edge, pointing right toward the selected card. Maintain generous safe margins and strong readability at social-card thumbnail size. Constraints: no text, letters, words, slogans, logos, browser chrome, Google or Chrome branding, screenshots, political content, people, watermark, dotted lines, left-pointing arrow, Enter key, marker on the right edge, or misaligned result cards. Do not simply crop the source; recompose naturally for the taller 1200:630 frame.

The built-in image-generation tool used `assets/store/promo-marquee-1400x560.png` as a style reference and produced `assets/marketing/source/arrowkey-search-navigator-social-card-generated-source-1731x909.png`. The source was resized without content edits to exact 1200 x 630 output using local `System.Drawing` high-quality bicubic resampling. The website icon is an unchanged copy of the reviewed 128 x 128 Store icon.
