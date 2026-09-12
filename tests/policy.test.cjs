"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const policy = require("../src/policy.js");

function move(overrides = {}) {
  return policy.decideMovement({
    activeEligibleIndex: -1,
    candidateCount: 3,
    key: "ArrowDown",
    neutralFocus: true,
    repeat: false,
    sessionActive: false,
    supportedLocation: true,
    ...overrides
  });
}

test("runtime scope is exact origin and pathname", () => {
  assert.equal(policy.isSupportedLocation({ origin: "https://www.google.com", pathname: "/search" }), true);
  assert.equal(policy.isSupportedLocation({ origin: "https://google.com", pathname: "/search" }), false);
  assert.equal(policy.isSupportedLocation({ origin: "https://www.google.com", pathname: "/search/" }), false);
  assert.equal(policy.isSupportedLocation({ origin: "https://www.google.com", pathname: "/" }), false);
  assert.equal(policy.isSupportedLocation({ origin: "https://www.youtube.com", pathname: "/" }), true);
});

function grid(columns, count = columns * 3) {
  return Array.from({ length: count }, (_, index) => ({
    left: (index % columns) * 240,
    top: Math.floor(index / columns) * 180,
    width: 220,
    height: 40
  }));
}

test("YouTube homepage vertical movement adapts to the rendered column count", () => {
  for (const columns of [1, 3, 4]) {
    const rects = grid(columns);
    assert.equal(policy.gridTargetIndex({ rects, activeEligibleIndex: 0, key: "ArrowDown" }), columns);
    assert.equal(policy.gridTargetIndex({ rects, activeEligibleIndex: columns, key: "ArrowUp" }), 0);
  }
});

test("YouTube homepage horizontal movement stays within the visual row", () => {
  const rects = grid(3, 8);
  assert.equal(policy.gridTargetIndex({ rects, activeEligibleIndex: 3, key: "ArrowRight" }), 4);
  assert.equal(policy.gridTargetIndex({ rects, activeEligibleIndex: 4, key: "ArrowLeft" }), 3);
  assert.equal(policy.gridTargetIndex({ rects, activeEligibleIndex: 5, key: "ArrowRight" }), -1);
});

test("YouTube homepage chooses the closest column in an incomplete row", () => {
  const rects = grid(4, 6);
  assert.equal(policy.gridTargetIndex({ rects, activeEligibleIndex: 3, key: "ArrowDown" }), 5);
  assert.equal(policy.gridTargetIndex({ rects, activeEligibleIndex: 5, key: "ArrowUp" }), 1);
});

test("any arrow activates the YouTube homepage grid and boundaries fail open", () => {
  const rects = grid(3, 6);
  const base = {
    activeEligibleIndex: -1, key: "ArrowDown", neutralFocus: true,
    rects, repeat: false, sessionActive: false, supportedLocation: true
  };
  for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
    const entry = policy.decideGridMovement({ ...base, key });
    assert.equal(entry.targetIndex, 0);
    assert.equal(entry.reason, "first");
  }
  assert.equal(policy.decideGridMovement({ ...base, activeEligibleIndex: 2, neutralFocus: false, key: "ArrowRight" }).cancelDefault, false);
});

test("viewport scrolling is symmetric and preserves room for the full title", () => {
  const base = { viewportHeight: 800, topRoom: 96, bottomRoom: 72 };
  assert.equal(policy.scrollDeltaForVisibility({ ...base, top: 40, bottom: 80 }), -56);
  assert.equal(policy.scrollDeltaForVisibility({ ...base, top: 710, bottom: 760 }), 32);
  assert.equal(policy.scrollDeltaForVisibility({ ...base, top: 120, bottom: 680 }), 0);
});

test("only unmodified arrows produce a direction", () => {
  assert.equal(policy.directionForKey("ArrowDown"), 1);
  assert.equal(policy.directionForKey("ArrowUp"), -1);
  assert.equal(policy.directionForKey("Tab"), 0);
  assert.equal(policy.directionForKey("Enter"), 0);
  assert.equal(policy.directionForKey("Escape"), 0);
  for (const modifier of ["ctrlKey", "metaKey", "altKey", "shiftKey"]) {
    assert.equal(policy.shouldIgnoreKeyboardEvent({ [modifier]: true }), true);
  }
  assert.equal(policy.shouldIgnoreKeyboardEvent({ getModifierState: (name) => name === "AltGraph" }), true);
  assert.equal(policy.shouldIgnoreKeyboardEvent({ defaultPrevented: true }), true);
  assert.equal(policy.shouldIgnoreKeyboardEvent({ isComposing: true }), true);
});

test("focus commit requires the exact connected eligible target on a supported route", () => {
  const valid = {
    focusStayedOnTarget: true,
    supportedLocation: true,
    targetConnected: true,
    targetStillEligible: true
  };
  assert.equal(policy.canCommitFocus(valid), true);
  for (const field of Object.keys(valid)) {
    assert.equal(policy.canCommitFocus({ ...valid, [field]: false }), false, field);
  }
  assert.equal(policy.canCommitFocus(null), false);
});

test("neutral ArrowDown starts at the first result and neutral ArrowUp is native", () => {
  assert.deepEqual(move(), {
    action: "move",
    cancelDefault: true,
    direction: 1,
    targetIndex: 0,
    reason: "first"
  });
  assert.equal(move({ key: "ArrowUp" }).reason, "boundary");
  assert.equal(move({ key: "ArrowUp" }).cancelDefault, false);
});

test("eligible native focus is the relative origin", () => {
  assert.equal(move({ activeEligibleIndex: 1, neutralFocus: false }).targetIndex, 2);
  assert.equal(move({ activeEligibleIndex: 1, neutralFocus: false, key: "ArrowUp" }).targetIndex, 0);
  assert.equal(move({ activeEligibleIndex: -1, neutralFocus: false }).reason, "unrelated-focus");
});

test("first and last boundaries fail open without wrapping", () => {
  const first = move({ activeEligibleIndex: 0, neutralFocus: false, key: "ArrowUp", sessionActive: true });
  const last = move({ activeEligibleIndex: 2, neutralFocus: false, sessionActive: true });
  assert.deepEqual([first.action, first.cancelDefault, first.reason], ["native", false, "boundary"]);
  assert.deepEqual([last.action, last.cancelDefault, last.reason], ["native", false, "boundary"]);
});

test("held repeats suppress only available movement owned by an active session", () => {
  const active = move({ activeEligibleIndex: 0, neutralFocus: false, repeat: true, sessionActive: true });
  const noSession = move({ activeEligibleIndex: 0, neutralFocus: false, repeat: true, sessionActive: false });
  const boundary = move({ activeEligibleIndex: 2, neutralFocus: false, repeat: true, sessionActive: true });
  assert.deepEqual([active.action, active.cancelDefault], ["suppress-repeat", true]);
  assert.deepEqual([noSession.action, noSession.cancelDefault], ["native", false]);
  assert.deepEqual([boundary.action, boundary.cancelDefault], ["native", false]);
});
