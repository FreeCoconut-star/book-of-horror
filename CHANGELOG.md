# Changelog

## 1.0.0 - 2026-11-10 - First production release

- Static single-file app on GitHub Pages: https://freecoconut-star.github.io/book-of-horror/
- Journal stored in the private repo `book-of-horror-data` (pages as JSON, charts as JPEG) via the GitHub contents API with a fine-grained token; sync across devices; full history via Git commits.
- Connect/settings screen with checks: token accepted, repo private, token can write. Disconnect removes token and cache from the device.
- Pages: five template sections, trigger chips, title/date/instrument/cost. Home stats, trigger filter, review mode, edit, delete (two-tap), unsaved-changes guard, paste/drop screenshots, keyboard navigation in review.
- Content-Security-Policy restricting network access to api.github.com.
- Simulated end-to-end test suite (`tests/simulate.js`): 9 checks passing.
- Documentation: README, CLAUDE.md, docs/SETUP, ARCHITECTURE, DECISIONS.

## Prototype - 2026-11-09 - Claude artifact (retired)

First version ran as a Claude artifact with account-based storage. Bugs found and fixed during audit: UTC date off by a day, `close()` handler clash with `document.close`, blocked `confirm()` for delete, oversized screenshots exceeding the document limit, stale review after edit, stuck loading state. Prototype data is not migrated to the GitHub store.

## Roadmap

See CLAUDE.md. Candidates: pattern insights, weekly reminder, pre-trade checklist.
