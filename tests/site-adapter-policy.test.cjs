"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const policy = require("../src/site-adapter-policy.js");
const scenarios = require("../fixtures/contracts/optional-site-scenarios.json");

function ordinaryEvidence(overrides = {}) {
  return {
    accessibleName: "Ordinary result",
    baseUrl: "https://example.test/search",
    connected: true,
    disabled: false,
    effectiveTarget: "",
    excludedContext: false,
    explicitRole: "",
    hasDownload: false,
    hiddenBySemantics: false,
    href: "/result",
    inert: false,
    rendered: true,
    supportedRoot: true,
    tabIndex: 0,
    ...overrides
  };
}

test("supports only the approved search routes", () => {
  assert.equal(policy.siteForLocation(new URL("https://www.google.com/search?q=a")), "google");
  assert.equal(policy.siteForLocation(new URL("https://www.youtube.com/results?search_query=a")), "youtube");
  assert.equal(policy.siteForLocation(new URL("https://github.com/search?q=a&type=repositories")), "github");
  for (const url of [
    "https://www.youtube.com/watch?v=x",
    "https://github.com/search?q=a&type=issues",
    "https://github.com/org/repo",
    "https://youtube.com/results?search_query=a",
    "https://www.google.fr/search?q=a"
  ]) assert.equal(policy.siteForLocation(new URL(url)), "");
});

test("each optional adapter has one deliberately narrow positive selector", () => {
  assert.deepEqual(policy.selectorsForSite("youtube"), {
    root: "ytd-search",
    titles: "ytd-video-renderer a#video-title[href^='/watch']"
  });
  assert.deepEqual(policy.selectorsForSite("github"), {
    root: "[data-testid='results-list']",
    titles: "h3 a[href]"
  });
  assert.equal(policy.selectorsForSite("gmail"), null);
});

for (const scenario of scenarios) {
  test(`optional-site eligibility oracle: ${scenario.id}`, () => {
    const actual = policy.classifyOptionalTitleEvidence(
      scenario.site,
      ordinaryEvidence(scenario.evidence)
    );
    assert.equal(actual.eligible, scenario.expected.eligible);
    assert.equal(actual.reason, scenario.expected.reason);
  });
}

test("optional-site eligibility oracle is static and dependency-free", () => {
  assert.equal(Array.isArray(scenarios), true);
  assert.equal(scenarios.length, 8);
});
