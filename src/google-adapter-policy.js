(function initializeGoogleAdapterPolicy(root, factory) {
  "use strict";

  const resultPolicy =
    typeof module === "object" && module.exports
      ? require("./result-policy.js")
      : root.SearchKeyboardNavigatorResultPolicy;
  const api = factory(resultPolicy);

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  Object.defineProperty(root, "SearchKeyboardNavigatorGoogleAdapterPolicy", {
    configurable: true,
    value: Object.freeze(api)
  });
})(globalThis, function createGoogleAdapterPolicy(resultPolicy) {
  "use strict";

  function isSupportedDefaultWebLocation(locationLike) {
    if (
      !locationLike ||
      locationLike.origin !== "https://www.google.com" ||
      locationLike.pathname !== "/search"
    ) {
      return false;
    }

    return true;
  }

  function isSupportedDefaultWebContext(locationLike) {
    return isSupportedDefaultWebLocation(locationLike);
  }

  function classifyEvidence(evidence) {
    if (!evidence.supportedRoot) {
      return { eligible: false, reason: "unsupported-live-layout" };
    }

    return resultPolicy.classifyEvidence({
      accessibleName: evidence.accessibleName,
      ambiguous: false,
      baseUrl: evidence.baseUrl,
      connected: evidence.connected,
      disabled: evidence.disabled,
      effectiveTarget: "",
      excludedContext: evidence.excludedContext,
      hasDownload: evidence.hasDownload,
      headingCount: 1,
      hiddenBySemantics: evidence.hiddenBySemantics,
      href: evidence.href,
      inert: evidence.inert,
      primaryLinkCount: 1,
      rendered: evidence.rendered,
      supportedRoot: true,
      tabIndex: evidence.tabIndex
    });
  }

  return {
    classifyEvidence,
    isSupportedDefaultWebContext,
    isSupportedDefaultWebLocation
  };
});
