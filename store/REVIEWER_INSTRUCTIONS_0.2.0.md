# Store reviewer instructions — version 0.2.0

Candidate SHA-256: `c406090c906f38cbdf2d88ea3941bb628dc8434bf00e8ae1ee49e1d8bd3e4bcb`.

Google Search works after the extension's global Enable action. YouTube and GitHub are off by default.

1. Open the popup and enable keyboard navigation.
2. Enable YouTube, accept only the displayed YouTube access request, and reload an already-open `https://www.youtube.com/results?search_query=keyboard` page once.
3. Confirm Arrow Down/Up moves only among ordinary video-title links. Search fields, player controls, filters, Tab, and Enter remain native.
4. Disable YouTube and confirm the marker and keyboard listener stop immediately in open YouTube tabs.
5. Repeat with GitHub at `https://github.com/search?q=keyboard&type=repositories`; only repository result titles are supported.
6. Confirm unrelated YouTube/GitHub routes remain inert and that removing either switch removes its origin permission.

The extension is not affiliated with or endorsed by Google, YouTube, GitHub, or Microsoft. It sends no page or interaction information anywhere.
