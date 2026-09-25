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
assets/
  images/          hero + reference imagery
  icons/           favicon, standalone icon SVGs
```

The desktop header (`.site-header-desktop`, `.desktop-nav`) and the mobile header (`.site-header-mobile`, `.mobile-menu`, `.hamburger`) are separate components. All mobile-only styling lives inside `@media (max-width: 767px)`.

## Before going live

1. **Contact details:** set `CONFIG.whatsappNumber` and `CONFIG.email` in `js/main.js`. Both are placeholders now.
2. **Form backend (optional):** set `CONFIG.formEndpoint` (Formspree, Netlify Forms or your own API). Without it, the form opens the visitor's mail app with a pre-filled request, and file attachments must be added by hand.
3. **Hero photo:** add a real workshop photo at `assets/images/hero-workshop.jpg` (about 2400px wide, subject on the right). Until then a dark studio gradient is shown.
4. **References:** replace the `assets/images/ref-*.svg` placeholders with real photos (4:5) and update the `src` attributes in `index.html`.
5. **Legal pages:** the footer links to `impressum.html` and `datenschutz.html`, which German law requires. Create both pages.

## Webshop-ready

Each section is self-contained and IDs are stable (`#services`, `#methods`, …). A shop can be added as its own route (for example `/shop`) that reuses `variables.css`, `base.css` and the header and footer components. The product categories in "Leistungen" and in the form's product select can be linked to shop categories later.
