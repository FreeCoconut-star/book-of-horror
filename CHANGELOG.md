# Changelog

## 1.1.0 - 2026-11-10 - Info buttons on every field

- Every form field (the connect/settings screen and all nine fields of the page editor) now has an "i" button next to its label. Tap or click it to open a short explanation of what the field is for; tap it again, tap elsewhere, press Esc or rotate/resize to close it. Only one explanation is open at a time.
- Explanations are text only (no hover dependency, so they work on phones), escaped like all other inserted text, and do not touch the stored data model.
- `tests/simulate.js`: 13 checks passing (4 new: every field has an info button and tip on the connect form and in the editor, buttons call the handler and sit outside the label, stored page data is unchanged).

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
