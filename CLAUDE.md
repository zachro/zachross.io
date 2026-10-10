# zachross.io

Personal website and portfolio for Zach Ross, a software engineer. Its primary audience is recruiters and hiring managers, so the first screen must answer three things fast: who Zach is, what he builds, and how to reach him.

## Stack

- **Framework:** Astro, static output only (`output: 'static'`). No server adapter unless a feature explicitly needs one.
- **Language:** TypeScript, strict mode.
- **Runtime/tooling:** Current Node LTS, pinned in `.nvmrc` and `package.json` `engines`. Use npm only (`package-lock.json` is committed); never introduce pnpm, yarn, or bun lockfiles.
- **Content:** Markdown/MDX in Astro content collections, with schemas validated by zod in `src/content.config.ts`.
- **Styling:** Plain modern CSS with custom properties in `src/styles/global.css`. Use component-scoped `<style>` blocks for component styles. Don't add Tailwind or a UI framework without asking.
- **Fonts:** JetBrains Mono for all text, self-hosted via `@fontsource/jetbrains-mono` (weights 400, 400 italic, 700). No Google Fonts or other third-party font CDNs.
- **Integrations:** `@astrojs/sitemap`, `@astrojs/mdx`, `@astrojs/rss` (once posts exist).
- **Formatting:** Prettier with `prettier-plugin-astro`, default config. Run `npm run format` before committing.
- **Hosting:** Cloudflare Workers with static assets (not Pages), configured in `wrangler.jsonc` and deployed automatically from GitHub. Pushes to `main` go to production, and other branches get preview URLs.
- **Domain/DNS/email:** Managed in the Cloudflare dashboard, not in this repo.

## Commands

- `npm run dev`: local dev server
- `npm run build`: production build to `dist/`
- `npm run preview`: serve the built `dist/` locally
- `npm run format`: run Prettier over the repo
- `npx astro check`: type-check `.astro` files and content schemas (needs `@astrojs/check` and `typescript` as dev dependencies)
- `npm run check:csp`: after a build, verify every inline script in `dist/` is allowed by hash in the CSP, with no stale hashes or inline styles

Run `npm run build` and `npx astro check` before calling any task done.

## Git workflow

- **Pushing to `main` deploys to production.** Never commit or push directly to `main`; work on a branch and open a PR so the preview URL and CI run first.
- Only commit or push when asked.
- Never add `Co-Authored-By` or other AI attribution trailers to commit messages.

## Structure

```
public/             served as-is: favicon.svg, robots.txt, resume.pdf, _headers
src/
  content.config.ts collection schemas
  content/
    projects/       one .md/.mdx per project case study
    posts/          blog posts (optional; don't create the section until there's a post)
  pages/            file-based routes
    og/[...slug].png.ts   build-time Open Graph images
    rss.xml.ts            only once posts exist
    404.astro
  layouts/BaseLayout.astro   all <head> tags, nav, footer
  assets/           images processed by astro:assets
  styles/global.css
wrangler.jsonc      Workers static-assets config (assets dir = dist/, 404 handling)
.github/workflows/checks.yml  CI: install, astro check, build, link check
```

## Conventions

- **Every page uses `BaseLayout`** and passes `title` and `description`. `BaseLayout` owns:
  - `<title>` and the meta description
  - the canonical URL (based on `site: 'https://zachross.io'`)
  - Open Graph and Twitter card tags, including the per-page OG image
  - favicon links
  - JSON-LD `Person` schema on the home page, with `sameAs` pointing to GitHub and LinkedIn. Until real URLs are listed under Contact & links, omit `sameAs` entirely; never use placeholder URLs.
- **URLs have no trailing slash.** Set `trailingSlash: 'never'` and `build.format: 'file'` in `astro.config.mjs`. Canonical URLs, the sitemap, internal links, and the link check all follow this form (`/about`, not `/about/`).
- **Images go in `src/assets/` and render with `<Image>` / `<Picture>`.** Only files that must keep exact URLs go in `public/`.
- **Project frontmatter schema (starting point):** `title`, `summary`, `role`, `stack: string[]`, `date`, `links: { repo?, demo?, writeup? }`, `featured: boolean`, `draft: boolean`.
- **Draft content never ships.** Filter out `draft: true` entries in `getStaticPaths` and in listing pages.
- **The resume lives at a stable URL, `/resume.pdf`.** Zach supplies this file. Never rename, move, regenerate, or edit it.
- **Canonical host is the apex domain `zachross.io`.** `www` redirects to it, and that redirect is configured in Cloudflare, not here.

## Constraints

- **Performance:** Zero client JS by default. Use islands (`client:*`) only where interactivity is truly needed, and prefer a few lines of inline vanilla JS (e.g. a theme toggle) over pulling in a framework. The Cloudflare Web Analytics beacon is the one allowed third-party script. Target Lighthouse scores of 95+ in all four categories.
- **Accessibility:**
  - semantic landmarks (`header`, `nav`, `main`, `footer`)
  - one `h1` per page
  - alt text on every meaningful image
  - WCAG AA contrast in both themes
  - visible focus styles
  - respect `prefers-reduced-motion`
  - fully keyboard-navigable
- **Theming:** Light and dark via `prefers-color-scheme`, with an optional manual toggle. Colors are defined only as CSS custom properties. The script that applies a saved theme runs inline in `<head>` to avoid a flash of the wrong theme.
- **Privacy:** No third-party trackers, embeds, or cookies. Analytics is Cloudflare Web Analytics only.
- **Security headers:** These live in `public/_headers`:
  - HSTS
  - Content-Security-Policy
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`

  Update the CSP whenever a new external origin is introduced. The Cloudflare analytics beacon needs to be allowed. A static site can't use nonces, so every inline script (and any inline style Astro emits) must be allowed by its `sha256-` hash in the CSP. Whenever an inline script changes, update its hash in `_headers` (`npm run check:csp` prints the expected one), then confirm the browser console shows no CSP violations on the branch's Cloudflare preview URL. `npm run preview` doesn't apply `_headers`, so it can't catch them.

- **Dependencies:** Keep them minimal. Ask before adding any dependency, including dev and build-time ones (e.g. satori/resvg for OG images). The exceptions are the dependencies this file already names.
- **Responsiveness:** Must work at 360px wide with no horizontal scroll.

## Contact & links

- Email: zach@zachross.io
- GitHub / LinkedIn: TODO, fill in real URLs

## Roadmap

Check off steps as they land. Once the site is live, move what's left to GitHub issues and delete this section.

- [x] 1. Scaffold Astro (minimal template, TS strict), set `site`, trailing-slash config, `.nvmrc`, Prettier, `wrangler.jsonc`, add the integrations, and push to GitHub.
- [x] 2. Build `BaseLayout` with all head tags, global styles, the theme setup, and the 404 page.
- [x] 3. Add content collections and schemas, with one placeholder project.
- [x] 4. Build the pages: home, about, and the projects list and detail pages.
- [x] 5. Add OG image generation, sitemap, `robots.txt`, favicon set, and JSON-LD. Have `BaseLayout` default `image` to each page's generated OG image, so every page emits `og:image` and the `summary_large_image` Twitter card.
- [ ] 6. Add `_headers` (with inline-script hashes), the CI workflow (astro check, build, lychee link check), and Renovate.
- [ ] 7. Replace placeholders with real content, then do the Lighthouse and axe pass. Add Zach's resume at `public/resume.pdf` (a copy without personal phone or email) and link it from the home page and the About contact section, replacing the TODO comments there.
