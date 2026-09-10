# Store reviewer instructions

- Version: `0.1.2`
- Release ZIP SHA-256: `627cf4d2ca24adc6dba6fc75aad1e825e0bd23213d6bad58c0e5aaedbaba163e`
- Supported site: desktop `https://www.google.com/search` only
- Named Chrome API permissions: `storage`, only for the versioned local consent Boolean

## Test

1. Before enabling, open a supported Google Search page and verify arrows remain completely native. Click the extension toolbar icon and verify the popup explains the local URL/result/focus/key-event processing, zero transmission, and local consent storage.
2. Select **Enable keyboard navigation**. Close and reopen the popup to verify the enabled setting persists and the Arrow Up, Arrow Down, Enter, Ctrl + Enter, and Escape instructions are shown.
3. Use a signed-out Chrome profile and a non-personal query such as `keyboard navigation accessibility`.
4. While the search field has focus, verify Arrow Up and Arrow Down retain their normal editing behavior.
5. Move focus to ordinary page content or click blank page space, then press Arrow Down. A recognized result title should receive native focus, a title outline, and a small left marker.
6. Verify one-step Arrow Down and Arrow Up movement. Focus must not move to menus, translation links, or other non-title controls.
7. Verify navigation does not wrap. At a boundary, the arrow retains native page behavior.
8. Verify Tab, Shift+Tab, and plain Enter remain native. On an extension-selected result, press Ctrl + Enter and record whether Chrome opens the result in a new tab while leaving the original Search tab open. This behavior is not established by static tests. Escape clears an active navigation session.
9. Select **Disable keyboard navigation** in the popup. Verify the outline clears and arrows return immediately to native page behavior. Reopen the popup and confirm the disabled choice persists.
10. Treat supported sponsored or rich-result titles as possible destinations under the current structural rule; the extension does not classify advertisements.
11. Verify there is no extension-originated network activity, page-data storage, account, analytics, telemetry, remote code, or background service worker. The only stored value is the local consent Boolean.

Known limits: only compatible `www.google.com` desktop layouts are recognized; Google markup can change; screen-reader compatibility, forced-colors presentation, high zoom, and broad language/layout coverage are not established.

Version 0.1.2 adds a consent gate and the `storage` permission solely for its local Boolean choice. It does not add telemetry, page-data storage, extension networking, a backend, or extension-owned Enter handling.

The publisher must compare this hash with the final uploaded file. If any allowlisted source or icon changes, rebuild, re-review, and replace the hash before upload.
