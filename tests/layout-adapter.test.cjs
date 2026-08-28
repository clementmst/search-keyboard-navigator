"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const adapter = require("../src/layout-adapter.js");

const canonical = {
  blockIsDirectChild: true,
  excludedModule: false,
  headingCount: 1,
  headingInsideTitleWrapper: true,
  headingLinkCount: 1,
  headingLinkInsideTitleWrapper: true,
  organicContainerCount: 1,
  rootCount: 1,
  titleWrapperCount: 1,
  titleWrapperInsideOrganicContainer: true
};

test("adapter is explicitly versioned and uses a narrow desktop structure", () => {
  assert.equal(adapter.ADAPTER_ID, "google-desktop-organic-2026-08-v1");
  assert.equal(adapter.RESULT_ROOT_SELECTOR, "#search #rso");
  assert.equal(adapter.RESULT_BLOCK_SELECTOR, ":scope > .MjjYud");
  assert.deepEqual(adapter.classifyStructure(canonical), {
    eligible: true,
    reason: "supported-organic-title"
  });
});

for (const [name, change, reason] of [
  ["missing root", { rootCount: 0 }, "unknown-layout"],
  ["duplicate root", { rootCount: 2 }, "unknown-layout"],
  ["nested block", { blockIsDirectChild: false }, "noncanonical-block"],
  ["missing organic marker", { organicContainerCount: 0 }, "noncanonical-block"],
  ["duplicate organic marker", { organicContainerCount: 2 }, "noncanonical-block"],
  ["missing title wrapper", { titleWrapperCount: 0 }, "noncanonical-block"],
  ["duplicate title wrapper", { titleWrapperCount: 2 }, "noncanonical-block"],
  ["duplicate heading", { headingCount: 2 }, "ambiguous-title"],
  ["unlinked heading", { headingLinkCount: 0 }, "ambiguous-title"],
  ["heading outside wrapper", { headingInsideTitleWrapper: false }, "ambiguous-title"],
  ["link outside wrapper", { headingLinkInsideTitleWrapper: false }, "ambiguous-title"],
  ["wrapper outside organic container", { titleWrapperInsideOrganicContainer: false }, "noncanonical-block"],
  ["excluded module", { excludedModule: true }, "excluded-module"]
]) {
  test(`adapter fails closed for ${name}`, () => {
    const actual = adapter.classifyStructure({ ...canonical, ...change });
    assert.equal(actual.eligible, false);
    assert.equal(actual.reason, reason);
  });
}
