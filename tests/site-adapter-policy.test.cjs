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
  assert.equal(policy.siteForLocation(new URL("https://www.youtube.com/")), "youtube-home");
  for (const url of [
    "https://www.youtube.com/watch?v=x",
    "https://github.com/search?q=a&type=repositories",
    "https://youtube.com/results?search_query=a",
    "https://www.google.fr/search?q=a"
  ]) assert.equal(policy.siteForLocation(new URL(url)), "");
});

test("each YouTube adapter has one deliberately narrow positive selector", () => {
  assert.deepEqual(policy.selectorsForSite("youtube"), {
    root: "ytd-search",
    titles: "ytd-video-renderer a#video-title[href], ytd-video-renderer h3 a[href]"
  });
  assert.deepEqual(policy.selectorsForSite("youtube-home"), {
    root: "ytd-browse[page-subtype='home']",
    titles: "ytd-rich-item-renderer a#video-title-link[href], ytd-rich-item-renderer h3 a[href]"
  });
  assert.equal(policy.selectorsForSite("gmail"), null);
});

for (const scenario of scenarios) {
  test(`optional-site eligibility oracle: ${scenario.id}`, () => {
    const actual = policy.classifyOptionalTitleEvidence(
      scenario.site,
      ordinaryEvidence({
        ...(scenario.site === "youtube" ? {
          baseUrl: "https://www.youtube.com/results?search_query=test",
          href: "/watch?v=fixture"
        } : {}),
        ...scenario.evidence
      })
    );
    assert.equal(actual.eligible, scenario.expected.eligible);
    assert.equal(actual.reason, scenario.expected.reason);
  });
}

test("optional-site eligibility oracle is static and dependency-free", () => {
  assert.equal(Array.isArray(scenarios), true);
  assert.equal(scenarios.length, 4);
});

test("YouTube accepts relative and absolute watch URLs only", () => {
  for (const href of ["/watch?v=abc", "https://www.youtube.com/watch?v=abc"]) {
    assert.equal(policy.classifyOptionalTitleEvidence("youtube", ordinaryEvidence({
      baseUrl: "https://www.youtube.com/results?search_query=test", href
    })).eligible, true);
  }
  for (const href of ["/shorts/abc", "/watch", "https://example.com/watch?v=abc"]) {
    const result = policy.classifyOptionalTitleEvidence("youtube", ordinaryEvidence({
      baseUrl: "https://www.youtube.com/results?search_query=test", href
    }));
    assert.equal(result.eligible, false);
    assert.equal(result.reason, "unsafe-url");
  }
});

test("YouTube title selector covers direct and nested title-link layouts", () => {
  const selector = policy.selectorsForSite("youtube").titles;
  assert.match(selector, /a#video-title\[href\]/);
  assert.match(selector, /h3 a\[href\]/);
  assert.doesNotMatch(selector, /shorts|playlist|channel/);
});

test("YouTube homepage uses ordinary video cards and the same safe watch-link policy", () => {
  const selector = policy.selectorsForSite("youtube-home").titles;
  assert.match(selector, /ytd-rich-item-renderer/);
  assert.doesNotMatch(selector, /shorts|playlist|channel/);
  assert.equal(policy.classifyOptionalTitleEvidence("youtube-home", ordinaryEvidence({
    baseUrl: "https://www.youtube.com/", href: "/watch?v=homepage"
  })).eligible, true);
  assert.equal(policy.classifyOptionalTitleEvidence("youtube-home", ordinaryEvidence({
    baseUrl: "https://www.youtube.com/", href: "/shorts/homepage"
  })).eligible, false);
});
