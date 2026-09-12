# Privacy Policy — ArrowKey Search Navigator

Effective date: August 31, 2026
Last updated: September 12, 2026

ArrowKey Search Navigator (formerly Search Keyboard Navigator) is a Chrome extension published by an individual developer in France. It helps users move keyboard focus among recognized result links on supported Google Search pages and, only when individually enabled by the user, YouTube search and homepage videos.

## Information handled on the device

To provide keyboard navigation, the extension temporarily handles the following information on the user's device:

- **Web history:** the address of the current supported page, solely to confirm that the page is within an enabled site and route.
- **Website content:** visible result-title link text and destinations, surrounding page structure, and element visibility.
- **User activity:** key-event metadata and current focus state. On supported pages, the extension briefly examines each keydown event only long enough to determine whether it is an eligible arrow command, an active-session Escape command, or another key that must be ignored, and whether the current page context is safe. The extension does not record typed text, retain keystrokes, or transmit key events.

Search queries, page content, and result destinations can contain personal or sensitive information. This information is processed only within the current browser page so the extension can recognize eligible result-title links, move native keyboard focus, and display its focus indicator.

## Extension collection and transmission

Through the extension itself, the developer does not receive, retain, transmit, sell, or share search queries, browsing addresses, page content, result destinations, keyboard interactions, focus state, or identifiers.

The current release has no analytics, telemetry, accounts, advertising, backend, remote configuration, remote code, or extension-originated network requests.

Before this page handling begins, the popup explains the local processing. Turning on the **Google Search** or **YouTube** access switch is the user's affirmative choice for that site. Until Google Search access is on, its content controller remains inactive; until YouTube access is granted, the packaged controller is not registered on YouTube.

## Permissions and purpose

The extension runs by default only on `https://www.google.com/search*`. Users may separately grant or remove access to `https://www.youtube.com/*` from the popup. Packaged code loads across the enabled YouTube origin so it remains available through in-page navigation, but exact runtime guards return without selecting results or moving focus except on YouTube `/results` and `/`. `storage` keeps the local Google-access setting, and optional `scripting` registers only packaged files. No remote code is fetched.

## Storage and retention

The extension stores one versioned Boolean setting in Chrome on the user's device: whether Google Search access is enabled. Chrome separately remembers whether the user granted the optional YouTube origin and scripting permissions. The extension does not store searches, URLs, page content, result destinations, focus history, or keyboard activity. Temporary in-page navigation state ends when the page or extension session ends. Local access choices remain until the user changes them or removes the extension.

## Sharing and sale

The extension does not sell user data. It does not transfer user data to third parties, use data for purposes unrelated to its single purpose, or use data to determine creditworthiness or for lending.

Information handled from supported pages is used only to provide or improve the extension's single, user-facing keyboard-navigation purpose. It is not used for unrelated purposes or transferred to third parties. The extension's use of this information complies with the [Chrome Web Store User Data Policy, including the Limited Use requirements](https://developer.chrome.com/docs/webstore/program-policies/limited-use/). This affirmative statement addresses those data-use restrictions; it does not claim that every separate legal or Chrome Web Store requirement has been satisfied.

## Security

All executable JavaScript and CSS is included in the installed extension package. Because the current release does not transmit user data or create a developer-controlled user-data store, there are no extension-operated data servers or external data recipients.

## Support communications

Contacting support is voluntary. If a user emails the public support address, the developer and Google's Gmail service receive the sender's email address, message content, timestamps, and any attachments. Messages may be automatically forwarded to another Gmail inbox controlled by the same developer so the developer can respond from the support address. No project agent currently has mailbox access.

Support information is used only to answer requests, investigate reported problems, protect the service, or meet legal obligations. Users should not include search queries, page content, passwords, or other sensitive information unless it is necessary for their request. No fixed automatic deletion schedule is currently configured; the developer deletes support messages when they are no longer reasonably needed. Users may request deletion, subject to legal or security needs, by emailing the support address.

## User choices

Users can stop page processing by turning off the relevant **Google Search** or **YouTube** access switch, disabling the extension, or uninstalling it. Turning off access removes active page listeners and clears the extension's selection. The extension does not create a developer-held record of on-page activity. Users who voluntarily contact support may request access, correction, or deletion of their support communication by emailing the support address, subject to applicable legal or security needs.

## Future changes

Any future telemetry, backend, account system, advertising, expanded site access, or other material change would require updated disclosures and this policy to be revised before that behavior is released. Material changes will be identified by a new effective date.

## Contact

Privacy and support questions can be sent to [searchkeyboardnavigator.support@gmail.com](mailto:searchkeyboardnavigator.support@gmail.com).
