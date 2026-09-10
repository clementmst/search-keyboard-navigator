"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function pngDimensions(relativePath) {
  const data = fs.readFileSync(path.join(root, relativePath));
  assert.deepEqual([...data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

test("manifest icon assets are valid PNG files at their declared sizes", () => {
  for (const size of [16, 32, 48, 128]) {
    assert.deepEqual(pngDimensions(`assets/icons/icon${size}.png`), [size, size]);
  }
  assert.deepEqual(
    pngDimensions(
      "chrome-web-store-submission-materials/store-icon-128x128/search-keyboard-navigator-store-icon-128x128.png"
    ),
    [128, 128]
  );
});

test("Store promotional image and release allowlist have the expected boundary", () => {
  assert.deepEqual(pngDimensions("assets/store/promo-small.png"), [440, 280]);
  assert.deepEqual(pngDimensions("assets/store/promo-marquee-1400x560.png"), [1400, 560]);
  assert.deepEqual(
    pngDimensions(
      "chrome-web-store-submission-materials/small-promotional-tile-440x280/search-keyboard-navigator-small-promotional-tile-440x280.png"
    ),
    [440, 280]
  );
  assert.deepEqual(
    pngDimensions(
      "chrome-web-store-submission-materials/marquee-promotional-tile-1400x560/search-keyboard-navigator-marquee-promotional-tile-1400x560.png"
    ),
    [1400, 560]
  );
  const allowlist = fs
    .readFileSync(path.join(root, "release", "ALLOWLIST.txt"), "utf8")
    .trim()
    .split(/\r?\n/);
  assert.deepEqual(allowlist, [
    "manifest.json",
    "assets/icons/icon16.png",
    "assets/icons/icon32.png",
    "assets/icons/icon48.png",
    "assets/icons/icon128.png",
    "src/consent-policy.js",
    "src/policy.js",
    "src/result-policy.js",
    "src/google-adapter-policy.js",
    "src/site-adapter-policy.js",
    "src/navigator.js",
    "src/navigator.css",
    "src/keyboard-navigation-instructions-popup.html",
    "src/keyboard-navigation-instructions-popup.css",
    "src/keyboard-navigation-instructions-popup.js"
  ]);
});

test("marketing and website images use their declared exact dimensions", () => {
  assert.deepEqual(
    pngDimensions("assets/marketing/source/arrowkey-search-navigator-social-card-generated-source-1731x909.png"),
    [1731, 909]
  );
  assert.deepEqual(
    pngDimensions("assets/marketing/arrowkey-search-navigator-social-card-1200x630.png"),
    [1200, 630]
  );
  assert.deepEqual(
    pngDimensions("website/assets/arrowkey-search-navigator-social-card-1200x630.png"),
    [1200, 630]
  );
  assert.deepEqual(
    pngDimensions("website/assets/arrowkey-search-navigator-icon-128x128.png"),
    [128, 128]
  );
});

test("instruction popup contains concise consent and keyboard-readable controls", () => {
  const html = fs.readFileSync(
    path.join(root, "src", "keyboard-navigation-instructions-popup.html"),
    "utf8"
  );
  assert.match(html, /<table[\s>]/);
  assert.match(html, /<kbd>↑<\/kbd>/);
  assert.match(html, /<kbd>↓<\/kbd>/);
  assert.match(html, /<kbd>Enter<\/kbd>/);
  assert.match(html, /<kbd>Ctrl<\/kbd>[\s\S]*?<kbd>Enter<\/kbd>/);
  assert.match(html, /New tab where supported/);
  assert.match(html, /<kbd>Esc<\/kbd>/);
  assert.match(html, /Enable keyboard navigation/);
  assert.match(html, /does not record typed text or send your searches/);
  assert.match(html, /Disable keyboard navigation/);
  assert.match(html, /personalized YouTube results or private GitHub repositories/);
  assert.match(html, /loads ArrowKey's packaged code across that site/);
  assert.match(html, /id="enable-youtube"/);
  assert.match(html, /id="enable-github"/);
  assert.match(html, /<script src="consent-policy\.js"><\/script>/);
  assert.match(html, /<script src="keyboard-navigation-instructions-popup\.js"><\/script>/);
  assert.doesNotMatch(html, /https?:\/\//i);
});

test("Store screenshots preserve their sources and use the required dimensions", () => {
  assert.deepEqual(
    pngDimensions("assets/store/screenshots/source/neutral-original.png"),
    [1919, 1030]
  );
  assert.deepEqual(
    pngDimensions("assets/store/screenshots/source/political-original.png"),
    [1919, 1032]
  );
  assert.deepEqual(
    pngDimensions("assets/store/screenshots/source/funny-67-original.png"),
    [1919, 1031]
  );
  assert.deepEqual(
    pngDimensions("assets/store/screenshots/01-neutral-google.png"),
    [1280, 800]
  );
  assert.deepEqual(
    pngDimensions("assets/store/screenshots/02-political-trump.png"),
    [1280, 800]
  );
  assert.deepEqual(
    pngDimensions("assets/store/screenshots/03-neutral-funny-67.png"),
    [1280, 800]
  );
  assert.deepEqual(
    pngDimensions(
      "chrome-web-store-submission-materials/listing-screenshots-1280x800/01-keyboard-navigation-on-google-search-neutral-query.png"
    ),
    [1280, 800]
  );
  assert.deepEqual(
    pngDimensions(
      "chrome-web-store-submission-materials/listing-screenshots-1280x800/02-keyboard-navigation-on-google-search-funny-67-query.png"
    ),
    [1280, 800]
  );
});

test("0.1.2 reviewer and dashboard records identify the exact gated artifact", () => {
  const reviewer = fs.readFileSync(path.join(root, "store", "REVIEWER_INSTRUCTIONS.md"), "utf8");
  const dashboard = fs.readFileSync(path.join(root, "store", "DASHBOARD_RECONCILIATION.md"), "utf8");
  const expectedHash = "56d6e542fc62875819723d3edbf7bfff1e9d28d434c65e32b1901eaf77dd26ed";
  for (const document of [reviewer, dashboard]) {
    assert.match(document, /0\.1\.2/);
    assert.equal(document.includes(expectedHash), true);
  }
  assert.match(dashboard, /do not upload or submit/i);
  assert.match(dashboard, /in-product disclosure/i);
  assert.match(dashboard, /authorized the minimal in-product disclosure and consent design/i);
  assert.match(dashboard, /storage.*local consent Boolean/i);
});

test("privacy-policy copies are identical and contain the affirmative Limited Use statement", () => {
  const localPolicy = fs.readFileSync(path.join(root, "PRIVACY_POLICY.md"), "utf8");
  const hostedCopy = fs.readFileSync(
    path.join(
      root,
      "chrome-web-store-submission-materials",
      "privacy-policy-public-page",
      "search-keyboard-navigator-privacy-policy-for-google-sites.md"
    ),
    "utf8"
  );
  assert.equal(hostedCopy, localPolicy);
  assert.match(localPolicy, /use of this information complies with the \[Chrome Web Store User Data Policy, including the Limited Use requirements\]/);
  assert.doesNotMatch(localPolicy, /designed to meet/);
});
