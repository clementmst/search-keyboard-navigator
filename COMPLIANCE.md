# Compliance and Platform Policy

## Status and limits

This is a versioned engineering compliance register, not legal advice and not a certification that ArrowKey Search Navigator (formerly Search Keyboard Navigator) complies with law or platform policy. The dedicated Compliance & Platform Policy Reviewer is read-only and is a required release-gate reviewer. It reports evidence and unresolved choices through the project orchestrator/operator interface.

The initial assessment was reviewed on 2026-08-28 and Store-preparation sources and gaps were refreshed on 2026-08-31 against [research/sources.yaml](research/sources.yaml) and [compliance/register.yaml](compliance/register.yaml). Requirements that depend on developer identity, jurisdiction, launch market, publication method, or future product behavior remain unresolved. A release or external publication is blocked if a material item is unresolved, a drift-prone policy has not been rechecked, or qualified legal advice is required.

## Confirmed project facts

- Version 0.1.1 is publicly listed in the Chrome Web Store following user-operated account setup, submission, review, and publication. The current 0.1.2 rename and discovery materials remain local drafts until separately submitted or deployed.
- The manifest has one static content-script match, `https://www.google.com/search*`, plus narrower runtime origin/path/layout guards. It has no named Chrome API permissions or separate host permissions.
- Current source has no account, backend, analytics, telemetry, advertising, monetization, persistent storage, extension network activity, remote configuration, or remotely hosted executable code.
- Current behavior necessarily inspects the page URL and result DOM locally and ephemerally. Project wording does not call that “no data handling.”
- The extension contains no package-manager manifest, lockfile, runtime dependency, or copied third-party code. The proposed GitHub Pages workflow separately references four official GitHub Actions by the major-version tags shown in GitHub's current Pages example; this external CI supply-chain surface must be reviewed again before activation. Original generated icon and promotional assets have recorded prompts and provenance. Synthetic fixtures contain no real queries or result pages. Three user-supplied live Google Search screenshots are preserved; the user reports that selected screenshots were used for public version 0.1.1, but their third-party rights are not certified and the political candidate remains prohibited from future submission under the recorded Google Search screenshot guidance.
- Native `Tab`, `Shift+Tab`, and Enter behavior is not intercepted or reimplemented. The unmodified-arrow interaction is still an experiment and has no accessibility-compliance claim.

These are repository facts, not conclusions about every runtime, distribution channel, law, or future artifact.

## User-supplied facts and preferences

Recorded 2026-08-28; unanswered details remain unknown rather than inferred.

- The intended publisher is an individual in France, publishing personally, who states they have authority to accept agreements.
- Version 0.1.1 is publicly available through the Chrome Web Store. The intended availability remains worldwide; version 0.1.2 has not yet been submitted.
- The intended audience is the general public, and the product will not be specifically directed at children under 16.
- Optional privacy-minimized first-party analytics is the chosen future direction, but no categories, purpose, lawful basis/consent, retention, processors, infrastructure, or implementation authority exists. It is deferred and must not delay private testing, so current Stage 1B remains local-only and backend-free.
- The preferred operation is simple, mostly non-commercial, ideally free and cash-neutral. Donations are desired. Data sales and affiliate links were mentioned as possibilities, not approved features.
- Google and Chrome may be referenced only to explain compatibility/availability in marketing, not in the product name.
- Open source may be used or adapted only when the exact license permits the intended use and every obligation is satisfied; otherwise the project may study concepts and implement independently without copying protected code.
- The public support/privacy address is `searchkeyboardnavigator.support@gmail.com`. The user confirmed forwarding and send-as replies through a personal Gmail inbox controlled by the same developer. No project agent has mailbox access or permission to send externally. No fixed automatic deletion schedule is configured; the public policy discloses the current support-message handling and deletion approach.
- No external legal counsel is planned. The project compliance agent is an AI assistant, not licensed counsel, and cannot certify compliance or eliminate unresolved legal risk.

