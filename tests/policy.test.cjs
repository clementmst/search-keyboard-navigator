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
