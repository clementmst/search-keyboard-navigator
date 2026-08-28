"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const resultPolicy = require("../src/result-policy.js");

const root = path.join(__dirname, "..");
const scenarios = JSON.parse(
  fs.readFileSync(
    path.join(root, "fixtures", "contracts", "selector-scenarios.json"),
    "utf8"
  )
);

function classifyScenario(scenario) {
  const secondaryAmbiguity = scenario.secondary.some((element) =>
    resultPolicy.isSecondaryInteractiveLinkCandidate({
      ...element,
      isPrimary: false
    })
  );
  const blockedSecondaryContext = scenario.secondary.some((element) =>
    resultPolicy.isBlockedResultRole(element)
  );

  return resultPolicy.classifyEvidence({
    accessibleName: "Synthetic ordinary result",
    ambiguous:
      secondaryAmbiguity ||
      resultPolicy.isResultContainerLink(scenario.containerRole),
    baseUrl: "https://example.test/search",
    connected: true,
    disabled: false,
    effectiveTarget: "",
    excludedContext:
      resultPolicy.isUnsupportedPrimaryRole(scenario.primary.explicitRole) ||
      blockedSecondaryContext,
    hasDownload: false,
    headingCount: 1,
    hiddenBySemantics: false,
    href: "/result",
    inert: false,
    primaryLinkCount: 1,
    rendered: true,
    supportedRoot: true,
    tabIndex: 0
  });
}

for (const scenario of scenarios) {
  test(`selector scenario oracle: ${scenario.id}`, () => {
    const fixture = fs.readFileSync(
      path.join(root, "fixtures", scenario.fixture),
      "utf8"
    );
    assert.equal(
      fixture.includes(scenario.requiredMarkup),
      true,
      `fixture does not contain scenario marker: ${scenario.requiredMarkup}`
    );

    const actual = classifyScenario(scenario);
    assert.equal(actual.eligible, scenario.expected.eligible);
    assert.equal(actual.reason, scenario.expected.reason);
  });
}

test("selector scenario oracle is explicitly static and dependency-free", () => {
  const source = fs.readFileSync(__filename, "utf8");
  const imports = Array.from(
    source.matchAll(/require\("([^"]+)"\)/g),
    (match) => match[1]
  ).sort();
  assert.deepEqual(imports, [
    "../src/result-policy.js",
    "node:assert/strict",
    "node:fs",
    "node:path",
    "node:test"
  ]);
  assert.equal(Array.isArray(scenarios), true);
  assert.equal(scenarios.length, 11);
});