## Provisional risk defaults

These are conservative project controls, not legal conclusions:

1. Keep current Stage 1B local-only and backend-free. Telemetry remains a future user choice governed by [TELEMETRY_DECISION.md](TELEMETRY_DECISION.md); do not add accounts, analytics, telemetry, queries, URLs, page content, identifiers, crash uploads, or other product-improvement data without a complete separate design and explicit authorization.
2. Never sell browsing, search, or user data. Chrome Limited Use prohibits transfer or sale to data brokers and similar third parties, and an EU/worldwide data-sale model would create disproportionate privacy and trust risk.
3. Treat affiliate-link rewriting, injection, codes, and cookies as blocked for this extension. The current Store policy requires prominent disclosures, a related user action for every inclusion, and a direct transparent benefit tied to core functionality; the current product supplies no such affiliate benefit and must retain one narrow purpose.
4. If later authorized, prefer an optional clearly labelled external donation link with no feature gating, nagging, deceptive placement, or payment-card handling by the extension. Provider terms, platform placement, publisher/donor jurisdiction, tax, consumer, privacy, payment, and Store requirements must be reviewed first.
5. Compare no telemetry, privacy-minimized first-party analytics, and third-party analytics before any authorization. The privacy-first recommendation is no telemetry for v1; if collection is later selected, prefer explicit opt-in, first-party control, a stated improvement purpose, no raw search terms/full URLs/page content/stable identifiers, and documented lawful basis/consent, retention/deletion, security, processors, transfers, user rights, and Store disclosures before implementation.
6. A future agent may triage or draft support messages only after mailbox ownership, access, retention, privacy, and approval controls exist. It may not autonomously make legal commitments, accept agreements, disclose user data, issue refunds, or send sensitive responses.
7. Material unresolved legal questions block public release unless resolved by authoritative evidence or qualified advice. If the user later chooses to accept a clearly stated residual risk without outside counsel, that human decision must be recorded, but it cannot waive Store policy, law, third-party rights, or a non-exceptable safety/privacy requirement.

## Initial gap assessment

### Likely applicable at Chrome Web Store preparation or publication

- The Chrome Web Store single-purpose, minimum-permission, accurate-listing, deceptive-behavior, user-data disclosure, Limited Use, security, and remote-code rules must be rechecked against the exact artifact and listing. A static content-script match is site access even without named API permissions.
- Local-only inspection still handles website content and browsing activity under the Store's published user-data guidance. The privacy policy, prominent disclosure, dashboard answers, and listing must accurately state transient local processing and zero retention, transmission, sale, sharing, analytics, or advertising.
- Web Store publication would require an authorized publisher to use an eligible Google account and accept the then-current Developer Agreement and incorporated terms. No agent may accept them.
- Google Terms apply to use of Google services. The extension must not misrepresent its origin or affiliation, misuse Google content or brand elements, or introduce prohibited automated access. The current general terms prohibit automated access contrary to machine-readable instructions, while Google's live `robots.txt` disallows `/search`; official text does not expressly resolve a local extension that only moves focus on a page loaded by a human. That ambiguity blocks public release pending qualified review or authoritative clarification.
- Objective claims such as “accessible,” “privacy-preserving,” “works on Google Search,” or “never selects ads” require evidence matching their scope. Listing limitations must be conspicuous and must not imply Google endorsement.
- Accessibility law depends on the developer, offering, market, and use context. WCAG 2.2 remains the project quality baseline, but it is not a legal-compliance certification and does not replace human assistive-technology evidence.
- An EU-facing release also needs qualified assessment of GDPR roles and territorial scope, ePrivacy installation/storage treatment, provider-identity disclosures, and whether the General Product Safety Regulation applies to this software and distribution model.
- Open-source license/notice and third-party asset/data-rights review must run on the exact release artifact, listing screenshots, icons, copy, and provenance even though the current tree has no identified third-party dependency or production asset.

