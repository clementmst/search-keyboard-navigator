"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "website", "index.html"), "utf8");
const robots = fs.readFileSync(path.join(root, "website", "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "website", "sitemap.xml"), "utf8");
const css = fs.readFileSync(path.join(root, "website", "styles.css"), "utf8");
const canonical = "https://clementmst.github.io/search-keyboard-navigator/";
const storeUrl = "https://chromewebstore.google.com/detail/search-keyboard-navigator/eifanigljpfnmmdfeefjdioelblkgmeja";

test("website exposes consistent discovery metadata", () => {
  assert.match(html, /<title>ArrowKey Search Navigator — Keyboard navigation for Google Search<\/title>/);
  assert.match(html, new RegExp(`rel="canonical" href="${canonical}"`));
  assert.match(html, /"@type": "SoftwareApplication"/);
  assert.match(html, /"alternateName": "Search Keyboard Navigator"/);
  assert.match(html, /"softwareVersion": "0\.1\.2"/);
  assert.match(html, new RegExp(storeUrl));
  assert.match(robots, new RegExp(`${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}sitemap\\.xml`));
  assert.match(sitemap, new RegExp(`<loc>${canonical}</loc>`));
});

test("website states exact product controls and evidence limits", () => {
  for (const text of [
    "Previous result",
    "Next result",
    "Open result",
    "New tab where supported",
    "Clear selection",
    "Screen-reader compatibility has not yet been established"
  ]) {
    assert.equal(html.includes(text), true, `missing website statement: ${text}`);
  }
  assert.match(html, /No account · No tracking/);
  assert.match(html, /not affiliated with, endorsed by, or sponsored by Google LLC/);
});

test("website is static and tracker-free", () => {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  assert.equal(scripts.length, 1);
  assert.match(scripts[0][0], /type="application\/ld\+json"/);
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /google-analytics|googletagmanager|plausible|segment|mixpanel|facebook\.net/i);
  assert.doesNotMatch(html, /<form[\s>]/i);
});

test("website includes a keyboard bypass link and a supported structured-data category", () => {
  assert.match(html, /class="skip-link" href="#main-content"/);
  assert.match(html, /<main id="main-content" tabindex="-1">/);
  assert.doesNotMatch(html, /href="#top"/);
  for (const target of html.matchAll(/href="#([^"]+)"/g)) {
    assert.match(html, new RegExp(`id="${target[1]}"`), `missing fragment target: ${target[1]}`);
  }
  assert.match(html, /"applicationCategory": "BrowserApplication"/);
  assert.match(html, /"applicationSubCategory": "Accessibility"/);
});

test("all local website assets exist", () => {
  for (const relativePath of [
    "website/styles.css",
    "website/assets/arrowkey-search-navigator-icon-128x128.png",
    "website/assets/arrowkey-search-navigator-social-card-1200x630.png"
  ]) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }
});

test("primary button normal and hover colors meet 4.5:1 contrast with white text", () => {
  function luminance(hex) {
    const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
    const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }
  function contrast(first, second) {
    const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
  }
  const normal = css.match(/--blue:\s*(#[0-9a-f]{6})/i)?.[1];
  const hover = css.match(/\.primary:hover\s*\{\s*background:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(normal);
  assert.ok(hover);
  assert.ok(contrast(normal, "#ffffff") >= 4.5, `normal contrast: ${contrast(normal, "#ffffff")}`);
  assert.ok(contrast(hover, "#ffffff") >= 4.5, `hover contrast: ${contrast(hover, "#ffffff")}`);
});
