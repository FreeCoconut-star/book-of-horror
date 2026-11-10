# Setup

## One-time deployment

1. **Repos.** Public `book-of-horror` (this repo) and **private** `book-of-horror-data`. Free GitHub accounts can only publish Pages from public repos, which is why the journal lives in a separate private repo.
2. **Pages.** Repo Settings -> Pages -> Source: Deploy from a branch -> Branch `main`, folder `/ (root)` -> Save. The site appears at `https://<user>.github.io/book-of-horror/` after about a minute.
3. **Defaults.** `index.html` pre-fills owner `FreeCoconut-star` and repo `book-of-horror-data` (constant `DEF`). Change `DEF` if you fork this for another account.

## Create the access token (each person/device set)

1. GitHub -> Settings -> Developer settings -> Personal access tokens -> **Fine-grained tokens** -> Generate new token.
2. **Repository access:** Only select repositories -> `book-of-horror-data` (nothing else).
3. **Permissions -> Repository permissions:** **Contents: Read and write**. (Metadata: Read-only is added automatically.)
4. Choose an expiry (up to 1 year), generate, copy the token immediately (shown once).
5. Open the app, paste the token, check owner/repo, tap **Connect**.

The same token can be pasted on several devices, or create one per device so you can revoke a lost phone individually.

## New device

Open the live URL, paste a token, Connect. Pages load from the data repo.

## Token expired, lost or leaked

- Expired: create a new token and paste it under the gear icon (Settings). Data is untouched.
- Lost or leaked: revoke it at GitHub -> Settings -> Developer settings -> Fine-grained tokens, then create a new one. The token can only reach the data repo, but that repo is your private journal, so revoke promptly.

## Backup

The data repo is the database and keeps every version of every page in Git history. For an extra copy, clone it (`git clone`) or download it as a ZIP from GitHub.

## Troubleshooting

| Message | Cause | Fix |
|---|---|---|
| Token rejected or expired | 401 from GitHub | New token under Settings. |
| GitHub refused (permissions or rate limit) | 403 | Token needs Contents: Read and write on the data repo; or wait out rate limiting (5,000 requests/hour). |
| Repository not found | 404 | Wrong owner/repo name, or the token is not granted that repo. (GitHub reports no-access as not found.) |
| Repository is PUBLIC | Safety check | Make `book-of-horror-data` private. |
| Token is read-only | Permission set to Read | Regenerate with Read and write. |
| Offline or blocked | Network or extension blocking api.github.com | Check connection; the app only talks to api.github.com. |
| Change not visible after a code push | Pages deploy delay or browser cache | Wait about a minute, hard-refresh. |
