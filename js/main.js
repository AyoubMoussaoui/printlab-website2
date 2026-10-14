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
    'nav.prices': 'Prices', 'nav.contact': 'Contact', 'nav.jobs': 'Jobs', 'cta.inquire': 'Enquire',
    'hero.title1': 'Your design.', 'hero.title2': 'Your finish.',
    'hero.lead': 'We print textiles, promotional items and accessories. Sharp, colourfast and personal. Starting from a single piece.',
    'hero.cta1': 'Request a quote', 'hero.cta2': 'Our services',
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
    'forwho.1.t': 'Businesses', 'forwho.1.d': 'Corporate wear & merch',
    'forwho.2.t': 'Trades & hospitality', 'forwho.2.d': 'Workwear & team outfits',
    'forwho.3.t': 'Clubs', 'forwho.3.d': 'Club apparel & fan gear',
    'forwho.4.t': 'Sports teams', 'forwho.4.d': 'Jerseys, training & teamwear',
    'forwho.5.t': 'Schools & graduates', 'forwho.5.d': 'Graduation & class shirts',
    'forwho.6.t': 'Events & celebrations', 'forwho.6.d': 'Event textiles, crew shirts & bachelor parties',
    'forwho.7.t': 'Bands, artists & creators', 'forwho.7.d': 'Merch & tour shirts',
    'forwho.8.t': 'Brands & start‑ups', 'forwho.8.d': 'Small runs for your own label',
    'forwho.9.t': 'Private customers', 'forwho.9.d': 'Gifts & one-offs',
    'design.title': 'No design yet? No problem.', 'design.text': 'We are happy to create several design proposals for you and you pick your favourite.',
    'design.cta': 'Request a design',
    'refs.kicker': 'Examples', 'refs.title': 'What your print could look like.',
    'refs.note': 'Example images for illustration.',
    'refs.1': 'T-shirts', 'refs.2': 'Hoodies & sweatshirts', 'refs.5': 'Bachelor & event sets',
    'refs.6': 'Teamwear & club apparel', 'refs.more': 'More on Instagram',
    'contact.kicker': 'Contact', 'contact.title': "Let's start your project.",
    'contact.lead': 'Send us your request and you will receive a non-binding quote within 24 hours.',
    'form.name': 'Name', 'form.email': 'Email', 'form.phone': 'Phone', 'form.optional': '(optional)',
    'form.product': 'What would you like printed?',
    'form.pTshirt': 'T-shirts', 'form.pHoodie': 'Hoodies', 'form.pCap': 'Caps & beanies', 'form.pBag': 'Bags',
    'form.pBottle': 'Bottles', 'form.own': 'Own textile', 'form.other': 'Other', 'form.qty': 'Quantity',
    'form.color': 'Colour', 'form.colorPh': 'e.g. black', 'form.position': 'Print position',
    'form.posFront': 'Front', 'form.posBack': 'Back', 'form.posBoth': 'Front & back', 'form.posUnsure': 'Not sure yet',
    'form.extras': 'Colour & preferred date',
    'form.step1': 'Step 1 of 2', 'form.step1Title': 'Your project', 'form.step2': 'Step 2 of 2', 'form.step2Title': 'Contact & file',
    'form.next': 'Next', 'form.nextNote': 'One more short step: contact and file.', 'form.back': 'Back', 'form.change': 'Change',
    'form.message': 'Message', 'form.messagePh': 'Any other wishes or questions …',
    'form.deadline': 'Preferred date', 'form.deadlineHint': 'For example for an event or a bachelor party.',
    'form.delivery': 'Pickup or shipping?', 'form.pickup': 'Pickup in Trier', 'form.shipping': 'Shipping',
    'form.zip': 'Postcode and town', 'form.zipPh': 'e.g. 54290 Trier',
    'form.files': 'Your file (logo, artwork)', 'form.filesCta': 'Choose a file or drop it here',
    'form.filesHint': 'PNG, JPG, PDF, SVG, AI or EPS. Up to 3 files, max. 15 MB in total.',
    'form.filesSafe': 'We use your files only for your quote and your order. They are transferred encrypted and deleted once everything is done.',
    'form.filesSafeLink': 'More on privacy',
    'form.noDesign': 'No design yet? No problem, we are happy to create proposals for you.',
    'form.submit': 'Request quote', 'form.note': 'Free & non-binding. Reply within 24 hours.',
    'form.privacy': 'How we handle your details is explained in our',
    'form.privacyLink': 'privacy policy (German)',
    'footer.tag': 'Custom textile printing from 1 piece',
    'footer.payment': 'Payment & delivery', 'footer.claim': 'Claims', 'footer.review': 'Reviews', 'footer.imprint': 'Imprint', 'footer.privacy': 'Privacy',
    'aria.lang': 'Choose language', 'aria.home': 'PRINT LAB Trier home page', 'aria.nav': 'Main navigation',
    'aria.navMobile': 'Mobile navigation', 'aria.trust': 'Our advantages', 'aria.top': 'PRINT LAB Trier, back to top',
    'aria.wa': 'Message us on WhatsApp', 'aria.backTop': 'Back to top',
    'prices.kicker': 'Prices', 'prices.title': 'Fair prices. Clearly calculated.',
    'prices.intro': 'With us you know what you are paying for. Your exact price depends on effort, quantity and print position. Within 24 hours we send you a transparent quote with a fixed price, free and non-binding for you.',
    'prices.label': 'Guide prices', 'prices.from': 'Guide price from', 'prices.incl': 'incl. print',
    'prices.note': 'Guide prices are starting prices for orientation. Elaborate or multi-colour designs, larger print areas, additional print positions and the choice of textile can change the final price. Your exact price is in your quote.',
    'prices.premium': 'Premium / oversize shirt', 'prices.transfer': 'Transfer without textile',
    'prices.transferNote': 'You bring your own textile. The price depends on size, printing method and quantity.',
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
    'faq.a11': 'Once you have approved the quote, you pay by bank transfer in advance (prepayment) or via PayPal. Production starts as soon as your payment has arrived.',
    'reviews.kicker': 'Customer reviews', 'reviews.all': 'See all reviews',
    'faq.q9': 'How much is shipping?',
    'faq.a9': 'Within Germany, standard shipping costs €7.50 and express €14.00. Orders from €199 ship free. If you pick up your order in Trier by arrangement, there are no shipping costs.'
  };

  const MESSAGES = {
    de: {
      required: 'Bitte fülle dieses Feld aus.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      qty: 'Bitte gib eine Stückzahl ab 1 an.',
      delivery: 'Bitte wähle Abholung oder Versand.',
      product: 'Bitte wähle aus, was wir bedrucken sollen.', pcs: 'Stk.',
      fileType: 'Dieses Dateiformat können wir leider nicht annehmen: {name}',
      fileCount: 'Bitte höchstens 3 Dateien auswählen.',
      fileSize: 'Die Dateien sind zusammen größer als 15 MB. Schick größere Dateien gerne per E-Mail oder WhatsApp.',
      removeFile: '{name} entfernen',
      sending: 'Wird gesendet …',
      success: 'Danke! Deine Anfrage ist bei uns angekommen. Du bekommst gleich eine Bestätigung per E-Mail, und wir melden uns innerhalb von 24 Stunden.',
      rate: 'Du hast gerade schon mehrere Anfragen gesendet. Bitte versuche es später erneut oder schreib uns per WhatsApp.',
      fallbackTitle: 'Fast geschafft! Wie möchtest du deine Anfrage senden?',
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
      product: 'Please choose what we should print on.', pcs: 'pcs',
      fileType: 'We cannot accept this file format: {name}',
      fileCount: 'Please choose up to 3 files.',
      fileSize: 'The files are larger than 15 MB in total. Feel free to send bigger files by email or WhatsApp.',
      removeFile: 'Remove {name}',
      sending: 'Sending …',
      success: 'Thank you! Your request has arrived. You will get a confirmation by email shortly, and we will reply within 24 hours.',
      rate: 'You have already sent several requests. Please try again later or message us on WhatsApp.',
      fallbackTitle: 'Almost done! How would you like to send your request?',
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

  /* Changing the language changes text lengths, so everything below moves
     and the screen would show a different place. Remember the first element
     visible under the header and put it back at the same spot afterwards. */
  function findScrollAnchor() {
    const main = document.getElementById('main');
    if (!main || window.scrollY < 1) return null;
    let headerBottom = 0;
    document.querySelectorAll('[data-header], [data-mobile-header]').forEach((h) => {
      const r = h.getBoundingClientRect();
      if (r.height > 0) headerBottom = Math.max(headerBottom, r.bottom);
    });
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT);
    let el = walker.nextNode();
    while (el) {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.top >= headerBottom - 1) return { el, top: r.top };
      // Skip what lies completely above the visible area
      el = r.bottom < headerBottom ? (walker.nextSibling() || nextOutside(walker)) : walker.nextNode();
    }
    return null;
  }
  function nextOutside(walker) {
    while (walker.parentNode()) {
      const next = walker.nextSibling();
      if (next) return next;
    }
    return null;
  }

  function applyLanguage(lang) {
    const anchor = findScrollAnchor();
    // The browser's own scroll anchoring would correct a second time
    if (anchor) document.documentElement.style.overflowAnchor = 'none';
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
    if (anchor) {
      const shift = anchor.el.getBoundingClientRect().top - anchor.top;
      // Instantly: 'auto' would follow the page's smooth scrolling and
      // show the content jumping away and gliding back
      const root = document.documentElement;
      root.style.scrollBehavior = 'auto';
      if (Math.abs(shift) >= 1) window.scrollTo(0, window.scrollY + shift);
      requestAnimationFrame(() => { root.style.overflowAnchor = ''; root.style.scrollBehavior = ''; });
    }
  }

  /* Once the visitor has chosen a language with our own switch, the
     browser must not offer its own translation as well: in-app browsers
     (e.g. the Google app) then put a translation bar over the top of the
     page, which pushes the header down and hides the start of the hero. */
  function declineBrowserTranslation() {
    document.documentElement.setAttribute('translate', 'no');
    if (!document.querySelector('meta[name="google"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google';
      meta.content = 'notranslate';
      document.head.appendChild(meta);
    }
  }

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      declineBrowserTranslation();
      applyLanguage(btn.dataset.lang);
      // Remember only a real choice, so first-time visitors keep the browser's offer
      try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) {}
    });
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
    // Back to top leaves a clean address, so a refresh simply starts at the top
    if (history.replaceState) history.replaceState(null, '', hash === '#top' ? location.pathname + location.search : hash);

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

  /* Phones and tablets: the visible height changes all the time (toolbars
     appear and hide, pull-to-refresh), and browsers report it differently.
     The hero is therefore sized from the physical screen height, which
     never changes, so no toolbar state can show a strip of the next
     section under the marquee. Set once, so nothing moves while scrolling. */
  const setScreenHeight = () => {
    const s = window.screen;
    if (!s || !s.width || !s.height) return;
    const landscape = window.matchMedia('(orientation: landscape)').matches;
    const h = landscape ? Math.min(s.width, s.height) : Math.max(s.width, s.height);
    document.documentElement.style.setProperty('--screen-h', h + 'px');
  };
  setScreenHeight();
  window.addEventListener('orientationchange', () => setTimeout(setScreenHeight, 200));
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
     Not the footer: at the end of the page "back to top" is most useful,
     and the footer leaves room for the buttons instead.
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
    const formStart = Date.now();

    /* ---- Two steps: 1 = the project, 2 = contact and file. Step 1 is
       checked before step 2 opens; going back keeps everything filled in. */
    const steps = Array.from(form.querySelectorAll('[data-form-step]'));
    const progress2 = form.querySelector('[data-progress-2]');
    const summaryEl = form.querySelector('[data-form-summary]');
    let currentStep = 1;
    const radioValue = (name) => (form.querySelector('input[name="' + name + '"]:checked') || {}).value || '';

    function updateSummary() {
      if (!summaryEl) return;
      const product = form.querySelector('input[name="product"]:checked');
      const position = form.querySelector('input[name="position"]:checked');
      const delivery = form.querySelector('input[name="delivery"]:checked');
      const label = (input) => (input ? input.closest('label').textContent.trim() : '');
      const qty = form.querySelector('#f-qty').value.trim();
      summaryEl.textContent = [label(product), qty ? qty + ' ' + t('pcs') : '', label(position), label(delivery)]
        .filter(Boolean).join(' · ');
    }

    function goStep(n, moveFocus) {
      currentStep = n;
      steps.forEach((el) => {
        const active = Number(el.dataset.formStep) === n;
        el.hidden = !active;
        el.classList.toggle('is-entering', active && moveFocus);
      });
      if (progress2) progress2.classList.toggle('is-done', n === 2);
      if (n === 2) updateSummary();
      if (!moveFocus) return;
      // Keep the top of the form in view, then lead the eye to the new step
      const top = form.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) {
        const offset = (document.querySelector('.site-header-mobile__bar') || {}).offsetHeight
          || (document.querySelector('[data-header]') || {}).offsetHeight || 0;
        window.scrollTo({ top: Math.max(0, top + window.pageYOffset - offset - 16), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      const title = steps[n - 1].querySelector('.form-step__title');
      if (title) title.focus({ preventScroll: true });
    }
    document.addEventListener('printlab:lang', () => { if (currentStep === 2) updateSummary(); });

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
    const deliveryValue = () => radioValue('delivery');
    function setDeliveryError(message) {
      if (deliveryError) deliveryError.textContent = message || '';
      if (deliveryGroup) deliveryGroup.classList.toggle('is-invalid', Boolean(message));
    }

    /* ---- Product cards */
    const productGroup = form.querySelector('[data-required-group="product"]');
    const productError = form.querySelector('[data-error-for="product"]');
    function setProductError(message) {
      if (productError) productError.textContent = message || '';
      if (productGroup) productGroup.classList.toggle('is-invalid', Boolean(message));
    }
    form.querySelectorAll('input[name="product"]').forEach((r) => r.addEventListener('change', () => setProductError('')));
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

    const requiredInputs = Array.from(form.querySelectorAll('[required]')).filter((input) => input.type !== 'radio');
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
        ['Nachricht', data.get('message')]
      ];
      if (selectedFiles.length) rows.push(['Datei', t('fileLine')]);
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
      if (selectedFiles.length) {
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
      updateDelivery();
      goStep(1, false);
      form.querySelectorAll('.is-valid').forEach((el) => el.classList.remove('is-valid'));
    }

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

    /* ---- Step checks: returns the first invalid element of that step */
    const inStep = (el, n) => Number(el.closest('[data-form-step]').dataset.formStep) === n;
    function checkStep(n) {
      let firstInvalid = null;
      if (n === 1 && !radioValue('product')) {
        setProductError(t('product'));
        firstInvalid = form.querySelector('input[name="product"]');
      }
      requiredInputs.filter((input) => inStep(input, n)).forEach((input) => {
        const message = validateInput(input);
        setError(input, message);
        if (message && !firstInvalid) firstInvalid = input;
      });
      if (n === 1 && !deliveryValue()) {
        setDeliveryError(t('delivery'));
        if (!firstInvalid) firstInvalid = form.querySelector('input[name="delivery"]');
      }
      return firstInvalid;
    }

    function nextStep() {
      const firstInvalid = checkStep(1);
      if (firstInvalid) { firstInvalid.focus(); return; }
      goStep(2, true);
    }

    form.querySelectorAll('[data-step-next]').forEach((btn) => btn.addEventListener('click', nextStep));
    form.querySelectorAll('[data-step-back]').forEach((btn) => btn.addEventListener('click', () => goStep(1, true)));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (honeypot && honeypot.value.trim() !== '') return; // bot filled the hidden field
      // Enter in a step 1 field means "Weiter"
      if (currentStep === 1) { nextStep(); return; }

      const invalidStep1 = checkStep(1);
      if (invalidStep1) { goStep(1, true); invalidStep1.focus(); return; }
      const firstInvalid = checkStep(2);
      if (firstInvalid) { firstInvalid.focus(); return; }

      const data = new FormData(form);
      data.delete('website'); // honeypot is never sent
      data.delete('files[]');
      selectedFiles.forEach((file) => data.append('files[]', file, file.name));
      data.set('t', String(formStart));
      data.set('lang', currentLang);
      if (CONFIG.formEndpoint) sendToServer(data);
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

  /* Customer reviews: rating line in the hero and a short block in the
     prices section. Only approved reviews (reviews.php, fallback
     reviews.json); both stay hidden while there are none. */
  const heroRating = document.querySelector('[data-hero-rating]');
  const homeReviews = document.querySelector('[data-home-reviews]');
  if (heroRating || homeReviews) {
    const getJson = (url) => fetch(url, { cache: 'no-cache' }).then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
    getJson('reviews.php').catch(() => getJson('reviews.json')).then((data) => {
      const reviews = (Array.isArray(data) ? data : [])
        .filter((r) => r && +r.rating >= 1 && +r.rating <= 5 && typeof r.text === 'string' && r.text.trim())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      if (!reviews.length) return;
      const average = reviews.reduce((sum, r) => sum + Math.round(+r.rating), 0) / reviews.length;
      const paint = () => {
        const de = currentLang === 'de';
        const score = average.toFixed(2).replace('.', de ? ',' : '.');
        const count = reviews.length + ' ' + (de ? (reviews.length === 1 ? 'Bewertung' : 'Bewertungen') : (reviews.length === 1 ? 'review' : 'reviews'));
        document.querySelectorAll('[data-rating-score]').forEach((el) => { el.textContent = score; });
        document.querySelectorAll('[data-rating-count]').forEach((el) => { el.textContent = count; });
        document.querySelectorAll('.home-reviews__of').forEach((el) => { el.textContent = '/ ' + (de ? '5,00' : '5.00'); });
        if (heroRating) heroRating.setAttribute('aria-label', (de ? 'Kundenbewertung ' : 'Customer rating ') + score + ' / 5, ' + count);
      };
      document.querySelectorAll('[data-rating-stars]').forEach((el) => { el.style.width = (average / 5 * 100) + '%'; });
      paint();
      document.addEventListener('printlab:lang', paint);

      const list = homeReviews && homeReviews.querySelector('[data-home-review-list]');
      if (list) {
        reviews.slice(0, 2).forEach((r) => {
          const li = document.createElement('li');
          li.className = 'rv-card home-reviews__item';
          const stars = document.createElement('span');
          stars.className = 'rv-stars';
          stars.setAttribute('aria-label', Math.round(+r.rating) + ' / 5');
          const fill = document.createElement('span');
          fill.className = 'rv-stars__fill';
          fill.style.width = (Math.round(+r.rating) / 5 * 100) + '%';
          stars.appendChild(fill);
          const text = document.createElement('p');
          text.className = 'home-reviews__text';
          text.textContent = '„' + r.text.trim() + '“';
          const who = document.createElement('p');
          who.className = 'home-reviews__who';
          const d = new Date(r.date);
          who.textContent = (r.name || 'Anonym') + (Number.isNaN(d.getTime()) ? '' : ' · ' + String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear());
          li.append(stars, text, who);
          list.appendChild(li);
        });
      }
      if (heroRating) heroRating.hidden = false;
      if (homeReviews) homeReviews.hidden = false;
    }).catch(() => { /* no reviews shown */ });
  }

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
    if (stored) { initialLang = stored; declineBrowserTranslation(); }
  } catch (e) {}

  applyLanguage(initialLang);
})();