(function initializeNavigator() {
  "use strict";

  const policy = globalThis.SearchKeyboardNavigatorPolicy;
  const resultPolicy = globalThis.SearchKeyboardNavigatorResultPolicy;
  const layoutAdapter = globalThis.SearchKeyboardNavigatorLayoutAdapter;
  const INDICATOR_CLASS = "skn-private-test-focused";
  const EDITING_OR_WIDGET_SELECTOR = [
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
    "[role='button']",
    "[role='checkbox']",
    "[role='radio']",
    "[role='switch']",
    "[role='tab']",
    "[role='option']",
    "[role='menuitem']",
    "[role='menuitemcheckbox']",
    "[role='menuitemradio']",
    ":not(a)[tabindex]",
    "summary",
    "details",
    "audio[controls]",
    "video[controls]",
    "[role='slider']",
    "[role='listbox']",
    "[role='menu']",
    "[role='menubar']",
    "[role='tree']",
    "[role='treegrid']",
    "[role='grid']",
    "[role='tablist']",
    "[role='radiogroup']",
    "[role='toolbar']",
    "[role='application']",
    "[role='dialog']",
    "dialog",
    "[aria-modal='true']",
    "[popover]",
    "iframe",
    "object",
    "embed"
  ].join(",");
  const INTERACTIVE_OR_FOCUSABLE_SELECTOR = [
    "a[href]",
    "button",
    "input",
    "textarea",
    "select",
    "summary",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]:not([contenteditable='false'])",
    "[tabindex]",
    "[role='button']",
    "[role='link']",
    "[role='checkbox']",
    "[role='radio']",
    "[role='switch']",
    "[role='tab']",
    "[role='option']",
    "[role='menuitem']",
    "[role='menuitemcheckbox']",
    "[role='menuitemradio']",
    "iframe",
    "object",
    "embed"
  ].join(",");
  const BLOCKED_RESULT_CONTEXT_SELECTOR = [
    "button",
    "input",
    "textarea",
    "select",
    "option",
    "[contenteditable]:not([contenteditable='false'])",
    "[role='textbox']",
    "[role='searchbox']",
    "[role='combobox']",
    "aside",
    "nav",
    "[role='navigation']",
    "dialog",
    "[role='dialog']",
    "[aria-modal='true']",
    "[popover]",
    "[role='application']",
    "[role='listbox']",
    "[role='menu']",
    "[role='menubar']",
    "[role='tree']",
    "[role='treeitem']",
    "[role='treegrid']",
    "[role='grid']",
    "[role='gridcell']",
    "[role='row']",
    "[role='feed']",
    "[role='tablist']",
    "[role='radiogroup']",
    "[role='toolbar']",
    "[role='slider']",
    "[role='spinbutton']",
    "[role='scrollbar']",
    "[role='separator'][tabindex]",
    "[role='button']",
    "[role='checkbox']",
    "[role='radio']",
    "[role='switch']",
    "[role='tab']",
    "[role='option']",
    "[role='menuitem']",
    "[role='menuitemcheckbox']",
    "[role='menuitemradio']",
    ":not(a)[tabindex]",
    "summary",
    "details",
    "audio[controls]",
    "video[controls]",
    "iframe",
    "object",
    "embed",
    "[aria-roledescription]",
    "[data-text-ad]"
  ].join(",");

  const state = {
    active: false,
    movingFocus: false,
    previousFocus: null,
    selected: null
  };

  if (!policy || !resultPolicy || !layoutAdapter) {
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
    // Stage 1A deliberately declines complex referenced-name computation.
    // A future adapter may support aria-labelledby only with DOM/AX evidence.
    if (anchor.hasAttribute("aria-labelledby")) {
      return "";
    }

    if (anchor.hasAttribute("aria-label")) {
      return normalizeText(anchor.getAttribute("aria-label"));
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

  function hasUnsupportedExplicitRole(anchor) {
    if (!anchor || !anchor.hasAttribute("role")) {
      return false;
    }

    return resultPolicy.isUnsupportedPrimaryRole(anchor.getAttribute("role"));
  }

  function hasSecondaryInteractiveLinkCandidate(block, primaryLink) {
    return Array.from(block.querySelectorAll("a, [role]")).some((element) =>
      resultPolicy.isSecondaryInteractiveLinkCandidate({
        explicitRole: element.getAttribute("role") || "",
        hasHref: element.hasAttribute("href"),
        hasTabIndex: element.hasAttribute("tabindex"),
        isPrimary: element === primaryLink,
        tagName: element.localName
      })
    );
  }

  function hasBlockedContext(element) {
    if (
      element.closest(BLOCKED_RESULT_CONTEXT_SELECTOR) ||
      element.querySelector(BLOCKED_RESULT_CONTEXT_SELECTOR)
    ) {
      return true;
    }

    let current = element;
    while (current) {
      if (resultPolicy.isBlockedResultRole(roleEvidence(current))) {
        return true;
      }
      current = current.parentElement;
    }

    return Array.from(element.querySelectorAll("[role]")).some((descendant) =>
      resultPolicy.isBlockedResultRole(roleEvidence(descendant))
    );
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

  function supportedRoot() {
    const roots = Array.from(
      document.querySelectorAll(layoutAdapter.RESULT_ROOT_SELECTOR)
    );
    if (roots.length !== 1) {
      return null;
    }

    const root = roots[0];
    if (
      !isRendered(root) ||
      hasHiddenSemantics(root) ||
      hasActiveOverlay()
    ) {
      return null;
    }

    return root;
  }

  function candidateFromBlock(root, block) {
    const organicContainers = Array.from(
      block.querySelectorAll(layoutAdapter.ORGANIC_CONTAINER_SELECTOR)
    );
    const titleWrappers = Array.from(
      block.querySelectorAll(layoutAdapter.TITLE_WRAPPER_SELECTOR)
    );
    const headings = Array.from(block.querySelectorAll("h3"));
    const heading = headings.length === 1 ? headings[0] : null;
    const titleWrapper = titleWrappers.length === 1 ? titleWrappers[0] : null;
    const headingLinks = heading && titleWrapper
      ? Array.from(titleWrapper.querySelectorAll("a[href]")).filter(
          (anchor) => anchor.contains(heading) || heading.contains(anchor)
        )
      : [];
    const headingLink = headingLinks.length === 1 ? headingLinks[0] : null;
    const structure = layoutAdapter.classifyStructure({
      blockIsDirectChild: block.parentElement === root,
      excludedModule: Boolean(
        block.matches("[data-text-ad]") ||
        block.querySelector(
          "[data-text-ad], aside, [role='navigation'], [aria-roledescription], " +
            "g-scrolling-carousel, block-component, table"
        )
      ),
      headingCount: headings.length,
      headingInsideTitleWrapper: Boolean(
        heading && titleWrapper && titleWrapper.contains(heading)
      ),
      headingLinkCount: headingLinks.length,
      headingLinkInsideTitleWrapper: Boolean(
        headingLink && titleWrapper && titleWrapper.contains(headingLink)
      ),
      organicContainerCount: organicContainers.length,
      rootCount: 1,
      titleWrapperCount: titleWrappers.length,
      titleWrapperInsideOrganicContainer: Boolean(
        titleWrapper &&
          organicContainers[0] &&
          organicContainers[0].contains(titleWrapper)
      )
    });
    const ambiguous =
      !structure.eligible ||
      !headingLink ||
      resultPolicy.isResultContainerLink(block.getAttribute("role")) ||
      hasSecondaryInteractiveLinkCandidate(block, headingLink);
    const baseTarget = document.querySelector("base[target]");
    const effectiveTarget = headingLink
      ? headingLink.getAttribute("target") ||
        (baseTarget ? baseTarget.getAttribute("target") || "" : "")
      : "";
    const evidence = {
      accessibleName: headingLink ? accessibleNameFor(headingLink) : "",
      ambiguous,
      baseUrl: document.baseURI,
      connected: Boolean(headingLink && headingLink.isConnected),
      disabled: Boolean(headingLink && isDisabled(headingLink)),
      effectiveTarget,
      excludedContext: Boolean(
        block.hasAttribute("aria-label") ||
        hasUnsupportedExplicitRole(headingLink) ||
        hasBlockedContext(block)
      ),
      hasDownload: Boolean(headingLink && headingLink.hasAttribute("download")),
      headingCount: headings.length,
      hiddenBySemantics: Boolean(headingLink && hasHiddenSemantics(headingLink)),
      href: headingLink ? headingLink.getAttribute("href") || "" : "",
      inert: Boolean(headingLink && headingLink.closest("[inert]")),
      primaryLinkCount: headingLinks.length,
      rendered: Boolean(headingLink && isRendered(headingLink)),
      supportedRoot: root.contains(block),
      tabIndex: headingLink ? headingLink.tabIndex : -1
    };
    const classification = resultPolicy.classifyEvidence(evidence);

    return classification.eligible ? headingLink : null;
  }

  function candidatesInFreshOrder() {
    const root = supportedRoot();
    if (!root) {
      return [];
    }

    return Array.from(root.querySelectorAll(layoutAdapter.RESULT_BLOCK_SELECTOR))
      .map((block) => candidateFromBlock(root, block))
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
      supportedLocation: policy.isSupportedLocation(location),
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
    const neutralFocus = isNeutralDocumentFocus(activeElement);

    if (
      activeEligibleIndex < 0 &&
      (closestInPath(
        event,
        EDITING_OR_WIDGET_SELECTOR,
        resultPolicy.isEditingOrWidgetRole
      ) ||
        closestInPath(
          event,
          INTERACTIVE_OR_FOCUSABLE_SELECTOR,
          resultPolicy.isInteractiveRole
        ))
    ) {
      return;
    }

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

  document.addEventListener("keydown", onKeyDown, { passive: false });
  document.addEventListener("focusin", onFocusIn);
})();
