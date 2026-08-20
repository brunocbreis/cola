# Publishing

Live at **https://brunocbreis.github.io/cola/**

Hosted on GitHub Pages from the `main` branch, root folder. The repo is
`brunocbreis/cola`.

## Updating it

1. Edit the markdown in `content/`.
2. Rebuild: `node build.mjs`
3. Publish:

```sh
git add -A && git commit -m "copy edits" && git push
```

The live site updates about a minute after the push. GitHub rebuilds it
automatically — there is nothing to click.

## Then check it

A Pages build failed silently once and left the site two days stale on a commit
that had pushed cleanly, so a green `git push` is not evidence the site changed.

```sh
curl -sI https://brunocbreis.github.io/cola/ | grep -i last-modified
gh api repos/brunocbreis/cola/pages/builds/latest --jq '"\(.status) \(.commit[0:7]) \(.error.message // "-")"'
```

If a build errors, `gh api -X POST repos/brunocbreis/cola/pages/builds` requests
a fresh one.

## Keeping the history readable

Two habits keep the log worth reading:

1. Run `node build.mjs` before committing, so `index.html` in a commit matches the
   `content/` and `template/` beside it. A checkout of any commit then serves the page
   that commit describes.
2. Add an entry at the top of `CHANGELOG.md` for anything a visitor would notice.
   Copy fixes and typos need no entry.

Commit subjects read as what the change does — `Give touch devices a gesture for every
key` — with the reasoning in the body. One commit per idea; a rebuild of `index.html`
may stand alone.

## The one rule about git here

The repository begins and ends at `site/`. `~/Desktop/cola/` above it holds
`backups/`, which contains real holdings and balances. Run every git command from
inside `site/`, and never initialize or add a remote at the parent.

## Why this works with no build step on the host

`index.html` is self-contained: the icon is a base64 data URI and the CSS and JS are
inline, so the page makes zero external requests. GitHub Pages serves the one file.

`content/`, `template/`, and `build.mjs` also live in the repo. They are the source the
page is generated from, and are harmless to serve.

## A domain, later

Buy one anywhere, then in the repo's Settings → Pages → Custom domain, enter it and add
a CNAME record at your registrar pointing to `brunocbreis.github.io`. GitHub issues the
TLS certificate. Nothing about the page changes.
