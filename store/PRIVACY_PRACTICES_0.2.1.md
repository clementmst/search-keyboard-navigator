# Privacy-practices dashboard draft — version 0.2.1

## Single purpose

Enable keyboard movement among recognized Google Search result links and YouTube video links.

## Permissions

- `storage`: remembers only the versioned local Google Search access choice.
- `scripting` (optional): registers only packaged navigation JavaScript and CSS after the user enables YouTube.
- `https://www.google.com/search*`: static site access for supported Google Search pages; runtime handling remains off until the Google Search switch is enabled.
- `https://www.youtube.com/*` (optional): requested only from the YouTube switch. Packaged code loads across the granted origin to survive in-page navigation but returns without selecting or moving focus except on `/results` and `/`.

On each enabled supported page, the extension transiently handles the current route, visible candidate links and layout, focus state, and relevant arrow-key metadata. This processing occurs only on the device. None of this information is stored or transmitted by the extension.

## Remote code and data use

No remote code, analytics, telemetry, backend, account, advertising, or extension-originated network request exists. All executable files are inside the package. Dashboard categories and certifications must match the exact package and hosted privacy policy; this draft does not itself certify compliance.
