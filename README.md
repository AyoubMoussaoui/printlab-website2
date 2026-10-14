# PRINT LAB Trier – Website

Marketing and quote-request site for PRINT LAB Trier (custom textile printing). Plain HTML, CSS and vanilla JS, with no build step. Open `index.html` in a browser to preview it.

## Structure

```
index.html
css/
  variables.css    design tokens (colors, radii, type, spacing)
  base.css         reset + document defaults (no styling of bare a/button/nav)
  layout.css       container, headers, sections, grids (desktop defaults)
  components.css   class-scoped components (BEM)
  responsive.css   explicit breakpoints: 1100–1279 / 768–1099 / ≤767 / ≤359
js/
  main.js          i18n (DE/EN), mobile menu, active nav, form, marquee, WhatsApp
  bewertung.js     review form: stars, validation, sending
  reklamation.js   claim form: photo upload (reduced in the browser), DE/EN, sending
zahlung.html       payment & delivery: order flow, Vorkasse/PayPal, shipping, no right of withdrawal for custom work, defects
bewertung.html     review form (stars, name, context, message, optional e-mail, publishing consent); e-mailed via anfrage.php, never auto-published
karriere.html      jobs page (student assistant opening, Google for Jobs data), linked in every footer
reklamation.html   claim page ("Reklamation & Mängelrüge"), linked in every footer
impressum.html     legal notice (§ 5 DDG)
datenschutz.html   privacy policy (GDPR)
404.html           "page not found" page (wired up in .htaccess)
.htaccess          Apache settings for netcup/Plesk: www redirect, 404 page, caching, security headers
robots.txt, sitemap.xml   search engine files
.github/           automatic checks (see "Checks")
assets/
  fonts/           Archivo, self-hosted (no requests to Google), OFL license
  images/          hero + reference imagery
  images/logo/     logo files (see "Logo" below)
  icons/           favicon, standalone icon SVGs
```

The desktop header (`.site-header-desktop`, `.desktop-nav`) and the mobile header (`.site-header-mobile`, `.mobile-menu`, `.hamburger`) are separate components. All mobile-only styling lives inside `@media (max-width: 767px)`.

## Before going live

1. **Contact details:** `CONFIG.whatsappNumber` and `CONFIG.email` in `js/main.js` are set. If they change, also update `impressum.html` and `datenschutz.html`.
2. **Form service:** see "Quote form" below. Until one is connected, visitors send the prepared request themselves by e-mail or WhatsApp.
3. **Hero photo:** `assets/images/hero-workshop.jpg` is the current workshop photo (1024px wide). For sharper results on large screens, replace it with a version about 2400px wide, keeping the subject on the right.
4. **Examples → real work:** the `#references` section shows example images (`assets/images/examples/`, square 1:1, AI-generated with their Content Credentials kept) under the title "So kann dein Druck aussehen" and a "Beispielbilder" note. When real job photos are in, replace the files, rename the section back to "Unsere Arbeiten" (nav label `nav.references`, `refs.kicker`, `refs.title`), remove the `refs.note` paragraph and update the image `alt` texts, in `index.html` and the EN strings in `js/main.js`.
5. **Legal pages:** have both texts checked before launch; they are templates, not legal advice.
6. **Privacy policy upkeep:** `datenschutz.html` must describe what the site actually does. Connecting a form service, adding analytics or embedding any third-party content requires updating it.
7. **Domain and hosting:** the site runs at `https://printlab-trier.de/` on netcup webhosting (Plesk). Plesk pulls the `main` branch from GitHub and deploys it to `/printlab-trier.de/httpdocs`. A GitHub webhook (Settings → Webhooks) tells Plesk about every push to `main`, so a merged pull request goes live within about a minute. If it doesn't, use **Jetzt Pull ausführen** in Plesk → Git. The address is written in `index.html` (canonical link, social preview tags, structured data), `sitemap.xml` and `robots.txt`. GitHub is only used for the source code.

## Design-Konfigurator (archived)

A live design configurator (upload a logo, see it on a T-shirt or hoodie, send the request with a preview image) was built and then taken off the site to keep the page light. The complete, tested code is in commit `8022479` ("Design-Konfigurator release 1 replaces the simple preview"): `css/configurator.css`, `js/configurator.js` and the section markup in `index.html`. To look at it: `git show 8022479 --stat`. To bring it back, restore those files from that commit (`git checkout 8022479 -- css/configurator.css js/configurator.js`) and re-add the section, the menu item and the two asset links. `anfrage.php` already accepts its requests (source `konfigurator`, sizes, print size, dpi).

## Quote form

The form posts to `anfrage.php` on the netcup server (`CONFIG.formEndpoint` in `js/main.js`). The script:

- checks the fields again (name, e-mail, product, quantity, Abholung/Versand, optional Wunschtermin and PLZ),
- e-mails the request to `info@printlab-trier.de` with up to 3 uploaded files attached (PNG, JPG, PDF, SVG, AI, EPS, PSD, TIF, WebP, HEIC; max. 15 MB together). "Reply-To" is the customer, so replying in the mail app answers them directly,
- sends the customer a short confirmation (fixed text plus product, quantity, date and delivery; their free text is never echoed back),
- filters bots with a hidden honeypot field and a time check (submissions faster than 3 seconds are ignored), and limits each IP to 5 sent requests per hour (only a one-way hash of the IP is kept, for at most a day).

