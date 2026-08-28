(function initializeLayoutAdapter(root, factory) {
  "use strict";

  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  Object.defineProperty(root, "SearchKeyboardNavigatorLayoutAdapter", {
    configurable: true,
    value: Object.freeze(api)
  });
})(globalThis, function createLayoutAdapter() {
  "use strict";

  const ADAPTER_ID = "google-desktop-organic-2026-08-v1";
  const RESULT_ROOT_SELECTOR = "#search #rso";
  const RESULT_BLOCK_SELECTOR = ":scope > .MjjYud";
  const ORGANIC_CONTAINER_SELECTOR = ".g";
  const TITLE_WRAPPER_SELECTOR = ".yuRUbf";

  function classifyStructure(evidence) {
    if (!evidence || evidence.rootCount !== 1) {
      return { eligible: false, reason: "unknown-layout" };
    }

    if (
      evidence.blockIsDirectChild !== true ||
      evidence.organicContainerCount !== 1 ||
      evidence.titleWrapperCount !== 1 ||
      evidence.titleWrapperInsideOrganicContainer !== true
    ) {
      return { eligible: false, reason: "noncanonical-block" };
    }

    if (
      evidence.headingCount !== 1 ||
      evidence.headingLinkCount !== 1 ||
      evidence.headingInsideTitleWrapper !== true ||
      evidence.headingLinkInsideTitleWrapper !== true
    ) {
      return { eligible: false, reason: "ambiguous-title" };
    }

    if (evidence.excludedModule === true) {
      return { eligible: false, reason: "excluded-module" };
    }

    return { eligible: true, reason: "supported-organic-title" };
  }

  return {
    ADAPTER_ID,
    ORGANIC_CONTAINER_SELECTOR,
    RESULT_BLOCK_SELECTOR,
    RESULT_ROOT_SELECTOR,
    TITLE_WRAPPER_SELECTOR,
    classifyStructure
  };
});
