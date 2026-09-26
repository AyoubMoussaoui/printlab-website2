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

    /* Form service. Leave formEndpoint empty to use the built-in fallback
       (visitor sends the prepared request by e-mail or WhatsApp).
       Examples:
         Formspree:  formEndpoint: 'https://formspree.io/f/XXXXXXX'
         Web3Forms:  formEndpoint: 'https://api.web3forms.com/submit',
                     formFields: { access_key: 'YOUR-KEY' }
       Set formFileUploads to true only if the service plan accepts files.
       Remember to name the service in datenschutz.html. */
    formEndpoint: '',
    formFields: {},
    formFileUploads: false,

    /* Upload page for logos/artwork, e.g. a Dropbox "File request" link.
       When set, the form shows an upload button instead of the file picker,
       and the e-mail/WhatsApp choice offers it too. Empty = file picker. */
    uploadLink: '',

    maxFiles: 3,
    maxFileSizeMB: 10,
    fileTypes: ['png', 'jpg', 'jpeg', 'pdf', 'svg', 'ai', 'eps']
  };

  const mqMobile = window.matchMedia('(max-width: 767px)');

  /* ------------------------------------------------------------------------
     2. i18n
     ------------------------------------------------------------------------ */
  const EN = {
    'skip': 'Skip to content', 'nav.services': 'Services', 'nav.methods': 'Techniques',
    'nav.how': 'Process', 'nav.forwho': 'Who for?', 'nav.references': 'Work',
    'nav.contact': 'Contact', 'cta.inquire': 'Enquire', 'hero.eyebrow': 'Textile printing in Trier',
    'hero.title1': 'Your design.', 'hero.title2': 'Your textile.',
    'hero.lead': 'We print your logo or design on any textile – sharp, colourfast and personal. Starting from a single piece.',
    'hero.cta1': 'Request a quote', 'hero.cta2': 'Our services',
    'trust.1': 'From 1 piece — no minimum', 'trust.2': 'Quote within 24 hours', 'trust.3': 'Delivery across Germany',
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
    'refs.kicker': 'References', 'refs.title': 'Our work.',
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
    'form.file': 'Upload file', 'form.fileHint': 'Choose logo or artwork (max. 3 files of 10 MB: PNG, JPG, PDF, SVG, AI, EPS)',
    'form.submit': 'Request quote', 'form.note': 'Free & non-binding. Reply within 24 hours.',
    'form.privacy': 'How we handle your details is explained in our',
    'form.privacyLink': 'privacy policy (German)',
    'footer.tag': 'Custom textile printing from 1 piece',
    'footer.imprint': 'Imprint', 'footer.privacy': 'Privacy',
    'badge.1': 'Printing from 1 piece', 'badge.2': 'Local production in Trier', 'badge.3': 'Free artwork check',
    'aria.lang': 'Choose language', 'aria.home': 'PRINT LAB Trier – home', 'aria.nav': 'Main navigation',
    'aria.navMobile': 'Mobile navigation', 'aria.trust': 'Our advantages', 'aria.top': 'PRINT LAB Trier – back to top',
    'aria.wa': 'Message us on WhatsApp', 'aria.fileClear': 'Remove files', 'aria.backTop': 'Back to top',
    'upload.cta': 'Upload logo or artwork',
    'upload.sub': 'Opens our secure file upload in a new tab – no account needed. PNG, JPG, PDF, SVG, AI or EPS.'
  };

  const MESSAGES = {
    de: {
      required: 'Bitte fülle dieses Feld aus.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      qty: 'Bitte gib eine Stückzahl ab 1 an.',
      sending: 'Wird gesendet …',
      success: 'Danke! Deine Anfrage ist bei uns – wir melden uns innerhalb von 24 Stunden.',
      successNoFiles: 'Danke! Deine Anfrage ist bei uns. Schick uns deine Dateien bitte noch per WhatsApp oder E-Mail – wir melden uns innerhalb von 24 Stunden.',
      error: 'Das hat leider nicht geklappt. Bitte versuche es erneut oder schreib uns per WhatsApp.',
      fallbackTitle: 'Fast geschafft! Wie möchtest du deine Anfrage senden?',
      fallbackFiles: 'Deine Dateien hängst du im nächsten Schritt direkt in der E-Mail oder im WhatsApp-Chat an.',
      viaEmail: 'Per E-Mail senden', viaWhatsApp: 'Per WhatsApp senden',
      uploadPrompt: 'Hast du ein Logo oder Motiv? Lade es hier hoch – es landet direkt bei uns:',
      viaUpload: 'Dateien hochladen',
      uploadNote: 'Druckdateien lade ich über euren Upload-Link hoch.',
      fileMax: 'Maximal {n} Dateien – nur die ersten wurden übernommen.',
      fileType: '„{f}“ hat ein nicht unterstütztes Format.',
      fileSize: '„{f}“ ist größer als {n} MB.',
      menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', waText: 'Hallo Team PRINT LAB, ich habe eine Anfrage: '
    },
    en: {
      required: 'Please fill in this field.',
      email: 'Please enter a valid email address.',
      qty: 'Please enter a quantity of at least 1.',
      sending: 'Sending …',
      success: 'Thank you! We have received your request and will reply within 24 hours.',
      successNoFiles: 'Thank you! We have received your request. Please send us your files via WhatsApp or email – we will reply within 24 hours.',
      error: 'Something went wrong. Please try again or message us on WhatsApp.',
      fallbackTitle: 'Almost done! How would you like to send your request?',
      fallbackFiles: 'You can attach your files in the next step, directly in the email or WhatsApp chat.',
      viaEmail: 'Send by email', viaWhatsApp: 'Send via WhatsApp',
      uploadPrompt: 'Have a logo or artwork? Upload it here – it goes straight to us:',
      viaUpload: 'Upload files',
      uploadNote: 'I will upload my artwork via your upload link.',
      fileMax: 'Maximum {n} files – only the first ones were added.',
      fileType: '"{f}" has an unsupported format.',
      fileSize: '"{f}" is larger than {n} MB.',
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
    if (vars) Object.keys(vars).forEach((k) => { msg = msg.split('{' + k + '}').join(vars[k]); });
    return msg;
  };
  /* Text of any data-i18n key in the current language */
  const tr = (key) => (currentLang === 'en' ? EN[key] : DE[key]) || DE[key] || '';

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
  }
  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    updateMenuLabel();
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

  let floatsQueued = false;
  function updateFloats() {
    floatsQueued = false;
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 500);
    const zones = hideZones.map((z) => z.getBoundingClientRect());
    floats.forEach((btn) => {
      const r = btn.getBoundingClientRect();
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
    const fileInput = form.querySelector('[data-file-input]');
    const fileLabel = form.querySelector('[data-file-label]');
    const fileError = form.querySelector('[data-upload-error]');
    const fileClearBtn = form.querySelector('#file-clear');
    const submitBtn = form.querySelector('[type="submit"]');
    const honeypot = form.querySelector('#f-website');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const canSetFiles = (() => { try { return !!new DataTransfer(); } catch (e) { return false; } })();

    /* ---- Upload link replaces the file picker when configured */
    const useUploadLink = Boolean(CONFIG.uploadLink);
    if (useUploadLink) {
      const pickerField = form.querySelector('[data-file-field]');
      const linkField = form.querySelector('[data-upload-link-field]');
      const link = form.querySelector('[data-upload-link]');
      if (pickerField) pickerField.hidden = true;
      if (fileInput) fileInput.disabled = true; // disabled inputs are not submitted
      if (link) link.href = CONFIG.uploadLink;
      if (linkField) linkField.hidden = false;
    }

    /* ---- Files: keep a list so visitors can add files in several steps */
    let selectedFiles = [];

    function renderFiles() {
      if (canSetFiles && fileInput) {
        const dt = new DataTransfer();
        selectedFiles.forEach((f) => dt.items.add(f));
        fileInput.files = dt.files;
      }
      if (fileLabel) {
        fileLabel.textContent = selectedFiles.length
          ? selectedFiles.map((f) => f.name).join(', ')
          : tr('form.fileHint');
      }
      if (fileClearBtn) fileClearBtn.hidden = selectedFiles.length === 0;
    }

    function resetFiles() {
      selectedFiles = [];
      if (fileInput) fileInput.value = '';
      if (fileError) fileError.textContent = '';
      renderFiles();
    }

    function checkFile(file) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      if (!CONFIG.fileTypes.includes(ext)) return t('fileType', { f: file.name });
      if (file.size > CONFIG.maxFileSizeMB * 1024 * 1024) return t('fileSize', { f: file.name, n: CONFIG.maxFileSizeMB });
      return '';
    }

    if (fileInput) {
      window.addEventListener('pageshow', resetFiles);
      fileInput.addEventListener('change', () => {
        const errors = [];
        let incoming = Array.from(fileInput.files || []);
        if (canSetFiles) {
          incoming = incoming.filter((f) => {
            const err = checkFile(f);
            if (err) errors.push(err);
            return !err;
          });
          const room = CONFIG.maxFiles - selectedFiles.length;
          if (incoming.length > room) errors.push(t('fileMax', { n: CONFIG.maxFiles }));
          selectedFiles = selectedFiles.concat(incoming.slice(0, Math.max(0, room)));
        } else {
          // Older browsers: the native input keeps only the latest selection
          selectedFiles = incoming.filter((f) => !checkFile(f)).slice(0, CONFIG.maxFiles);
        }
        if (fileError) fileError.textContent = errors.join(' ');
        renderFiles();
      });
      if (fileClearBtn) fileClearBtn.addEventListener('click', resetFiles);
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
      renderFiles();
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
      if (selectedFiles.length) rows.push(['Dateien', selectedFiles.map((f) => f.name).join(', ') + ' (werden angehängt)']);
      if (useUploadLink && data.get('has_design') === 'Ja') rows.push(['Dateien', t('uploadNote')]);
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
      if (useUploadLink) {
        const row = document.createElement('div');
        row.className = 'quote-form__fallback-upload';
        const prompt = document.createElement('p');
        prompt.className = 'quote-form__fallback-note';
        prompt.textContent = t('uploadPrompt');
        const up = document.createElement('a');
        up.className = 'btn btn--glass';
        up.href = CONFIG.uploadLink;
        up.target = '_blank';
        up.rel = 'noopener noreferrer';
        up.textContent = t('viaUpload');
        row.appendChild(prompt);
        row.appendChild(up);
        status.appendChild(row);
      } else if (selectedFiles.length) {
        const note = document.createElement('p');
        note.className = 'quote-form__fallback-note';
        note.textContent = t('fallbackFiles');
        status.appendChild(note);
      }
      actions.firstChild.focus();
    }

    async function sendToService(data) {
      Object.keys(CONFIG.formFields).forEach((k) => data.set(k, CONFIG.formFields[k]));
      if (!data.has('subject')) data.set('subject', 'Neue Anfrage über die PRINT LAB Website');
      const hadFiles = selectedFiles.length > 0;
      if (!CONFIG.formFileUploads) data.delete('files[]');

      submitBtn.disabled = true;
      showStatus(t('sending'));
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        let body = {};
        try { body = await res.json(); } catch (e) { /* non-JSON reply */ }
        if (!res.ok || body.success === false || body.ok === false) throw new Error('HTTP ' + res.status);
        form.reset();
        resetFiles();
        form.querySelectorAll('.is-valid').forEach((el) => el.classList.remove('is-valid'));
        showStatus(hadFiles && !CONFIG.formFileUploads ? t('successNoFiles') : t('success'), 'success');
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