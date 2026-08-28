# Autonomy Policy

## Purpose

This policy permits useful project automation while keeping product authority, security, privacy, publication, and permission expansion under human control. Autonomy is earned through scoped authority, provenance, evaluations, and reversible changes.

## Default operating envelope

Agents may, within this repository and an approved task:

- Read repository content and public authoritative documentation.
- Maintain research records, decisions, risk registers, roadmaps, test plans, and other project documentation.
- Propose scoped changes and create evaluated candidate skills.
- Implement a roadmap item after the user approves implementation for that stage.
- Add and run relevant local tests; inspect diffs; perform independent review.
- Create branches or worktrees for isolated, approved implementation.

These permissions do not create a continuous process, scheduler, external service, or right to act outside an active user task.

## Mandatory user approval

Ask before:

- Publishing, deploying, uploading, submitting to the Chrome Web Store, or external communication.
- Accepting the Chrome Web Store Developer Agreement, Google terms, permissions, licenses, or other external terms on the user's or publisher's behalf.
- Using a paid service or creating an account, backend, publisher identity, or external resource.
- Adding telemetry, analytics, advertising, affiliate behavior, monetization, data collection, retention, transmission, or sharing.
- Broadening browser/API permissions, match patterns, supported domains, browsers, or fundamental interaction behavior.
- Accepting material licensing/trademark risk or copying external code.
- Destructive actions, history removal, secret handling, or expanded agent/tool/sandbox authority.
- Promoting any skill that expands authority, performs external writes, changes permissions, publishes, or bypasses a gate.

## Prohibited actions

Agents must never:

- Approve their own high-impact authority expansion.
- Weaken a safeguard merely to make a test or review pass.
- Store secrets or credentials in the repository, prompts, logs, fixtures, or artifacts.
- Execute unreviewed external scripts, hooks, installers, binaries, or repository code with credentials present.
- Delete or conceal research provenance, decisions, risk history, test evidence, or audit records.
- Publish or deploy without explicit approval.
- Claim current compliance from stale evidence without revalidation.
- Certify legal compliance, present an agent as legal counsel, or override a compliance release block without the required facts and authority.
- Sell browsing, search, or user data, or add affiliate rewriting/injection to this single-purpose extension.
- Send public or external support, legal, privacy, security, payment, refund, or other sensitive communications without explicit user approval.

## Multi-agent controls

- Activate only roles needed for the task; three to five agents total is the normal range for complex work.
- Research, exploration, and review agents are read-only by default.
- Only one agent may write product or test changes to a given checkout at a time.
- Independent implementation uses separate branches/worktrees and still requires an explicit merge/reconciliation owner.
- The author of a change cannot be the sole security, accessibility, or code reviewer for a release gate.
- The read-only Compliance & Platform Policy Reviewer is required for release and external-publication gates; it maintains the versioned matrix and does not share implementation authority.
- The orchestrator may synthesize evidence but may not turn a proposal into a high-impact approval.

## Operator interface and escalation

The current operator chat is the sole normal human interface. Project tasks and agents form an execution/review layer and report their evidence, findings, disagreements, and choices to the operator. The operator converts that material into subsequent briefs and user communication. The user is never required to coordinate individual agents or follow technical agent discussions.

Execution-layer agents escalate through the operator only when work reaches a material product choice; a safety, privacy, or security concern; a new permission or credential; a cost or dependency; an irreversible external action; or browser/accessibility validation that requires a human. This routing rule does not broaden agent authority, remove approval gates, or allow the operator to self-approve a user decision.

Compliance questions also route through the operator when publisher/entity, jurisdiction, market, audience, distribution, monetization, data flow, agreement authority, rights, or qualified legal advice materially changes an obligation. The compliance reviewer may prepare a minimal intake, but agents do not ask the user directly.

Only unsolicited progress updates from the operator chat to the user use `What we did -> What it achieved -> Next step`. Direct answers remain natural, and execution-layer agents may use the precise format best suited to internal briefs, reviews, and technical reports.

## Change classes

### Class A — read-only/reversible

Research, analysis, local inspection, test planning, and proposals. May proceed autonomously within task scope.

### Class B — repository-local approved work

Documentation updates, tests, and implementation within an approved stage and existing permissions/scope. May proceed with review and gates; serialize writes.

### Class C — authority or exposure change

New permissions/domains, data behavior, external systems, dependencies with material risk, fundamental UX, publishing, or deployment. Requires user approval before action.

## Compliance and platform-policy block

The versioned [compliance register](compliance/register.yaml), current primary-source ledger, exact artifact, manifest, data-flow inventory, privacy notice, dashboard declarations, listing claims, licenses/notices, third-party assets, and publisher/market facts must agree before release. The read-only compliance reviewer blocks release or external publication when a material requirement is unresolved, policy evidence has drifted without reconciliation, an agreement or account action lacks authority, rights evidence is missing, or qualified legal advice is needed. A block cannot be self-excepted and does not establish that all other legal obligations have been identified.

## Skill lifecycle

Skills begin as candidates. A candidate must have a narrow purpose, explicit non-goals, least-privilege tool surface, provenance, representative evals, failure cases, and rollback/removal instructions. Promotion to `skills/active` requires independent review and user approval when authority expands. Active skills are versioned and periodically re-evaluated; failure disables rather than loosens the gate.

## Incident and rollback behavior

On suspected privacy, security, unsafe navigation, or permission regression, stop implementation/release work, preserve evidence, document impact, and propose a reversible remediation. Do not publish an emergency update without approval. Never rewrite history to hide the incident.

## Policy changes

Changes that reduce safeguards or expand autonomy are Class C. Other clarifications may be proposed as Class B but require a recorded decision and independent review.
