/* ==========================================================================
   PRINT LAB Trier: payment & delivery page (zahlung.html). DE/EN switch.
   German is in the HTML, English here. Like every subpage the page always
   opens in German; the switch offers English.
   ========================================================================== */
(function () {
  'use strict';

  const EN = {
    skip: 'Skip to content', back: 'Back to home page',
    title: 'Payment & delivery',
    lead: 'Everything you need to know about payment, shipping and your order. Transparent and without hidden conditions.',
    stepsTitle: 'How your order works',
    step1: 'Request & clarification', step1Text: 'Together we discuss your design, the product you want, the quantity and your preferred date.',
    step2: 'Quote & approval', step2Text: 'You receive your transparent quote and approve it digitally.',
    step3: 'Invoice & payment', step3Text: 'You then receive the invoice with all payment details.',
    step4: 'Production', step4Text: 'As soon as your payment arrives, we start finishing your items.',
    payTitle: 'Payment methods',
    payText: 'Once your request is clarified and the quote is approved, we send you the invoice. We accept:',
    payBank: 'Bank transfer (prepayment)',
    payNote: 'Production starts immediately after payment is received. All prices are final prices. Under § 19 UStG (German small business regulation) no VAT is charged.',
    shipTitle: 'Shipping & pickup',
    ship1a: 'Production usually takes', ship1b: '5 working days', ship1c: 'after your approval. Shipping takes another 1 to 3 working days.',
    ship2a: 'Shipping within Germany:', ship2b: 'Standard €7.50, express €14.00. Free shipping from an order value of €199.',
    ship3a: 'Pickup:', ship3b: 'By prior arrangement directly in Trier (free of charge).',
    ship4: 'Need your order by a fixed date? Let us know in your request – we will tell you honestly whether it is possible.',
    customTitle: 'Custom work & right of withdrawal',
    customText: 'All products are finished individually to your specifications and wishes (e.g. with DTF or screen printing). Under § 312g (2) no. 1 BGB (German Civil Code), the statutory right of withdrawal does not apply to goods made to customer specifications or clearly tailored to your personal needs.',
    customCheck: 'Please therefore check design, text, sizes, colours and quantities carefully before approving.',
    defectTitle: 'Defects & warranty',
    defect1: 'If a product has a manufacturing or material defect, please contact us within', defect2: '14 days',
    defect3: 'of receipt via our', defect4: 'claims page',
    defect5: '– we will quickly and easily arrange a replacement or a flawless reprint. Your statutory warranty rights remain unaffected.',
    defectBtn: 'Go to claims',
    askTitle: 'Any questions?', ask1: 'Just write to us at', ask2: 'or on WhatsApp. We are happy to help.',
    askBtn: 'Send a request',
    footerPayment: 'Payment & delivery', footerClaim: 'Claims', footerReview: 'Reviews', footerImprint: 'Imprint', footerPrivacy: 'Privacy',
    'aria.home': 'PRINT LAB Trier home page', 'aria.lang': 'Choose language'
  };
  const TITLE = { de: document.title, en: 'Payment & delivery | PRINT LAB Trier' };

  const i18nNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const ariaNodes = Array.from(document.querySelectorAll('[data-i18n-aria]'));
  const DE = {};
  i18nNodes.forEach((el) => { DE[el.dataset.i18n] = DE[el.dataset.i18n] || el.textContent; });
  ariaNodes.forEach((el) => { DE[el.dataset.i18nAria] = el.getAttribute('aria-label'); });

  function applyLanguage(next) {
    const lang = next === 'en' ? 'en' : 'de';
    const dict = lang === 'en' ? EN : DE;
    i18nNodes.forEach((el) => { if (dict[el.dataset.i18n] !== undefined) el.textContent = dict[el.dataset.i18n]; });
    ariaNodes.forEach((el) => { if (dict[el.dataset.i18nAria] !== undefined) el.setAttribute('aria-label', dict[el.dataset.i18nAria]); });
    document.documentElement.lang = lang;
    document.title = TITLE[lang];
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    document.dispatchEvent(new CustomEvent('printlab:lang'));
  }

  // After a choice with the switch the browser no longer offers its own
  // translation (same as the home page)
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
    });
  });
})();
