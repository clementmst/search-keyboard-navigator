"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const consentSource = fs.readFileSync(path.join(root, "src", "consent-policy.js"), "utf8");
const navigatorSource = fs.readFileSync(path.join(root, "src", "navigator.js"), "utf8");
const popupSource = fs.readFileSync(
  path.join(root, "src", "keyboard-navigation-instructions-popup.js"),
  "utf8"
);
const popupHtml = fs.readFileSync(
  path.join(root, "src", "keyboard-navigation-instructions-popup.html"),
  "utf8"
);
const popupCss = fs.readFileSync(
  path.join(root, "src", "keyboard-navigation-instructions-popup.css"),
  "utf8"
);

function createStorage(initialValue, options = {}) {
  const listeners = [];
  const writes = [];
  const pendingGets = [];
  const chrome = {
    runtime: { lastError: null },
    storage: {
      local: {
        get(key, callback) {
          if (options.delayGet) {
            pendingGets.push(() => callback({ [key]: initialValue }));
            return;
          }
          if (options.failGet) {
            chrome.runtime.lastError = { message: "simulated read failure" };
          }
          callback({ [key]: initialValue });
          chrome.runtime.lastError = null;
        },
        set(value, callback) {
          writes.push(value);
          if (options.failWrites) {
            chrome.runtime.lastError = { message: "simulated write failure" };
          }
          callback();
          chrome.runtime.lastError = null;
        }
      },
      onChanged: {
        addListener(listener) {
          listeners.push(listener);
        }
      }
    }
  };
  return {
    listeners,
    writes,
    pendingGets,
    chrome
  };
}

function createPopupElements() {
  const elements = new Map();
  for (const id of [
    "loading-panel",
    "consent-panel",
    "instructions-panel",
    "enable-navigation",
    "disable-navigation",
    "status-message",
    "error-message",
    "consent-heading",
    "instructions-heading",
    "enabled-state"
  ]) {
    elements.set(id, {
      hidden: id !== "loading-panel",
      disabled: false,
      textContent: "",
      focusCount: 0,
      listeners: {},
      focus() { this.focusCount += 1; },
      addEventListener(type, listener) { this.listeners[type] = listener; }
    });
  }
  return elements;
}

test("disabled consent keeps the content controller away from page data", () => {
  const storage = createStorage(false);
  const context = vm.createContext({
    chrome: storage.chrome,
    document: new Proxy({}, { get() { throw new Error("page data accessed before consent"); } })
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(navigatorSource, context);
  assert.equal(storage.listeners.length, 1);
});

test("grant starts the controller and revocation removes its page listeners", () => {
  const storage = createStorage(true);
  const added = [];
  const removed = [];
  const document = {
    addEventListener(type) { added.push(type); },
    removeEventListener(type) { removed.push(type); }
  };
  const context = vm.createContext({
    chrome: storage.chrome,
    document,
    Element: class Element {},
    HTMLElement: class HTMLElement {},
    SearchKeyboardNavigatorPolicy: {},
    SearchKeyboardNavigatorResultPolicy: {},
    SearchKeyboardNavigatorGoogleAdapterPolicy: {}
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(navigatorSource, context);
  assert.deepEqual(added, ["keydown", "focusin"]);
  storage.listeners[0](
    { arrowKeyLocalPageProcessingConsentV1: { oldValue: true, newValue: false } },
    "local"
  );
  assert.deepEqual(removed, ["keydown", "focusin"]);
});

test("a storage change wins over a stale initial consent read", () => {
  const storage = createStorage(true, { delayGet: true });
  const added = [];
  const context = vm.createContext({
    chrome: storage.chrome,
    document: { addEventListener(type) { added.push(type); } },
    Element: class Element {},
    HTMLElement: class HTMLElement {},
    SearchKeyboardNavigatorPolicy: {},
    SearchKeyboardNavigatorResultPolicy: {},
    SearchKeyboardNavigatorGoogleAdapterPolicy: {}
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(navigatorSource, context);
  storage.listeners[0](
    { arrowKeyLocalPageProcessingConsentV1: { oldValue: true, newValue: false } },
    "local"
  );
  storage.pendingGets[0]();
  assert.deepEqual(added, []);
});

test("popup requires an explicit enable action and supports disabling", () => {
  const storage = createStorage(false);
  const elements = createPopupElements();
  const context = vm.createContext({
    chrome: storage.chrome,
    document: { getElementById(id) { return elements.get(id); } }
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);

  assert.equal(elements.get("consent-panel").hidden, false);
  assert.equal(elements.get("instructions-panel").hidden, true);
  elements.get("enable-navigation").listeners.click();
  assert.equal(storage.writes[0].arrowKeyLocalPageProcessingConsentV1, true);
  assert.equal(elements.get("instructions-panel").hidden, false);
  assert.equal(elements.get("enabled-state").focusCount, 1);
  elements.get("disable-navigation").listeners.click();
  assert.equal(storage.writes[1].arrowKeyLocalPageProcessingConsentV1, false);
  assert.equal(elements.get("consent-panel").hidden, false);
  assert.equal(elements.get("consent-heading").focusCount, 1);
});

test("post-enable focus uses a visible target with a focus indicator", () => {
  assert.match(popupHtml, /id="enabled-state" class="enabled-state" tabindex="-1"/);
  assert.doesNotMatch(popupHtml, /id="enabled-state"[^>]*visually-hidden/);
  assert.match(popupCss, /\.enabled-state:focus\s*\{/);
});

for (const scenario of [
  { name: "Enable", initialValue: false, button: "enable-navigation", activePanel: "consent-panel" },
  { name: "Disable", initialValue: true, button: "disable-navigation", activePanel: "instructions-panel" }
]) {
  test(`a failed ${scenario.name} write preserves the visible actual state`, () => {
    const storage = createStorage(scenario.initialValue, { failWrites: true });
    const elements = createPopupElements();
    const context = vm.createContext({
      chrome: storage.chrome,
      document: { getElementById(id) { return elements.get(id); } }
    });
    vm.runInContext(consentSource, context);
    vm.runInContext(popupSource, context);
    elements.get(scenario.button).listeners.click();
    assert.equal(elements.get(scenario.activePanel).hidden, false);
    assert.equal(elements.get("error-message").hidden, false);
    assert.match(elements.get("error-message").textContent, /Nothing changed/);
  });
}

test("an initial read failure shows a visible neutral state", () => {
  const storage = createStorage(true, { failGet: true });
  const elements = createPopupElements();
  const context = vm.createContext({
    chrome: storage.chrome,
    document: { getElementById(id) { return elements.get(id); } }
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  assert.equal(elements.get("consent-panel").hidden, true);
  assert.equal(elements.get("instructions-panel").hidden, true);
  assert.equal(elements.get("error-message").hidden, false);
  assert.match(elements.get("error-message").textContent, /could not be read/);
});
