(function initializePopup() {
  "use strict";

  const consentPolicy = globalThis.ArrowKeyConsentPolicy;
  const extensionStorage = globalThis.chrome?.storage?.local;
  const loadingPanel = document.getElementById("loading-panel");
  const instructionsPanel = document.getElementById("instructions-panel");
  const googleCheckbox = document.getElementById("enable-google");
  const statusMessage = document.getElementById("status-message");
  const errorMessage = document.getElementById("error-message");
  const siteMessage = document.getElementById("site-message");
  const optionalSites = [
    { checkbox: document.getElementById("enable-youtube"), id: "arrowkey-youtube", origin: "https://www.youtube.com/*", matches: ["https://www.youtube.com/*"] }
  ];
  const siteScripts = [
    "src/consent-policy.js", "src/policy.js", "src/result-policy.js",
    "src/google-adapter-policy.js", "src/site-adapter-policy.js", "src/navigator.js"
  ];
  const siteCss = ["src/navigator.css"];

  function showReady() {
    loadingPanel.hidden = true;
    instructionsPanel.hidden = false;
    errorMessage.hidden = true;
  }

  function showError(message) {
    loadingPanel.hidden = true;
    instructionsPanel.hidden = false;
    errorMessage.hidden = false;
    errorMessage.textContent = message;
    statusMessage.textContent = "";
  }

  function saveGoogleAccess(enabled) {
    googleCheckbox.disabled = true;
    extensionStorage.set({ [consentPolicy.storageKey]: enabled }, () => {
      googleCheckbox.disabled = false;
      if (globalThis.chrome.runtime.lastError) {
        googleCheckbox.checked = !enabled;
        showError("Google Search access could not be changed. Try again.");
        return;
      }
      statusMessage.textContent = `Google Search access ${enabled ? "enabled" : "disabled"}.`;
    });
  }

  function registrationFor(site) {
    return { id: site.id, matches: site.matches, js: siteScripts, css: siteCss,
      runAt: "document_idle", allFrames: false, persistAcrossSessions: true };
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

  async function refreshOptionalSites() {
    if (!chrome.permissions) return;
    const scriptingGranted = await chrome.permissions.contains({ permissions: ["scripting"] });
    if (scriptingGranted) {
      const removedSiteRegistrations = await chrome.scripting.getRegisteredContentScripts({
        ids: ["arrowkey-github"]
      });
      if (removedSiteRegistrations.length) {
        await chrome.scripting.unregisterContentScripts({ ids: ["arrowkey-github"] });
      }
    }
    for (const site of optionalSites) {
      const [originGranted, siteScriptingGranted] = await Promise.all([
        chrome.permissions.contains({ origins: [site.origin] }),
        chrome.permissions.contains({ permissions: ["scripting"] })
      ]);
      const registrations = siteScriptingGranted
        ? await chrome.scripting.getRegisteredContentScripts({ ids: [site.id] }) : [];
      const registration = registrations[0];
      const setupComplete = Boolean(
        originGranted && siteScriptingGranted && registrations.length === 1 &&
        JSON.stringify(registration.matches) === JSON.stringify(site.matches) &&
        JSON.stringify(registration.js) === JSON.stringify(siteScripts) &&
        JSON.stringify(registration.css) === JSON.stringify(siteCss) &&
        registration.allFrames === false && registration.runAt === "document_idle"
      );
      site.checkbox.checked = originGranted;
      if (originGranted && !setupComplete) {
        siteMessage.textContent = "One site needs to be switched off and on again.";
      }
    }
    await removeScriptingIfUnused(null);
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
          siteMessage.textContent = "Access was not enabled.";
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
        siteMessage.textContent = "Enabled. Reload an open page once.";
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
        siteMessage.textContent = "Access removed.";
      }
    } catch {
      siteMessage.textContent = "The site setting could not be changed.";
      await refreshOptionalSites();
    } finally {
      site.checkbox.disabled = false;
    }
  }

  if (!consentPolicy || !extensionStorage) {
    showError("Access settings could not be read. Close the popup and try again.");
    return;
  }

  googleCheckbox.addEventListener("change", () => saveGoogleAccess(googleCheckbox.checked));
  for (const site of optionalSites) {
    site.checkbox.addEventListener("change", () => setOptionalSite(site, site.checkbox.checked));
  }

  extensionStorage.get(consentPolicy.storageKey, (storedValues) => {
    if (globalThis.chrome.runtime.lastError) {
      showError("Access settings could not be read. Close the popup and try again.");
      return;
    }
    googleCheckbox.checked = consentPolicy.isGranted(storedValues[consentPolicy.storageKey]);
    showReady();
    refreshOptionalSites().catch(() => {
      siteMessage.textContent = "Optional site settings could not be read.";
    });
  });
})();
