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
    ["content_scripts", "description", "manifest_version", "name", "version"].sort()
  );
  for (const forbidden of [
    "permissions",
    "host_permissions",
    "optional_permissions",
    "optional_host_permissions",
    "background",
    "action",
    "web_accessible_resources",
    "externally_connectable"
  ]) {
    assert.equal(Object.hasOwn(manifest, forbidden), false, `${forbidden} must be absent`);
  }
  assert.equal(manifest.content_scripts.length, 1);
  assert.deepEqual(manifest.content_scripts[0].matches, ["https://www.google.com/search*"]);
  assert.deepEqual(manifest.content_scripts[0].js, [
    "src/policy.js",
    "src/result-policy.js",
    "src/layout-adapter.js",
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
