"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8")
);

test("manifest keeps Google static and exposes only approved optional site grants", () => {
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(
    Object.keys(manifest).sort(),
    ["action", "content_scripts", "description", "icons", "manifest_version", "minimum_chrome_version", "name", "optional_host_permissions", "optional_permissions", "permissions", "version"].sort()
  );
  assert.equal(manifest.name, "ArrowKey Search Navigator");
  assert.equal(manifest.version, "0.2.1");
  assert.equal(manifest.minimum_chrome_version, "105");
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
  assert.deepEqual(manifest.permissions, ["storage"]);
  assert.deepEqual(manifest.optional_permissions, ["scripting"]);
  assert.deepEqual(manifest.optional_host_permissions, ["https://www.youtube.com/*"]);
  for (const forbidden of [
    "host_permissions",
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
    "src/consent-policy.js",
    "src/policy.js",
    "src/result-policy.js",
    "src/google-adapter-policy.js",
    "src/site-adapter-policy.js",
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
