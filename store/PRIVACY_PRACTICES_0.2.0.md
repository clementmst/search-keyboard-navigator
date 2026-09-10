# Privacy-practices dashboard draft — version 0.2.0

## Single purpose

Enable keyboard movement among recognized result links on supported search pages.

## Permissions

- `storage`: remembers only the versioned local global enable choice.
- `scripting` (optional): registers only packaged navigation JavaScript and CSS after the user enables YouTube or GitHub.
- `https://www.google.com/search*`: default site access for supported Google Search pages.
- `https://www.youtube.com/*` (optional): requested only from the YouTube switch. Packaged code loads across the granted origin to survive in-page navigation but returns without selecting or moving focus unless the route is `/results`.
- `https://github.com/*` (optional): requested only from the GitHub switch. Packaged code loads across the granted origin to survive in-page navigation but returns without selecting or moving focus unless the route is `/search?type=repositories`.

The same transient local processing applies on every enabled site: current route, visible candidate links and page structure, focus state, and relevant key-event metadata. YouTube results may be personalized and GitHub results may include private repositories visible to the signed-in user. None of this information is stored or transmitted by the extension.

## Remote code and data use

No remote code, analytics, telemetry, backend, account, advertising, or extension-originated network request exists. All executable files are inside the package. The publisher must reconcile the live dashboard categories and certifications against the package and hosted policy; this document is not authority for an agent to certify them.
