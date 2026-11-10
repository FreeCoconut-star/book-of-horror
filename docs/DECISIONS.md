# Decisions

Short records of why things are the way they are. Reverse a decision only with the owner's agreement.

## D1 - Single static HTML file, no framework
No build or dependency maintenance, trivial to host and to hand to anyone. Trade-off: one long file; keep it organised by section comments.

## D2 - Host on GitHub Pages
Free, no extra account, works from any device without Claude. Trade-off: static only, so no server-side secrets or accounts; free plan requires the repo to be public. Vercel was not needed.

## D3 - Store pages in a separate private GitHub repo, accessed with a fine-grained token
Owner wanted GitHub as storage and access from anywhere. This gives sync, history and ownership with no extra service. Alternatives considered: browser-only storage (private but single device, easy to lose), Supabase (real accounts and sync, extra service to run). Trade-off: a token lives in each browser; mitigated by single-repo scope, expiry, CSP and the private-repo check. Revisit if multi-user or stronger auth is needed.

## D4 - Thumbnails inline in page JSON, full image fetched on demand
List view needs no per-card requests; review view loads the sharp image when opened. Trade-off: page files are about 10-30 KB larger.

## D5 - Strict CSP
Limits damage if any bug allowed script injection: network access only to api.github.com, so the token cannot be sent elsewhere.

## D6 - Last write wins on conflicts
Single owner, rare simultaneous edits; automatic retry with the fresh sha keeps saves simple. Trade-off: a concurrent edit on another device can be overwritten (still recoverable from Git history).

## D7 - Two-tap confirmation instead of `confirm()`
Browser dialogs can be blocked in embedded or sandboxed contexts, which silently disabled delete in the prototype.

## D8 - Local dates
Dates use the device's local day, not UTC, so late-night or early-morning trades are not stamped with the wrong day.

## D9 - Fixed trigger vocabulary plus free note
Chips make patterns countable (top trigger, filters); the free note keeps nuance. Edit `TRIG` to change the vocabulary; existing pages keep their stored values.
