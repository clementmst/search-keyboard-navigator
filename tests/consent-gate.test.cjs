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
  const runtimeListeners = [];
  const chrome = {
    runtime: { lastError: null, onMessage: { addListener(listener) { runtimeListeners.push(listener); } } },
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
    chrome,
    runtimeListeners
  };
}

function createPopupElements() {
  const elements = new Map();
  for (const id of [
    "loading-panel",
    "instructions-panel",
    "status-message",
    "error-message",
    "main-heading",
    "instructions-heading"
    ,"enable-google"
    ,"enable-youtube"
    ,"site-message"
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

function createOptionalChrome(options = {}) {
  const storage = createStorage(true);
  const origins = new Set(options.origins || []);
  let scriptingGranted = Boolean(options.scriptingGranted);
  const registrations = new Map(options.registrations || []);
  const messages = [];
  storage.chrome.permissions = {
    async contains(query) {
      if (query.permissions) return query.permissions.every((value) => value !== "scripting" || scriptingGranted);
      return query.origins.every((value) => origins.has(value));
    },
    async request(query) {
      if (options.denyRequest) return false;
      scriptingGranted = true;
      query.origins.forEach((value) => origins.add(value));
      return true;
    },
    async remove(query) {
      if (query.origins && options.failOriginRemoval) return false;
      if (query.permissions && options.failScriptingRemoval) return false;
      if (query.origins) query.origins.forEach((value) => origins.delete(value));
      if (query.permissions?.includes("scripting")) scriptingGranted = false;
      return true;
    }
  };
  storage.chrome.scripting = {
    async getRegisteredContentScripts({ ids }) {
      if (options.rejectScriptingBeforeGrant && !scriptingGranted) throw new Error("scripting not granted");
      return ids.flatMap((id) => registrations.has(id) ? [registrations.get(id)] : []);
    },
    async registerContentScripts(items) {
      if (options.failRegistration) throw new Error("registration failed");
      items.forEach((item) => registrations.set(item.id, item));
    },
    async unregisterContentScripts({ ids }) { ids.forEach((id) => registrations.delete(id)); }
  };
  storage.chrome.tabs = {
    async query() { return [{ id: 7 }]; },
    async sendMessage(id, message) {
      if (options.failMessage) throw new Error("delivery failed");
      if (options.noReceiver) throw new Error("Could not establish connection. Receiving end does not exist.");
      messages.push({ id, message });
    }
  };
  return { chrome: storage.chrome, origins, registrations, messages, scriptingGranted: () => scriptingGranted };
}

async function settle() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
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

test("optional-site revocation message immediately removes page listeners", () => {
  const storage = createStorage(true);
  const removed = [];
  const context = vm.createContext({
    chrome: storage.chrome,
    document: { addEventListener() {}, removeEventListener(type) { removed.push(type); } },
    Element: class Element {}, HTMLElement: class HTMLElement {},
    SearchKeyboardNavigatorPolicy: {}, SearchKeyboardNavigatorResultPolicy: {}, SearchKeyboardNavigatorGoogleAdapterPolicy: {}
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(navigatorSource, context);
  storage.runtimeListeners[0]({ type: "arrowkey-revoke-site" });
  assert.deepEqual(removed, ["keydown", "focusin"]);
});

test("an explicitly permitted optional site starts independently of Google access", () => {
  const storage = createStorage(false);
  const added = [];
  const context = vm.createContext({
    chrome: storage.chrome,
    location: { origin: "https://www.youtube.com" },
    document: { addEventListener(type) { added.push(type); }, removeEventListener() {} },
    Element: class Element {}, HTMLElement: class HTMLElement {},
    SearchKeyboardNavigatorPolicy: {}, SearchKeyboardNavigatorResultPolicy: {},
    SearchKeyboardNavigatorGoogleAdapterPolicy: {}
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(navigatorSource, context);
  assert.deepEqual(added, ["keydown", "focusin"]);
  assert.equal(storage.listeners.length, 0);
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

test("popup presents independent Google and YouTube access toggles", () => {
  const storage = createStorage(false);
  const elements = createPopupElements();
  const context = vm.createContext({
    chrome: storage.chrome,
    document: { getElementById(id) { return elements.get(id); } }
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);

  assert.equal(elements.get("instructions-panel").hidden, false);
  assert.equal(elements.get("enable-google").checked, false);
  elements.get("enable-google").checked = true;
  elements.get("enable-google").listeners.change();
  assert.equal(storage.writes[0].arrowKeyLocalPageProcessingConsentV1, true);
  elements.get("enable-google").checked = false;
  elements.get("enable-google").listeners.change();
  assert.equal(storage.writes[1].arrowKeyLocalPageProcessingConsentV1, false);
});

test("popup discloses local page handling before either access switch", () => {
  const disclosureIndex = popupHtml.indexOf('class="access-disclosure"');
  const googleSwitchIndex = popupHtml.indexOf('id="enable-google"');
  const youtubeSwitchIndex = popupHtml.indexOf('id="enable-youtube"');
  assert.ok(disclosureIndex >= 0);
  assert.ok(disclosureIndex < googleSwitchIndex);
  assert.ok(disclosureIndex < youtubeSwitchIndex);
  assert.match(popupHtml, /page address, visible links and layout, focus, and arrow-key presses/);
  assert.match(popupHtml, /stores none of that information and sends nothing/);
});

test("post-enable focus uses a visible target with a focus indicator", () => {
  assert.match(popupHtml, /<h1 id="main-heading" tabindex="-1">/);
  assert.doesNotMatch(popupHtml, /id="main-heading"[^>]*visually-hidden/);
  assert.match(popupCss, /h1:focus[\s\S]*outline: 3px solid/);
  assert.match(
    popupCss,
    /@media \(prefers-color-scheme: dark\)[\s\S]*h1:focus,[\s\S]*outline-color: #8ab4f8/
  );
});

test("a failed Google toggle write restores its actual state", () => {
  const storage = createStorage(false, { failWrites: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: storage.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  elements.get("enable-google").checked = true;
  elements.get("enable-google").listeners.change();
  assert.equal(elements.get("enable-google").checked, false);
  assert.equal(elements.get("error-message").hidden, false);
});

test("an initial read failure shows a visible neutral state", () => {
  const storage = createStorage(true, { failGet: true });
  const elements = createPopupElements();
  const context = vm.createContext({
    chrome: storage.chrome,
    document: { getElementById(id) { return elements.get(id); } }
  });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  assert.equal(elements.get("instructions-panel").hidden, false);
  assert.equal(elements.get("error-message").hidden, false);
  assert.match(elements.get("error-message").textContent, /could not be read/);
});

test("optional-site grant registers only packaged code and denial remains off", async () => {
  for (const denyRequest of [false, true]) {
    const fake = createOptionalChrome({ denyRequest });
    const elements = createPopupElements();
    const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
    vm.runInContext(consentSource, context);
    vm.runInContext(popupSource, context);
    await settle();
    const checkbox = elements.get("enable-youtube");
    checkbox.checked = true;
    checkbox.listeners.change();
    await settle();
    assert.equal(fake.registrations.has("arrowkey-youtube"), !denyRequest);
    assert.equal(fake.origins.has("https://www.youtube.com/*"), !denyRequest);
  }
});

test("fresh popup does not call scripting before optional permission exists", async () => {
  const fake = createOptionalChrome({ rejectScriptingBeforeGrant: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  await settle();
  assert.equal(elements.get("enable-youtube").checked, false);
  assert.equal(elements.get("site-message").textContent, "");
});

test("registration failure rolls back a newly granted origin", async () => {
  const fake = createOptionalChrome({ failRegistration: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  elements.get("enable-youtube").checked = true;
  elements.get("enable-youtube").listeners.change();
  await settle();
  assert.equal(fake.origins.has("https://www.youtube.com/*"), false);
  assert.equal(elements.get("enable-youtube").checked, false);
  assert.equal(fake.scriptingGranted(), false);
});

test("failed registration plus failed rollback keeps the host grant visible", async () => {
  const fake = createOptionalChrome({ failRegistration: true, failOriginRemoval: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  elements.get("enable-youtube").checked = true;
  elements.get("enable-youtube").listeners.change();
  await settle();
  assert.equal(fake.origins.has("https://www.youtube.com/*"), true);
  assert.equal(elements.get("enable-youtube").checked, true);
  assert.match(elements.get("site-message").textContent, /switched off and on again/);
});

test("teardown message failure preserves permission and registration", async () => {
  const fake = createOptionalChrome({ origins: ["https://www.youtube.com/*"], scriptingGranted: true, failMessage: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  elements.get("enable-youtube").checked = false;
  elements.get("enable-youtube").listeners.change();
  await settle();
  assert.equal(fake.origins.has("https://www.youtube.com/*"), true);
  assert.equal(elements.get("enable-youtube").checked, true);
});

test("a tab with no injected receiver does not block origin removal", async () => {
  const fake = createOptionalChrome({ origins: ["https://www.youtube.com/*"], scriptingGranted: true, noReceiver: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  await settle();
  elements.get("enable-youtube").checked = false;
  elements.get("enable-youtube").listeners.change();
  await settle();
  assert.equal(fake.origins.has("https://www.youtube.com/*"), false);
  assert.equal(fake.scriptingGranted(), false);
});

test("opening the popup retries cleanup of orphaned scripting authority", async () => {
  const fake = createOptionalChrome({ scriptingGranted: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  await settle();
  assert.equal(fake.scriptingGranted(), false);
});

test("opening the popup removes a legacy GitHub content-script registration", async () => {
  const legacy = { id: "arrowkey-github", matches: ["https://github.com/*"], js: [], css: [] };
  const fake = createOptionalChrome({ scriptingGranted: true, registrations: [[legacy.id, legacy]] });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  await settle();
  assert.equal(fake.registrations.has("arrowkey-github"), false);
});

test("revocation stops open tabs and removal failure restores registration", async () => {
  const site = { id: "arrowkey-youtube", matches: ["https://www.youtube.com/results*"], js: [], css: [] };
  const fake = createOptionalChrome({ origins: ["https://www.youtube.com/*"], scriptingGranted: true, registrations: [[site.id, site]], failOriginRemoval: true });
  const elements = createPopupElements();
  const context = vm.createContext({ chrome: fake.chrome, document: { getElementById(id) { return elements.get(id); } } });
  vm.runInContext(consentSource, context);
  vm.runInContext(popupSource, context);
  await settle();
  elements.get("enable-youtube").checked = false;
  elements.get("enable-youtube").listeners.change();
  await settle();
  assert.equal(fake.messages[0].message.type, "arrowkey-revoke-site");
  assert.equal(fake.origins.has("https://www.youtube.com/*"), true);
  assert.equal(fake.registrations.has("arrowkey-youtube"), true);
});