The upload area appears when "Design vorhanden?" is **Ja**; for **Nein** a short note says PRINT LAB will create design proposals. If sending fails (server or mail problem), the visitor gets the previous fallback: the request opens pre-filled in their e-mail app or WhatsApp, plus a copy button.

## Claim form (Reklamation)

`reklamation.html` posts to the same `anfrage.php` with `form=reklamation`. Required: name, e-mail, type of issue, description, at least one photo of the defect (up to 4) and one of the whole item (up to 2); the order number is optional. Photos larger than 1.2 MB are redrawn in the browser at max. 2000 px as JPEG, so a claim is usually 1 to 3 MB. The shop mail has the photos attached (names start with `Mangel_` or `Artikel_`), the customer gets a short confirmation. Bot filter and the hourly limit are shared with the quote form. The issue types are listed twice: in `reklamation.html` and in `CLAIM_ISSUES` in `anfrage.php` (the server only accepts those values).

PHP 7.4 or newer is enough; in Plesk (PHP-Einstellungen) choose the newest 8.x version. Uploads need `upload_max_filesize` ≥ 25M and `post_max_size` ≥ 26M (netcup's defaults are higher). If the e-mail settings ever change, update `SHOP_EMAIL` at the top of `anfrage.php` and the privacy policy.

## Checks

Every push to `main` and every pull request runs `.github/workflows/site-checks.yml`:

- HTML validation (`html-validate`, rules in `.htmlvalidate.json`)
- JavaScript and PHP syntax checks
- `.github/scripts/check-links.mjs`: every local link, image, stylesheet, script, CSS `url()` and in-page anchor must resolve
- `.github/scripts/stamp-assets.mjs --check`: every page must reference the current CSS/JS version (see below)

### After changing any CSS or JS file

Run this once before committing:

```
node .github/scripts/stamp-assets.mjs
```

It adds a fingerprint (`?v=…`) to all CSS/JS links in the HTML pages. Without it, visitors' browsers can combine the new HTML with an old cached stylesheet right after a deploy, and new elements then look broken. The check above fails if this step was forgotten.

Run all checks locally before pushing:

```
npx html-validate index.html reklamation.html karriere.html zahlung.html bewertung.html impressum.html datenschutz.html 404.html
node --check js/main.js
node .github/scripts/check-links.mjs
node .github/scripts/stamp-assets.mjs --check
```

## Accessibility & behaviour notes

- Text colors meet WCAG AA contrast. Use `--color-muted` for secondary text (it switches automatically on dark sections) and `--color-magenta-on-dark` for small magenta text on dark backgrounds.
- Scroll-reveal animations only hide content once JavaScript has run (`html.js`), so the page stays readable without JavaScript.
- Translatable screen-reader labels use `data-i18n-aria="key"`, alongside `data-i18n` (text) and `data-i18n-placeholder`.
- The floating WhatsApp and back-to-top buttons step aside only while they would cover an element marked `data-hide-float` (hero buttons, form submit).

## Webshop-ready

Each section is self-contained and IDs are stable (`#services`, `#methods`, …). A shop can be added as its own route (for example `/shop`) that reuses `variables.css`, `base.css` and the header and footer components. The product categories in "Leistungen" and in the form's product select can be linked to shop categories later.

## Logo

The logo is a P/L monogram inside a rounded frame (a nod to a screen-printing screen), with the "PRINT LAB" wordmark and the "Textildruck · Trier" tagline. All text in the logo files is converted to outlines, so they don't depend on the font being installed.

| File | Use |
| --- | --- |
| `printlab-logo-on-dark.svg` / `.png` | Full logo on black or dark backgrounds (the website version) |
| `printlab-logo-on-light.svg` / `.png` | Full logo on white or light backgrounds |
| `printlab-logo-black.svg` / `.png` | One color, black: stamps, single-color screen printing, invoices |
| `printlab-logo-white.svg` / `.png` | One color, white: dark textiles, magenta backgrounds |
| `printlab-mark-*.svg` | Monogram only (`on-dark`, `on-light`, `black`, `white`, `magenta`): neck labels, sleeve prints, embroidery |
| `printlab-profile-1080.png` | Instagram and WhatsApp profile picture |

The `on-dark` and `white` SVG/PNG files have a transparent background and light colors. Opened in a viewer with a white background they look empty; that is expected. The `black` and `white` PNGs are transparent, 2000px wide, for print shops and apps that don't take SVG.

Colors: magenta `#C91F6F`, black `#0B0B0B`, off-white `#F5F3EE`. Keep clear space around the logo of at least half the monogram's height, and don't use the monogram smaller than 16px on screen or about 12mm in print.

The favicon (`assets/icons/favicon.svg`) and Apple touch icon (`assets/icons/apple-touch-icon.png`) use the same monogram.