### Not currently active in the current 0.1.2 source tree

- Chrome Web Store account, agreement, and initial publication steps were completed by the user for version 0.1.1. No agent has account access, and the current 0.1.2 update has not been uploaded or submitted; exact artifact and listing review still apply before that human action.
- Telemetry, advertising, affiliate, payment, cookie, cross-device sync, sale, and data-sharing controls have no active feature to govern because those behaviors are absent. Any addition reopens privacy, consumer, permission, and approval review before implementation.
- Third-party software notice obligations are not currently triggered by a dependency or copied code because none is present. This is a repository observation, not a permanent exemption.
- Google brand-asset permission is not currently needed for the original icon or abstract promotional tile because neither uses Google marks or interface content. A real Google Search screenshot is still required by the Store and its branding, third-party-content, and privacy treatment remains unresolved.

### Remaining facts requiring operator/user decision

1. Who will perform private testing, in which countries, and whether real personal/account-based queries, screenshots, logs, or shared builds will be used.
2. The future privacy-minimized first-party telemetry proposal and its complete purpose, events, consent/lawful basis, identifiers, retention, processors, infrastructure, international transfers, security, rights, permissions, and disclosures; current code remains no-telemetry until separately authorized.
3. Intended donation provider and France/worldwide payment, tax, consumer, privacy, and Store placement analysis when the post-live donation task begins.
4. Public privacy-policy URL, any required publisher/controller identity details, exact Store listing/assets/claims, and whether authoritative clarification or qualified advice will be obtained for release-blocking legal ambiguities.

The operator should obtain these answers using [COMPLIANCE_INTAKE.md](COMPLIANCE_INTAKE.md) only at the relevant testing or distribution gate; execution-layer agents do not question the user directly.

## Release-blocking rules

The compliance reviewer must block release or external publication when any of these conditions exists:

- A material row in [compliance/register.yaml](compliance/register.yaml) is `unresolved` or `legal-review-required` for the intended developer, market, data flow, artifact, or distribution method.
- The Chrome Web Store Developer Agreement, Program Policies, enforcement notice, Google Terms, service-specific terms, or applicable law has changed since its recorded review and has not been reconciled.
- Manifest permissions, runtime data flow, artifact, privacy notice, dashboard declaration, listing, screenshots, accessibility statements, or marketing claims disagree.
- An agreement would have to be accepted, credentials or an account accessed, rights obtained, or an external communication made without the user's specific authority.
- A dependency, copied code, asset, screenshot, brand element, or data source lacks reviewed provenance, license, notice, or permission.
- The available evidence cannot substantiate an objective privacy, security, accessibility, compatibility, or performance claim.
- A proposal would sell browsing/search/user data, add affiliate rewriting/injection to this single-purpose product, or implement telemetry, donations, payment, marketing automation, or support-email automation without its separately approved design and review.

## Review procedure

1. Record the intended developer/entity, markets, users, distribution, monetization, and exact data-flow/artifact facts.
2. Re-open each drift-prone primary source; record access date, version/change date when available, applicability reasoning, conflict, and evidence in the source ledger and compliance register.
3. Compare the exact manifest, source, dependency/license inventory, artifact, privacy notice, dashboard answers, listing copy, screenshots, support plan, and test claims.
4. Mark each row `satisfied`, `not-applicable`, `unresolved`, or `legal-review-required`, with evidence and reasoning. “Satisfied” is an internal gate result, not legal certification.
5. Have an independent read-only compliance review report blockers through the operator. Publication remains a separate user-approved action.

## Change monitoring

Recheck this assessment at every release candidate; before Store asset or dashboard work; after a Chrome Web Store or Google policy/enforcement notice; after any permission, domain, dependency, data-flow, claim, monetization, market, entity, distribution, or asset change; and at least every 90 days while preparing a release. Preserve superseded entries rather than erasing history.
