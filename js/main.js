/* ==========================================================================
   PRINT LAB Trier — main.js
   Vanilla JS, no dependencies. Modules:
     1. Config         5. Active section highlighting
     2. i18n (DE / EN) 6. Floating WhatsApp visibility
     3. Mobile menu    7. Quote form
     4. Header state   8. Small utilities (marquee, year, links)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONFIG — replace the placeholders before going live
     ------------------------------------------------------------------------ */
  const CONFIG = {
    whatsappNumber: '4915901378917',
    email: 'just-click@live.fr',
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
    'form.fileHint': 'Choose logo or artwork (max. 3 files, PNG, JPG, PDF, SVG)',
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
      waText: 'Hallo Team PRINT LAB, ich habe eine Anfrage: '
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
  }

  // Universal smooth scroll with Event Delegation (safely ignores WhatsApp)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    
    // If it is an external link (like WhatsApp), do nothing and let it open normally
    if (!href || !href.startsWith('#')) return;

    // It is an internal page link, so intercept it for smooth scrolling
    e.preventDefault();
    if (isMenuOpen()) closeMenu();

    // If the link is just "#" (like your logo), route it smoothly to "#top"
    const targetHash = href === '#' ? '#top' : href;
    requestAnimationFrame(() => scrollToHash(targetHash));
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
      
      if (rect.top <= triggerPoint) {
        foundId = section.id;
        break;
      }
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
     6. FLOATING WHATSAPP
     ------------------------------------------------------------------------ */
  const waFloat = document.querySelector('[data-wa-float]');
  if (waFloat) {
    waFloat.classList.remove('is-hidden'); 
  }

  function updateWhatsAppLinks() {
    const href = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t('waText'));
    document.querySelectorAll('[data-whatsapp-link]').forEach((a) => { 
      a.href = href; 
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
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
    const submitBtn = form.querySelector('[type="submit"]');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const fileClearBtn = document.getElementById('file-clear');

    function resetFileInput() {
      if (!fileInput || !fileLabel) return;
      fileInput.value = ''; // Hard clear the input
      
      const defaultText = document.documentElement.lang === 'en' 
        ? 'Choose logo or artwork (max. 3 files, PNG, JPG, PDF, SVG)' 
        : 'Logo oder Motiv auswählen (max. 3 Dateien, PNG, JPG, PDF, SVG)';
      fileLabel.textContent = defaultText;
      
      if (fileClearBtn) fileClearBtn.hidden = true;
    }

    if (fileInput && fileLabel) {
      // Force clear on page load to prevent sticky browser cache
      window.addEventListener('pageshow', resetFileInput);

      fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        
        if (files && files.length > 0) {
          // Block the upload if more than 3 files are selected
          if (files.length > 3) {
            const warningMsg = document.documentElement.lang === 'en' 
              ? 'You can only upload a maximum of 3 files.' 
              : 'Du kannst maximal 3 Dateien hochladen.';
            alert(warningMsg);
            resetFileInput();
            return;
          }
          
          // Extract all file names and join them with a comma
          const fileNames = Array.from(files).map(f => f.name).join(', ');
          fileLabel.textContent = fileNames;
          if (fileClearBtn) fileClearBtn.hidden = false;
        } else {
          resetFileInput();
        }
      });

      if (fileClearBtn) {
        fileClearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          resetFileInput();
        });
      }
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
      
      // Dynamically map all multiple file names for the email summary
      const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
      if (files.length > 0) {
        const fileNames = files.map(f => f.name).join(', ');
        rows.push(['Dateien', fileNames + ' (bitte im E-Mail-Programm anhängen)']);
      }
      
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
          resetFileInput();
          showStatus(t('success'), 'success');
        } catch (err) {
          showStatus(t('error'), 'error');
        } finally {
          submitBtn.disabled = false;
        }
        return;
      }

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
    track.style.animationDuration = Math.round((groupWidth * count) / 2 / 40) + 's';
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Unobserve so it only animates once
        }
      });
    }, {
      root: null,
      threshold: 0.1, // Triggers when 10% of the element is visible
      rootMargin: "0px 0px -50px 0px" // Triggers slightly before the element hits the bottom of the screen
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

// Back-to-Top Button Sichtbarkeit umschalten
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }, { passive: true });
  }

  let initialLang = 'de';
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored) initialLang = stored;
  } catch (e) { /* storage unavailable */ }
  
  // This is the critical line that applies the WhatsApp link injection!
  applyLanguage(initialLang);
})();

/* ==========================================================================
   REAL-TIME FORM VALIDATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form');
  if (!form) return;

  // Select all required fields in the form
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

  inputs.forEach(input => {
    // Validate when user clicks away from the field
    input.addEventListener('blur', () => {
      validateInput(input);
    });

    // Validate in real-time ONLY if they are trying to fix an error or if they type a correct value
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid') || input.checkValidity()) {
        validateInput(input);
      }
    });
  });

  function validateInput(input) {
    const errorTarget = form.querySelector(`[data-error-for="${input.id}"]`);
    
    if (input.checkValidity()) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorTarget) errorTarget.textContent = '';
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      
      // Inject specific error messages based on what went wrong
      if (errorTarget) {
        if (input.validity.valueMissing) {
          errorTarget.textContent = 'Dieses Feld ist erforderlich.';
        } else if (input.validity.typeMismatch) {
          errorTarget.textContent = 'Bitte gib eine gültige Formatierung ein (z. B. E-Mail).';
        } else {
          errorTarget.textContent = 'Eingabe ungültig.';
        }
      }
    }
  }
});