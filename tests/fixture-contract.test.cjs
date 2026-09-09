"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, "..", "fixtures", name), "utf8");
}

test("supported fixture is scrollable and pointer clicks have a non-navigating guard", () => {
  const html = fixture("ordinary-results.html");
  const guard = fixture("pointer-guard.js");
  assert.match(html, /min-height:\s*75vh\s*!important/);
  assert.deepEqual(
    Array.from(html.matchAll(/<a\s+href="([^"]+)"/g), (match) => match[1]),
    [
      "https://example.test/alpha",
      "https://example.test/bravo",
      "https://example.test/charlie"
    ]
  );
  assert.match(guard, /addEventListener\("click",\s*preventFixtureResultNavigation,\s*true\)/);
  assert.match(guard, /event\.detail\s*>\s*0/);
  assert.match(guard, /event\.preventDefault\(\)/);
  assert.doesNotMatch(guard, /stop(?:Immediate)?Propagation/);
});

test("supported fixture exposes representative editing, widget, popover, and embedded controls", () => {
  const html = fixture("ordinary-results.html");
  for (const token of [
    "<textarea",
    "<select",
    "contenteditable=\"true\"",
    "role=\"slider\"",
    "role=\"scrollbar\"",
    "role=\"separator\"",
    "role=\"tree\"",
    "role=\"toolbar\"",
    " popover",
    "<iframe"
  ]) {
    assert.equal(html.includes(token), true, `missing fixture context: ${token}`);
  }
});

test("excluded fixtures cover hidden names and whole-layout ancestor contexts", () => {
  const ambiguous = fixture("ambiguous-results.html");
  assert.match(ambiguous, /aria-hidden="true"/);
  assert.match(ambiguous, /aria-label="Label name" aria-labelledby="referenced-name"/);
  assert.match(fixture("editing-context.html"), /<main contenteditable="true">/);
  assert.match(fixture("widget-context.html"), /role="application"/);
  assert.match(fixture("modal-context.html"), /<dialog open>/);
  assert.match(fixture("interactive-role-context.html"), /<a role="button"/);
});

test("secondary semantic and focusable link fixtures preserve the exact-one-title contract", () => {
  const semanticLink = fixture("secondary-role-link-context.html");
  const focusableAnchor = fixture("secondary-focusable-anchor-context.html");
  const ordinary = fixture("ordinary-results.html");

  assert.match(semanticLink, /<a href="https:\/\/example\.test\/primary-role-link"><h3>/);
  assert.match(semanticLink, /<div role="link" tabindex="0">/);
  assert.match(focusableAnchor, /<a href="https:\/\/example\.test\/primary-focusable-anchor"><h3>/);
  assert.match(focusableAnchor, /<a tabindex="0">Secondary focusable anchor<\/a>/);
  assert.match(ordinary, /<article id="alpha">\s*<a href="https:\/\/example\.test\/alpha"><h3>/);
  assert.doesNotMatch(ordinary, /<main[^>]*>[\s\S]*?<article[^>]*>[\s\S]*?role="link"/);
});

test("role-token fixture covers fallback, recognized precedence, and container-self cases", () => {
  const html = fixture("role-token-context.html");
  for (const token of [
    'id="secondary-fallback-link"',
    'role="foo link"',
    'id="secondary-nonlink-first"',
    'role="button link"',
    'id="primary-fallback-link"',
    'id="primary-link-first"',
    'role="link button"',
    'id="container-fallback-link"',
    'id="container-nonlink-first"',
    'role="article link"'
  ]) {
    assert.equal(html.includes(token), true, `missing role-token fixture case: ${token}`);
  }
});

test("Stage 1B live-adapter fixture separates title links from incidental, ad, and rich structures", () => {
  const html = fixture("live-google-default.html");
  assert.match(html, /id="search"/);
  assert.match(html, /id="rso"/);
  assert.match(html, /data-fixture-case="ordinary-alpha"/);
  assert.match(html, /data-fixture-case="ordinary-bravo"/);
  assert.match(html, /data-fixture-case="sponsored" data-text-ad/);
  assert.match(html, /data-fixture-case="localized-sponsored-outside-organic"/);
  assert.match(html, /advertiser\.example\/ar/);
  assert.match(html, /data-fixture-case="ordinary-with-secondary-link"/);
  assert.match(html, /Traduire cette page/);
  assert.match(html, /data-fixture-case="rich-grid" role="grid"/);
  assert.doesNotMatch(html, /class=/);
});
