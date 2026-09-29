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
    email: 'just-click@live.fr',
    instagram: 'https://instagram.com/printlab_trier',

    /* Optional form service. Leave formEndpoint empty to use the built-in
       flow: the visitor sends the prepared request by e-mail or WhatsApp and
       attaches their design file there.
       Examples (text only, free plans are enough):
         Formspree:  formEndpoint: 'https://formspree.io/f/XXXXXXX'
         Web3Forms:  formEndpoint: 'https://api.web3forms.com/submit',
                     formFields: { access_key: 'YOUR-KEY' }
       Remember to name the service in datenschutz.html. */
    formEndpoint: '',
    formFields: {}
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
    'hero.lead': 'We print your logo or design on any textile – sharp, colourfast and personal. Starting from a single piece.',
    'hero.cta1': 'Request a quote', 'hero.cta2': 'Our services',
    'fact.1': 'Printing from 1 piece', 'fact.2': 'Free artwork check', 'fact.3': 'Quote within 24 hours', 'fact.4': 'Local production in Trier',
    'services.kicker': 'Services', 'services.title': 'What we print on',
    'services.intro': 'With DTF or screen printing we can print on almost any textile. Bring your own piece or choose from our range.',
    'services.1.t': 'T-shirts', 'services.1.d': 'The classic for teams, events and merch – from basic to premium cotton, in many colours and sizes.',
    'services.2.t': 'Hoodies & sweatshirts', 'services.2.d': 'Warm companions with a strong look. Chest, back or sleeve – we print every position.',
    'services.3.t': 'Caps & beanies', 'services.3.d': 'Snapbacks, trucker caps and beanies with your logo – ideal for crews, clubs and brands.',
    'services.4.t': 'Bags & totes', 'services.4.d': 'Tote bags, gym bags and shoppers – sustainable promo pieces people love to carry.',
    'services.5.t': 'Bottles & accessories', 'services.5.d': 'Water bottles, promotional items and accessories – with special printing even on unusual materials.',
    'services.6.t': 'Your own textile', 'services.6.d': 'Already have the perfect piece? Bring it in – we check the material and print it for you.',
    'methods.kicker': 'Techniques', 'methods.title': 'The right technique for your project',
    'methods.intro': 'We give you honest advice on which process fits your motif, material and quantity.',
    'methods.1.t': 'DTF printing', 'methods.1.d': 'Direct-to-film for brilliant, detailed motifs – including gradients and fine lines.',
    'methods.1.p1': 'Single pieces & small to medium runs', 'methods.1.p2': 'Detailed, full-colour motifs', 'methods.1.p3': 'Suitable for almost all textiles',
    'methods.2.t': 'Screen printing', 'methods.2.d': 'The proven process for rich colours and maximum durability – cost-effective for larger runs.',
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
    'forwho.text': 'Workwear, teamwear, merch, event textiles or one-off pieces – we print for small and large projects.',
    'forwho.1.t': 'Businesses', 'forwho.1.d': 'Workwear & merch',
    'forwho.2.t': 'Clubs', 'forwho.2.d': 'Club apparel & fan gear',
    'forwho.3.t': 'Teams', 'forwho.3.d': 'Teamwear & jerseys',
    'forwho.4.t': 'Events', 'forwho.4.d': 'Event textiles & crew shirts',
    'forwho.5.d': 'Bachelor & bachelorette sets',
    'forwho.6.t': 'Private customers', 'forwho.6.d': 'Gifts & one-offs',
    'design.title': 'No design yet? No problem.', 'design.text': 'We are happy to create several design proposals for you – and you pick your favourite.',
    'design.cta': 'Request a design',
    'refs.kicker': 'Examples', 'refs.title': 'What your print could look like.',
    'refs.note': 'Example images for illustration – photos of our real jobs are coming soon.',
    'refs.1': 'T-shirts', 'refs.2': 'Hoodies & sweatshirts', 'refs.5': 'Bachelor & event sets',
    'refs.6': 'Teamwear & club apparel', 'refs.more': 'More on Instagram',
    'contact.kicker': 'Contact', 'contact.title': "Let's start your project.",
    'contact.lead': 'Send us your request – you will receive a non-binding quote within 24 hours.',
    'contact.wa': 'Message us directly', 'contact.loc': 'Location',
    'form.name': 'Name', 'form.email': 'Email', 'form.phone': 'Phone', 'form.optional': '(optional)',
    'form.product': 'What would you like printed?', 'form.choose': 'Please choose',
    'form.own': 'Own textile', 'form.other': 'Other', 'form.qty': 'Quantity',
    'form.color': 'Colour', 'form.colorPh': 'e.g. black', 'form.position': 'Print position',
    'form.pos1': 'Left chest', 'form.pos2': 'Centre chest', 'form.pos3': 'Back',
    'form.pos4': 'Sleeve', 'form.pos5': 'Multiple positions', 'form.pos6': 'Not sure yet',
    'form.hasDesign': 'Design available?', 'form.yes': 'Yes', 'form.no': 'No',
    'form.message': 'Message', 'form.messagePh': 'Tell us briefly about your idea …',
    'form.hintYes': 'Great! You attach your file (logo, artwork) in the next step, directly to the email or WhatsApp chat.',
    'form.hintNo': 'No problem – we are happy to create several design proposals for you.',
    'form.submit': 'Request quote', 'form.note': 'Free & non-binding. Reply within 24 hours.',
    'form.privacy': 'How we handle your details is explained in our',
    'form.privacyLink': 'privacy policy (German)',
    'footer.tag': 'Custom textile printing from 1 piece',
    'footer.imprint': 'Imprint', 'footer.privacy': 'Privacy',
    'aria.lang': 'Choose language', 'aria.home': 'PRINT LAB Trier – home', 'aria.nav': 'Main navigation',
    'aria.navMobile': 'Mobile navigation', 'aria.trust': 'Our advantages', 'aria.top': 'PRINT LAB Trier – back to top',
    'aria.wa': 'Message us on WhatsApp', 'aria.backTop': 'Back to top',
    'prices.kicker': 'Prices', 'prices.title': 'Fair prices. Clearly calculated.',
    'prices.intro': 'With us you know what you are paying for. Your price depends on the textile, print size, print position (front, back or both), printing method and quantity. The larger your order, the lower the price per piece can be.',
    'prices.label': 'Guide prices', 'prices.from': 'from', 'prices.incl': 'incl. print',
    'prices.premium': 'Premium / oversize shirt', 'prices.transfer': 'Transfer without textile',
    'prices.transferNote': 'You bring your own textile – the price depends on size, printing method and quantity.',
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
    'faq.intro': 'Your question is not here? Just write to us –', 'faq.introLink': 'send a request',
    'faq.q1': 'Is there a minimum order?',
    'faq.a1': 'No – you can order from a single piece. We offer screen printing from 10 pieces; for smaller quantities we recommend DTF printing.',
    'faq.q2': 'How long does my order take?',
    'faq.a2': 'Once you approve the design, production usually takes 5 working days. Shipping adds 1–3 working days. Have a fixed date, for example an event or a bachelor party? Just add it to your request – we will tell you honestly whether it works.',
    'faq.q3': 'When will I get my quote?',
    'faq.a3': 'Within 24 hours of your request – free and non-binding.',
    'faq.q4': "I don't have a design yet – can you help?",
    'faq.a4': 'Of course! We create several design proposals and you pick your favourite. The cost depends on the effort – we tell you the price upfront in the quote.',
    'faq.q5': 'Which files should I send?',
    'faq.a5': 'Ideally a vector file (PDF, SVG, AI or EPS). PNG or JPG work too – in good quality if possible. Not sure? Just send what you have: we check your file for free and get back to you if anything is missing.',
    'faq.q6': 'How do I send you my file?',
    'faq.a6': 'Fill in the request form and choose email or WhatsApp when sending. Your request is already prepared there – just attach your file with the paperclip and send the message.',
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
      sending: 'Wird gesendet …',
      success: 'Danke! Deine Anfrage ist bei uns – wir melden uns innerhalb von 24 Stunden.',
      successWithFile: 'Danke! Deine Anfrage ist bei uns. Schick uns deine Datei (Logo, Motiv) bitte noch per WhatsApp oder E-Mail – wir melden uns innerhalb von 24 Stunden.',
      error: 'Das hat leider nicht geklappt. Bitte versuche es erneut oder schreib uns per WhatsApp.',
      fallbackTitle: 'Fast geschafft! Wie möchtest du deine Anfrage senden?',
      viaEmail: 'Per E-Mail senden', viaWhatsApp: 'Per WhatsApp senden',
      steps: ['Wähle E-Mail oder WhatsApp – deine Anfrage ist schon ausgefüllt.', 'Hänge deine Datei (Logo, Motiv) mit der Büroklammer 📎 an.', 'Nachricht absenden – fertig!'],
      fileLine: 'hänge ich an',
      altEmail: 'Öffnet sich kein E-Mail-Programm? Kopiere deine Anfrage und schick sie an',
      copy: 'Anfrage kopieren', copied: 'Kopiert ✓',
      menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', waText: 'Hallo Team PRINT LAB, ich habe eine Anfrage: '
    },
    en: {
      required: 'Please fill in this field.',
      email: 'Please enter a valid email address.',
      qty: 'Please enter a quantity of at least 1.',
      sending: 'Sending …',
      success: 'Thank you! We have received your request and will reply within 24 hours.',
      successWithFile: 'Thank you! We have received your request. Please send us your file (logo, artwork) via WhatsApp or email – we will reply within 24 hours.',
      error: 'Something went wrong. Please try again or message us on WhatsApp.',
      fallbackTitle: 'Almost done! How would you like to send your request?',
      viaEmail: 'Send by email', viaWhatsApp: 'Send via WhatsApp',
      steps: ['Choose email or WhatsApp – your request is already filled in.', 'Attach your file (logo, artwork) with the paperclip 📎.', 'Send the message – done!'],
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
    const top = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - headerH;
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

  /* ------------------------------------------------------------------------
     4. HEADER STATE
     ------------------------------------------------------------------------ */
  const desktopHeader = document.querySelector('[data-header]');
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
    if (foundId && foundId !== activeSectionId) {
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

    /* ---- Hint under "Design vorhanden?": attach the file in the next step */
    const designHints = Array.from(form.querySelectorAll('[data-design-hint]'));
    function updateDesignHint() {
      const choice = hasDesign() ? 'Ja' : 'Nein';
      designHints.forEach((el) => { el.hidden = el.dataset.designHint !== choice; });
    }
    form.querySelectorAll('input[name="has_design"]').forEach((r) => r.addEventListener('change', updateDesignHint));
    updateDesignHint();

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

    function buildSummary(data) {
      const rows = [
        ['Name', data.get('name')], ['E-Mail', data.get('email')], ['Telefon', data.get('phone')],
        ['Produkt', data.get('product')], ['Stückzahl', data.get('quantity')], ['Farbe', data.get('color')],
        ['Druckposition', data.get('position')], ['Design vorhanden', data.get('has_design')],
        ['Nachricht', data.get('message')]
      ];
      if (data.get('has_design') === 'Ja') rows.push(['Datei', t('fileLine')]);
      return rows.filter((r) => r[1]).map((r) => r[0] + ': ' + r[1]).join('\n');
    }

    /* No form service configured: let the visitor choose e-mail or WhatsApp
       instead of silently firing a mailto: link that may do nothing. */
    function showFallback(data) {
      const subject = 'Anfrage: ' + (data.get('product') || 'Textildruck') + ' – ' + data.get('quantity') + ' Stk.';
      const summary = buildSummary(data);
      const mailHref = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(summary);
      const waHref = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t('waText') + '\n\n' + summary);

      status.textContent = '';
      status.classList.remove('is-error');
      status.classList.add('is-success');

      const title = document.createElement('p');
      title.className = 'quote-form__fallback-title';
      title.textContent = t('fallbackTitle');

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

    async function sendToService(data) {
      Object.keys(CONFIG.formFields).forEach((k) => data.set(k, CONFIG.formFields[k]));
      if (!data.has('subject')) data.set('subject', 'Neue Anfrage über die PRINT LAB Website');
      const withFile = hasDesign();

      submitBtn.disabled = true;
      showStatus(t('sending'));
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        let body = {};
        try { body = await res.json(); } catch (e) { /* non-JSON reply */ }
        if (!res.ok || body.success === false || body.ok === false) throw new Error('HTTP ' + res.status);
        form.reset();
        updateDesignHint();
        form.querySelectorAll('.is-valid').forEach((el) => el.classList.remove('is-valid'));
        showStatus(withFile ? t('successWithFile') : t('success'), 'success');
      } catch (err) {
        showStatus(t('error'), 'error');
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
      if (firstInvalid) { firstInvalid.focus(); return; }

      const data = new FormData(form);
      data.delete('website'); // honeypot is never sent
      if (CONFIG.formEndpoint) sendToService(data);
      else showFallback(data);
    });
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