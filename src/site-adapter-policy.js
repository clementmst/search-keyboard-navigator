(function initializeSiteAdapterPolicy(root, factory) {
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
  Object.defineProperty(root, "ArrowKeySiteAdapterPolicy", {
    configurable: true,
    value: Object.freeze(api)
  });
})(globalThis, function createSiteAdapterPolicy(resultPolicy) {
  "use strict";

  function siteForLocation(locationLike) {
    if (!locationLike) return "";
    if (locationLike.origin === "https://www.google.com" && locationLike.pathname === "/search") return "google";
    if (locationLike.origin === "https://www.youtube.com" && locationLike.pathname === "/results") return "youtube";
    if (locationLike.origin === "https://github.com" && locationLike.pathname === "/search") {
      const params = new URLSearchParams(locationLike.search || "");
      return params.get("type") === "repositories" ? "github" : "";
    }
    return "";
  }

  function selectorsForSite(site) {
    if (site === "google") return { root: "#search", titles: "a[href]" };
    if (site === "youtube") return { root: "ytd-search", titles: "ytd-video-renderer a#video-title[href^='/watch']" };
    if (site === "github") return { root: "[data-testid='results-list']", titles: "h3 a[href]" };
    return null;
  }

  function classifyOptionalTitleEvidence(site, evidence) {
    if (!resultPolicy || (site !== "youtube" && site !== "github")) {
      return { eligible: false, reason: "unsupported-site" };
    }

    return resultPolicy.classifyEvidence({
      accessibleName: evidence.accessibleName,
      ambiguous: false,
      baseUrl: evidence.baseUrl,
      connected: evidence.connected,
      disabled: evidence.disabled,
      effectiveTarget: evidence.effectiveTarget,
      excludedContext:
        evidence.excludedContext ||
        resultPolicy.isUnsupportedPrimaryRole(evidence.explicitRole),
      hasDownload: evidence.hasDownload,
      headingCount: 1,
      hiddenBySemantics: evidence.hiddenBySemantics,
      href: evidence.href,
      inert: evidence.inert,
      primaryLinkCount: 1,
      rendered: evidence.rendered,
      supportedRoot: evidence.supportedRoot,
      tabIndex: evidence.tabIndex
    });
  }

  return {
    classifyOptionalTitleEvidence,
    isSupportedLocation: (locationLike) => Boolean(siteForLocation(locationLike)),
    selectorsForSite,
    siteForLocation
  };
});
