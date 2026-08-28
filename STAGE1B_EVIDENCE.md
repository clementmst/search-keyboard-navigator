# Bounded Stage 1B private-test evidence

## Scope and classification

The operator explicitly authorized the immediate task in `CLOUD_HANDOFF.md`.
This is autonomy-policy Class B repository-local work: it retains the single
`https://www.google.com/search*` static match, adds no named API permission,
dependency, storage, network, telemetry, publication, or external action, and
does not implement any deferred backlog item.

## Implemented contract

Adapter `google-desktop-organic-2026-08-v1` requires exactly one `#search #rso`
root. Only direct `.MjjYud` children can be considered. Each candidate block must
contain exactly one `.g`, one `.yuRUbf` inside that organic container, and exactly
one title link associated with one `h3` inside the wrapper. Any secondary
interactive link makes the block ambiguous.
The existing URL, accessible-name, rendering, focusability, target, disabled,
role, overlay, keyboard-context, and action-time focus revalidation controls still
apply. Blocks containing sponsored markers, tables, carousels, rich components,
navigation, or ambiguous headings fail closed. Unknown layouts return no
candidates; this is expected safe behavior, not a compatibility failure.

No mutation observer was added. Every potential extension-owned movement freshly
enumerates the root and blocks, and focus is followed by a second fresh
enumeration before the session commits. A removed/replaced/ineligible selected
node therefore clears the session without semantic replacement or focus transfer.

## Evidence boundary

Dependency-free tests cover the adapter's positive contract and mutations of each
required signal. Synthetic fixtures cover two ordinary title blocks and excluded
sponsored/rich/ambiguous blocks. Static checks retain the manifest, no-network,
no-storage, no unsafe-sink, no Enter/Tab synthesis, no ARIA/tab-order rewrite,
and exact post-focus-revalidation tripwires.

These checks do **not** execute a DOM, trusted input, Chrome extension load, live
Google page, visual state, accessibility tree, speech output, or assistive
technology. No real Chrome observation was performed in the cloud. Follow
`PRIVATE_TEST.md` and record only the bounded pass/fail fields.

Independent engineering/product/test, accessibility, and privacy/security plus
compliance reviews initially found title-link counting, secondary-link ambiguity,
and container-relationship blockers. The reviewed correction derives the actual
associated link set, restores production secondary-link rejection, enforces
wrapper containment, and adds minimal regression fixtures/checks. The final
review status is recorded with the deterministic test result below.

After correction, all three independent review tracks reported no remaining
blocker for the bounded unpublished private-test build. Engineering/product/test,
accessibility, and privacy/security/compliance reviewers separately retained the
human real-Chrome observation and candid AT/runtime evidence limits. The final
dependency-free run completed 60 tests with 60 passes, 0 failures, and 0 skips.

## Remaining risk and gate status

Google DOM structures drift and the adapter can safely become inert. A structure
that imitates all positive signals could still be misclassified; the exclusion
list is defense in depth, not a universal taxonomy. Unmodified arrows retain the
known scrolling and assistive-technology conflict. Private observation remains
necessary, and public release, Store preparation, telemetry, broader layouts,
browser automation, and accessibility qualification remain deferred and blocked
at their existing gates.
