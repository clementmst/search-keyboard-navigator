# Telemetry Decision Gate

## Current status

The user has selected **optional privacy-minimized first-party analytics as the future direction**, but its design and implementation are deferred and not authorized in this pass. It must not delay the private test build. Stage 1A remains exactly as implemented: local-only page processing, no analytics or telemetry, no identifiers, no backend, no extension network activity, and no accounts.

The publisher is an individual in France and intends worldwide public Chrome Web Store availability. That makes the French GDPR/ePrivacy analysis a baseline and adds the laws and transfer rules of other launch markets. Chrome Web Store user-data, disclosure, Limited Use, permission, and single-purpose rules apply independently of whether a practice is lawful.

## Plain-language terms

- **Local processing:** code reads or changes information only on the user's device; the developer does not receive it. The current result-link detection is local processing.
- **Analytics:** organized measurement used to understand how people use a product, such as feature counts, failures, or retention.
- **Telemetry:** automatically generated diagnostic or usage events sent from the extension to the developer or a service. Analytics can be built from telemetry.
- **Identifier:** a value that singles out or links a device, installation, session, or person, even if it is random rather than a name.
- **Personal data:** information relating to an identified or reasonably identifiable person. IP addresses, persistent identifiers, timestamps, and event combinations can be personal data.
- **Sensitive browsing/search data:** queries, full URLs, result text, page content, and detailed event sequences that can reveal health, politics, religion, sexuality, finances, location, or other private interests.
- **Opt-in:** collection stays off until a user makes a clear affirmative choice after understandable disclosure.
- **Opt-out:** collection starts by default and the user must turn it off.
- **Retention:** how long raw events, identifiers, logs, backups, and aggregates remain before deletion or irreversible anonymization.
- **Processor:** a vendor that handles personal data for the publisher, such as hosting, logging, analytics, support, or database providers; a contract does not remove the publisher's duties.
- **International transfer:** personal data becomes available outside the EU/EEA or to a provider subject to another country's access regime, requiring a lawful transfer mechanism and assessment.

## Options

| Option | Product impact | Privacy and compliance burden | Reversibility |
|---|---|---|---|
| **A. No telemetry** | Improvement relies on deterministic tests, manual browser/AT evidence, voluntary support reports, and small user studies. Learning is slower and less representative, but bugs cannot leak search activity to the publisher. | Lowest burden: no analytics backend, processor, telemetry consent, telemetry retention, event-level rights workflow, or transfer mechanism. Store disclosures must still explain local page processing and site access. | High. A later separately approved design can add telemetry, but historical data cannot be recovered. |
| **B. Privacy-minimized first-party analytics** | Coarse counts can show whether core navigation works and where sessions fail, improving prioritization. It adds onboarding/settings UI, network failure modes, backend operations, and data-quality limits because opt-in samples are incomplete. | Material burden: defined purpose and events, opt-in/default-off choice, privacy notice, Chrome disclosures and consent treatment, permission/network review, controller record, processor contracts, security, retention/deletion, rights handling, server-log/IP controls, breach response, and transfer analysis. | Medium. Collection can be switched off and infrastructure removed, but data already received must follow retention/deletion duties. |
| **C. Third-party analytics** | Fast dashboards and less custom infrastructure, but an SDK/service increases code, supply-chain, network, blocking, and vendor-dependence risk. Cross-product identifiers or default events can collect more than intended. | Highest burden: everything in B plus vendor due diligence, sub-processors, purpose conflicts, international transfers, SDK audits, contract/change monitoring, and proof the vendor does not profile, advertise, or reuse browsing data. Many mainstream audience tools do not qualify for France's narrow consent exemption. | Low to medium. The SDK can be removed, but vendor-held data, backups, derived profiles, and contractual exit obligations may persist. |

## Recommendation

Use **Option A for the current private test**. The selected future direction is Option B, but authorize it only if a concrete product question cannot be answered safely through tests, voluntary feedback, or user research and the complete design below passes its separate gate. This is a sequencing recommendation, not a statement that telemetry is unlawful.

If Option B is later proposed, the minimum design should be:

- a single written improvement purpose and a closed event allowlist;
- explicit opt-in, default off, with an equally easy later withdrawal;
- no raw search terms, full URLs, result text/page content, keystroke content, account data, ad/result destinations, or stable cross-session/device identifiers;
- coarse events only, such as supported-layout recognized, movement succeeded/failed by broad reason, or extension error category, after proving each field is necessary;
- no fingerprinting, advertising, affiliate use, sale, sharing, cross-customer profiling, or human reading of event-level browsing data;
- first-party control with EU/EEA hosting preferred, no provider reuse, IP/server-log minimization, encryption, strict access, and a short justified raw retention period followed by deletion or demonstrably irreversible aggregation;
- a processor/sub-processor and international-transfer inventory, contracts, transfer mechanism/assessment where needed, incident plan, rights process, and tested deletion;
- prominent Chrome Web Store, privacy-policy, and in-product disclosure before collection; the exact consent/lawful-basis and French Article 82 analysis completed before implementation;
- separately approved manifest/network/infrastructure changes, tests proving only allowlisted events leave the device, and independent privacy/security/compliance review.

Do not assume that calling data “anonymous,” hashing an identifier, truncating an IP address, using an EU server, or aggregating later removes it from GDPR or Chrome Limited Use while raw or linkable data exists.

## Decision checklist

Before authorizing any telemetry implementation, the operator must return one proposal that answers:

1. What single product decision will the data improve, and why cannot current tests or voluntary feedback answer it?
2. Which exact event fields are necessary, and which sensitive fields are technically prevented?
3. Is the choice no telemetry, privacy-minimized first-party analytics, or third-party analytics, and why is the more private option insufficient?
4. Is collection opt-in or opt-out, and what GDPR legal basis and French ePrivacy/Article 82 analysis supports it?
5. Are any identifiers used, how are server IP/log data handled, and can events be linked across sessions, sites, devices, or people?
6. Who is controller, which processors/sub-processors receive data, where is it stored/accessed, and what international-transfer safeguards apply?
7. What raw and aggregate retention/deletion periods, user-rights process, security controls, incident response, and shutdown plan apply?
8. What manifest permissions/origins, Store disclosures, privacy notice, consent UI, and independent tests/reviews change?

Until the user approves that complete Option B proposal, the answer is operationally **no telemetry in the code**. The private test proceeds without waiting for telemetry design.

## Primary evidence

- [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq), [Limited Use](https://developer.chrome.com/docs/webstore/program-policies/limited-use), and [Disclosure Requirements](https://developer.chrome.com/docs/webstore/program-policies/disclosure-requirements).
- [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) and [EDPB Article 5(3) ePrivacy guidance](https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- CNIL guidance on [audience-measurement exemptions](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience), [data minimization](https://www.cnil.fr/fr/minimiser-les-donnees-collectees), [retention](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees), and [international transfers](https://www.cnil.fr/fr/les-outils-de-la-conformite/transferer-des-donnees-hors-de-lue).

All sources were accessed 2026-08-28 and are also recorded in [research/sources.yaml](research/sources.yaml). Recheck them when a concrete telemetry proposal is made.
