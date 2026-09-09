"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8")
);

test("manifest has one static site-access grant and no named API permissions", () => {
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(
    Object.keys(manifest).sort(),
    ["action", "content_scripts", "description", "icons", "manifest_version", "name", "version"].sort()
  );
  assert.equal(manifest.name, "ArrowKey Search Navigator");
  assert.equal(manifest.version, "0.1.2");
  assert.equal(
    manifest.description,
    "Navigate Google Search results with Arrow Up and Arrow Down. Open links with Enter or Chrome's native new-tab shortcut."
  );
  assert.ok(manifest.description.length <= 132);
  assert.deepEqual(manifest.icons, {
    16: "assets/icons/icon16.png",
    32: "assets/icons/icon32.png",
    48: "assets/icons/icon48.png",
    128: "assets/icons/icon128.png"
  });
  for (const iconPath of Object.values(manifest.icons)) {
    assert.equal(fs.existsSync(path.join(__dirname, "..", iconPath)), true);
  }
  for (const forbidden of [
    "permissions",
    "host_permissions",
    "optional_permissions",
    "optional_host_permissions",
    "background",
    "web_accessible_resources",
    "externally_connectable"
  ]) {
    assert.equal(Object.hasOwn(manifest, forbidden), false, `${forbidden} must be absent`);
  }
  assert.deepEqual(manifest.action, {
    default_title: "How to use ArrowKey Search Navigator",
    default_popup: "src/keyboard-navigation-instructions-popup.html",
    default_icon: {
      16: "assets/icons/icon16.png",
      32: "assets/icons/icon32.png"
    }
  });
  assert.equal(
    fs.existsSync(path.join(__dirname, "..", manifest.action.default_popup)),
    true
  );
  assert.equal(manifest.content_scripts.length, 1);
  assert.deepEqual(manifest.content_scripts[0].matches, ["https://www.google.com/search*"]);
  assert.deepEqual(manifest.content_scripts[0].js, [
    "src/policy.js",
    "src/result-policy.js",
    "src/google-adapter-policy.js",
    "src/navigator.js"
  ]);
  assert.deepEqual(manifest.content_scripts[0].css, ["src/navigator.css"]);
  assert.equal(manifest.content_scripts[0].run_at, "document_idle");
  assert.equal(manifest.content_scripts[0].all_frames, false);
  assert.equal(manifest.content_scripts[0].world, "ISOLATED");
  assert.deepEqual(
    Object.keys(manifest.content_scripts[0]).sort(),
    ["all_frames", "css", "js", "matches", "run_at", "world"].sort()
  );
});
