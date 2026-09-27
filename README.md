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
impressum.html     legal notice (§ 5 DDG)
datenschutz.html   privacy policy (GDPR)
404.html           "page not found" page (served by GitHub Pages)
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
7. **Own domain:** the site address `https://ayoubmoussaoui.github.io/printlab-website2/` is written in `index.html` (canonical link, social preview tags, structured data), `sitemap.xml`, `robots.txt` and `404.html` (`<base href>`). Replace it everywhere when moving to your own domain.

## Quote form

After a valid submit the visitor chooses **"Per E-Mail senden"** or **"Per WhatsApp senden"**; both open with the request already filled in. E-mail and WhatsApp links can't carry attachments, so the form has no file picker. Instead:

- When "Design vorhanden?" is **Ja**, a hint under the choice explains that the file (logo, artwork) is attached in the next step, and the send box shows three short steps (choose channel → attach with 📎 → send). The pre-filled message includes "Datei: hänge ich an".
- When it is **Nein**, the hint says PRINT LAB will create design proposals.

Optional: set `formEndpoint` in `CONFIG` (`js/main.js`) to a form service such as Formspree or Web3Forms (text only, free plans suffice; extra fields like an access key go in `formFields`). The request is then sent automatically; if a design exists, the success message asks the visitor to send the file via WhatsApp or e-mail. Name the service in `datenschutz.html`. A hidden honeypot field filters simple spam bots and is never sent.

## Checks

Every push to `main` and every pull request runs `.github/workflows/site-checks.yml`:

- HTML validation (`html-validate`, rules in `.htmlvalidate.json`)
- JavaScript syntax check
- `.github/scripts/check-links.mjs`: every local link, image, stylesheet, script, CSS `url()` and in-page anchor must resolve

Run them locally before pushing:

```
npx html-validate index.html impressum.html datenschutz.html 404.html
node --check js/main.js
node .github/scripts/check-links.mjs
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
| `printlab-logo-black.svg` | One color, black: stamps, single-color screen printing, invoices |
| `printlab-logo-white.svg` | One color, white: dark textiles, magenta backgrounds |
| `printlab-mark-*.svg` | Monogram only (`on-dark`, `on-light`, `black`, `white`, `magenta`): neck labels, sleeve prints, embroidery |
| `printlab-profile-1080.png` | Instagram and WhatsApp profile picture |

Colors: magenta `#C91F6F`, black `#0B0B0B`, off-white `#F5F3EE`. Keep clear space around the logo of at least half the monogram's height, and don't use the monogram smaller than 16px on screen or about 12mm in print.

The favicon (`assets/icons/favicon.svg`) and Apple touch icon (`assets/icons/apple-touch-icon.png`) use the same monogram.

