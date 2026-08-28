(function initializeResultPolicy(root, factory) {
  "use strict";

  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  Object.defineProperty(root, "SearchKeyboardNavigatorResultPolicy", {
    configurable: true,
    value: Object.freeze(api)
  });
})(globalThis, function createResultPolicy() {
  "use strict";

  // WAI-ARIA 1.2 concrete roles. Abstract roles are intentionally absent so
  // fallback token lists resolve to the first recognized non-abstract role.
  const CONCRETE_ARIA_ROLES = new Set([
    "alert",
    "alertdialog",
    "application",
    "article",
    "banner",
    "blockquote",
    "button",
    "caption",
    "cell",
    "checkbox",
    "code",
    "columnheader",
    "combobox",
    "complementary",
    "contentinfo",
    "definition",
    "deletion",
    "dialog",
    "directory",
    "document",
    "emphasis",
    "feed",
    "figure",
    "form",
    "generic",
    "grid",
    "gridcell",
    "group",
    "heading",
    "img",
    "insertion",
    "link",
    "list",
    "listbox",
    "listitem",
    "log",
    "main",
    "marquee",
    "math",
    "menu",
    "menubar",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "meter",
    "navigation",
    "none",
    "note",
    "option",
    "paragraph",
    "presentation",
    "progressbar",
    "radio",
    "radiogroup",
    "region",
    "row",
    "rowgroup",
    "rowheader",
    "scrollbar",
    "search",
    "searchbox",
    "separator",
    "slider",
    "spinbutton",
    "status",
    "strong",
    "subscript",
    "superscript",
    "switch",
    "tab",
    "table",
    "tablist",
    "tabpanel",
    "term",
    "textbox",
    "time",
    "timer",
    "toolbar",
    "tooltip",
    "tree",
    "treegrid",
    "treeitem"
  ]);
  const EDITING_OR_WIDGET_ROLES = new Set([
    "application",
    "button",
    "checkbox",
    "combobox",
    "dialog",
    "grid",
    "link",
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
    "switch",
    "tab",
    "tablist",
    "textbox",
    "toolbar",
    "tree",
    "treegrid",
    "treeitem"
  ]);
  const BLOCKED_RESULT_ROLES = new Set([
    "application",
    "button",
    "checkbox",
    "combobox",
    "dialog",
    "feed",
    "grid",
    "gridcell",
    "listbox",
    "menu",
    "menubar",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "navigation",
    "option",
    "radio",
    "radiogroup",
    "row",
    "scrollbar",
    "searchbox",
    "separator",
    "slider",
    "spinbutton",
    "switch",
    "tab",
    "tablist",
    "textbox",
    "toolbar",
    "tree",
    "treegrid",
    "treeitem"
  ]);
  const INTERACTIVE_ROLES = new Set([
    "button",
    "checkbox",
    "link",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "switch",
    "tab"
  ]);

  function parseHttpUrl(href, baseUrl) {
    try {
      const parsed = new URL(href, baseUrl);
      return parsed.protocol === "http:" || parsed.protocol === "https:"
        ? parsed
        : null;
    } catch {
      return null;
    }
  }

  function isAllowedTarget(target) {
    const normalized = String(target || "").trim().toLowerCase();
    return normalized === "" || normalized === "_self";
  }

  function effectiveAriaRole(roleValue) {
    const tokens = String(roleValue || "").trim().toLowerCase().split(/\s+/);
    return tokens.find((token) => CONCRETE_ARIA_ROLES.has(token)) || "";
  }

  function roleRequiresKeyboardGuard(evidence, roles) {
    const role = effectiveAriaRole(evidence.explicitRole);
    if (!roles.has(role)) {
      return false;
    }

    return role !== "separator" || Boolean(evidence.hasTabIndex);
  }

  function isBlockedResultRole(evidence) {
    return roleRequiresKeyboardGuard(evidence, BLOCKED_RESULT_ROLES);
  }

  function isEditingOrWidgetRole(evidence) {
    return roleRequiresKeyboardGuard(evidence, EDITING_OR_WIDGET_ROLES);
  }

  function isInteractiveRole(evidence) {
    return INTERACTIVE_ROLES.has(effectiveAriaRole(evidence.explicitRole));
  }

  function isResultContainerLink(roleValue) {
    return effectiveAriaRole(roleValue) === "link";
  }

  function isUnsupportedPrimaryRole(roleValue) {
    const role = effectiveAriaRole(roleValue);
    return Boolean(role && role !== "link");
  }

  function isSecondaryInteractiveLinkCandidate(evidence) {
    if (evidence.isPrimary) {
      return false;
    }

    const effectiveRole = effectiveAriaRole(evidence.explicitRole);
    if (effectiveRole === "link") {
      return true;
    }

    return (
      String(evidence.tagName || "").toLowerCase() === "a" &&
      (Boolean(evidence.hasHref) ||
        Boolean(evidence.hasTabIndex) ||
        Boolean(effectiveRole))
    );
  }

  function classifyEvidence(evidence) {
    if (!evidence.supportedRoot) {
      return { eligible: false, reason: "unsupported-root" };
    }

    if (!evidence.connected || !evidence.rendered) {
      return { eligible: false, reason: "not-perceivable" };
    }

    if (
      evidence.hiddenBySemantics ||
      evidence.inert ||
      evidence.disabled ||
      evidence.excludedContext ||
      evidence.ambiguous
    ) {
      return { eligible: false, reason: "excluded-or-ambiguous" };
    }

    if (evidence.headingCount !== 1 || evidence.primaryLinkCount !== 1) {
      return { eligible: false, reason: "noncanonical-title" };
    }

    if (!evidence.accessibleName || evidence.tabIndex < 0) {
      return { eligible: false, reason: "not-sequentially-focusable" };
    }

    if (evidence.hasDownload || !isAllowedTarget(evidence.effectiveTarget)) {
      return { eligible: false, reason: "unsupported-activation" };
    }

    const url = parseHttpUrl(evidence.href, evidence.baseUrl);
    if (!url) {
      return { eligible: false, reason: "unsafe-url" };
    }

    return { eligible: true, reason: "eligible", url: url.href };
  }

  return {
    classifyEvidence,
    effectiveAriaRole,
    isAllowedTarget,
    isBlockedResultRole,
    isEditingOrWidgetRole,
    isInteractiveRole,
    isResultContainerLink,
    isSecondaryInteractiveLinkCandidate,
    isUnsupportedPrimaryRole,
    parseHttpUrl
  };
});
