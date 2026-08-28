"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sourceDirectory = path.join(__dirname, "..", "src");
const sources = fs.readdirSync(sourceDirectory)
  .filter((name) => name.endsWith(".js"))
  .map((name) => fs.readFileSync(path.join(sourceDirectory, name), "utf8"))
  .join("\n");
const navigatorSource = fs.readFileSync(path.join(sourceDirectory, "navigator.js"), "utf8");
const stylesheetSource = fs.readFileSync(path.join(sourceDirectory, "navigator.css"), "utf8");
const fixtureScript = fs.readFileSync(path.join(__dirname, "..", "fixtures", "pointer-guard.js"), "utf8");
const reviewedScripts = `${sources}\n${fixtureScript}`;

test("static tripwire finds no listed network, persistence, messaging, remote-code, sink, or observer APIs", () => {
  const forbiddenPatterns = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\b/,
    /\bEventSource\b/,
    /\bsendBeacon\b/,
    /\bchrome\s*\.\s*(runtime|storage)\b/,
    /\blocalStorage\b/,
    /\bsessionStorage\b/,
    /\bindexedDB\b/,
    /\bcaches\s*\./,
    /\bdocument\s*\.\s*cookie\b/,
    /\bBroadcastChannel\b/,
    /\bpostMessage\s*\(/,
    /\bimport\s*\(/,
    /\b(?:innerHTML|outerHTML)\s*=/,
    /\binsertAdjacentHTML\s*\(/,
    /\bdocument\s*\.\s*write\s*\(/,
    /\beval\s*\(/,
    /\bnew\s+Function\b/,
    /\bMutationObserver\b/
  ];
  for (const pattern of forbiddenPatterns) {
    assert.equal(pattern.test(reviewedScripts), false, `listed tripwire matched: ${pattern}`);
  }
  assert.doesNotMatch(stylesheetSource, /@import\b|url\s*\(/i);
});

test("controller does not handle Enter or stop event propagation", () => {
  assert.equal(/["']Enter["']/.test(navigatorSource), false);
  assert.equal(/\.stop(?:Immediate)?Propagation\s*\(/.test(navigatorSource), false);
  assert.equal(/\.click\s*\(/.test(navigatorSource), false);
  assert.equal(/\.dispatchEvent\s*\(/.test(navigatorSource), false);
});

test("controller does not rewrite focus order or accessibility semantics", () => {
  assert.equal(/\.tabIndex\s*=/.test(navigatorSource), false);
  assert.equal(/setAttribute\s*\(\s*["'](?:tabindex|role|aria-)/i.test(navigatorSource), false);
  assert.equal(/removeAttribute\s*\(\s*["'](?:tabindex|role|aria-)/i.test(navigatorSource), false);
});

test("controller contains the specified instant-scroll and fail-closed static guards", () => {
  assert.match(navigatorSource, /behavior:\s*["']instant["']/);
  for (const requiredToken of [
    "contenteditable",
    "role='application'",
    "role='treegrid'",
    "role='toolbar'",
    "role='scrollbar'",
    "role='separator'",
    "role='combobox'",
    "role='gridcell'",
    "role='button'",
    "role='link'",
    "role='checkbox'",
    "aria-modal='true'",
    "[popover]",
    "iframe",
    "object",
    "embed",
    "aria-labelledby",
    "aria-hidden='true'"
  ]) {
    assert.equal(navigatorSource.includes(requiredToken), true, `missing guard: ${requiredToken}`);
  }
  assert.equal(/accessibleNameFor[\s\S]*?anchor\.textContent/.test(navigatorSource), false);
  assert.ok(
    navigatorSource.indexOf('hasAttribute("aria-labelledby")') <
      navigatorSource.indexOf('hasAttribute("aria-label")'),
    "aria-labelledby must fail closed before aria-label is considered"
  );
  assert.match(navigatorSource, /hasUnsupportedExplicitRole\(headingLink\)/);
  assert.match(navigatorSource, /layoutAdapter\.classifyStructure/);
  assert.match(navigatorSource, /RESULT_BLOCK_SELECTOR/);
  assert.match(navigatorSource, /\[data-text-ad\].*aria-roledescription/s);
  assert.match(navigatorSource, /isUnsupportedPrimaryRole\(anchor\.getAttribute\("role"\)\)/);
  assert.match(navigatorSource, /isResultContainerLink\(block\.getAttribute\("role"\)\)/);
  assert.match(navigatorSource, /isBlockedResultRole\(roleEvidence\(/);
  assert.match(sources, /effectiveAriaRole/);
  assert.doesNotMatch(sources, /explicitRole[\s\S]{0,160}split\(\/\\s\+\/\)\[0\]/);
});

test("controller revalidates exact focus ownership before committing selection", () => {
  const focusCall = navigatorSource.indexOf("target.focus({ preventScroll: true })");
  const freshEnumeration = navigatorSource.indexOf("const freshCandidates = candidatesInFreshOrder()", focusCall);
  const commitCheck = navigatorSource.indexOf("policy.canCommitFocus", freshEnumeration);
  const commitState = navigatorSource.indexOf("state.selected = target", commitCheck);
  assert.ok(focusCall >= 0 && focusCall < freshEnumeration);
  assert.ok(freshEnumeration < commitCheck && commitCheck < commitState);
  assert.match(navigatorSource.slice(commitCheck, commitState), /clearSession\(\)/);
});

test("production controller does not depend on fixture metadata", () => {
  for (const token of [
    "ordinary-single-title-link",
    "sitelink-ambiguity",
    "fixture-search",
    "selector-scenarios",
    "container-fallback-link"
  ]) {
    assert.equal(navigatorSource.includes(token), false, `fixture token leaked: ${token}`);
  }
});
