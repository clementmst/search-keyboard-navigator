# Privacy-practices dashboard draft

Verify every label against the live Chrome Web Store dashboard immediately before submission; dashboard wording can change.

## Single purpose

Enable keyboard movement among recognized result-title links on supported desktop Google Search pages.

## Site-access justification

The packaged content script needs access to `https://www.google.com/search*` so it can recognize visible result-title links, move native focus among them when the user presses an unmodified arrow key, and display the focus indicator. Runtime code requires the exact `https://www.google.com` origin and `/search` pathname. No other origin or named Chrome API permission is requested.

## Remote code

No. All executable JavaScript and CSS is included in the submitted package. The extension has no remote configuration, remote module, dynamic-code loader, or extension-originated network request.

## User-data handling

Prominent disclosure: the extension temporarily processes the current Google Search page address, visible result-title link text and destinations, surrounding page structure, visibility and focus state, and key-event metadata on the user's device to provide navigation. On supported pages, a document-level listener briefly examines each keydown event only long enough to determine whether it is an eligible Arrow Up, Arrow Down, or active-session Escape command and whether the current context is safe. Other keys are immediately ignored. Typed text and keystrokes are not recorded, retained, or transmitted. Through the extension itself, the developer does not receive, retain, transmit, sell, or share the page or key-event information.

Conservative classification for final dashboard review:

- browsing activity/page address: handled transiently on-device;
- website content, including visible title text and destinations: handled transiently on-device;
- user activity, including transient key-event metadata and focus state: handled on-device only; unrelated keys are immediately ignored, and typed text is not recorded;
- authentication, financial, health, location, communications, identifiers, and personal profile information: not intentionally requested or collected, though a user's query or result content can itself contain sensitive information;
- analytics, telemetry, advertising, personalization, and sale/sharing: none.

Do not select a blanket “no user data handled” representation if the live dashboard or policy treats this local page inspection as collection or use. The compliance reviewer must reconcile the exact checkboxes with the final artifact, hosted privacy policy, and current User Data FAQ.

## Limited Use certification

The current design uses page data only to provide or improve the prominently described, single user-facing navigation purpose, keeps it on-device, and does not transfer it. This use is intended to comply with the Chrome Web Store User Data Policy, including the Limited Use requirements. Only the authorized human publisher may make the dashboard certification after reading the current text and verifying that the final artifact and disclosures still agree.

## Voluntary support communications

The extension does not send support data. If a user voluntarily emails `searchkeyboardnavigator.support@gmail.com`, Gmail and the individual developer receive the sender's address, message, timestamps, and attachments. Messages may be forwarded to another Gmail inbox controlled by the same developer so replies can be sent from the support address. No project agent has mailbox access. The hosted privacy policy must disclose the support purpose, sensitive-information warning, retention approach, and available deletion request.
