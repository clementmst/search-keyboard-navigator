"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const scriptPath = path.join(root, "release", "manage-chrome-web-store-release.ps1");
const script = fs.readFileSync(scriptPath, "utf8");
const config = JSON.parse(fs.readFileSync(path.join(root, "release", "chrome-web-store-publisher-config.json"), "utf8"));
function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

test("Store publisher configuration identifies only the intended item and service account", () => {
  assert.deepEqual(config, {
    projectId: "arrowkey-cws-publishing",
    publisherId: "eaa48e71-1070-4baa-9c3c-68933eb6a389",
    itemId: "eifanigljpfnmmdfeefjdioelbkgmeja",
    serviceAccountEmail: "arrowkey-cws-publisher@arrowkey-cws-publishing.iam.gserviceaccount.com",
    expectedExtensionName: "ArrowKey Search Navigator"
  });
  assert.equal(Object.keys(config).some((key) => /secret|token|key/i.test(key)), false);
});

test("Store management defaults to least-privilege read-only status", () => {
  assert.match(script, /\[string\]\$Action = "Status"/);
  assert.match(script, /chromewebstore\.readonly/);
  assert.match(script, /if \(\$Action -eq "Status"\) \{ \$readOnlyScope \} else \{ \$writeScope \}/);
  assert.match(script, /Get-SanitizedStatus/);
  assert.doesNotMatch(script, /publicKey\s*=/);
});

test("Validate contains package, name, version, and hash guards without an external write", () => {
  assert.match(script, /System\.Security\.Cryptography\.SHA256/);
  assert.match(script, /System\.IO\.File.*ReadAllBytes/);
  assert.match(script, /externalWrite = \$false/);
  assert.match(script, /SHA-256 does not match the approved hash/);
});

test("Release synchronously binds the exact upload before submission", () => {
  assert.match(script, /-Body \$packageEvidence\.Bytes/);
  assert.doesNotMatch(script, /-InFile \$packageEvidence\.Path/);
  assert.match(script, /\$upload\.uploadState -ne "SUCCEEDED"/);
  assert.match(script, /\$upload\.crxVersion -ne \$packageEvidence\.Version/);
  const uploadIndex = script.indexOf("$upload = Invoke-RestMethod");
  const stateIndex = script.indexOf('$upload.uploadState -ne "SUCCEEDED"');
  const versionIndex = script.indexOf("$upload.crxVersion -ne $packageEvidence.Version");
  const submitIndex = script.indexOf("$submission = Invoke-RestMethod");
  assert.ok(uploadIndex >= 0 && uploadIndex < stateIndex);
  assert.ok(stateIndex < versionIndex && versionIndex < submitIndex);
  assert.doesNotMatch(script, /receipt/i);
});

test("Release blocks uncertain preflight state before upload", () => {
  assert.match(script, /preReleaseStatus\.itemId -ne \$config\.itemId/);
  assert.match(script, /submittedItemRevisionStatus\.state -ne "CANCELLED"/);
  assert.match(script, /preReleaseStatus\.lastAsyncUploadState -eq "IN_PROGRESS"/);
  const preflightIndex = script.indexOf('$preReleaseStatus.lastAsyncUploadState -eq "IN_PROGRESS"');
  const uploadIndex = script.indexOf("$upload = Invoke-RestMethod");
  assert.ok(preflightIndex >= 0 && preflightIndex < uploadIndex);
});

test("submission always requests normal review and blocks on warnings", () => {
  assert.match(script, /Release requires the release-specific -ConfirmRelease switch/);
  assert.match(script, /Release requires an explicit -PublishType choice/);
  assert.doesNotMatch(script, /\[string\]\$PublishType\s*=\s*"/);
  assert.match(script, /skipReview = \$false/);
  assert.match(script, /blockOnWarnings = \$true/);
  assert.doesNotMatch(script, /skipReview\s*=\s*\$true/);
});

test("authentication is short-lived and reviewed text/key-file scopes contain no private credential material", () => {
  assert.match(script, /auth print-access-token/);
  assert.match(script, /--impersonate-service-account=/);
  assert.doesNotMatch(script, /activate-service-account|\.p12|private_key/);
  assert.match(script, /\$accessToken = \$null/);
  const textExtensions = new Set([".json", ".ps1", ".md", ".yaml", ".yml", ".cjs", ".js", ".html", ".css", ".txt", ".toml"]);
  for (const file of walkFiles(root)) {
    assert.doesNotMatch(path.basename(file), /\.(?:pem|key|p12|pfx)$/i);
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    const contents = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(contents, /-----BEGIN (?:RSA )?PRIVATE KEY-----|"private_key"\s*:|ya29\.[A-Za-z0-9_-]{20,}/);
  }
});
