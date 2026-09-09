(function initializeNavigator() {
  "use strict";

  const policy = globalThis.SearchKeyboardNavigatorPolicy;
  const resultPolicy = globalThis.SearchKeyboardNavigatorResultPolicy;
  const googleAdapterPolicy =
    globalThis.SearchKeyboardNavigatorGoogleAdapterPolicy;
  const INDICATOR_CLASS = "skn-focused";
  const ARROW_OWNING_SELECTOR = [
    "input",
    "textarea",
    "select",
    "option",
    "[contenteditable]:not([contenteditable='false'])",
    "[role='textbox']",
    "[role='searchbox']",
    "[role='combobox']",
    "[role='spinbutton']",
    "[role='scrollbar']",
    "[role='separator'][tabindex]",
    "[role='radio']",
    "[role='tab']",
    "[role='option']",
    "[role='menuitem']",
    "[role='menuitemcheckbox']",
    "[role='menuitemradio']",
    "audio[controls]",
    "video[controls]",
    "[role='slider']",
    "[role='listbox']",
    "[role='menu']",
    "[role='menubar']",
    "[role='tree']",
    "[role='treeitem']",
    "[role='treegrid']",
    "[role='grid']",
    "[role='tablist']",
    "[role='radiogroup']",
    "[role='toolbar']",
    "[role='application']"
  ].join(",");
  const ARROW_OWNING_ROLES = new Set([
    "application",
    "combobox",
    "grid",
    "listbox",
    "menu",
    "menubar",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "radiogroup",
    "scrollbar",
    "searchbox",
    "separator",
    "slider",
    "spinbutton",
    "tab",
    "tablist",
    "textbox",
    "toolbar",
    "tree",
    "treegrid",
    "treeitem"
  ]);
  const state = {
    active: false,
    movingFocus: false,
    previousFocus: null,
    selected: null
  };

  if (!policy || !resultPolicy || !googleAdapterPolicy) {
    return;
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function isHtmlElement(value) {
    return value instanceof HTMLElement;
  }

  function roleEvidence(element) {
    return {
      explicitRole: element.getAttribute("role") || "",
      hasTabIndex: element.hasAttribute("tabindex")
    };
  }

  function isArrowOwningRole(evidence) {
    const role = resultPolicy.effectiveAriaRole(evidence.explicitRole);
    if (!ARROW_OWNING_ROLES.has(role)) {
      return false;
    }

    return role !== "separator" || Boolean(evidence.hasTabIndex);
  }

  function closestInPath(event, selector, rolePolicy) {
    return event.composedPath().some(
      (entry) =>
        isElement(entry) &&
        (entry.matches(selector) || rolePolicy(roleEvidence(entry)))
    );
  }

  function hasHiddenSemantics(element) {
    return Boolean(
      element.closest("[hidden], [aria-hidden='true']") ||
      element.closest("[inert]")
    );
  }

  function isRendered(element) {
    if (!element.isConnected) {
      return false;
    }

    const hasArea = Array.from(element.getClientRects()).some(
      (rectangle) => rectangle.width > 0 && rectangle.height > 0
    );
    if (!hasArea) {
      return false;
    }

    let current = element;
    while (current) {
      const style = getComputedStyle(current);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.visibility === "collapse" ||
        style.contentVisibility === "hidden" ||
        Number.parseFloat(style.opacity) === 0
      ) {
        return false;
      }
      current = current.parentElement;
    }

    return true;
  }

  function isDisabled(element) {
    return Boolean(
      element.matches(":disabled, [aria-disabled='true']") ||
      element.closest("[aria-disabled='true']")
    );
  }

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function textNodeIsPerceivable(textNode, boundary) {
    let current = textNode.parentElement;
    while (current) {
      if (
        current.matches("[hidden], [aria-hidden='true'], [inert], script, style, template")
      ) {
        return false;
      }

      const style = getComputedStyle(current);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.visibility === "collapse" ||
        style.contentVisibility === "hidden" ||
        Number.parseFloat(style.opacity) === 0
      ) {
        return false;
      }

      if (current === boundary) {
        return true;
      }
      current = current.parentElement;
    }

    return false;
  }

  function accessibleNameFor(anchor) {
    if (anchor.hasAttribute("aria-label")) {
      const explicitLabel = normalizeText(anchor.getAttribute("aria-label"));
      if (explicitLabel) {
        return explicitLabel;
      }
    }

    const walker = document.createTreeWalker(anchor, NodeFilter.SHOW_TEXT);
    const segments = [];
    let textNode = walker.nextNode();
    while (textNode) {
      if (textNodeIsPerceivable(textNode, anchor)) {
        const segment = normalizeText(textNode.nodeValue);
        if (segment) {
          segments.push(segment);
        }
      }
      textNode = walker.nextNode();
    }

    return normalizeText(segments.join(" "));
  }

  function hasActiveOverlay() {
    const overlays = Array.from(
      document.querySelectorAll("dialog[open], [aria-modal='true'], [popover]")
    );

    return overlays.some((overlay) => {
      if (overlay.hasAttribute("popover")) {
        try {
          if (!overlay.matches(":popover-open")) {
            return false;
          }
        } catch {
          return false;
        }
      }

      return isRendered(overlay);
    });
  }

  function supportedLiveRoot() {
    if (
      !googleAdapterPolicy.isSupportedDefaultWebContext(location)
    ) {
      return null;
    }

    const roots = Array.from(document.querySelectorAll("#search"));
    if (roots.length !== 1) {
      return null;
    }

    const searchRoot = roots[0];
    if (
      !isRendered(searchRoot) ||
      hasHiddenSemantics(searchRoot) ||
      hasActiveOverlay() ||
      searchRoot.closest(
        "dialog, [role='dialog'], [aria-modal='true'], [popover], iframe, object, embed"
      )
    ) {
      return null;
    }

    return searchRoot;
  }

  function liveTitleAnchors(root) {
    return Array.from(root.querySelectorAll("a[href]")).filter((anchor) => {
      const headings = Array.from(anchor.querySelectorAll("h3"));
      return (
        headings.length === 1 &&
        headings[0].closest("a[href]") === anchor
      );
    });
  }

  function candidateFromLiveTitle(root, headingLink) {
    if (!headingLink) {
      return null;
    }

    const evidence = {
      accessibleName: accessibleNameFor(headingLink),
      baseUrl: document.baseURI,
      connected: headingLink.isConnected,
      disabled: isDisabled(headingLink),
      excludedContext: false,
      hasDownload: headingLink.hasAttribute("download"),
      hiddenBySemantics: hasHiddenSemantics(headingLink),
      href: headingLink.getAttribute("href") || "",
      inert: Boolean(headingLink.closest("[inert]")),
      rendered: isRendered(headingLink),
      supportedRoot: root.contains(headingLink),
      tabIndex: 0
    };
    const classification = googleAdapterPolicy.classifyEvidence(evidence);

    return classification.eligible ? headingLink : null;
  }

  function candidatesInFreshOrder() {
    const liveRoot = supportedLiveRoot();
    if (!liveRoot) {
      return [];
    }

    return liveTitleAnchors(liveRoot)
      .map((anchor) => candidateFromLiveTitle(liveRoot, anchor))
      .filter(Boolean);
  }

  function removeIndicator() {
    if (state.selected) {
      state.selected.classList.remove(INDICATOR_CLASS);
    }
  }

  function clearSession() {
    removeIndicator();
    state.active = false;
    state.previousFocus = null;
    state.selected = null;
  }

  function selectedIsStillEligible(candidates) {
    if (!state.active) {
      return true;
    }

    if (
      !state.selected ||
      !state.selected.isConnected ||
      !candidates.includes(state.selected)
    ) {
      clearSession();
      return false;
    }

    return true;
  }

  function isNeutralDocumentFocus(element) {
    return (
      !element ||
      element === document.body ||
      element === document.documentElement
    );
  }

  function canRestoreFocus(element) {
    if (!isHtmlElement(element) || !element.isConnected) {
      return false;
    }

    if (element === document.body || element === document.documentElement) {
      return true;
    }

    return !hasHiddenSemantics(element) && !isDisabled(element) && isRendered(element);
  }

  function restorePreviousFocus(candidates) {
    const prior = state.previousFocus;
    const selected = state.selected;

    if (
      !selected ||
      document.activeElement !== selected ||
      !canRestoreFocus(prior) ||
      (!isNeutralDocumentFocus(prior) && !candidates.includes(prior))
    ) {
      return;
    }

    state.movingFocus = true;
    try {
      if (prior === document.body || prior === document.documentElement) {
        selected.blur();
      } else {
        prior.focus({ preventScroll: true });
      }
    } finally {
      state.movingFocus = false;
    }
  }

  function activate(target, previousFocus) {
    state.movingFocus = true;
    try {
      target.focus({ preventScroll: true });
    } finally {
      state.movingFocus = false;
    }

    const freshCandidates = candidatesInFreshOrder();
    const commitAllowed = policy.canCommitFocus({
      focusStayedOnTarget: document.activeElement === target,
      supportedLocation:
        policy.isSupportedLocation(location) &&
        googleAdapterPolicy.isSupportedDefaultWebContext(location),
      targetConnected: target.isConnected,
      targetStillEligible: freshCandidates.includes(target)
    });

    if (!commitAllowed) {
      clearSession();
      return false;
    }

    removeIndicator();
    state.active = true;
    state.previousFocus = previousFocus;
    state.selected = target;
    target.classList.add(INDICATOR_CLASS);
    target.scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" });
    return true;
  }

  function onKeyDown(event) {
    if (!policy.isSupportedLocation(location)) {
      if (state.active) {
        clearSession();
      }
      return;
    }

    if (event.key === "Escape") {
      if (!state.active || policy.shouldIgnoreKeyboardEvent(event)) {
        return;
      }

      const candidates = candidatesInFreshOrder();
      if (!selectedIsStillEligible(candidates)) {
        return;
      }

      restorePreviousFocus(candidates);
      clearSession();
      return;
    }

    if (!policy.directionForKey(event.key) || policy.shouldIgnoreKeyboardEvent(event)) {
      return;
    }

    if (String(document.designMode).toLowerCase() === "on") {
      return;
    }

    const candidates = candidatesInFreshOrder();
    if (!selectedIsStillEligible(candidates)) {
      return;
    }

    if (state.active && document.activeElement !== state.selected) {
      clearSession();
    }

    const activeElement = document.activeElement;
    const activeEligibleIndex = candidates.indexOf(activeElement);
    const arrowOwnedByControl = closestInPath(
      event,
      ARROW_OWNING_SELECTOR,
      isArrowOwningRole
    );

    if (activeEligibleIndex < 0 && arrowOwnedByControl) {
      return;
    }

    const neutralFocus =
      isNeutralDocumentFocus(activeElement) || activeEligibleIndex < 0;

    const decision = policy.decideMovement({
      activeEligibleIndex,
      candidateCount: candidates.length,
      key: event.key,
      neutralFocus,
      repeat: event.repeat,
      sessionActive: state.active,
      supportedLocation: true
    });

    if (decision.action === "suppress-repeat") {
      event.preventDefault();
      return;
    }

    if (decision.action !== "move") {
      return;
    }

    const previousFocus = state.active ? state.previousFocus : activeElement;
    if (activate(candidates[decision.targetIndex], previousFocus)) {
      event.preventDefault();
    }
  }

  function onFocusIn(event) {
    if (
      state.active &&
      !state.movingFocus &&
      event.target !== state.selected
    ) {
      clearSession();
    }
  }

  document.addEventListener("keydown", onKeyDown, {
    capture: true,
    passive: false
  });
  document.addEventListener("focusin", onFocusIn);
})();
