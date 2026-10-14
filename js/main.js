/* ==========================================================================
   PRINT LAB Trier — main.js
   Vanilla JS, no dependencies. Modules:
     1. Config         5. Active section highlighting
     2. i18n (DE / EN) 6. Floating buttons (WhatsApp, back to top)
     3. Mobile menu    7. Quote form
     4. Header state   8. Small utilities (marquee, year, reveal)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONFIG
     ------------------------------------------------------------------------ */
  const CONFIG = {
    whatsappNumber: '4915901378917',
    email: 'info@printlab-trier.de',
    instagram: 'https://instagram.com/printlab_trier',

    /* The form posts to anfrage.php on our own server, which e-mails the
       request (with uploaded files) to CONFIG.email and sends the customer a
       confirmation. If that fails, the visitor can still send the prepared
       request by e-mail or WhatsApp. Set to '' to only offer that choice. */
    formEndpoint: 'anfrage.php',
    maxFiles: 3,
    maxTotalBytes: 15 * 1024 * 1024,
    fileTypes: ['png', 'jpg', 'jpeg', 'pdf', 'svg', 'ai', 'eps', 'psd', 'tif', 'tiff', 'webp', 'heic']
  };

  const mqMobile = window.matchMedia('(max-width: 767px)');

  /* ------------------------------------------------------------------------
     2. i18n
     ------------------------------------------------------------------------ */
  const EN = {
    'skip': 'Skip to content', 'nav.services': 'Services', 'nav.methods': 'Techniques',
    'nav.how': 'Process', 'nav.forwho': 'Who for?', 'nav.references': 'Examples',
    'nav.prices': 'Prices', 'nav.contact': 'Contact', 'cta.inquire': 'Enquire',
    'hero.title1': 'Your design.', 'hero.title2': 'Your textile.',
    'hero.lead': 'We print your logo or design on any textile. Sharp, colourfast and personal. Starting from a single piece.',
    'hero.cta1': 'Request a quote', 'hero.cta2': 'Test your logo',
    'fact.1': 'Printing from 1 piece', 'fact.2': 'Free artwork check', 'fact.3': 'Quote within 24 hours', 'fact.4': 'Local production in Trier',
    'services.kicker': 'Services', 'services.title': 'What we print on',
    'services.intro': 'With DTF or screen printing we can print on almost any textile. Bring your own piece or choose from our range.',
    'services.1.t': 'T-shirts', 'services.1.d': 'The classic for teams, events and merch. From basic to premium cotton, in many colours and sizes.',
    'services.2.t': 'Hoodies & sweatshirts', 'services.2.d': 'Warm companions with a strong look. Chest, back or sleeve: we print every position.',
    'services.3.t': 'Caps & beanies', 'services.3.d': 'Snapbacks, trucker caps and beanies with your logo, ideal for crews, clubs and brands.',
    'services.4.t': 'Bags & totes', 'services.4.d': 'Tote bags, gym bags and shoppers. Sustainable promo pieces people love to carry.',
    'services.5.t': 'Bottles & accessories', 'services.5.d': 'Water bottles, promotional items and accessories, with special printing even on unusual materials.',
    'services.6.t': 'Your own textile', 'services.6.d': 'Already have the perfect piece? Bring it in and we check the material and print it for you.',
    'methods.kicker': 'Techniques', 'methods.title': 'The right technique for your project',
    'methods.intro': 'We give you honest advice on which process fits your motif, material and quantity.',
    'methods.1.t': 'DTF printing', 'methods.1.d': 'Direct-to-film for brilliant, detailed motifs, including gradients and fine lines.',
    'methods.1.p1': 'Single pieces & small to medium runs', 'methods.1.p2': 'Detailed, full-colour motifs', 'methods.1.p3': 'Suitable for almost all textiles',
    'methods.2.t': 'Screen printing', 'methods.2.d': 'The proven process for rich colours and maximum durability. Cost-effective for larger runs.',
    'methods.2.p1': 'Extremely durable prints', 'methods.2.p2': 'Ideal for larger quantities', 'methods.2.p3': 'Strong spot colours',
    'methods.3.t': 'Special printing', 'methods.3.d': 'For special materials such as EVA, plastics or promotional items, we find the right solution.',
    'methods.3.tag3': 'Special transfer',
    'how.kicker': 'Process', 'how.title': 'Your textile in 5 steps',
    'how.1.t': 'Request', 'how.1.d': 'Send us your idea and quantity.',
    'how.2.t': 'Design', 'how.2.d': 'On request, we create several proposals.',
    'how.3.t': 'Selection', 'how.3.d': 'You choose textile, colour and design.',
    'how.4.t': 'Production', 'how.4.d': 'We print your textiles.',
    'how.5.t': 'Done', 'how.5.d': 'Pick-up or shipping.',
    'forwho.kicker': 'Who for?', 'forwho.title': 'For everyone with something to show.',
    'forwho.text': 'Workwear, teamwear, merch, event textiles or one-off pieces: we print for small and large projects.',
    'forwho.1.t': 'Businesses', 'forwho.1.d': 'Workwear & merch',
    'forwho.2.t': 'Clubs', 'forwho.2.d': 'Club apparel & fan gear',
    'forwho.3.t': 'Teams', 'forwho.3.d': 'Teamwear & jerseys',
    'forwho.4.t': 'Events', 'forwho.4.d': 'Event textiles & crew shirts',
    'forwho.5.d': 'Bachelor & bachelorette sets',
    'forwho.6.t': 'Private customers', 'forwho.6.d': 'Gifts & one-offs',
    'design.title': 'No design yet? No problem.', 'design.text': 'We are happy to create several design proposals for you and you pick your favourite.',
    'design.cta': 'Request a design',
    'refs.kicker': 'Examples', 'refs.title': 'What your print could look like.',
    'refs.note': 'Example images for illustration.', 'refs.examples': 'Examples',
    'refs.intro': 'Upload your logo and see right away how it looks on your textile.',
    'studio.svgTitle': 'Preview of your design on the textile',
    'studio.dragHint': 'Tip: you can drag your logo on the textile.',
    'studio.upload': 'Upload logo', 'studio.noFile': 'No logo yet? We show you an example.',
    'studio.removeBg': 'Remove white background', 'studio.product': 'Textile',
    'studio.tshirt': 'T-shirt', 'studio.hoodie': 'Hoodie', 'studio.color': 'Colour', 'studio.position': 'Position',
    'studio.posCenter': 'Centre chest', 'studio.posLeft': 'Left chest', 'studio.posBack': 'Back',
    'studio.size': 'Size', 'studio.cta': 'Request with this design',
    'studio.note': 'Non-binding preview. Your file stays on your device until you send the request.',
    'refs.1': 'T-shirts', 'refs.2': 'Hoodies & sweatshirts', 'refs.5': 'Bachelor & event sets',
    'refs.6': 'Teamwear & club apparel', 'refs.more': 'More on Instagram',
    'contact.kicker': 'Contact', 'contact.title': "Let's start your project.",
    'contact.lead': 'Send us your request and you will receive a non-binding quote within 24 hours.',
    'contact.wa': 'Message us directly', 'contact.loc': 'Location',
    'form.name': 'Name', 'form.email': 'Email', 'form.phone': 'Phone', 'form.optional': '(optional)',
    'form.product': 'What would you like printed?', 'form.choose': 'Please choose',
    'form.own': 'Own textile', 'form.other': 'Other', 'form.qty': 'Quantity',
    'form.color': 'Colour', 'form.colorPh': 'e.g. black', 'form.position': 'Print position',
    'form.pos1': 'Left chest', 'form.pos2': 'Centre chest', 'form.pos3': 'Back',
    'form.pos4': 'Sleeve', 'form.pos5': 'Multiple positions', 'form.pos6': 'Not sure yet',
    'form.hasDesign': 'Design available?', 'form.yes': 'Yes', 'form.no': 'No',
    'form.message': 'Message', 'form.messagePh': 'Tell us briefly about your idea …',
    'form.deadline': 'Preferred date', 'form.deadlineHint': 'For example for an event or a bachelor party.',
    'form.delivery': 'Pickup or shipping?', 'form.pickup': 'Pickup in Trier', 'form.shipping': 'Shipping',
    'form.zip': 'Postcode and town', 'form.zipPh': 'e.g. 54290 Trier',
    'form.files': 'Your file (logo, artwork)', 'form.filesCta': 'Choose a file or drop it here',
    'form.filesHint': 'PNG, JPG, PDF, SVG, AI or EPS. Up to 3 files, max. 15 MB in total.',
    'form.hintNo': 'No problem, we are happy to create several design proposals for you.',
    'form.submit': 'Request quote', 'form.note': 'Free & non-binding. Reply within 24 hours.',
    'form.privacy': 'How we handle your details is explained in our',
    'form.privacyLink': 'privacy policy (German)',
    'footer.tag': 'Custom textile printing from 1 piece',
    'footer.imprint': 'Imprint', 'footer.privacy': 'Privacy',
    'aria.lang': 'Choose language', 'aria.home': 'PRINT LAB Trier home page', 'aria.nav': 'Main navigation',
    'aria.navMobile': 'Mobile navigation', 'aria.trust': 'Our advantages', 'aria.top': 'PRINT LAB Trier, back to top',
    'aria.wa': 'Message us on WhatsApp', 'aria.backTop': 'Back to top',
    'prices.kicker': 'Prices', 'prices.title': 'Fair prices. Clearly calculated.',
    'prices.intro': 'With us you know what you are paying for. Your price depends on the textile, print size, print position (front, back or both), printing method and quantity. The larger your order, the lower the price per piece can be.',
    'prices.label': 'Guide prices', 'prices.from': 'from', 'prices.incl': 'incl. print',
    'prices.premium': 'Premium / oversize shirt', 'prices.transfer': 'Transfer without textile',
    'prices.transferNote': 'You bring your own textile. The price depends on size, printing method and quantity.',
    'prices.footnote': 'Print size, additional print positions, printing method and choice of textile can affect the final price.',
    'prices.legal': 'All prices are final prices plus shipping (none for pick-up). No VAT is charged under the small business rule (§ 19 UStG).',
    'prices.moreTitle': 'Other products',
    'prices.moreText': 'Caps, bags, slides, accessories and special items: prices vary more here depending on product, material, printing method, print area and quantity, so we calculate them individually.',
    'prices.moreCta': 'Ask for a price',
    'prices.bulkTitle': 'For larger orders',
    'prices.bulkText': 'For clubs, companies, teams, bachelor parties and larger quantities we create an individual quote with a matching volume price.',
    'prices.bulkCta': 'Request a quote',
    'ship.title': 'Shipping within Germany', 'ship.standard': 'Standard', 'ship.express': 'Express',
    'ship.free': 'Free shipping from', 'ship.freeSuffix': 'order value',
    'faq.title': 'Frequently asked questions.',
    'faq.intro': 'Your question is not here? Just write to us using the', 'faq.introLink': 'request form',
    'faq.q1': 'Is there a minimum order?',
    'faq.a1': 'No, you can order from a single piece. We offer screen printing from 10 pieces; for smaller quantities we recommend DTF printing.',
    'faq.q2': 'How long does my order take?',
    'faq.a2': 'Once you approve the design, production usually takes 5 working days. Shipping adds 1 to 3 working days. Have a fixed date, for example an event or a bachelor party? Just add it to your request and we will tell you honestly whether it works.',
    'faq.q3': 'When will I get my quote?',
    'faq.a3': 'Within 24 hours of your request, free and non-binding.',
    'faq.q4': "I don't have a design yet. Can you help?",
    'faq.a4': 'Of course! We create several design proposals and you pick your favourite. The cost depends on the effort. We tell you the price upfront in the quote.',
    'faq.q5': 'Which files should I send?',
    'faq.a5': 'Ideally a vector file (PDF, SVG, AI or EPS). PNG or JPG work too. Not sure? Just send what you have: we check your file for free and get back to you if anything is missing.',
    'faq.q6': 'How do I send you my file?',
    'faq.a6': 'Simply upload your file directly in the request form, up to 3 files at once. You can also send it to us later by email or WhatsApp.',
    'faq.q7': 'Which printing method is right for me?',
    'faq.a7': 'DTF printing suits single pieces, small quantities and detailed, colourful designs. Screen printing is ideal from 10 pieces for larger runs and is especially durable. For special materials such as plastic or EVA there is special printing. We are happy to advise which method fits your project.',
    'faq.q8': 'Can I bring my own textile?',
    'faq.a8': 'Yes! Just bring your piece in. We first check whether the material and surface are suitable for printing. The transfer alone starts at €10.00.',
    'faq.q10': 'How long does the print last?',
    'faq.a10': 'With the right care, a long time: DTF prints last about 50 washes, screen prints even more than 50. Our care tips: wash inside out, no tumble dryer and do not iron directly on the print.',
    'faq.q11': 'How can I pay?',
    'faq.a11': 'You pay conveniently by bank transfer in advance (prepayment).',
    'faq.q9': 'How much is shipping?',
    'faq.a9': 'Within Germany, standard shipping costs €7.50 and express €14.00. Orders from €199 ship free. If you pick up your order in Trier by arrangement, there are no shipping costs.'
  };

  const MESSAGES = {
    de: {
      required: 'Bitte fülle dieses Feld aus.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      qty: 'Bitte gib eine Stückzahl ab 1 an.',
      delivery: 'Bitte wähle Abholung oder Versand.',
      fileType: 'Dieses Dateiformat können wir leider nicht annehmen: {name}',
      fileCount: 'Bitte höchstens 3 Dateien auswählen.',
      fileSize: 'Die Dateien sind zusammen größer als 15 MB. Schick größere Dateien gerne per E-Mail oder WhatsApp.',
      removeFile: '{name} entfernen',
      sending: 'Wird gesendet …',
      success: 'Danke! Deine Anfrage ist bei uns angekommen. Du bekommst gleich eine Bestätigung per E-Mail, und wir melden uns innerhalb von 24 Stunden.',
      rate: 'Du hast gerade schon mehrere Anfragen gesendet. Bitte versuche es später erneut oder schreib uns per WhatsApp.',
      fallbackTitle: 'Fast geschafft! Wie möchtest du deine Anfrage senden?',
      studioNoPreview: 'Für {name} können wir hier keine Vorschau zeigen. Die Datei wird trotzdem mit deiner Anfrage gesendet.',
      studioTooBig: 'Diese Datei ist größer als 15 MB. Schick sie uns gerne per E-Mail oder WhatsApp.',
      sendFailed: 'Das Senden hat gerade nicht geklappt. Schick uns deine Anfrage einfach per E-Mail oder WhatsApp, sie ist schon ausgefüllt:',
      viaEmail: 'Per E-Mail senden', viaWhatsApp: 'Per WhatsApp senden',
      steps: ['Wähle E-Mail oder WhatsApp, deine Anfrage ist schon ausgefüllt.', 'Hänge deine Datei (Logo, Motiv) mit der Büroklammer 📎 an.', 'Nachricht absenden, fertig!'],
      fileLine: 'hänge ich an',
      altEmail: 'Öffnet sich kein E-Mail-Programm? Kopiere deine Anfrage und schick sie an',
      copy: 'Anfrage kopieren', copied: 'Kopiert ✓',
      menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', waText: 'Hallo Team PRINT LAB, ich habe eine Anfrage: '
    },
    en: {
      required: 'Please fill in this field.',
      email: 'Please enter a valid email address.',
      qty: 'Please enter a quantity of at least 1.',
      delivery: 'Please choose pickup or shipping.',
      fileType: 'We cannot accept this file format: {name}',
      fileCount: 'Please choose up to 3 files.',
      fileSize: 'The files are larger than 15 MB in total. Feel free to send bigger files by email or WhatsApp.',
      removeFile: 'Remove {name}',
      sending: 'Sending …',
      success: 'Thank you! Your request has arrived. You will get a confirmation by email shortly, and we will reply within 24 hours.',
      rate: 'You have already sent several requests. Please try again later or message us on WhatsApp.',
      fallbackTitle: 'Almost done! How would you like to send your request?',
      studioNoPreview: 'We cannot show a preview for {name} here. The file will still be sent with your request.',
      studioTooBig: 'This file is larger than 15 MB. Feel free to send it by email or WhatsApp.',
      sendFailed: 'Sending did not work just now. Simply send your request by email or WhatsApp, it is already filled in:',
      viaEmail: 'Send by email', viaWhatsApp: 'Send via WhatsApp',
      steps: ['Choose email or WhatsApp, your request is already filled in.', 'Attach your file (logo, artwork) with the paperclip 📎.', 'Send the message, done!'],
      fileLine: 'attached',
      altEmail: 'No email app opening? Copy your request and send it to',
      copy: 'Copy request', copied: 'Copied ✓',
      menuOpen: 'Open menu', menuClose: 'Close menu', waText: 'Hi PRINT LAB, I have a request: '
    }
  };

  const LANG_KEY = 'printlab-lang';
  let currentLang = 'de';

  const i18nNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const i18nPhNodes = Array.from(document.querySelectorAll('[data-i18n-placeholder]'));
  const i18nAriaNodes = Array.from(document.querySelectorAll('[data-i18n-aria]'));
  const DE = {};
  i18nNodes.forEach((el) => { DE[el.dataset.i18n] = DE[el.dataset.i18n] || el.textContent; });
  i18nPhNodes.forEach((el) => { DE[el.dataset.i18nPlaceholder] = el.getAttribute('placeholder'); });
  i18nAriaNodes.forEach((el) => { DE[el.dataset.i18nAria] = DE[el.dataset.i18nAria] || el.getAttribute('aria-label'); });

  const t = (key, vars) => {
    let msg = (MESSAGES[currentLang] || MESSAGES.de)[key] || '';
    if (vars && typeof msg === 'string') Object.keys(vars).forEach((k) => { msg = msg.split('{' + k + '}').join(vars[k]); });
    return msg;
  };

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
    i18nAriaNodes.forEach((el) => {
      const value = dict[el.dataset.i18nAria];
      if (value !== undefined) el.setAttribute('aria-label', value);
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
    document.dispatchEvent(new CustomEvent('printlab:lang'));
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) {}
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

  function isMenuOpen() { return menuToggle && menuToggle.getAttribute('aria-expanded') === 'true'; }
  function updateMenuLabel() {
    if (!menuToggle) return;
    menuToggle.setAttribute('aria-label', isMenuOpen() ? t('menuClose') : t('menuOpen'));
  }
  function openMenu() {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
    updateMenuLabel();
    updateMobileCta();
  }
  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    updateMenuLabel();
    updateMobileCta();
  }

  if (menuToggle) menuToggle.addEventListener('click', () => (isMenuOpen() ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isMenuOpen()) { closeMenu(); menuToggle.focus(); } });
  document.addEventListener('click', (e) => {
    if (!isMenuOpen()) return;
    if (mobileMenu && mobileMenu.contains(e.target)) return;
    if (menuToggle && menuToggle.contains(e.target)) return;
    closeMenu();
  });
  const onBreakpointChange = (e) => { if (!e.matches) closeMenu(); };
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBreakpointChange);
  else if (mqMobile.addListener) mqMobile.addListener(onBreakpointChange);

  function scrollToHash(hash) {
    const target = hash === '#top' ? document.body : document.querySelector(hash);
    if (!target) return;
    const headerH = mqMobile.matches && mobileHeader
      ? mobileHeader.querySelector('.site-header-mobile__bar').offsetHeight
      : (document.querySelector('[data-header]') || { offsetHeight: 0 }).offsetHeight;
    // Skip most of the section's top padding so its title lands just under the header
    const gap = mqMobile.matches ? 28 : 48;
    const padTop = parseFloat(getComputedStyle(target).paddingTop) || 0;
    const skip = Math.max(0, padTop - gap);
    const top = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - headerH + skip;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', hash);

    // Move keyboard focus with the scroll (skip link, screen readers)
    const focusTarget = hash === '#top' ? document.getElementById('main') : target;
    if (focusTarget) {
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    if (isMenuOpen()) closeMenu();
    const targetHash = href === '#' ? '#top' : href;
    requestAnimationFrame(() => scrollToHash(targetHash));
  });

  // Arriving with a hash (e.g. index.html#faq from another page): use the same offset
  window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (/^#[\w-]+$/.test(hash) && hash !== '#top' && document.querySelector(hash)) scrollToHash(hash);
  });

  /* ------------------------------------------------------------------------
     4. HEADER STATE
     ------------------------------------------------------------------------ */
  const desktopHeader = document.querySelector('[data-header]');

  // Measured header height, so the hero + marquee fill exactly one screen
  const heroEl = document.querySelector('.hero');
  const setHeaderReal = () => {
    if (heroEl) document.documentElement.style.setProperty('--header-real', heroEl.offsetTop + 'px');
  };
  setHeaderReal();
  window.addEventListener('resize', setHeaderReal, { passive: true });
  const onScroll = () => { if (desktopHeader) desktopHeader.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------------
     5. ACTIVE SECTION HIGHLIGHTING
     ------------------------------------------------------------------------ */
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
  const sections = Array.from(document.querySelectorAll('[data-section]'));
  let activeSectionId = '';

  function updateActiveNav() {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + activeSectionId;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function determineActiveSection() {
    if (document.body.classList.contains('is-locked')) return;
    const triggerPoint = window.innerHeight * 0.4;
    let foundId = '';
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerPoint) { foundId = section.id; break; }
    }
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      if (sections.length) foundId = sections[sections.length - 1].id;
    }
    if (foundId !== activeSectionId) { // '' at the top clears the highlight
      activeSectionId = foundId;
      updateActiveNav();
    }
  }
  window.addEventListener('scroll', determineActiveSection, { passive: true });
  window.addEventListener('resize', determineActiveSection);
  window.addEventListener('touchend', determineActiveSection);
  determineActiveSection();

  /* ------------------------------------------------------------------------
     6. FLOATING BUTTONS
     WhatsApp stays visible; both buttons step aside only while they would
     cover an element marked [data-hide-float] (hero CTAs, form submit).
     ------------------------------------------------------------------------ */
  const waFloat = document.querySelector('[data-wa-float]');
  const backToTop = document.getElementById('back-to-top');
  const floats = [waFloat, backToTop].filter(Boolean);
  const hideZones = Array.from(document.querySelectorAll('[data-hide-float]'));

  function overlaps(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  // Phones: sticky request bar once the hero buttons are gone, but not
  // in the contact section (the form has its own button) or with the menu open
  const mobileCta = document.querySelector('[data-mobile-cta]');
  const heroCtas = document.querySelector('.hero__ctas');
  const contactSection = document.getElementById('contact');

  function updateMobileCta() {
    if (!mobileCta || !heroCtas || !contactSection) return;
    const pastHero = heroCtas.getBoundingClientRect().bottom < 0;
    const c = contactSection.getBoundingClientRect();
    const inContact = c.top < window.innerHeight && c.bottom > 0;
    const menuOpen = document.body.classList.contains('is-locked');
    mobileCta.classList.toggle('is-visible', pastHero && !inContact && !menuOpen);
  }

  let floatsQueued = false;
  function updateFloats() {
    floatsQueued = false;
    updateMobileCta();
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 500);
    const zones = hideZones.map((z) => z.getBoundingClientRect());
    floats.forEach((btn) => {
      // Layout box (offset*) ignores the hide animation's transform, so the
      // check doesn't flip-flop at the edge; 8px margin keeps a small gap.
      const m = 8;
      const r = { left: btn.offsetLeft - m, top: btn.offsetTop - m,
        right: btn.offsetLeft + btn.offsetWidth + m, bottom: btn.offsetTop + btn.offsetHeight + m };
      btn.classList.toggle('is-hidden', zones.some((z) => overlaps(r, z)));
    });
  }
  function queueFloats() {
    if (!floatsQueued) { floatsQueued = true; requestAnimationFrame(updateFloats); }
  }
  window.addEventListener('scroll', queueFloats, { passive: true });
  window.addEventListener('resize', queueFloats);
  updateFloats();

  function updateWhatsAppLinks() {
    const href = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t('waText'));
    document.querySelectorAll('[data-whatsapp-link]').forEach((a) => {
      a.href = href; a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ------------------------------------------------------------------------
     7. QUOTE FORM
     ------------------------------------------------------------------------ */
  const form = document.querySelector('[data-quote-form]');

  if (form) {
    const status = form.querySelector('[data-form-status]');
    const submitBtn = form.querySelector('[type="submit"]');
    const honeypot = form.querySelector('#f-website');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const hasDesign = () => (form.querySelector('input[name="has_design"]:checked') || {}).value === 'Ja';
    const formStart = Date.now();

    /* ---- "Design vorhanden?": upload area for Ja, a short note for Nein */
    const designHints = Array.from(form.querySelectorAll('[data-design-hint]'));
    function updateDesignHint() {
      const choice = hasDesign() ? 'Ja' : 'Nein';
      designHints.forEach((el) => { el.hidden = el.dataset.designHint !== choice; });
    }
    form.querySelectorAll('input[name="has_design"]').forEach((r) => r.addEventListener('change', updateDesignHint));
    updateDesignHint();

    /* ---- Wunschtermin: no dates in the past */
    const deadline = form.querySelector('#f-deadline');
    if (deadline) {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      deadline.min = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    }

    /* ---- Abholung oder Versand: PLZ field only for Versand */
    const deliveryGroup = form.querySelector('[data-required-group="delivery"]');
    const deliveryError = form.querySelector('[data-error-for="delivery"]');
    const shippingOnly = Array.from(form.querySelectorAll('[data-shipping-only]'));
    const deliveryValue = () => (form.querySelector('input[name="delivery"]:checked') || {}).value || '';
    function setDeliveryError(message) {
      if (deliveryError) deliveryError.textContent = message || '';
      if (deliveryGroup) deliveryGroup.classList.toggle('is-invalid', Boolean(message));
    }
    function updateDelivery() {
      shippingOnly.forEach((el) => { el.hidden = deliveryValue() !== 'Versand'; });
      if (deliveryValue()) setDeliveryError('');
    }
    form.querySelectorAll('input[name="delivery"]').forEach((r) => r.addEventListener('change', updateDelivery));

    /* ---- File upload: keep our own list so files can be added and removed */
    const fileInput = form.querySelector('#f-files');
    const fileList = form.querySelector('[data-file-list]');
    const fileError = form.querySelector('[data-error-for="f-files"]');
    const fileZone = fileInput ? fileInput.closest('.upload__zone') : null;
    let selectedFiles = [];

    const formatSize = (bytes) => (bytes < 1024 * 1024
      ? Math.max(1, Math.round(bytes / 1024)) + ' KB'
      : (bytes / 1024 / 1024).toFixed(1).replace('.', currentLang === 'de' ? ',' : '.') + ' MB');

    function renderFiles() {
      if (!fileList) return;
      fileList.textContent = '';
      selectedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'upload__item';
        const name = document.createElement('span');
        name.className = 'upload__name';
        name.textContent = file.name;
        const size = document.createElement('span');
        size.className = 'upload__size';
        size.textContent = formatSize(file.size);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'upload__remove';
        remove.setAttribute('aria-label', t('removeFile', { name: file.name }));
        remove.textContent = '×';
        remove.addEventListener('click', () => {
          selectedFiles.splice(index, 1);
          if (fileError) fileError.textContent = '';
          renderFiles();
          fileInput.focus();
        });
        li.append(name, size, remove);
        fileList.appendChild(li);
      });
    }

    function addFiles(list) {
      let message = '';
      Array.from(list).forEach((file) => {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        const total = selectedFiles.reduce((sum, f) => sum + f.size, 0) + file.size;
        if (selectedFiles.some((f) => f.name === file.name && f.size === file.size)) return;
        if (!CONFIG.fileTypes.includes(ext)) message = message || t('fileType', { name: file.name });
        else if (selectedFiles.length >= CONFIG.maxFiles) message = message || t('fileCount');
        else if (total > CONFIG.maxTotalBytes) message = message || t('fileSize');
        else selectedFiles.push(file);
      });
      if (fileError) fileError.textContent = message;
      renderFiles();
    }

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        addFiles(fileInput.files);
        fileInput.value = ''; // allows choosing the same file again after removing it
      });
      ['dragenter', 'dragover'].forEach((type) => fileInput.addEventListener(type, () => fileZone.classList.add('is-dragover')));
      ['dragleave', 'drop'].forEach((type) => fileInput.addEventListener(type, () => fileZone.classList.remove('is-dragover')));
    }

    /* ---- Validation */
    function setError(input, message) {
      const field = input.closest('.field');
      const errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
      if (field) field.classList.toggle('is-invalid', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      input.classList.toggle('is-invalid', Boolean(message));
      input.classList.toggle('is-valid', !message && input.value.trim() !== '');
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
        if (input.getAttribute('aria-invalid') === 'true' || input.checkValidity()) setError(input, validateInput(input));
      });
    });

    // Re-translate visible messages when the language changes
    document.addEventListener('printlab:lang', () => {
      requiredInputs.forEach((input) => {
        if (input.getAttribute('aria-invalid') === 'true') setError(input, validateInput(input));
      });
    });

    /* ---- Status area */
    function showStatus(message, type) {
      status.textContent = message;
      status.classList.toggle('is-success', type === 'success');
      status.classList.toggle('is-error', type === 'error');
    }

    const formatDate = (value) => (value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('.') : value || '');

    function buildSummary(data) {
      const rows = [
        ['Name', data.get('name')], ['E-Mail', data.get('email')], ['Telefon', data.get('phone')],
        ['Produkt', data.get('product')], ['Stückzahl', data.get('quantity')], ['Farbe', data.get('color')],
        ['Druckposition', data.get('position')], ['Wunschtermin', formatDate(data.get('deadline'))],
        ['Lieferung', data.get('delivery')], ['PLZ und Ort', data.get('delivery') === 'Versand' ? data.get('zip') : ''],
        ['Design vorhanden', data.get('has_design')], ['Nachricht', data.get('message')]
      ];
      if (data.get('has_design') === 'Ja') rows.push(['Datei', t('fileLine')]);
      return rows.filter((r) => r[1]).map((r) => r[0] + ': ' + r[1]).join('\n');
    }

    /* No form service configured: let the visitor choose e-mail or WhatsApp
       instead of silently firing a mailto: link that may do nothing. */
    function showFallback(data, failed) {
      const subject = 'Anfrage: ' + (data.get('product') || 'Textildruck') + ', ' + data.get('quantity') + ' Stk.';
      const summary = buildSummary(data);
      const mailHref = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(summary);
      const waHref = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t('waText') + '\n\n' + summary);

      status.textContent = '';
      status.classList.remove('is-error');
      status.classList.add('is-success');

      const title = document.createElement('p');
      title.className = 'quote-form__fallback-title';
      title.textContent = failed ? t('sendFailed') : t('fallbackTitle');

      const actions = document.createElement('div');
      actions.className = 'quote-form__fallback-actions';
      [[mailHref, t('viaEmail'), 'btn--light'], [waHref, t('viaWhatsApp'), 'btn--whatsapp']].forEach(([href, label, mod]) => {
        const a = document.createElement('a');
        a.className = 'btn ' + mod;
        a.href = href;
        a.textContent = label;
        if (href.startsWith('https:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        actions.appendChild(a);
      });

      status.appendChild(title);
      status.appendChild(actions);

      // Webmail users (e.g. Gmail in the browser) may have no mail app for mailto:
      const alt = document.createElement('p');
      alt.className = 'quote-form__alt';
      alt.appendChild(document.createTextNode(t('altEmail') + ' '));
      const addr = document.createElement('strong');
      addr.className = 'quote-form__alt-address';
      addr.textContent = CONFIG.email;
      alt.appendChild(addr);
      if (navigator.clipboard && window.isSecureContext) {
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'quote-form__copy';
        copyBtn.textContent = t('copy');
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(subject + '\n\n' + summary).then(() => {
            copyBtn.textContent = t('copied');
          }).catch(() => {});
        });
        alt.appendChild(document.createTextNode(' '));
        alt.appendChild(copyBtn);
      }
      status.appendChild(alt);
      if (data.get('has_design') === 'Ja') {
        const steps = document.createElement('ol');
        steps.className = 'quote-form__steps';
        t('steps').forEach((text) => {
          const li = document.createElement('li');
          li.textContent = text;
          steps.appendChild(li);
        });
        status.appendChild(steps);
      }
      actions.firstChild.focus();
    }

    function resetForm() {
      form.reset();
      selectedFiles = [];
      renderFiles();
      updateDesignHint();
      updateDelivery();
      form.querySelectorAll('.is-valid').forEach((el) => el.classList.remove('is-valid'));
    }

    /* ---- Design handed over from the live preview */
    let studioFiles = [];
    document.addEventListener('printlab:design', (e) => {
      const d = e.detail || {};
      const product = form.querySelector('#f-product');
      const position = form.querySelector('#f-position');
      const color = form.querySelector('#f-color');
      if (product && d.product) product.value = d.product;
      if (position && d.position) position.value = d.position;
      if (color && d.color) color.value = d.color;
      [product, color].forEach((el) => { if (el && el.value) setError(el, ''); });
      if (d.files && d.files.length) {
        const ja = form.querySelector('input[name="has_design"][value="Ja"]');
        if (ja) ja.checked = true;
        updateDesignHint();
        selectedFiles = selectedFiles.filter((f) => !studioFiles.includes(f));
        studioFiles = d.files.slice();
        addFiles(d.files);
      }
    });

    async function sendToServer(data) {
      submitBtn.disabled = true;
      showStatus(t('sending'));
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        let body = {};
        try { body = await res.json(); } catch (e) { /* non-JSON reply */ }
        if (res.status === 429) { showStatus(t('rate'), 'error'); return; }
        if (!res.ok || body.ok !== true) throw new Error('HTTP ' + res.status);
        resetForm();
        showStatus(t('success'), 'success');
        status.focus();
      } catch (err) {
        showFallback(data, true);
      } finally {
        submitBtn.disabled = false;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (honeypot && honeypot.value.trim() !== '') return; // bot filled the hidden field

      let firstInvalid = null;
      requiredInputs.forEach((input) => {
        const message = validateInput(input);
        setError(input, message);
        if (message && !firstInvalid) firstInvalid = input;
      });
      if (!deliveryValue()) {
        setDeliveryError(t('delivery'));
        if (!firstInvalid) firstInvalid = form.querySelector('input[name="delivery"]');
      }
      if (firstInvalid) { firstInvalid.focus(); return; }

      const data = new FormData(form);
      data.delete('website'); // honeypot is never sent
      data.delete('files[]');
      if (hasDesign()) selectedFiles.forEach((file) => data.append('files[]', file, file.name));
      data.set('t', String(formStart));
      data.set('lang', currentLang);
      if (CONFIG.formEndpoint) sendToServer(data);
      else showFallback(data);
    });
  }

  /* ------------------------------------------------------------------------
     7b. DESIGN PREVIEW ("Dein Logo testen")
     Everything happens in the browser: the uploaded logo is drawn onto an
     SVG garment. "Mit diesem Design anfragen" hands the original file and
     a rendered preview image over to the quote form.
     ------------------------------------------------------------------------ */
  const studio = document.querySelector('[data-studio]');

  if (studio) {
    const svg = studio.querySelector('[data-studio-svg]');
    const fileInput = studio.querySelector('#studio-file');
    const emptyNote = studio.querySelector('[data-studio-empty]');
    const fileNote = studio.querySelector('[data-studio-file]');
    const bgWrap = studio.querySelector('[data-studio-bg]');
    const bgToggle = studio.querySelector('[data-studio-bg-toggle]');
    const sizeInput = studio.querySelector('[data-studio-size]');
    const swatchWrap = studio.querySelector('[data-studio-swatches]');
    const colorName = studio.querySelector('[data-studio-color-name]');
    const cta = studio.querySelector('[data-studio-cta]');
    const NS = 'http://www.w3.org/2000/svg';

    const COLORS = [
      { id: 'black', de: 'Schwarz', en: 'Black', hex: '#1C1C1E' },
      { id: 'white', de: 'Weiß', en: 'White', hex: '#F7F6F3' },
      { id: 'grey', de: 'Grau meliert', en: 'Heather grey', hex: '#A4A7AC' },
      { id: 'navy', de: 'Navy', en: 'Navy', hex: '#1F2A44' },
      { id: 'red', de: 'Rot', en: 'Red', hex: '#B42A32' },
      { id: 'green', de: 'Flaschengrün', en: 'Bottle green', hex: '#1F4A38' },
      { id: 'sand', de: 'Sand', en: 'Sand', hex: '#D9C9AA' },
      { id: 'pink', de: 'Rosa', en: 'Pink', hex: '#EDB3C6' }
    ];

    /* Garments in a 500 × 560 viewBox. Areas are the printable zones. */
    const GARMENTS = {
      tshirt: {
        form: 'T-Shirts',
        body: 'M200 58 C220 82 280 82 300 58 L372 80 C402 92 440 120 462 150 L418 218 L366 192 L362 516 C330 526 170 526 138 516 L134 192 L82 218 L38 150 C60 120 98 92 128 80 Z',
        front: {
          bands: ['M200 58 C220 82 280 82 300 58 C292 72 276 92 250 92 C224 92 208 72 200 58 Z'],
          seams: ['M128 80 C130 120 132 160 134 192', 'M372 80 C370 120 368 160 366 192', 'M140 500 C172 509 328 509 360 500', 'M50 166 L94 226', 'M450 166 L406 226'],
          extras: []
        },
        back: {
          bands: ['M205 58 C225 66 275 66 295 58 C288 66 272 74 250 74 C228 74 212 66 205 58 Z'],
          seams: ['M128 80 C130 120 132 160 134 192', 'M372 80 C370 120 368 160 366 192', 'M140 500 C172 509 328 509 360 500', 'M50 166 L94 226', 'M450 166 L406 226'],
          extras: []
        },
        areas: { center: [175, 128, 150, 180], left: [268, 116, 54, 52], back: [165, 108, 170, 210] }
      },
      hoodie: {
        form: 'Hoodies / Sweatshirts',
        body: 'M172 88 L328 88 C366 96 398 114 416 152 C434 212 446 280 454 328 L412 342 C402 290 388 244 372 216 L370 498 C336 510 164 510 130 498 L128 216 C112 244 98 290 88 342 L46 328 C54 280 66 212 84 152 C102 114 134 96 172 88 Z',
        front: {
          under: ['M170 96 C164 40 208 12 250 12 C292 12 336 40 330 96 Z'],
          bands: ['M206 94 C206 56 226 38 250 38 C274 38 294 56 294 94 C280 104 220 104 206 94 Z', 'M46 328 L88 342 L83 362 L41 348 Z', 'M454 328 L412 342 L417 362 L459 348 Z', 'M130 498 C164 510 336 510 370 498 L370 522 C336 534 164 534 130 522 Z'],
          seams: ['M172 388 L328 388 L352 476 L148 476 Z', 'M198 388 L176 476', 'M302 388 L324 476', 'M128 216 C126 170 140 124 172 92', 'M372 216 C374 170 360 124 328 92'],
          extras: [['M233 102 L229 196', 3.2], ['M267 102 L271 196', 3.2]]
        },
        back: {
          bands: ['M46 328 L88 342 L83 362 L41 348 Z', 'M454 328 L412 342 L417 362 L459 348 Z', 'M130 498 C164 510 336 510 370 498 L370 522 C336 534 164 534 130 522 Z'],
          seams: ['M128 216 C126 170 140 124 172 92', 'M372 216 C374 170 360 124 328 92'],
          over: ['M176 96 C172 40 214 16 250 16 C286 16 328 40 324 96 C304 132 196 132 176 96 Z'],
          overSeams: ['M250 18 L250 124'],
          extras: []
        },
        areas: { center: [180, 196, 140, 168], left: [280, 146, 46, 46], back: [160, 146, 180, 228] }
      }
    };

    const state = {
      product: 'tshirt', color: 'black', position: 'center', size: 80,
      dx: 0, dy: 0,
      logo: null,           // { src, w, h, demo }
      file: null,           // the visitor's original file
      previewable: false,
      bgDetected: false,
      source: null          // canvas with the original pixels
    };
    const demoLogos = {};

    const colorById = (id) => COLORS.find((c) => c.id === id) || COLORS[0];
    const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const isLight = (hex) => { const [r, g, b] = hexToRgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) > 150; };
    const mix = (hex, target, amount) => {
      const a = hexToRgb(hex), b = hexToRgb(target);
      return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * amount).toString(16).padStart(2, '0')).join('');
    };

    /* ---- Colour swatches */
    COLORS.forEach((c, i) => {
      const label = document.createElement('label');
      label.className = 'swatch';
      label.title = c.de;
      const input = document.createElement('input');
      input.className = 'swatch__input';
      input.type = 'radio';
      input.name = 'studio-color';
      input.value = c.id;
      input.checked = i === 0;
      input.setAttribute('aria-label', c.de);
      const dot = document.createElement('span');
      dot.className = 'swatch__dot';
      dot.style.backgroundColor = c.hex;
      label.append(input, dot);
      swatchWrap.appendChild(label);
    });

    function updateColorLabels() {
      const c = colorById(state.color);
      colorName.textContent = currentLang === 'en' ? c.en : c.de;
      swatchWrap.querySelectorAll('.swatch').forEach((label) => {
        const col = colorById(label.querySelector('input').value);
        const name = currentLang === 'en' ? col.en : col.de;
        label.title = name;
        label.querySelector('input').setAttribute('aria-label', name);
      });
    }

    /* ---- Geometry of the logo inside the active print area */
    function area() {
      const a = GARMENTS[state.product].areas[state.position];
      return { x: a[0], y: a[1], w: a[2], h: a[3] };
    }

    function logoRect() {
      if (!state.logo) return null;
      const a = area();
      const ratio = state.logo.h / state.logo.w;
      let w = a.w * state.size / 100;
      let h = w * ratio;
      if (h > a.h) { h = a.h; w = h / ratio; }
      const freeX = (a.w - w) / 2, freeY = a.h - h;
      // Chest prints sit high; keep the drag offset inside the area
      state.dx = Math.max(-freeX, Math.min(freeX, state.dx));
      const baseY = state.position === 'left' ? 0 : freeY * 0.15;
      state.dy = Math.max(-baseY, Math.min(freeY - baseY, state.dy));
      return { x: a.x + freeX + state.dx, y: a.y + baseY + state.dy, w, h };
    }

    /* ---- Build the SVG markup */
    function garmentMarkup(forExport) {
      const g = GARMENTS[state.product];
      const view = state.position === 'back' ? g.back : g.front;
      const base = colorById(state.color).hex;
      const light = isLight(base);
      const band = light ? mix(base, '#000000', 0.12) : mix(base, '#FFFFFF', 0.06);
      const inner = light ? mix(base, '#000000', 0.22) : mix(base, '#000000', 0.35);
      const seam = light ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.10)';
      const outline = light ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.35)';
      const r = logoRect();
      const id = forExport ? 'x' : 's';
      const p = (d, fill, extra) => '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>';
      const strokes = (list, color, width) => list.map((d) => '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + width + '" stroke-linecap="round" stroke-dasharray="' + (width < 2 ? '3 4' : 'none') + '"/>').join('');
      const title = currentLang === 'en' ? 'Preview of your design on the textile' : 'Vorschau deines Designs auf dem Textil';
      let out = '<title' + (forExport ? '' : ' id="studio-svg-title"') + '>' + escapeXml(title) + '</title>';
      out += '<defs>'
        + '<clipPath id="' + id + '-clip"><path d="' + g.body + '"/></clipPath>'
        + '<linearGradient id="' + id + '-side" x1="0" x2="1" y1="0" y2="0">'
        + '<stop offset="0" stop-color="#000" stop-opacity="0.28"/><stop offset="0.2" stop-color="#000" stop-opacity="0"/>'
        + '<stop offset="0.8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.28"/></linearGradient>'
        + '<radialGradient id="' + id + '-light" cx="0.45" cy="0.3" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity="' + (light ? 0.18 : 0.08) + '"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
        + '<filter id="' + id + '-noise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter>'
        + '</defs>';
      out += '<ellipse cx="250" cy="540" rx="170" ry="12" fill="#000" opacity="0.08"/>';
      (view.under || []).forEach((d) => { out += p(d, band, ' stroke="' + outline + '" stroke-width="1"'); });
      out += p(g.body, base, ' stroke="' + outline + '" stroke-width="1"');
      if (r) {
        out += '<g clip-path="url(#' + id + '-clip)"><image class="studio__logo" data-studio-logo="" href="' + state.logo.src + '" x="' + r.x.toFixed(1) + '" y="' + r.y.toFixed(1) + '" width="' + r.w.toFixed(1) + '" height="' + r.h.toFixed(1) + '" preserveAspectRatio="xMidYMid meet" opacity="0.96"/></g>';
      }
      out += '<g clip-path="url(#' + id + '-clip)" pointer-events="none">'
        + '<rect x="0" y="0" width="500" height="560" fill="url(#' + id + '-side)"/>'
        + '<rect x="0" y="0" width="500" height="560" fill="url(#' + id + '-light)"/>'
        + '<rect x="0" y="0" width="500" height="560" filter="url(#' + id + '-noise)" opacity="' + (light ? 0.10 : 0.16) + '"/>'
        + '</g>';
      view.bands.forEach((d, i) => { out += p(d, i === 0 && state.product === 'hoodie' && view === g.front ? inner : band, ' stroke="' + outline + '" stroke-width="0.8"'); });
      out += strokes(view.seams, seam, 1.4);
      (view.over || []).forEach((d) => { out += p(d, mix(base, light ? '#000000' : '#FFFFFF', light ? 0.06 : 0.04), ' stroke="' + outline + '" stroke-width="1"'); });
      out += strokes(view.overSeams || [], seam, 1.4);
      view.extras.forEach(([d, w]) => { out += '<path d="' + d + '" fill="none" stroke="' + (light ? '#FFFFFF' : '#E9E6E0') + '" stroke-width="' + w + '" stroke-linecap="round"/>'; });
      if (!forExport) {
        const a = area();
        out += '<rect class="studio__area" x="' + a.x + '" y="' + a.y + '" width="' + a.w + '" height="' + a.h + '" fill="none" stroke="' + (light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)') + '" stroke-width="1.2" stroke-dasharray="5 5" rx="4" opacity="0"/>';
      }
      return out;
    }

    function escapeXml(text) {
      return String(text).replace(/[<>&"]/g, (ch) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[ch]));
    }

    function render() {
      if (state.logo && state.logo.demo) state.logo = demoLogos[isLight(colorById(state.color).hex) ? 'dark' : 'light'] || state.logo;
      svg.innerHTML = garmentMarkup(false);
      updateColorLabels();
    }

    function updateLogoOnly() {
      const img = svg.querySelector('[data-studio-logo]');
      const r = logoRect();
      if (!img || !r) { render(); return; }
      img.setAttribute('x', r.x.toFixed(1));
      img.setAttribute('y', r.y.toFixed(1));
      img.setAttribute('width', r.w.toFixed(1));
      img.setAttribute('height', r.h.toFixed(1));
    }

    /* ---- Demo logo (PRINT LAB) until the visitor uploads their own */
    async function loadDemo(url) {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const vb = (text.match(/viewBox="([\d.\s-]+)"/) || [])[1];
        const [, , w, h] = vb ? vb.split(/\s+/).map(Number) : [0, 0, 224, 64];
        return { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text), w, h, demo: true };
      } catch (e) { return null; }
    }

    Promise.all([
      loadDemo('assets/images/logo/printlab-logo-white.svg'),
      loadDemo('assets/images/logo/printlab-logo-black.svg')
    ]).then(([lightLogo, darkLogo]) => {
      demoLogos.light = lightLogo; // for dark textiles
      demoLogos.dark = darkLogo;   // for light textiles
      if (!state.logo) { state.logo = lightLogo || darkLogo; render(); }
    });

    /* ---- Uploads */
    const PREVIEW_EXT = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'heic', 'gif'];

    function showFileNote(text, warning) {
      emptyNote.hidden = true;
      fileNote.hidden = false;
      fileNote.textContent = text;
      fileNote.classList.toggle('is-warning', Boolean(warning));
    }

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    function hasWhiteBackground(ctx, w, h) {
      const pts = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1], [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1]];
      return pts.every(([x, y]) => {
        const d = ctx.getImageData(x, y, 1, 1).data;
        return d[3] > 245 && d[0] > 232 && d[1] > 232 && d[2] > 232;
      });
    }

    /* Flood-fill from the edges: only white connected to the border becomes
       transparent, so white parts inside a logo stay white. */
    function removeWhite(canvas) {
      const ctx = canvas.getContext('2d');
      const { width: w, height: h } = canvas;
      const img = ctx.getImageData(0, 0, w, h);
      const d = img.data;
      const seen = new Uint8Array(w * h);
      const stack = [];
      const isWhite = (i) => d[i * 4 + 3] > 0 && d[i * 4] > 228 && d[i * 4 + 1] > 228 && d[i * 4 + 2] > 228;
      for (let x = 0; x < w; x += 1) { stack.push(x, (h - 1) * w + x); }
      for (let y = 0; y < h; y += 1) { stack.push(y * w, y * w + w - 1); }
      while (stack.length) {
        const i = stack.pop();
        if (seen[i] || !isWhite(i)) continue;
        seen[i] = 1;
        d[i * 4 + 3] = 0;
        const x = i % w;
        if (x > 0) stack.push(i - 1);
        if (x < w - 1) stack.push(i + 1);
        if (i >= w) stack.push(i - w);
        if (i < w * (h - 1)) stack.push(i + w);
      }
      // Soften the edge: light pixels next to removed ones become partly transparent
      for (let i = 0; i < w * h; i += 1) {
        if (seen[i]) continue;
        const x = i % w;
        const near = (x > 0 && seen[i - 1]) || (x < w - 1 && seen[i + 1]) || (i >= w && seen[i - w]) || (i < w * (h - 1) && seen[i + w]);
        if (!near) continue;
        const min = Math.min(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
        if (min > 170) d[i * 4 + 3] = Math.round(d[i * 4 + 3] * (255 - min) / 85);
      }
      ctx.putImageData(img, 0, 0);
      return canvas;
    }

    /* Crop away transparent margins so the logo fills the print area */
    function trim(canvas) {
      const ctx = canvas.getContext('2d');
      const { width: w, height: h } = canvas;
      const d = ctx.getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          if (d[(y * w + x) * 4 + 3] > 12) {
            if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < 0) return canvas;
      const out = document.createElement('canvas');
      out.width = x1 - x0 + 1;
      out.height = y1 - y0 + 1;
      out.getContext('2d').drawImage(canvas, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
      return out;
    }

    function copyCanvas(src) {
      const c = document.createElement('canvas');
      c.width = src.width;
      c.height = src.height;
      c.getContext('2d').drawImage(src, 0, 0);
      return c;
    }

    function applySource() {
      let canvas = copyCanvas(state.source);
      if (state.bgDetected && bgToggle.checked) canvas = removeWhite(canvas);
      canvas = trim(canvas);
      state.logo = { src: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height, demo: false };
      state.dx = 0;
      state.dy = 0;
      render();
    }

    async function handleFile(file) {
      if (!file) return;
      if (file.size > CONFIG.maxTotalBytes) { showFileNote(t('studioTooBig'), true); return; }
      state.file = file;
      state.previewable = false;
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const url = URL.createObjectURL(file);
      try {
        if (!PREVIEW_EXT.includes(ext)) throw new Error('no preview');
        const img = await loadImage(url);
        const nw = img.naturalWidth || 1000, nh = img.naturalHeight || 1000;
        const scale = Math.min(1, 1200 / Math.max(nw, nh));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(nw * scale));
        canvas.height = Math.max(1, Math.round(nh * scale));
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        state.source = canvas;
        state.bgDetected = hasWhiteBackground(ctx, canvas.width, canvas.height);
        bgWrap.hidden = !state.bgDetected;
        bgToggle.checked = true;
        state.previewable = true;
        applySource();
        showFileNote(file.name, false);
      } catch (err) {
        bgWrap.hidden = true;
        showFileNote(t('studioNoPreview', { name: file.name }), true);
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    fileInput.addEventListener('change', () => {
      handleFile(fileInput.files[0]);
      fileInput.value = '';
    });
    bgToggle.addEventListener('change', () => { if (state.source) applySource(); });

    /* ---- Options */
    studio.addEventListener('change', (e) => {
      const el = e.target;
      if (el.name === 'studio-product') { state.product = el.value; state.dx = 0; state.dy = 0; render(); }
      if (el.name === 'studio-color') { state.color = el.value; render(); }
      if (el.name === 'studio-position') {
        state.position = el.value; state.dx = 0; state.dy = 0;
        state.size = el.value === 'left' ? 100 : 80;
        sizeInput.value = state.size;
        render();
      }
    });
    sizeInput.addEventListener('input', () => { state.size = Number(sizeInput.value); updateLogoOnly(); });

    /* ---- Drag the logo inside the print area */
    let drag = null;
    function svgPoint(evt) {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    svg.addEventListener('pointerdown', (e) => {
      const img = e.target.closest('[data-studio-logo]');
      if (!img) return;
      e.preventDefault();
      const p = svgPoint(e);
      drag = { x: p.x, y: p.y, dx: state.dx, dy: state.dy, img };
      img.classList.add('is-dragging');
      const guide = svg.querySelector('.studio__area');
      if (guide) guide.setAttribute('opacity', '1');
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const p = svgPoint(e);
      state.dx = drag.dx + (p.x - drag.x);
      state.dy = drag.dy + (p.y - drag.y);
      updateLogoOnly();
    });
    const endDrag = () => {
      if (!drag) return;
      drag.img.classList.remove('is-dragging');
      const guide = svg.querySelector('.studio__area');
      if (guide) guide.setAttribute('opacity', '0');
      drag = null;
    };
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    /* ---- Render the preview as a PNG for the request */
    function previewFile() {
      return new Promise((resolve) => {
        const markup = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 560" width="1000" height="1120">' + garmentMarkup(true) + '</svg>';
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 1000;
          canvas.height = 1120;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#F3F1EC';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (!blob) { resolve(null); return; }
            const c = colorById(state.color);
            const name = 'Vorschau-' + (state.product === 'hoodie' ? 'Hoodie' : 'T-Shirt') + '-' + c.de.replace(/\W+/g, '') + '-' + positionLabel().replace(/\W+/g, '') + '.png';
            resolve(new File([blob], name, { type: 'image/png' }));
          }, 'image/png');
        };
        img.onerror = () => resolve(null);
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
      });
    }

    function positionLabel() {
      return { center: 'Brust mittig', left: 'Brust links', back: 'Rücken' }[state.position];
    }

    cta.addEventListener('click', async () => {
      const files = [];
      if (state.file) {
        files.push(state.file);
        if (state.previewable) {
          const preview = await previewFile();
          if (preview) files.push(preview);
        }
      }
      document.dispatchEvent(new CustomEvent('printlab:design', {
        detail: {
          product: GARMENTS[state.product].form,
          color: colorById(state.color).de,
          position: positionLabel(),
          files
        }
      }));
      scrollToHash('#contact');
    });

    document.addEventListener('printlab:lang', render);
    render();
  }

  /* ------------------------------------------------------------------------
     8. UTILITIES
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-marquee]').forEach((track) => {
    const group = track.querySelector('.marquee__group');
    if (!group) return;
    const groupWidth = group.getBoundingClientRect().width || 1;
    const minWidth = Math.max(window.innerWidth, 1920) * 2;
    let count = Math.max(2, Math.ceil(minWidth / groupWidth));
    if (count % 2) count += 1;
    for (let i = 1; i < count; i += 1) {
      const clone = group.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.appendChild(clone);
    }
    track.style.animationDuration = Math.round((groupWidth * count) / 2 / 40) + 's';
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Scroll reveal. Content is only hidden while html.js is set (see CSS),
  // so it is revealed immediately where the observer is unavailable.
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  let initialLang = 'de';
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored) initialLang = stored;
  } catch (e) {}
  
  applyLanguage(initialLang);
})();