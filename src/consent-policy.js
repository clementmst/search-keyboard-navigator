(function initializeConsentPolicy(root) {
  "use strict";

  const STORAGE_KEY = "arrowKeyLocalPageProcessingConsentV1";

  root.ArrowKeyConsentPolicy = Object.freeze({
    storageKey: STORAGE_KEY,
    isGranted(value) {
      return value === true;
    }
  });
})(globalThis);
