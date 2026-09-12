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
  const GRID_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

  function isSupportedLocation(locationLike) {
    if (!locationLike) return false;
    if (locationLike.origin === "https://www.google.com" && locationLike.pathname === "/search") return true;
    if (locationLike.origin === "https://www.youtube.com" && locationLike.pathname === "/results") return true;
    if (locationLike.origin === "https://www.youtube.com" && locationLike.pathname === "/") return true;
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

  function scrollDeltaForVisibility(input) {
    if (
      !input ||
      !Number.isFinite(input.top) ||
      !Number.isFinite(input.bottom) ||
      !Number.isFinite(input.viewportHeight) ||
      input.viewportHeight <= 0
    ) {
      return 0;
    }
    const topRoom = Number.isFinite(input.topRoom) ? input.topRoom : 96;
    const bottomRoom = Number.isFinite(input.bottomRoom) ? input.bottomRoom : 72;
    if (input.top < topRoom) return input.top - topRoom;
    const bottomLimit = input.viewportHeight - bottomRoom;
    if (input.bottom > bottomLimit) return input.bottom - bottomLimit;
    return 0;
  }

  function gridTargetIndex(input) {
    const rects = input?.rects;
    const activeIndex = input?.activeEligibleIndex;
    const current = Array.isArray(rects) ? rects[activeIndex] : null;
    if (!current || !GRID_KEYS.has(input.key)) return -1;

    const currentX = current.left + current.width / 2;
    const rowTolerance = Math.max(8, current.height / 2);
    const choices = rects.map((rect, index) => ({
      index,
      horizontal: Math.abs(rect.left + rect.width / 2 - currentX),
      vertical: rect.top - current.top
    })).filter((choice) => choice.index !== activeIndex);

    if (input.key === "ArrowLeft" || input.key === "ArrowRight") {
      const direction = input.key === "ArrowLeft" ? -1 : 1;
      const sameRow = choices.filter((choice) =>
        Math.abs(choice.vertical) <= rowTolerance &&
        (rects[choice.index].left - current.left) * direction > 0
      );
      sameRow.sort((a, b) => a.horizontal - b.horizontal || a.index - b.index);
      return sameRow[0]?.index ?? -1;
    }

    const direction = input.key === "ArrowUp" ? -1 : 1;
    const otherRows = choices.filter((choice) => choice.vertical * direction > rowTolerance);
    otherRows.sort((a, b) =>
      Math.abs(a.vertical) - Math.abs(b.vertical) ||
      a.horizontal - b.horizontal ||
      a.index - b.index
    );
    return otherRows[0]?.index ?? -1;
  }

  function decideGridMovement(input) {
    if (!input || !GRID_KEYS.has(input.key)) {
      return { action: "native", cancelDefault: false, reason: "not-grid-arrow" };
    }
    if (!input.supportedLocation || !Array.isArray(input.rects) || input.rects.length === 0) {
      return { action: "native", cancelDefault: false, reason: "unsupported-or-empty" };
    }
    const hasEligibleOrigin = input.activeEligibleIndex >= 0;
    if (!input.neutralFocus && !hasEligibleOrigin) {
      return { action: "native", cancelDefault: false, reason: "unrelated-focus" };
    }

    const targetIndex = hasEligibleOrigin
      ? gridTargetIndex(input)
      : 0;
    const movementAvailable = targetIndex >= 0 && targetIndex < input.rects.length;
    if (input.repeat) {
      return input.sessionActive && movementAvailable
        ? { action: "suppress-repeat", cancelDefault: true, reason: "active-repeat" }
        : { action: "native", cancelDefault: false, reason: "repeat-fail-open" };
    }
    if (!movementAvailable) {
      return { action: "native", cancelDefault: false, reason: "boundary" };
    }
    return {
      action: "move", cancelDefault: true, targetIndex,
      reason: hasEligibleOrigin ? "grid-relative" : "first"
    };
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
    decideGridMovement,
    decideMovement,
    directionForKey,
    gridTargetIndex,
    hasDisallowedModifier,
    isSupportedLocation,
    scrollDeltaForVisibility,
    shouldIgnoreKeyboardEvent
  };
});
