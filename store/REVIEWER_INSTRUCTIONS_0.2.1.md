# Store reviewer instructions — version 0.2.1

Candidate SHA-256: `33f19600d2613bc9fbaa6c81dbdcadbf625310819d87c81d6dbe49f45ec76282`.

Google Search and YouTube have separate access switches in the popup. YouTube is an optional origin grant.

1. Open the popup, read the local-processing explanation, and turn on Google Search.
2. At `https://www.google.com/search?q=keyboard+navigation`, confirm Arrow Down/Up moves among recognized ordinary result titles. Search controls, Tab, and Enter remain native.
3. Open the popup, enable YouTube, accept only the displayed YouTube access request, and reload an already-open YouTube page once.
4. At `https://www.youtube.com/results?search_query=keyboard+navigation`, confirm Arrow Down/Up moves among ordinary video-title links while search fields, filters, player controls, Tab, and Enter remain native.
5. At `https://www.youtube.com/`, confirm all four arrow keys navigate the responsive ordinary-video grid and scrolling keeps the selected preview and title visible.
6. Turn YouTube off and confirm the marker and keyboard listener stop in open YouTube tabs and its origin permission is removed.

The extension is not affiliated with or endorsed by Google, YouTube, or Microsoft. It sends no page or interaction information anywhere.
