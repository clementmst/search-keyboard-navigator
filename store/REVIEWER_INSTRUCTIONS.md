# Store reviewer instructions

- Version: `0.1.1`
- Release ZIP SHA-256: `fcabfa8a583a88e48e0272e2abed4d92a27db1fd2ddca41949611d170672ac5a`
- Supported site: desktop `https://www.google.com/search` only
- Named Chrome API permissions: none

## Test

1. Click the extension toolbar icon. Verify the compact popup explains Arrow Up, Arrow Down, Enter, Ctrl + Enter, and Escape without opening a tab or requesting new access.
2. Use a signed-out Chrome profile and a non-personal query such as `keyboard navigation accessibility`.
3. While the search field has focus, verify Arrow Up and Arrow Down retain their normal editing behavior.
4. Move focus to ordinary page content or click blank page space, then press Arrow Down. A recognized result title should receive native focus, a title outline, and a small left marker.
5. Verify one-step Arrow Down and Arrow Up movement. Focus must not move to menus, translation links, or other non-title controls.
6. Verify navigation does not wrap. At a boundary, the arrow retains native page behavior.
7. Verify Tab, Shift+Tab, and plain Enter remain native. On an extension-selected result, press Ctrl + Enter and record whether Chrome opens the result in a new tab while leaving the original Search tab open. This behavior is not established by static tests. Escape clears an active navigation session.
8. Treat supported sponsored or rich-result titles as possible destinations under the current structural rule; the extension does not classify advertisements.
9. Verify there is no extension-originated network activity, persistent storage, account, analytics, telemetry, remote code, or background service worker.

Known limits: only compatible `www.google.com` desktop layouts are recognized; Google markup can change; screen-reader compatibility, forced-colors presentation, high zoom, and broad language/layout coverage are not established.

The publisher must compare this hash with the final uploaded file. If any allowlisted source or icon changes, rebuild, re-review, and replace the hash before upload.
