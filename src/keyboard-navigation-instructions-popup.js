(function initializePopup() {
  "use strict";

  const consentPolicy = globalThis.ArrowKeyConsentPolicy;
  const extensionStorage = globalThis.chrome?.storage?.local;
  const loadingPanel = document.getElementById("loading-panel");
  const consentPanel = document.getElementById("consent-panel");
  const instructionsPanel = document.getElementById("instructions-panel");
  const enableButton = document.getElementById("enable-navigation");
  const disableButton = document.getElementById("disable-navigation");
  const statusMessage = document.getElementById("status-message");
  const errorMessage = document.getElementById("error-message");
  const mainHeading = document.getElementById("main-heading");
  const consentHeading = document.getElementById("consent-heading");
  const siteMessage = document.getElementById("site-message");
  const optionalSites = [
    { checkbox: document.getElementById("enable-youtube"), id: "arrowkey-youtube", origin: "https://www.youtube.com/*", matches: ["https://www.youtube.com/*"] },
    { checkbox: document.getElementById("enable-github"), id: "arrowkey-github", origin: "https://github.com/*", matches: ["https://github.com/*"] }
  ];
  const siteScripts = [
    "src/consent-policy.js", "src/policy.js", "src/result-policy.js",
    "src/google-adapter-policy.js", "src/site-adapter-policy.js", "src/navigator.js"
  ];
  const siteCss = ["src/navigator.css"];
  let currentEnabled = false;

  function showPanel(enabled, moveFocus = false) {
    currentEnabled = enabled;
    loadingPanel.hidden = true;
    consentPanel.hidden = enabled;
    instructionsPanel.hidden = !enabled;
    errorMessage.hidden = true;
    statusMessage.textContent = enabled
      ? "Keyboard navigation is enabled."
      : "Keyboard navigation is off.";
    if (moveFocus) {
      (enabled ? mainHeading : consentHeading).focus();
    }
  }

  function showError(stateKnown = true) {
    loadingPanel.hidden = true;
    consentPanel.hidden = stateKnown ? currentEnabled : true;
    instructionsPanel.hidden = stateKnown ? !currentEnabled : true;
    errorMessage.hidden = false;
    errorMessage.textContent = stateKnown
      ? "The setting could not be saved. Nothing changed. Close the popup and try again."
      : "The current setting could not be read. Close the popup and try again.";
    statusMessage.textContent = "";
  }

  function saveConsent(enabled, button) {
    button.disabled = true;
    extensionStorage.set(
      { [consentPolicy.storageKey]: enabled },
      () => {
        button.disabled = false;
        if (globalThis.chrome.runtime.lastError) {
          showError();
          return;
        }
        showPanel(enabled, true);
      }
    );
  }

  async function refreshOptionalSites() {
    if (!chrome.permissions) return;
    for (const site of optionalSites) {
      if (!site.checkbox) continue;
      const [originGranted, scriptingGranted] = await Promise.all([
        chrome.permissions.contains({ origins: [site.origin] }),
        chrome.permissions.contains({ permissions: ["scripting"] })
      ]);
      const registrations = scriptingGranted
        ? await chrome.scripting.getRegisteredContentScripts({ ids: [site.id] })
        : [];
      const registration = registrations[0];
      const setupComplete = Boolean(
        originGranted && scriptingGranted && registrations.length === 1 &&
        JSON.stringify(registration.matches) === JSON.stringify(site.matches) &&
        JSON.stringify(registration.js) === JSON.stringify(siteScripts) &&
        JSON.stringify(registration.css) === JSON.stringify(siteCss) &&
        registration.allFrames === false && registration.runAt === "document_idle"
      );
      site.checkbox.checked = originGranted;
      if (originGranted && !setupComplete) {
        siteMessage.textContent = "Site access exists, but setup is incomplete. Switch it off to remove access.";
      }
    }
    await removeScriptingIfUnused(null);
  }

  function registrationFor(site) {
    return {
      id: site.id,
      matches: site.matches,
      js: siteScripts,
      css: siteCss,
      runAt: "document_idle",
      allFrames: false,
      persistAcrossSessions: true
    };
  }

  async function removeScriptingIfUnused(excludedSite) {
    const enabledElsewhere = (await Promise.all(
      optionalSites.filter((site) => site !== excludedSite).map((site) =>
        chrome.permissions.contains({ origins: [site.origin] })
      )
    )).some(Boolean);
    if (!enabledElsewhere && await chrome.permissions.contains({ permissions: ["scripting"] })) {
      const removed = await chrome.permissions.remove({ permissions: ["scripting"] });
      if (!removed) throw new Error("Scripting permission was not removed");
    }
  }

  async function stopInjectedController(tabId) {
    try {
      await chrome.tabs.sendMessage(tabId, { type: "arrowkey-revoke-site" });
    } catch (error) {
      const message = String(error?.message || "");
      if (/receiving end does not exist|could not establish connection/i.test(message)) return;
      throw error;
    }
  }

  async function setOptionalSite(site, enabled) {
    site.checkbox.disabled = true;
    siteMessage.textContent = "";
    try {
      if (enabled) {
        const alreadyGranted = await chrome.permissions.contains({ origins: [site.origin] });
        const alreadyScripting = await chrome.permissions.contains({ permissions: ["scripting"] });
        const granted = await chrome.permissions.request({ permissions: ["scripting"], origins: [site.origin] });
        if (!granted) {
          site.checkbox.checked = false;
          siteMessage.textContent = "Site access was not enabled.";
          return;
        }
        try {
          const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [site.id] });
          if (existing.length) await chrome.scripting.unregisterContentScripts({ ids: [site.id] });
          await chrome.scripting.registerContentScripts([registrationFor(site)]);
        } catch (error) {
          if (!alreadyGranted) {
            const rolledBack = await chrome.permissions.remove({ origins: [site.origin] });
            if (!rolledBack) site.checkbox.checked = true;
          }
          if (!alreadyScripting) await removeScriptingIfUnused(site);
          throw error;
        }
        siteMessage.textContent = "Enabled. Reload an open matching page once.";
      } else {
        const tabs = await chrome.tabs.query({ url: site.matches });
        await Promise.all(tabs.map((tab) => stopInjectedController(tab.id)));
        const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [site.id] });
        if (existing.length) await chrome.scripting.unregisterContentScripts({ ids: [site.id] });
        const removed = await chrome.permissions.remove({ origins: [site.origin] });
        if (!removed) {
          await chrome.scripting.registerContentScripts([registrationFor(site)]);
          throw new Error("Site access was not removed");
        }
        await removeScriptingIfUnused(site);
        siteMessage.textContent = "Site access removed.";
      }
    } catch {
      siteMessage.textContent = "The site setting could not be changed.";
      await refreshOptionalSites();
    } finally {
      site.checkbox.disabled = false;
    }
  }

  if (!consentPolicy || !extensionStorage) {
    showError(false);
    return;
  }

  enableButton.addEventListener("click", () => {
    saveConsent(true, enableButton);
  });

  disableButton.addEventListener("click", () => {
    saveConsent(false, disableButton);
  });

  for (const site of optionalSites) {
    if (site.checkbox) {
      site.checkbox.addEventListener("change", () => setOptionalSite(site, site.checkbox.checked));
    }
  }

  extensionStorage.get(consentPolicy.storageKey, (storedValues) => {
    if (globalThis.chrome.runtime.lastError) {
      showError(false);
      return;
    }
    showPanel(consentPolicy.isGranted(storedValues[consentPolicy.storageKey]));
    refreshOptionalSites().catch(() => {
      siteMessage.textContent = "Optional site settings could not be read.";
    });
  });
})();
