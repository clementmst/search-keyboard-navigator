"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const resultPolicy = require("../src/result-policy.js");

const contractPath = path.join(__dirname, "..", "fixtures", "contracts", "result-policy-cases.json");
const cases = JSON.parse(fs.readFileSync(contractPath, "utf8"));

for (const fixtureCase of cases) {
  test(`result contract: ${fixtureCase.id}`, () => {
    const actual = resultPolicy.classifyEvidence(fixtureCase.evidence);
    assert.equal(actual.eligible, fixtureCase.expected.eligible);
    assert.equal(actual.reason, fixtureCase.expected.reason);
  });
}

test("relative HTTP URL resolves while non-HTTP protocols fail", () => {
  assert.equal(
    resultPolicy.parseHttpUrl("/result", "https://example.com/search").href,
    "https://example.com/result"
  );
  assert.equal(resultPolicy.parseHttpUrl("mailto:test@example.com", "https://example.com/"), null);
  assert.equal(resultPolicy.parseHttpUrl("javascript:void(0)", "https://example.com/"), null);
});

test("only current-context target values are allowed", () => {
  assert.equal(resultPolicy.isAllowedTarget(""), true);
  assert.equal(resultPolicy.isAllowedTarget("_self"), true);
  assert.equal(resultPolicy.isAllowedTarget("_blank"), false);
  assert.equal(resultPolicy.isAllowedTarget("named-frame"), false);
});

test("secondary semantic and focusable link candidates fail closed without blocking the primary", () => {
  const candidate = (overrides) =>
    resultPolicy.isSecondaryInteractiveLinkCandidate({
      explicitRole: "",
      hasHref: false,
      hasTabIndex: false,
      isPrimary: false,
      tagName: "div",
      ...overrides
    });

  assert.equal(candidate({ explicitRole: "link" }), true);
  assert.equal(candidate({ explicitRole: " LINK " }), true);
  assert.equal(candidate({ explicitRole: "foo link" }), true);
  assert.equal(candidate({ explicitRole: "button link" }), false);
  assert.equal(candidate({ tagName: "a", hasTabIndex: true }), true);
  assert.equal(candidate({ tagName: "a", explicitRole: "button" }), true);
  assert.equal(candidate({ tagName: "a", hasHref: true }), true);
  assert.equal(candidate({ tagName: "a" }), false);
  assert.equal(
    candidate({
      explicitRole: "link",
      hasHref: true,
      hasTabIndex: true,
      isPrimary: true,
      tagName: "a"
    }),
    false
  );
});

test("effective ARIA roles use the first recognized non-abstract token", () => {
  assert.equal(resultPolicy.effectiveAriaRole("foo link"), "link");
  assert.equal(resultPolicy.effectiveAriaRole("command link"), "link");
  assert.equal(resultPolicy.effectiveAriaRole("button link"), "button");
  assert.equal(resultPolicy.effectiveAriaRole(" LINK button "), "link");
  assert.equal(resultPolicy.effectiveAriaRole("foo bar"), "");
  assert.equal(resultPolicy.isUnsupportedPrimaryRole("foo link"), false);
  assert.equal(resultPolicy.isUnsupportedPrimaryRole("link button"), false);
  assert.equal(resultPolicy.isUnsupportedPrimaryRole("button link"), true);
  assert.equal(resultPolicy.isUnsupportedPrimaryRole("foo"), false);
  assert.equal(resultPolicy.isResultContainerLink("foo link"), true);
  assert.equal(resultPolicy.isResultContainerLink("article link"), false);
});
