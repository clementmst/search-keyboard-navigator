# Evaluations

Evaluations determine whether agents, skills, product behavior, and release evidence are trustworthy enough to advance. They do not grant authority by themselves.

## Initial suites

1. **Product behavior:** scenarios derived from `ACCEPTANCE_TEST_MATRIX.md`, including discovery, neutral/native-focus entry, search-input exit, scrolling loss, boundaries, recovery, and perceived effort. Stage 1A must try to falsify always-on arrows rather than merely demonstrate them.
2. **Result classification:** balanced positive, negative, ambiguous, drifted-class, localized, interstitial, and adversarial DOM cases with independently reviewed sidecar oracles, minimal pairs, irrelevant-markup randomization, and signal-removal tests. Report false-positive and false-negative rates separately. Any ad/unrelated-link false positive is release-blocking; unknown layouts must yield zero.
3. **Keyboard safety:** event matrices across targets, composed paths, modifiers, composition, cancellation, repeat, boundaries, and focus transitions.
4. **Accessibility:** separate focus/AX-tree assertions from structured manual AT speech/key-delivery/cursor evidence, forced-color, zoom, and sticky-header checks.
5. **Security/privacy:** unsafe URL/DOM, clobbering, forged-marker, mutation-DoS, network/storage, remote-code, and artifact-leak checks.
6. **Agent/skill behavior:** representative tasks, forbidden-action probes, approval-boundary tests, provenance quality, and failure/rollback behavior.

## Eval case schema

Each case records ID, purpose, risk/control mapping, fixture/version, preconditions, inputs, allowed tools/authority, expected outcome, forbidden outcomes, scoring rule, determinism notes, and evidence retention policy.

## Promotion rules

- Establish a baseline before changing prompts, skills, selectors, or architecture.
- Use held-out cases for promotion; do not tune only to known fixtures.
- Record model/tool/version and commit to make results interpretable.
- Averages cannot hide safety failures. Permission, publication, data-leak, unsafe-navigation, ad-selection, or destructive-action violations are hard failures.
- Require independent review for material promotions.
- On regression, disable or revert the candidate; never relax the oracle just to pass.

## Candidate skill evaluation

A candidate skill needs at least five representative success cases, three ambiguity/edge cases, and three forbidden-action cases, including one approval-boundary case and one untrusted-content case. Authority-expanding skills require user approval even after passing.

The explicit exploratory product-value decision rules for the current experiment are in [STAGE1A_USER_VALUE_PROTOCOL.md](STAGE1A_USER_VALUE_PROTOCOL.md). No automated DOM/browser eval harness is authorized; implementing one remains a separate approval decision.
