# Book of Horror

A private trading-mistakes journal, based on Tom Hougaard's "Book of Horror" idea: record each costly mistake with the evidence, the rule you broke and the correction, then re-read the book until the patterns stop repeating.

**Live app:** https://freecoconut-star.github.io/book-of-horror/

## What it does

Each page captures the five elements from the concept:

1. **Visual evidence** - screenshot of the completed-day chart showing entries and exits
2. **What I did** - the action, plainly, no excuses
3. **What I knew** - the rule that was broken
4. **The gremlin** - the emotional trigger (chips: Impatience, Need to be right, Revenge, FOMO, Fear, Hope, Boredom, Greed, plus a free note)
5. **Correction** - the rule to follow next time

Plus title, date, instrument and cost. The home screen shows page count, pages this month and your top trigger; trigger chips filter the list. **Read the book** steps through pages one at a time, newest first.

## How it works (one paragraph)

The app is a single static file (`index.html`, no build step, no dependencies) served by GitHub Pages. Your journal is **not** stored in this repository. It is stored as small JSON files and JPEG charts in a separate **private** repository (`book-of-horror-data`), which the app reads and writes directly through the GitHub API using a fine-grained access token you paste once per device. Every edit is a Git commit, so you get sync across devices and full history for free.

```
Browser (any device)  --HTTPS + your token-->  api.github.com  -->  private repo: pages/*.json, img/*.jpg
       ^
       |  loads the app
GitHub Pages (this public repo)
```

## Repositories

| Repo | Visibility | Purpose |
|---|---|---|
| `FreeCoconut-star/book-of-horror` | Public | App code and docs. Contains nothing personal. |
| `FreeCoconut-star/book-of-horror-data` | **Private** | Your journal. Must stay private; the app refuses to connect to a public repo. |

## Quick start

See [docs/SETUP.md](docs/SETUP.md). In short: turn on Pages, create a fine-grained token (Contents: Read and write, only the data repo), open the app, paste the token.

## Documentation

- [docs/SETUP.md](docs/SETUP.md) - deploy, token, new devices, troubleshooting
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - design, data model, sync, security, limits
- [docs/DECISIONS.md](docs/DECISIONS.md) - why it is built this way, and the trade-offs
- [CLAUDE.md](CLAUDE.md) - project instructions and context for Claude (or any engineer)
- [CHANGELOG.md](CHANGELOG.md) - history and roadmap
- [tests/simulate.js](tests/simulate.js) - simulated end-to-end test (`node tests/simulate.js`)

## Status

v1.0.0. Verified: syntax check, simulated test against a fake GitHub API, live connect, page save and cross-device sync (user-confirmed). Not yet verified by test: screenshot upload and full-size display, layout on every screen size. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#known-limitations).
