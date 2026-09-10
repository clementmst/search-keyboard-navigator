(function initializePolicy(root, factory) {
  "use strict";

  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  Object.defineProperty(root, "SearchKeyboardNavigatorPolicy", {
    configurable: true,
    value: Object.freeze(api)
  });
})(globalThis, function createPolicy() {
  "use strict";

  const ARROW_UP = "ArrowUp";
  const ARROW_DOWN = "ArrowDown";

  function isSupportedLocation(locationLike) {
    if (!locationLike) return false;
    if (locationLike.origin === "https://www.google.com" && locationLike.pathname === "/search") return true;
    if (locationLike.origin === "https://www.youtube.com" && locationLike.pathname === "/results") return true;
    if (locationLike.origin === "https://github.com" && locationLike.pathname === "/search") {
      return new URLSearchParams(locationLike.search || "").get("type") === "repositories";
    }
    return false;
  }

  function hasDisallowedModifier(eventLike) {
    if (!eventLike) {
      return false;
    }

    const altGraph =
      typeof eventLike.getModifierState === "function" &&
      eventLike.getModifierState("AltGraph");

    return Boolean(
      eventLike.ctrlKey ||
      eventLike.metaKey ||
      eventLike.altKey ||
      eventLike.shiftKey ||
      altGraph
    );
  }

  function shouldIgnoreKeyboardEvent(eventLike) {
    if (!eventLike) {
      return true;
    }

    return Boolean(
      eventLike.defaultPrevented ||
      eventLike.isComposing ||
      eventLike.isTrusted === false ||
      hasDisallowedModifier(eventLike)
    );
  }

  function directionForKey(key) {
    if (key === ARROW_DOWN) {
      return 1;
    }

    if (key === ARROW_UP) {
      return -1;
    }

    return 0;
  }

  function canCommitFocus(input) {
    return Boolean(
      input &&
      input.supportedLocation &&
      input.focusStayedOnTarget &&
      input.targetConnected &&
      input.targetStillEligible
    );
  }

  function decideMovement(input) {
    const direction = directionForKey(input.key);

    if (!direction) {
      return { action: "native", cancelDefault: false, reason: "not-arrow" };
    }

    if (!input.supportedLocation || input.candidateCount <= 0) {
      return { action: "native", cancelDefault: false, reason: "unsupported-or-empty" };
    }

    const hasEligibleOrigin = input.activeEligibleIndex >= 0;

    if (!input.neutralFocus && !hasEligibleOrigin) {
      return { action: "native", cancelDefault: false, reason: "unrelated-focus" };
    }

    let targetIndex = -1;

    if (hasEligibleOrigin) {
      targetIndex = input.activeEligibleIndex + direction;
    } else if (direction > 0) {
      targetIndex = 0;
    }

    const movementAvailable =
      targetIndex >= 0 && targetIndex < input.candidateCount;

    if (input.repeat) {
      if (input.sessionActive && movementAvailable) {
        return {
          action: "suppress-repeat",
          cancelDefault: true,
          reason: "active-repeat"
        };
      }

      return { action: "native", cancelDefault: false, reason: "repeat-fail-open" };
    }

    if (!movementAvailable) {
      return { action: "native", cancelDefault: false, reason: "boundary" };
    }

    return {
      action: "move",
      cancelDefault: true,
      direction,
      targetIndex,
      reason: hasEligibleOrigin ? "relative" : "first"
    };
  }

  return {
    ARROW_DOWN,
    ARROW_UP,
    canCommitFocus,
    decideMovement,
    directionForKey,
    hasDisallowedModifier,
    isSupportedLocation,
    shouldIgnoreKeyboardEvent
  };
});
