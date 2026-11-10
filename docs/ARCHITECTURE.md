# Architecture

## Overview

- **Client only.** One `index.html` (CSS, markup, JS). No server, no build, no dependencies.
- **Hosting.** GitHub Pages from the public `book-of-horror` repo.
- **Storage.** The private `book-of-horror-data` repo, accessed by the browser through the GitHub REST contents API (`https://api.github.com/repos/{owner}/{repo}/contents/...`) with `Authorization: Bearer <fine-grained token>`.
- **Local state (browser localStorage).** `boh.cfg` = `{o, r, t}` (owner, repo, token). `boh.cache` = `{ [id]: { sha, d } }` (last known pages, for instant open and cheap sync).

## Data model (in the data repo)

```
pages/<id>.json     one journal page
img/<id>.jpg        full-size chart (optional)
```

`<id>` = `p` + base36 timestamp + 3 random chars; it is also the filename. Page JSON fields (all strings unless noted; missing means empty):

| Field | Meaning |
|---|---|
| `title`, `instrument`, `cost` | Free text. `cost` is free text such as `-3R` or `-450`. |
| `date` | `YYYY-MM-DD`, local date of the trade. |
| `did` | What I did. |
| `knew` | What I knew (rule broken). |
| `emo` | Array of trigger names from `TRIG`. |
| `trigger` | Free-text note on the urge. |
| `fix` | Correction. |
| `ts` | Creation time in ms (number); sort tiebreaker. |
| `hasImg` | Boolean; whether `img/<id>.jpg` exists. |
| `thumb` | 320 px JPEG data URL stored inline so list cards need no extra requests. |

Compatibility rule: add optional fields only; never rename or remove.

## Sync

- **Pull** (`pull()`): list `pages/` (one request); for each file compare its git `sha` to the cached sha; fetch only changed files (raw media type, 8 in parallel); drop cache entries no longer listed. A 404 on the directory is treated as empty only after confirming the repo itself is reachable.
- **Triggers:** app load, tab becomes visible (not while editing), browser comes online, manual refresh button.
- **Write** (`putRetry`): PUT with the cached sha. On 409/422 (stale or missing sha) it fetches the current sha and retries once, so the latest save wins. Image is written before the page JSON. Commit messages: `Add page <id>`, `Update page <id>`, `Add chart <id>`, `Delete <path>`.
- **Delete:** image then page, both via DELETE with sha.
- **Images:** resized in a canvas to max 1600 px, JPEG, shrunk further until at most about 600 KB; thumbnail 320 px at quality 0.7. Full image is fetched lazily on the review screen and cached as a blob URL for the session.

## Security and privacy

- The data repo is private; `connect()` refuses a public repo. The public app repo holds no personal data.
- Token is fine-grained: one repo, Contents read/write only, with an expiry. It lives in localStorage on each device you connect.
- CSP meta tag: `default-src 'none'; connect-src https://api.github.com; img-src 'self' data: blob:; script/style inline only`. No third-party code runs, and the page cannot send the token to another host.
- All dynamic text passes through `esc()`. Page ids are restricted to `[\w-]` by filename filtering.
- Residual risk: anyone with access to your unlocked browser profile can read the token and the journal. Use device locks; revoke tokens for lost devices.

## Failure handling

| Case | Behaviour |
|---|---|
| Offline / API down | Cached pages stay readable; sync shows a warning; saves fail with a message and the form stays open. |
| Token expired | Clear message; data untouched. |
| Two devices edit one page | Last save wins (no merge). |
| Save fails after image upload | Orphan `img/<id>.jpg` may remain; harmless, the page JSON is not written. |
| localStorage full | Warns; GitHub remains the source of truth. |
| Unsaved edits | Cancel needs a second tap; closing the tab prompts. |

## Known limitations

- Directory listing returns up to about 1,000 files; beyond roughly 1,000 pages sync needs pagination or a trees API change.
- No offline writes, no search, no export other than the repo itself.
- Not verified by automated test: screenshot canvas/upload path, real-browser layout, GitHub rate limiting, token expiry in production.
- Some browsers cannot decode HEIC; such a screenshot shows "Couldn't read that image".
- Journal text is stored as plain JSON in a private repo; it is protected by GitHub access control, not by additional encryption.
