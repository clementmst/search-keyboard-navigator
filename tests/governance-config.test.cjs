"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function records(relativePath, marker) {
  const text = fs.readFileSync(path.join(root, relativePath), "utf8");
  assert.equal(text.includes("\t"), false, `${relativePath} must not contain tabs`);
  return text
    .split(new RegExp(`(?=^${marker})`, "m"))
    .filter((part) => part.startsWith(marker));
}

test("source ledger records unique complete source entries", () => {
  const entries = records("research/sources.yaml", "  - id: ");
  assert.ok(entries.length >= 65);
  const ids = entries.map((entry) => entry.match(/^  - id: ([A-Z0-9-]+)$/m)?.[1]);
  assert.equal(ids.every(Boolean), true);
  assert.equal(new Set(ids).size, ids.length);
  for (const entry of entries) {
    for (const key of ["url", "retrieved", "version", "classification", "summary", "confidence", "impact", "conflicts"]) {
      assert.match(entry, new RegExp(`^    ${key}: .+`, "m"));
    }
  }
});

test("compliance register records unique reviewable entries", () => {
  const entries = records("compliance/register.yaml", "  - id: ");
  assert.ok(entries.length >= 10);
  const ids = entries.map((entry) => entry.match(/^  - id: ([A-Z0-9-]+)$/m)?.[1]);
  assert.equal(ids.every(Boolean), true);
  assert.equal(new Set(ids).size, ids.length);
  for (const entry of entries) {
    for (const key of ["area", "jurisdiction", "source_ids", "reviewed", "status", "applicability", "reasoning", "evidence", "unresolved"]) {
      assert.match(entry, new RegExp(`^    ${key}: .+`, "m"));
    }
  }
});
