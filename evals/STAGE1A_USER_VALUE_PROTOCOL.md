# Stage 1A user-value evaluation protocol

Status: protocol only; not executed. It evaluates the unmodified-arrow interaction hypothesis and grants no implementation, recruitment, external-communication, browser-automation, or Stage 1B authority.

## Question and limits

Can a keyboard-oriented user reach the result-navigation behavior after a realistic search, learn it from one short instruction, recover native behavior, avoid accidental actions, and understand fail-open boundaries?

This is a small exploratory decision protocol, not statistically representative usability research. Unaided discovery is recorded separately: Stage 1A has no onboarding surface, so it cannot claim that users will discover the keys unaided. An onboarding or explicit-mode design would be a separate product decision.

## Participants and environment

- Minimum exploratory set: five keyboard-oriented testers using fresh, signed-out Chrome profiles; include two regular screen-reader users if those environments are available.
- Do not recruit or contact external participants without separate approval. Internal/available testers may run the protocol.
- Use only the fixed non-personal query and synthetic fixtures in `MANUAL_TESTING.md`.
- Record aggregate outcomes only: no names, account state, queries, page dumps, audio/video, cookies, or identifying telemetry.
- Record Chrome/OS/AT versions and mark unavailable environments **not run**, never passed.

## Sessions

### A. Reachability and unaided diagnostic

1. Start from the real fixed-query submission flow without coaching about extension keys.
2. Ask: “Using only the keyboard, move to the second ordinary result.”
3. Allow 30 seconds; record the post-search focus category, first keys attempted, whether the behavior was reached, task completion, accidental action, and whether the tester became trapped.
4. Treat failure to discover arrows as an expected diagnostic of the no-onboarding design, not as an instructed-learnability failure.

### B. Instructed learnability

Give exactly one instruction: “On supported results, Up and Down move between result titles; Tab remains normal; Escape ends extension navigation.” Do not provide further coaching.

Ask the tester to move first-to-third-to-second, then continue with native Tab. Record first-attempt completion, wrong result, repeated key flooding, unexpected scroll, extra instruction, elapsed band (`<15 s`, `15–30 s`, `>30 s`), and confidence (`clear`, `uncertain`, `incorrect`).

### C. Recovery and native behavior

From an active middle result, ask the tester to return to ordinary page scrolling and then resume normal Tab navigation. Test both Escape and Tab exits in counterbalanced order. Record focus destination, scroll availability, focus visibility, traps, and whether prior focus restoration was expected or surprising.

### D. Accidental-action and non-interference probe

Repeat arrows while the search input, textarea, select, contenteditable, representative widgets, popover/dialog, and unrelated controls own focus; also try modified arrows and held repeats. Record any extension focus move, navigation, activation, cancelled native behavior, unexpected scroll, or stale indicator. Any accidental activation, focus theft from an excluded context, or keyboard trap is a hard failure.

### E. Boundary comprehension

Move to the first and last results and press the unavailable-direction arrow. Without explaining the rule, ask what happened and what another press will do. Record whether the tester identifies no wrapping, notices focus versus page scroll, understands that focus/session remain, and can recover. Do not count an answer as correct merely because the tester eventually reads the specification.

## Decision rules

These pilot thresholds are explicit project stopping rules, not population estimates:

- **Reject the current interaction recommendation immediately** after any accidental activation, excluded-context focus theft, keyboard trap, unsafe focus restoration, or repeated uncontrollable movement.
- **Revise** if realistic search entry leaves the feature unreachable without manufacturing neutral focus; fewer than four of five testers complete instructed movement on the first attempt; more than one of five cannot recover native behavior; more than one of five materially misunderstands a boundary; or a claimed AT mode does not deliver the keys.
- **Eligible for an “advance” recommendation only** if every safety rule passes, at least four of five complete instructed movement, at least four of five recover without coaching, at least four of five understand boundaries, and the required branded-Chrome/available-AT technical matrix separately passes.
- Never claim unaided discoverability from Stage 1A. Any release path needs an approved onboarding, explicit-mode, or other discovery solution plus its own evaluation.

## Evidence record

For each session record an anonymous tester number, environment/version, AT mode if any, entry focus category, task outcomes, elapsed bands, errors, recovery route, boundary explanation category, stopping-rule result, and sanitized notes. Preserve aggregate counts and disagreements beside `STAGE1A_MANUAL_RESULTS.md`; do not store raw browsing content or personal data.
