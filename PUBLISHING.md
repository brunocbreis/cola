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

## Why this works with no build step on the host

`index.html` is self-contained: the icon is a base64 data URI and the CSS and JS are
inline, so the page makes zero external requests. GitHub Pages serves the one file.

`content/`, `template/`, and `build.mjs` also live in the repo. They are the source the
page is generated from, and are harmless to serve.

## A domain, later

Buy one anywhere, then in the repo's Settings → Pages → Custom domain, enter it and add
a CNAME record at your registrar pointing to `brunocbreis.github.io`. GitHub issues the
TLS certificate. Nothing about the page changes.
