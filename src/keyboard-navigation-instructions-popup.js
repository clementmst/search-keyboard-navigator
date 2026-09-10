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

  extensionStorage.get(consentPolicy.storageKey, (storedValues) => {
    if (globalThis.chrome.runtime.lastError) {
      showError(false);
      return;
    }
    showPanel(consentPolicy.isGranted(storedValues[consentPolicy.storageKey]));
  });
})();
