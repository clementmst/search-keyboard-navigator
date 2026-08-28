(function installStage1APointerGuard() {
  "use strict";

  const key = "__sknStage1APointerGuard";
  const prior = globalThis[key];
  if (typeof prior === "function") {
    document.removeEventListener("click", prior, true);
  }

  const preventFixtureResultNavigation = (event) => {
    const origin = event.target instanceof Element ? event.target : null;
    const resultLink = origin ? origin.closest("main > article > a[href]") : null;
    if (resultLink && event.detail > 0) {
      event.preventDefault();
    }
  };

  document.addEventListener("click", preventFixtureResultNavigation, true);
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: preventFixtureResultNavigation
  });
})();
