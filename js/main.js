/* ==========================================================================
   PRINT LAB Trier — main.js
   Vanilla JS, no dependencies. Modules:
     1. Config          5. Active section highlighting
     2. i18n (DE / EN)  6. Floating WhatsApp visibility
     3. Mobile menu     7. Quote form
     4. Header state    8. Small utilities (marquee, year, links)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONFIG — replace the placeholders before going live
     ------------------------------------------------------------------------ */
  const CONFIG = {
    // TODO: real WhatsApp number in international format, digits only
    whatsappNumber: '4915901378917',
    // TODO: inbox that receives quote requests (used for the mailto fallback)
    email: 'just-click@live.fr',
    // Optional: form backend (e.g. Formspree, Netlify, own API). When set,
    // the form is POSTed there as multipart/form-data instead of mailto.
    formEndpoint: '',
    instagram: 'https://instagram.com/printlab_trier'
  };

  const mqMobile = window.matchMedia('(max-width: 767px)');

  /* ------------------------------------------------------------------------
     2. i18n — German is the source language in the HTML.
     ------------------------------------------------------------------------ */
  const EN = {
    'skip': 'Skip to content',
    'nav.services': 'Services',
    'nav.methods': 'Techniques',
    'nav.how': 'Process',
    'nav.forwho': 'Who for?',
    'nav.references': 'Work',
    'nav.contact': 'Contact',
    'cta.inquire': 'Enquire',
    'hero.eyebrow': 'Textile printing in Trier',
    'hero.title1': 'Your design.',
    'hero.title2': 'Your textile.',
    'hero.lead': 'We print your logo or design on any textile – sharp, colourfast and personal. Starting from a single piece.',
    'hero.cta1': 'Request a quote',
    'hero.cta2': 'Our services',
    'trust.1': 'From 1 piece — no minimum',
    'trust.2': 'Quote within 24 hours',
    'trust.3': 'Delivery across Germany',
    'services.kicker': 'Services',
    'services.title': 'What we print on',
    'services.intro': 'With DTF or screen printing we can print on almost any textile. Bring your own piece or choose from our range.',
    'services.1.t': 'T-shirts',
    'services.1.d': 'The classic for teams, events and merch – from basic to premium cotton, in many colours and sizes.',
    'services.2.t': 'Hoodies & sweatshirts',
    'services.2.d': 'Warm companions with a strong look. Chest, back or sleeve – we print every position.',
    'services.3.t': 'Caps & beanies',
    'services.3.d': 'Snapbacks, trucker caps and beanies with your logo – ideal for crews, clubs and brands.',
    'services.4.t': 'Bags & totes',
    'services.4.d': 'Tote bags, gym bags and shoppers – sustainable promo pieces people love to carry.',
    'services.5.t': 'Bottles & accessories',
    'services.5.d': 'Water bottles, promotional items and accessories – with special printing even on unusual materials.',
    'services.6.t': 'Your own textile',
    'services.6.d': 'Already have the perfect piece? Bring it in – we check the material and print it for you.',
    'methods.kicker': 'Techniques',
    'methods.title': 'The right technique for your project',
    'methods.intro': 'We give you honest advice on which process fits your motif, material and quantity.',
    'methods.1.t': 'DTF printing',
    'methods.1.d': 'Direct-to-film for brilliant, detailed motifs – including gradients and fine lines.',
    'methods.1.p1': 'Single pieces & small to medium runs',
    'methods.1.p2': 'Detailed, full-colour motifs',
    'methods.1.p3': 'Suitable for almost all textiles',
    'methods.2.t': 'Screen printing',
    'methods.2.d': 'The proven process for rich colours and maximum durability – cost-effective for larger runs.',
    'methods.2.p1': 'Extremely durable prints',
    'methods.2.p2': 'Ideal for larger quantities',
    'methods.2.p3': 'Strong spot colours',
    'methods.3.t': 'Special printing',
    'methods.3.d': 'For special materials such as EVA, plastics or promotional items, we find the right solution.',
    'methods.3.tag3': 'Special transfer',
    'how.kicker': 'Process',
    'how.title': 'Your textile in 5 steps',
    'how.1.t': 'Request',
    'how.1.d': 'Send us your idea and quantity.',
    'how.2.t': 'Design',
    'how.2.d': 'On request, we create several proposals.',
    'how.3.t': 'Selection',
    'how.3.d': 'You choose textile, colour and design.',
    'how.4.t': 'Production',
    'how.4.d': 'We print your textiles.',
    'how.5.t': 'Done',
    'how.5.d': 'Pick-up or shipping.',
    'forwho.kicker': 'Who for?',
    'forwho.title': 'For everyone with something to show.',
    'forwho.text': 'Workwear, teamwear, merch, event textiles or one-off pieces – we print for small and large projects.',
    'forwho.1.t': 'Businesses',
    'forwho.1.d': 'Workwear & merch',
    'forwho.2.t': 'Clubs',
    'forwho.2.d': 'Club apparel & fan gear',
    'forwho.3.t': 'Teams',
    'forwho.3.d': 'Teamwear & jerseys',
    'forwho.4.t': 'Events',
    'forwho.4.d': 'Event textiles & crew shirts',
    'forwho.5.d': 'Bachelor & bachelorette sets',
    'forwho.6.t': 'Private customers',
    'forwho.6.d': 'Gifts & one-offs',
    'design.title': 'No design yet? No problem.',
    'design.text': 'We are happy to create several design proposals for you – and you pick your favourite.',
    'design.cta': 'Request a design',
    'refs.kicker': 'References',
    'refs.title': 'Our work.',
    'refs.1': 'T-shirts',
    'refs.2': 'Hoodies & sweatshirts',
    'refs.5': 'Bachelor & event sets',
    'refs.6': 'Teamwear & club apparel',
    'refs.more': 'More on Instagram',
    'contact.kicker': 'Contact',
    'contact.title': "Let's start your project.",
    'contact.lead': 'Send us your request – you will receive a non-binding quote within 24 hours.',
    'contact.wa': 'Message us directly',
    'contact.loc': 'Location',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.optional': '(optional)',
    'form.product': 'What would you like printed?',
    'form.choose': 'Please choose',
    'form.own': 'Own textile',
    'form.other': 'Other',
    'form.qty': 'Quantity',
    'form.color': 'Colour',
    'form.colorPh': 'e.g. black',
    'form.position': 'Print position',
    'form.pos1': 'Left chest',
    'form.pos2': 'Centre chest',
    'form.pos3': 'Back',
    'form.pos4': 'Sleeve',
    'form.pos5': 'Multiple positions',
    'form.pos6': 'Not sure yet',
    'form.hasDesign': 'Design available?',
    'form.yes': 'Yes',
    'form.no': 'No',
    'form.message': 'Message',
    'form.messagePh': 'Tell us briefly about your idea …',
    'form.file': 'Upload file',
    'form.fileHint': 'Choose logo or artwork (PNG, JPG, PDF, SVG)',
    'form.submit': 'Request quote',
    'form.note': 'Free & non-binding. Reply within 24 hours.',
    'form.privacy': 'How we handle your details is explained in our',
    'form.privacyLink': 'privacy policy (German)',
    'footer.tag': 'Custom textile printing from 1 piece',
    'footer.imprint': 'Imprint',
    'footer.privacy': 'Privacy'
  };

  const MESSAGES = {
    de: {
      required: 'Bitte fülle dieses Feld aus.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      qty: 'Bitte gib eine Stückzahl ab 1 an.',
      sending: 'Wird gesendet …',
      success: 'Danke! Deine Anfrage ist bei uns – wir melden uns innerhalb von 24 Stunden.',
      mailto: 'Dein E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage. Bitte hänge deine Datei dort an.',
      error: 'Das hat leider nicht geklappt. Bitte versuche es erneut oder schreib uns per WhatsApp.',
      menuOpen: 'Menü öffnen',
      menuClose: 'Menü schließen',
      waText: 'Hallo PRINT LAB, ich habe eine Anfrage:'
    },
    en: {
      required: 'Please fill in this field.',
      email: 'Please enter a valid email address.',
      qty: 'Please enter a quantity of at least 1.',
      sending: 'Sending …',
      success: 'Thank you! We have received your request and will reply within 24 hours.',
      mailto: 'Your email app will open with the prepared request. Please attach your file there.',
      error: 'Something went wrong. Please try again or message us on WhatsApp.',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      waText: 'Hi PRINT LAB, I have a request:'
    }
  };

  const LANG_KEY = 'printlab-lang';
  let currentLang = 'de';

  // Snapshot the German source strings once so we can switch back.
  const i18nNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const i18nPhNodes = Array.from(document.querySelectorAll('[data-i18n-placeholder]'));
  const DE = {};
  i18nNodes.forEach((el) => { DE[el.dataset.i18n] = DE[el.dataset.i18n] || el.textContent; });
  i18nPhNodes.forEach((el) => { DE[el.dataset.i18nPlaceholder] = el.getAttribute('placeholder'); });

  const t = (key) => (MESSAGES[currentLang] || MESSAGES.de)[key];

  function applyLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'de';
    const dict = currentLang === 'en' ? EN : DE;

    i18nNodes.forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });
    i18nPhNodes.forEach((el) => {
      const value = dict[el.dataset.i18nPlaceholder];
      if (value !== undefined) el.setAttribute('placeholder', value);
    });

    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const qty = document.getElementById('f-qty');
    if (qty) qty.placeholder = currentLang === 'en' ? 'e.g. 25' : 'z. B. 25';

    updateMenuLabel();
    updateWhatsAppLinks();
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) { /* storage unavailable */ }
  }

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  /* ------------------------------------------------------------------------
     3. MOBILE MENU
     ------------------------------------------------------------------------ */
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileHeader = document.querySelector('[data-mobile-header]');

  function isMenuOpen() {
    return menuToggle && menuToggle.getAttribute('aria-expanded') === 'true';
  }

  function updateMenuLabel() {
    if (!menuToggle) return;
    menuToggle.setAttribute('aria-label', isMenuOpen() ? t('menuClose') : t('menuOpen'));
  }

  function openMenu() {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    // next frame → trigger the CSS transition
    requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
    updateMenuLabel();
  }

  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    updateMenuLabel();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => (isMenuOpen() ? closeMenu() : openMenu()));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Close the menu if the viewport grows past the mobile breakpoint.
  const onBreakpointChange = (e) => { if (!e.matches) closeMenu(); };
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBreakpointChange);
  else if (mqMobile.addListener) mqMobile.addListener(onBreakpointChange);

  function scrollToHash(hash) {
    const target = hash === '#top' ? document.body : document.querySelector(hash);
    if (!target) return;
    const headerH = mqMobile.matches && mobileHeader
      ? mobileHeader.querySelector('.site-header-mobile__bar').offsetHeight
      : (document.querySelector('[data-header]') || { offsetHeight: 0 }).offsetHeight;
    const top = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - headerH;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', hash);
  }

  // Mobile links: close first (so the layout settles), then scroll.
  document.querySelectorAll('[data-mobile-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash.charAt(0) !== '#') return;
      e.preventDefault();
      closeMenu();
      requestAnimationFrame(() => scrollToHash(hash));
    });
  });

  /* ------------------------------------------------------------------------
     4. HEADER STATE
     ------------------------------------------------------------------------ */
  const desktopHeader = document.querySelector('[data-header]');
  const onScroll = () => {
    if (desktopHeader) desktopHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------------
     5. ACTIVE SECTION HIGHLIGHTING
     ------------------------------------------------------------------------ */
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
  const sections = Array.from(document.querySelectorAll('[data-section]'));

  function setActive(id) {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Map();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      // Pick the first section (in document order) that occupies the reading band.
      const current = sections.find((s) => visible.get(s.id) > 0);
      setActive(current ? current.id : '');
    }, {
      // A thin band ~35% down the viewport decides which section is "current".
      rootMargin: '-35% 0px -60% 0px',
      threshold: [0, 0.01]
    });
    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ------------------------------------------------------------------------
     6. FLOATING WHATSAPP — hide while primary CTAs are on screen
     ------------------------------------------------------------------------ */
  const waFloat = document.querySelector('[data-wa-float]');
  const hideZones = Array.from(document.querySelectorAll('[data-hide-float]'));

  if (waFloat && 'IntersectionObserver' in window && hideZones.length) {
    const inView = new Set();
    const floatObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      });
      waFloat.classList.toggle('is-hidden', inView.size > 0);
    }, { threshold: 0 });
    hideZones.forEach((zone) => floatObserver.observe(zone));
  }

  function updateWhatsAppLinks() {
    const href = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t('waText'));
    document.querySelectorAll('[data-whatsapp-link]').forEach((a) => { a.href = href; });
  }

  /* ------------------------------------------------------------------------
     7. QUOTE FORM
     ------------------------------------------------------------------------ */
  const form = document.querySelector('[data-quote-form]');

  if (form) {
    const status = form.querySelector('[data-form-status]');
    const fileInput = form.querySelector('[data-file-input]');
    const fileLabel = form.querySelector('[data-file-label]');
    const submitBtn = form.querySelector('[type="submit"]');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (fileInput && fileLabel) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (file) fileLabel.textContent = file.name;
        else fileLabel.textContent = currentLang === 'en' ? EN['form.fileHint'] : DE['form.fileHint'];
      });
    }

    function setError(input, message) {
      const field = input.closest('.field');
      const errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
      if (field) field.classList.toggle('is-invalid', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl && message) {
        errorEl.id = errorEl.id || input.id + '-error';
        input.setAttribute('aria-describedby', errorEl.id);
      }
    }

    function validateInput(input) {
      const value = input.value.trim();
      if (input.required && !value) return t('required');
      if (input.type === 'email' && value && !EMAIL_RE.test(value)) return t('email');
      if (input.name === 'quantity' && value && (!Number.isFinite(+value) || +value < 1)) return t('qty');
      return '';
    }

    const requiredInputs = Array.from(form.querySelectorAll('[required]'));
    requiredInputs.forEach((input) => {
      input.addEventListener('blur', () => { if (input.value) setError(input, validateInput(input)); });
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') setError(input, validateInput(input));
      });
    });

    function buildSummary(data) {
      const rows = [
        ['Name', data.get('name')],
        ['E-Mail', data.get('email')],
        ['Telefon', data.get('phone')],
        ['Produkt', data.get('product')],
        ['Stückzahl', data.get('quantity')],
        ['Farbe', data.get('color')],
        ['Druckposition', data.get('position')],
        ['Design vorhanden', data.get('has_design')],
        ['Nachricht', data.get('message')]
      ];
      const file = data.get('file');
      if (file && file.name) rows.push(['Datei', file.name + ' (bitte anhängen)']);
      return rows.filter((r) => r[1]).map((r) => r[0] + ': ' + r[1]).join('\n');
    }

    function showStatus(message, type) {
      status.textContent = message;
      status.classList.toggle('is-success', type === 'success');
      status.classList.toggle('is-error', type === 'error');
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let firstInvalid = null;
      requiredInputs.forEach((input) => {
        const message = validateInput(input);
        setError(input, message);
        if (message && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const data = new FormData(form);

      if (CONFIG.formEndpoint) {
        submitBtn.disabled = true;
        showStatus(t('sending'));
        try {
          const res = await fetch(CONFIG.formEndpoint, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' }
          });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          if (fileLabel) fileLabel.textContent = currentLang === 'en' ? EN['form.fileHint'] : DE['form.fileHint'];
          showStatus(t('success'), 'success');
        } catch (err) {
          showStatus(t('error'), 'error');
        } finally {
          submitBtn.disabled = false;
        }
        return;
      }

      // Fallback: open the visitor's mail client with a pre-filled request.
      const subject = 'Anfrage: ' + (data.get('product') || 'Textildruck') + ' – ' + data.get('quantity') + ' Stk.';
      window.location.href = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(buildSummary(data));
      showStatus(t('mailto'), 'success');
    });
  }

  /* ------------------------------------------------------------------------
     8. UTILITIES
     ------------------------------------------------------------------------ */
  // Seamless marquee: repeat the group until the track is at least twice the
  // viewport width with an even group count, so translateX(-50%) loops cleanly.
  document.querySelectorAll('[data-marquee]').forEach((track) => {
    const group = track.querySelector('.marquee__group');
    if (!group) return;
    const groupWidth = group.getBoundingClientRect().width || 1;
    const minWidth = Math.max(window.innerWidth, 1920) * 2;
    let count = Math.max(2, Math.ceil(minWidth / groupWidth));
    if (count % 2) count += 1;
    for (let i = 1; i < count; i += 1) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
    // Keep a constant speed regardless of how many copies were added.
    track.style.animationDuration = Math.round((groupWidth * count) / 2 / 40) + 's';
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Initial language: stored choice, otherwise German.
  let initialLang = 'de';
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored) initialLang = stored;
  } catch (e) { /* storage unavailable */ }
  applyLanguage(initialLang);
})();
