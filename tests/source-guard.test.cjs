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
const googleAdapterSource = fs.readFileSync(
  path.join(sourceDirectory, "google-adapter-policy.js"),
  "utf8"
);
const stylesheetSource = fs.readFileSync(path.join(sourceDirectory, "navigator.css"), "utf8");
const fixtureScript = fs.readFileSync(path.join(__dirname, "..", "fixtures", "pointer-guard.js"), "utf8");
const reviewedScripts = `${sources}\n${fixtureScript}`;

test("static tripwire finds no network, page storage, persistent messaging, remote code, unsafe sink, or observer APIs", () => {
  const forbiddenPatterns = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\b/,
    /\bEventSource\b/,
    /\bsendBeacon\b/,
    /\bchrome\s*\.\s*(cookies|webRequest)\b/,
    /\bchrome\s*\.\s*runtime\s*\.\s*(?:connect)\b/,
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

test("storage use is limited to the versioned local consent choice", () => {
  const consentSource = fs.readFileSync(path.join(sourceDirectory, "consent-policy.js"), "utf8");
  const popupSource = fs.readFileSync(
    path.join(sourceDirectory, "keyboard-navigation-instructions-popup.js"),
    "utf8"
  );
  assert.match(consentSource, /arrowKeyLocalPageProcessingConsentV1/);
  assert.match(navigatorSource, /chrome\?\.storage\?\.local/);
  assert.match(popupSource, /chrome\?\.storage\?\.local/);
  assert.match(popupSource, /extensionStorage\.set/);
  assert.doesNotMatch(reviewedScripts, /chrome\.storage\.(?:sync|managed|session)/);
  assert.doesNotMatch(reviewedScripts, /acceptedAt|timestamp|Date\s*\(/);
});

test("optional scripting is limited to reviewed local files and approved sites", () => {
  const popupSource = fs.readFileSync(path.join(sourceDirectory, "keyboard-navigation-instructions-popup.js"), "utf8");
  assert.match(popupSource, /chrome\.permissions\.request/);
  assert.match(popupSource, /chrome\.scripting\.registerContentScripts/);
  assert.doesNotMatch(popupSource, /executeScript|insertCSS|func\s*:/);
  assert.doesNotMatch(navigatorSource, /chrome\s*\.\s*scripting/);
  assert.match(popupSource, /chrome\.tabs\.sendMessage/);
  assert.match(navigatorSource, /arrowkey-revoke-site/);
  assert.match(popupSource, /https:\/\/www\.youtube\.com\/\*/);
  assert.doesNotMatch(popupSource, /github\.com/);
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
    "aria-modal='true'",
    "[popover]",
    "iframe",
    "object",
    "embed",
    "aria-hidden='true'"
  ]) {
    assert.equal(navigatorSource.includes(requiredToken), true, `missing guard: ${requiredToken}`);
  }
  assert.equal(/accessibleNameFor[\s\S]*?anchor\.textContent/.test(navigatorSource), false);
  assert.doesNotMatch(navigatorSource, /liveSecondaryLinkCount/);
  assert.doesNotMatch(navigatorSource, /hasUnsupportedExplicitRole/);
  assert.match(navigatorSource, /excludedContext:\s*false/);
  assert.match(navigatorSource, /excludedContext:\s*hasBlockedResultAncestor/);
  assert.match(navigatorSource, /explicitRole:\s*headingLink\.getAttribute\("role"\)/);
  assert.match(navigatorSource, /tabIndex:\s*0/);
  assert.match(navigatorSource, /tabIndex:\s*headingLink\.tabIndex/);
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

test("Stage 1B adapter uses a minimal language-neutral title-link contract", () => {
  assert.match(navigatorSource, /selectorsForSite/);
  assert.match(navigatorSource, /querySelectorAll\("a\[href\]"\)/);
  assert.match(navigatorSource, /querySelectorAll\("h3"\)/);
  assert.doesNotMatch(navigatorSource, /secondaryLinkCount:/);
  assert.doesNotMatch(navigatorSource, /richOrVerticalSignal/);
  assert.doesNotMatch(navigatorSource, /hasLiveAdSignal/);
  assert.doesNotMatch(navigatorSource, /smallestSingleTitleBlock/);
  assert.match(googleAdapterSource, /origin\s*!==\s*"https:\/\/www\.google\.com"/);
  assert.match(googleAdapterSource, /pathname\s*!==\s*"\/search"/);
  assert.doesNotMatch(googleAdapterSource, /isSupportedDocumentLanguage/);
  assert.doesNotMatch(navigatorSource, /document\.documentElement\.lang/);
  assert.doesNotMatch(navigatorSource, /supportedSyntheticRoot/);
  assert.doesNotMatch(googleAdapterSource, /isKnownAdDestination/);
  assert.match(navigatorSource, /tabIndex:\s*headingLink\.tabIndex/);
  assert.match(navigatorSource, /capture:\s*true/);
  assert.doesNotMatch(navigatorSource, /INTERACTIVE_OR_FOCUSABLE_SELECTOR/);
  assert.doesNotMatch(
    navigatorSource,
    /querySelector(?:All)?\s*\(\s*["']\./,
    "generated class selectors must not become positive live-layout evidence"
  );
});

test("YouTube homepage grid geometry comes from complete video cards", () => {
  assert.match(navigatorSource, /candidate\.closest\("ytd-rich-item-renderer"\) \|\| candidate/);
  assert.match(navigatorSource, /geometryElement\.getBoundingClientRect\(\)/);
  assert.match(
    navigatorSource,
    /site === "youtube-home"\s*\? target\.closest\("ytd-rich-item-renderer"\) \|\| target/,
    "homepage scrolling must keep the complete selected video card visible"
  );
});

test("focus indicator targets the title and includes a non-layout arrow marker", () => {
  assert.match(stylesheetSource, /\.skn-focused:focus h3,\s*h3:has\(\.skn-focused:focus\)\s*\{/);
  assert.match(stylesheetSource, /\.skn-focused:focus h3::before,\s*h3:has\(\.skn-focused:focus\)::before\s*\{/);
  assert.match(stylesheetSource, /\.skn-focused:focus:not\(:has\(h3\)\)::before\s*\{/);
  assert.match(stylesheetSource, /border-left:\s*9px solid/);
  assert.match(stylesheetSource, /pointer-events:\s*none/);
  assert.match(stylesheetSource, /prefers-color-scheme:\s*dark/);
  assert.match(stylesheetSource, /forced-colors:\s*active/);
  assert.doesNotMatch(stylesheetSource, /^\.skn-focused\s*\{/m);
});
