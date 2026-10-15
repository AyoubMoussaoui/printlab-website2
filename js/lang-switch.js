/* ==========================================================================
   PRINT LAB Trier: DE/EN switch for German-first subpages (zahlung,
   impressum). German is in the HTML; each page script passes its English
   texts: PrintlabLang.init(EN, englishTabTitle).
   - [data-i18n]       text, swapped with textContent
   - [data-i18n-aria]  aria-label
   - [data-lang-only]  shown only in that language (e.g. a note in English)
   Pages always open in German; the switch offers English.
   ========================================================================== */
window.PrintlabLang = {
  init(EN, enTitle) {
    'use strict';
    const i18nNodes = Array.from(document.querySelectorAll('[data-i18n]'));
    const ariaNodes = Array.from(document.querySelectorAll('[data-i18n-aria]'));
    const onlyNodes = Array.from(document.querySelectorAll('[data-lang-only]'));
    const DE = {};
    i18nNodes.forEach((el) => { DE[el.dataset.i18n] = DE[el.dataset.i18n] || el.textContent; });
    ariaNodes.forEach((el) => { DE[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
    const TITLE = { de: document.title, en: enTitle };

    function applyLanguage(next) {
      const lang = next === 'en' ? 'en' : 'de';
      const dict = lang === 'en' ? EN : DE;
      i18nNodes.forEach((el) => { if (dict[el.dataset.i18n] !== undefined) el.textContent = dict[el.dataset.i18n]; });
      ariaNodes.forEach((el) => { if (dict[el.dataset.i18nAria] !== undefined) el.setAttribute('aria-label', dict[el.dataset.i18nAria]); });
      onlyNodes.forEach((el) => { el.hidden = el.dataset.langOnly !== lang; });
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
  }
};
