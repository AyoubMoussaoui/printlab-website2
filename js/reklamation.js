/* ==========================================================================
   PRINT LAB Trier: claim form (reklamation.html).
   Posts to anfrage.php with form=reklamation. Photos are reduced in size in
   the browser before sending (phone photos are often 3 to 10 MB), so the
   upload is fast on mobile data and stays within the server limits.
   ========================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    endpoint: 'anfrage.php',
    email: 'info@printlab-trier.de',
    whatsappNumber: '4915901378917',
    maxTotalBytes: 25 * 1024 * 1024,
    maxSide: 2000,          // longest side of a reduced photo, in px
    reduceAbove: 1.2 * 1024 * 1024,
    fileTypes: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']
  };
  const LANG_KEY = 'printlab-lang'; // shared with js/main.js

  /* ------------------------------------------------------------------------
     i18n: German is in the HTML, English here
     ------------------------------------------------------------------------ */
  const EN = {
    skip: 'Skip to content', back: 'Back to home page', kicker: 'Claims',
    title: 'Claims & defects',
    lead: 'Custom production is precision work. If something is still not right with your order, we will take care of it quickly and without fuss.',
    step1: 'Send photos and a description', step1Text: 'A photo of the defect and one of the whole item help us most.',
    step2: 'We check your case', step2Text: 'We usually get back to you within one working day.',
    step3: 'We find a solution together', step3Text: 'For example a flawless reprint or a replacement.',
    deadline: 'Claims can be made within 30 days of the order date. Please get in touch as early as possible.',
    note: 'Please keep the affected items as they are until we have sorted it out, and avoid using or cleaning them further. Your statutory warranty rights are of course not affected.',
    name: 'Name', email: 'Email', order: 'Order number', optional: '(optional)', orderPh: 'e.g. from your invoice',
    issue: 'Type of issue', choose: 'Please choose', issue1: 'Print defect / print quality', issue2: 'Damaged item',
    issue3: 'Wrong size or colour', issue4: 'Wrong design or position', issue5: 'Other',
    message: 'Description', messagePh: 'What exactly is wrong, and how many items are affected?',
    photoDefect: 'Photo of the defect', photoItem: 'Photo of the whole item', photoCta: 'Choose or take a photo',
    photoDefectHint: 'Close to the defect, in good light. Up to 4 photos.', photoItemHint: 'The whole item, clearly visible. Up to 2 photos.',
    submit: 'Submit claim', privacy: 'How we process your details and photos is explained in our', privacyLink: 'privacy policy',
    successTitle: 'Thank you, your claim has arrived.',
    successText: 'You will get a confirmation by email shortly. We will check your photos and usually get back to you within one working day with a solution.',
    footerTag: 'Custom textile printing from 1 piece', footerPayment: 'Payment & delivery', footerClaim: 'Claims', footerImprint: 'Imprint', footerPrivacy: 'Privacy',
    'aria.home': 'PRINT LAB Trier home page', 'aria.lang': 'Choose language'
  };

  const MESSAGES = {
    de: {
      required: 'Bitte fülle dieses Feld aus.', email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      photoRequired: 'Bitte füge mindestens ein Foto hinzu.', photoType: '„{name}“ ist kein Foto. Erlaubt sind JPG, PNG, WEBP oder HEIC.',
      photoCount: 'Hier sind höchstens {max} Fotos möglich.', photoSize: 'Die Fotos sind zusammen zu groß (max. 25 MB).',
      removePhoto: 'Foto {name} entfernen', preparing: 'Fotos werden vorbereitet …', sending: 'Wird gesendet …',
      rate: 'Zu viele Anfragen in kurzer Zeit. Bitte versuche es in einer Stunde erneut oder schreib uns per WhatsApp.',
      failed: 'Das Senden hat leider nicht geklappt. Schick uns deine Reklamation bitte per E-Mail oder WhatsApp, die Fotos kannst du dort direkt anhängen.',
      viaEmail: 'Per E-Mail senden', viaWhatsApp: 'Per WhatsApp senden',
      waText: 'Hallo PRINT LAB, ich möchte etwas reklamieren:', subject: 'Reklamation'
    },
    en: {
      required: 'Please fill in this field.', email: 'Please enter a valid email address.',
      photoRequired: 'Please add at least one photo.', photoType: '“{name}” is not a photo. Allowed are JPG, PNG, WEBP or HEIC.',
      photoCount: 'At most {max} photos are possible here.', photoSize: 'The photos are too large together (max. 25 MB).',
      removePhoto: 'Remove photo {name}', preparing: 'Preparing photos …', sending: 'Sending …',
      rate: 'Too many requests in a short time. Please try again in an hour or message us on WhatsApp.',
      failed: 'Unfortunately sending did not work. Please send us your claim by email or WhatsApp, you can attach the photos there directly.',
      viaEmail: 'Send by email', viaWhatsApp: 'Send via WhatsApp',
      waText: 'Hi PRINT LAB, I would like to make a claim:', subject: 'Claim'
    }
  };

  let lang = 'de';
  const t = (key, vars) => {
    let msg = MESSAGES[lang][key] || '';
    if (vars) Object.keys(vars).forEach((k) => { msg = msg.split('{' + k + '}').join(vars[k]); });
    return msg;
  };

  const i18nNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const phNodes = Array.from(document.querySelectorAll('[data-i18n-placeholder]'));
  const ariaNodes = Array.from(document.querySelectorAll('[data-i18n-aria]'));
  const DE = {};
  i18nNodes.forEach((el) => { DE[el.dataset.i18n] = DE[el.dataset.i18n] || el.textContent; });
  phNodes.forEach((el) => { DE[el.dataset.i18nPlaceholder] = el.getAttribute('placeholder'); });
  ariaNodes.forEach((el) => { DE[el.dataset.i18nAria] = el.getAttribute('aria-label'); });

  function applyLanguage(next) {
    lang = next === 'en' ? 'en' : 'de';
    const dict = lang === 'en' ? EN : DE;
    i18nNodes.forEach((el) => { if (dict[el.dataset.i18n] !== undefined) el.textContent = dict[el.dataset.i18n]; });
    phNodes.forEach((el) => { if (dict[el.dataset.i18nPlaceholder] !== undefined) el.setAttribute('placeholder', dict[el.dataset.i18nPlaceholder]); });
    ariaNodes.forEach((el) => { if (dict[el.dataset.i18nAria] !== undefined) el.setAttribute('aria-label', dict[el.dataset.i18nAria]); });
    document.documentElement.lang = lang;
    document.title = lang === 'en' ? 'Claims | PRINT LAB Trier' : 'Reklamation | PRINT LAB Trier';
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    document.dispatchEvent(new CustomEvent('printlab:lang'));
  }

  // Same behaviour as the home page: a choice made with the switch is
  // remembered, and the browser then doesn't offer its own translation
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
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    });
  });

  // Language chosen earlier on the home page or here
  let initial = 'de';
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored) { initial = stored; declineBrowserTranslation(); }
  } catch (e) {}
  if (initial !== 'de') applyLanguage(initial);

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------------
     Photos
     ------------------------------------------------------------------------ */
  const extOf = (name) => (name.split('.').pop() || '').toLowerCase();
  const formatSize = (bytes) => (bytes < 1024 * 1024
    ? Math.max(1, Math.round(bytes / 1024)) + ' KB'
    : (bytes / 1024 / 1024).toFixed(1).replace('.', lang === 'de' ? ',' : '.') + ' MB');

  /* Large photos are redrawn at max. 2000 px as JPEG. If the browser can't
     decode the format (e.g. HEIC outside Safari), the original is sent. */
  async function reducePhoto(file) {
    if (file.size <= CONFIG.reduceAbove || !window.createImageBitmap || !window.HTMLCanvasElement) return file;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, CONFIG.maxSide / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      if (bitmap.close) bitmap.close();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
      if (!blob || blob.size >= file.size) return file;
      const base = file.name.replace(/\.[^.]+$/, '') || 'foto';
      return new File([blob], base + '.jpg', { type: 'image/jpeg', lastModified: Date.now() });
    } catch (e) {
      return file;
    }
  }

  const zones = Array.from(document.querySelectorAll('[data-photo-zone]')).map((el) => ({
    el,
    name: el.dataset.photoZone,
    max: Number(el.dataset.max) || 1,
    input: el.querySelector('.upload__input'),
    list: el.querySelector('[data-photo-list]'),
    error: el.querySelector('.field__error'),
    items: [], // { file, url }
    pending: 0
  }));

  const totalBytes = () => zones.reduce((sum, z) => sum + z.items.reduce((s, it) => s + it.file.size, 0), 0);

  function setZoneError(zone, message) {
    zone.error.textContent = message || '';
    zone.el.classList.toggle('is-invalid', Boolean(message));
  }

  function renderZone(zone) {
    zone.list.textContent = '';
    zone.items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'photo-upload__item';
      const img = document.createElement('img');
      img.className = 'photo-upload__thumb';
      img.alt = '';
      img.src = item.url;
      img.addEventListener('error', () => { img.hidden = true; }); // e.g. HEIC preview in Chrome
      const name = document.createElement('span');
      name.className = 'photo-upload__name';
      name.textContent = item.file.name;
      const size = document.createElement('span');
      size.className = 'photo-upload__size';
      size.textContent = formatSize(item.file.size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'upload__remove';
      remove.setAttribute('aria-label', t('removePhoto', { name: item.file.name }));
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        URL.revokeObjectURL(item.url);
        zone.items.splice(index, 1);
        setZoneError(zone, '');
        renderZone(zone);
        zone.input.focus();
      });
      const text = document.createElement('span');
      text.className = 'photo-upload__text';
      text.append(name, size);
      li.append(img, text, remove);
      zone.list.appendChild(li);
    });
  }

  async function addPhotos(zone, fileList) {
    let message = '';
    const files = Array.from(fileList);
    zone.pending += files.length;
    for (const original of files) {
      if (!CONFIG.fileTypes.includes(extOf(original.name)) && !(original.type || '').startsWith('image/')) {
        message = message || t('photoType', { name: original.name });
        continue;
      }
      if (zone.items.length >= zone.max) { message = message || t('photoCount', { max: zone.max }); continue; }
      const file = await reducePhoto(original);
      if (!CONFIG.fileTypes.includes(extOf(file.name))) { message = message || t('photoType', { name: original.name }); continue; }
      if (totalBytes() + file.size > CONFIG.maxTotalBytes) { message = message || t('photoSize'); continue; }
      zone.items.push({ file, url: URL.createObjectURL(file) });
    }
    zone.pending -= files.length;
    setZoneError(zone, message);
    renderZone(zone);
  }

  zones.forEach((zone) => {
    const dropZone = zone.input.closest('.upload__zone');
    zone.input.addEventListener('change', () => {
      const files = zone.input.files;
      addPhotos(zone, files).then(() => { zone.input.value = ''; });
    });
    ['dragenter', 'dragover'].forEach((type) => zone.input.addEventListener(type, () => dropZone.classList.add('is-dragover')));
    ['dragleave', 'drop'].forEach((type) => zone.input.addEventListener(type, () => dropZone.classList.remove('is-dragover')));
  });

  /* ------------------------------------------------------------------------
     Form
     ------------------------------------------------------------------------ */
  const form = document.querySelector('[data-claim-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');
  const success = document.querySelector('[data-claim-success]');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const formStart = Date.now();
  const requiredInputs = Array.from(form.querySelectorAll('[required]'));

  function validateInput(input) {
    const value = input.value.trim();
    if (!value) return t('required');
    if (input.type === 'email' && !EMAIL_RE.test(value)) return t('email');
    return '';
  }

  function setError(input, message) {
    const field = input.closest('.field');
    const errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
    if (field) field.classList.toggle('is-invalid', Boolean(message));
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.id = errorEl.id || input.id + '-error';
      if (message) input.setAttribute('aria-describedby', errorEl.id);
    }
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    input.classList.toggle('is-invalid', Boolean(message));
    input.classList.toggle('is-valid', !message && input.value.trim() !== '');
  }

  requiredInputs.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) setError(input, validateInput(input)); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') setError(input, validateInput(input)); });
    input.addEventListener('change', () => { if (input.getAttribute('aria-invalid') === 'true') setError(input, validateInput(input)); });
  });

  // Re-translate visible messages when the language changes
  document.addEventListener('printlab:lang', () => {
    requiredInputs.forEach((input) => { if (input.getAttribute('aria-invalid') === 'true') setError(input, validateInput(input)); });
    zones.forEach((zone) => {
      if (zone.el.classList.contains('is-invalid') && !zone.items.length) setZoneError(zone, t('photoRequired'));
      renderZone(zone);
    });
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.classList.toggle('is-success', type === 'success');
    status.classList.toggle('is-error', type === 'error');
  }

  // Sending failed: offer e-mail or WhatsApp with the details filled in
  function showFallback(data) {
    const select = form.querySelector('#c-issue');
    const rows = [
      ['Name', data.get('name')], ['E-Mail', data.get('email')], ['Auftragsnummer', data.get('order')],
      ['Art des Problems', select.options[select.selectedIndex] ? select.value : ''], ['Beschreibung', data.get('message')]
    ].filter((r) => r[1]).map((r) => r[0] + ': ' + r[1]).join('\n');
    const subject = t('subject') + (data.get('order') ? ' ' + data.get('order') : '') + ' (' + data.get('name') + ')';
    status.textContent = '';
    status.classList.remove('is-error');
    status.classList.add('is-success');
    const title = document.createElement('p');
    title.className = 'quote-form__fallback-title';
    title.textContent = t('failed');
    const actions = document.createElement('div');
    actions.className = 'quote-form__fallback-actions';
    [
      ['mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(rows), t('viaEmail'), 'btn--light'],
      ['https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(t('waText') + '\n\n' + rows), t('viaWhatsApp'), 'btn--whatsapp']
    ].forEach(([href, label, mod]) => {
      const a = document.createElement('a');
      a.className = 'btn ' + mod;
      a.href = href;
      a.textContent = label;
      if (href.startsWith('https:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      actions.appendChild(a);
    });
    status.append(title, actions);
    actions.firstChild.focus();
  }

  function showSuccess() {
    form.hidden = true;
    zones.forEach((zone) => zone.items.forEach((item) => URL.revokeObjectURL(item.url)));
    success.hidden = false;
    success.focus();
    const top = success.getBoundingClientRect().top + window.pageYOffset - 24;
    if (success.getBoundingClientRect().top < 0) window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  async function send(data) {
    submitBtn.disabled = true;
    showStatus(t('sending'));
    try {
      const res = await fetch(CONFIG.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      let body = {};
      try { body = await res.json(); } catch (e) { /* non-JSON reply */ }
      if (res.status === 429) { showStatus(t('rate'), 'error'); return; }
      if (!res.ok || body.ok !== true) throw new Error('HTTP ' + res.status);
      showSuccess();
    } catch (err) {
      showFallback(data);
    } finally {
      submitBtn.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const honeypot = form.querySelector('#c-website');
    if (honeypot && honeypot.value.trim() !== '') return;
    if (zones.some((zone) => zone.pending > 0)) { showStatus(t('preparing')); return; }

    let firstInvalid = null;
    requiredInputs.forEach((input) => {
      const message = validateInput(input);
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    zones.forEach((zone) => {
      if (!zone.items.length) {
        setZoneError(zone, t('photoRequired'));
        if (!firstInvalid) firstInvalid = zone.input;
      }
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = new FormData(form);
    data.delete('website');
    zones.forEach((zone) => zone.items.forEach((item) => data.append(zone.name + '[]', item.file, item.file.name)));
    data.set('t', String(formStart));
    data.set('lang', lang);
    send(data);
  });

})();
