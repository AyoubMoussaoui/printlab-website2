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
assets/
  fonts/           Archivo, self-hosted (no requests to Google), OFL license
  images/          hero + reference imagery
  images/logo/     logo files (see "Logo" below)
  icons/           favicon, standalone icon SVGs
```

The desktop header (`.site-header-desktop`, `.desktop-nav`) and the mobile header (`.site-header-mobile`, `.mobile-menu`, `.hamburger`) are separate components. All mobile-only styling lives inside `@media (max-width: 767px)`.

## Before going live

1. **Contact details:** `CONFIG.whatsappNumber` and `CONFIG.email` in `js/main.js` are set. If they change, also update `impressum.html` and `datenschutz.html`.
2. **Form backend (optional):** set `CONFIG.formEndpoint` (Formspree, Netlify Forms or your own API). Without it, the form opens the visitor's mail app with a pre-filled request, and file attachments must be added by hand.
3. **Hero photo:** `assets/images/hero-workshop.jpg` is the current workshop photo (1024px wide). For sharper results on large screens, replace it with a version about 2400px wide, keeping the subject on the right.
4. **References:** replace the `assets/images/ref-*.svg` placeholders with real photos (4:5) and update the `src` attributes in `index.html`.
5. **Legal pages:** fill in every yellow-highlighted placeholder (`.legal__todo`) in `impressum.html` and `datenschutz.html`: owner name, street address, postcode, VAT status and hosting provider. Remove the highlight once each is filled in. Have both texts checked before launch; they are templates, not legal advice.
6. **Privacy policy upkeep:** `datenschutz.html` describes the site as it is now: no cookies, no tracking, self-hosted fonts, and a form that opens the visitor's email program. Adding a form backend, analytics or any embedded third-party service requires updating it.

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

