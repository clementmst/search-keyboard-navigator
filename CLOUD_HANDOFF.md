# Cloud handoff

## Objective

Continue building Search Keyboard Navigator into a safe private-test Chrome extension that lets a user move between ordinary organic Google Search result-title links with the keyboard.

## Current reviewed baseline

This repository contains the frozen Stage 1A baseline from local commit 5b26eb7. It has:
- Manifest V3 and only https://www.google.com/search* site access.
- No named API permissions, backend, accounts, telemetry, monetization, or external data transmission.
- 45 dependency-free static tests at the baseline.
- Governance, privacy, compliance, accessibility, research, and multi-agent role documents.
- Eleven project roles, read-only by default.
- Future optional privacy-minimizing telemetry is approved in principle but explicitly deferred.

## Immediate authorized task: bounded Stage 1B private-test adapter

Implement the narrowest fail-closed adapter that can identify ordinary organic desktop Google result-title links on a normal live https://www.google.com/search page. The user wants a meaningful install-and-test build without DevTools or synthetic DOM replacement.

Preserve:
- www.google.com/search only and no new permissions.
- Native Tab and Enter behavior.
- Editing, widget, modal, popover, ad/sponsored, carousel, rich-card, embedded-content, modified-key, IME, and assistive-technology exclusions.
- Predictable Arrow behavior with safe recovery and no universal-layout claim.
- No telemetry, backend, accounts, donations, support automation, marketing, Playwright, dependency installation, or publication in this pass.

Add focused fixtures and dependency-free tests. Produce PRIVATE_TEST.md with non-technical steps: load unpacked, use a fresh Chrome profile, make one non-personal query, test navigation, record pass/fail, and uninstall. Real Chrome observation is required evidence; do not claim it was run in cloud.

## Review gate

Before declaring ready, run independent engineering, accessibility, privacy/security, compliance, and product/test reviews. Lower-risk documentation refinements may be deferred, but genuine user-safety or privacy blockers must be fixed or escalated.

## User and operator decisions

- Publisher: individual in France.
- Intended audience: general public, not specifically directed at children under 16.
- Intended eventual release: worldwide Chrome Web Store.
- Monetization: free with optional donations later; no sale of user data; affiliate injection deferred/blocked.
- Support agent and address: later, approval-gated; no public outbound messages without user approval.
- Optional telemetry: later, opt-in and privacy-minimizing; never collect search queries, URLs, page content, account data, or browsing history.
- The main operator chat is the user interface. Escalate only material choices, new permissions/credentials, costs/dependencies, irreversible external actions, safety/privacy/compliance concerns, or human-only validation.

## Deferred backlog

Optional telemetry design and infrastructure; Chrome/assistive-technology evidence; worldwide store publication and policy artifacts; approval-gated support workflow; donation page/link; possible compliant marketing/SEO role; long-term cloud scheduler and concise operator recaps.
