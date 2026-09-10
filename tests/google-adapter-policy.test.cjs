"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const adapter = require("../src/google-adapter-policy.js");

function locationLike(search = "?q=keyboard") {
  return {
    origin: "https://www.google.com",
    pathname: "/search",
    search
  };
}

function ordinaryEvidence(overrides = {}) {
  return {
    accessibleName: "Ordinary result",
    baseUrl: "https://www.google.com/search?q=keyboard",
    connected: true,
    disabled: false,
    excludedContext: false,
    hasDownload: false,
    hiddenBySemantics: false,
    href: "https://example.test/result",
    inert: false,
    rendered: true,
    supportedRoot: true,
    tabIndex: 0,
    ...overrides
  };
}

test("default web layout guard accepts only the exact Google Search route", () => {
  assert.equal(adapter.isSupportedDefaultWebLocation(locationLike()), true);
  assert.equal(adapter.isSupportedDefaultWebLocation(locationLike("?q=x&udm=14")), true);
  assert.equal(adapter.isSupportedDefaultWebLocation(locationLike("?q=x&tbm=isch")), true);
  assert.equal(adapter.isSupportedDefaultWebLocation(locationLike("?q=x&udm=2")), true);
  assert.equal(
    adapter.isSupportedDefaultWebLocation({
      origin: "https://google.com",
      pathname: "/search",
      search: "?q=x"
    }),
    false
  );
});

test("live context is language-neutral on the supported Google Search route", () => {
  assert.equal(adapter.isSupportedDefaultWebContext.length, 1);
  assert.equal(adapter.isSupportedDefaultWebContext(locationLike()), true);

  assert.equal(
    adapter.isSupportedDefaultWebContext({
      origin: "https://www.google.fr",
      pathname: "/search",
      search: "?q=x"
    }),
    false
  );
});

test("narrow ordinary live evidence is eligible", () => {
  assert.equal(adapter.classifyEvidence(ordinaryEvidence()).eligible, true);
});

test("page metadata does not exclude otherwise valid result-title links", () => {
  for (const overrides of [
    { adSignal: true },
    { blockedContext: true },
    { secondaryLinkCount: 2 },
    { richOrVerticalSignal: true },
    { titleAnchorCount: 2 },
    { blockDistinct: false },
    { effectiveTarget: "_blank" },
    { supportedDefaultWebLayout: false }
  ]) {
    assert.equal(adapter.classifyEvidence(ordinaryEvidence(overrides)).eligible, true);
  }
});

test("only non-genuine or unusable title links are excluded", () => {
  for (const overrides of [
    { supportedRoot: false },
    { href: "javascript:alert(1)" },
    { accessibleName: "" },
    { tabIndex: -1 },
    { rendered: false },
    { hasDownload: true }
  ]) {
    assert.equal(adapter.classifyEvidence(ordinaryEvidence(overrides)).eligible, false);
  }
});
