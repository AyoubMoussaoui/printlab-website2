/* ==========================================================================
   PRINT LAB Trier: reviews page (bewertungen.html).

   1. Overview and list are built from reviews.json, which PRINT LAB fills
      by hand with checked reviews (see README). Nothing is invented: with
      an empty file the page shows "Noch keine Bewertungen".
   2. "Bewertung abgeben" opens a dialog with the review form. It posts to
      anfrage.php (form=bewertung); the review is e-mailed to the shop and
      only appears here after checking.
   ========================================================================== */
(function () {
  'use strict';

  const ENDPOINT = 'anfrage.php';
  const DATA_URL = 'reviews.json';
  const PAGE_SIZE = 10;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const RATING_TEXT = ['Bitte wählen', 'Schlecht', 'Geht so', 'In Ordnung', 'Gut', 'Sehr gut'];
  const MSG = {
    required: 'Bitte fülle dieses Feld aus.',
    rating: 'Bitte wähle 1 bis 5 Sterne.',
    email: 'Bitte gib eine gültige E-Mail-Adresse ein oder lass das Feld leer.',
    consent: 'Bitte bestätige, dass wir deine Bewertung veröffentlichen dürfen.',
    sending: 'Wird gesendet …',
    rate: 'Zu viele Anfragen in kurzer Zeit. Bitte versuche es in einer Stunde erneut.',
    failed: 'Das Senden hat leider nicht geklappt. Schick uns deine Bewertung gerne per E-Mail an info@printlab-trier.de.'
  };

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  const de2 = (n) => n.toFixed(2).replace('.', ',');
  const de1 = (n) => n.toFixed(1).replace('.', ',');

  /* ------------------------------------------------------------------------
     1. Overview and list
     ------------------------------------------------------------------------ */
  const list = document.querySelector('[data-rv-list]');
  const moreBtn = document.querySelector('[data-rv-more]');

  function formatDate(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const date = pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
    // Only show a time when the entry has one
    return /T\d{2}:\d{2}/.test(value) ? date + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ' Uhr' : date;
  }

  function starsEl(rating, large) {
    const wrap = document.createElement('span');
    wrap.className = 'rv-stars' + (large ? ' rv-stars--lg' : '');
    wrap.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.className = 'rv-stars__fill';
    fill.style.width = (rating / 5 * 100) + '%';
    wrap.appendChild(fill);
    return wrap;
  }

  function reviewItem(r) {
    const li = document.createElement('li');
    li.className = 'rv-card rv-item';
    const head = document.createElement('div');
    head.className = 'rv-item__head';
    const who = document.createElement('p');
    who.className = 'rv-item__name';
    who.textContent = r.name || 'Anonym';
    if (r.context) {
      const ctx = document.createElement('span');
      ctx.className = 'rv-item__context';
      ctx.textContent = r.context;
      who.appendChild(document.createTextNode(' '));
      who.appendChild(ctx);
    }
    const time = document.createElement('time');
    time.className = 'rv-item__date';
    time.dateTime = r.date;
    time.textContent = formatDate(r.date);
    head.append(who, time);

    const score = document.createElement('p');
    score.className = 'rv-item__score';
    score.appendChild(starsEl(r.rating));
    const num = document.createElement('span');
    num.className = 'rv-item__num';
    num.textContent = de2(r.rating) + ' / 5,00';
    score.appendChild(num);
    const label = document.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = r.rating + ' von 5 Sternen';
    score.appendChild(label);

    const text = document.createElement('p');
    text.className = 'rv-item__text';
    text.textContent = r.text;

    li.append(head, score, text);
    return li;
  }

  function render(reviews) {
    const valid = reviews
      .filter((r) => r && Number.isFinite(+r.rating) && +r.rating >= 1 && +r.rating <= 5 && typeof r.text === 'string' && r.text.trim())
      .map((r) => Object.assign({}, r, { rating: Math.round(+r.rating) }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!valid.length) return;

    const total = valid.length;
    const average = valid.reduce((sum, r) => sum + r.rating, 0) / total;
    document.querySelector('[data-rv-average]').textContent = de2(average);
    document.querySelector('[data-rv-stars]').style.width = (average / 5 * 100) + '%';
    document.querySelector('[data-rv-count]').textContent = total === 1 ? '1 Bewertung' : total + ' Bewertungen';
    document.querySelectorAll('[data-dist]').forEach((row) => {
      const stars = Number(row.dataset.dist);
      const pct = valid.filter((r) => r.rating === stars).length / total * 100;
      row.querySelector('.rv-dist__fill').style.width = pct + '%';
      row.querySelector('.rv-dist__pct').textContent = de1(pct) + ' %';
    });
    document.querySelector('[data-rv-score]').hidden = false;
    document.querySelector('[data-rv-empty]').hidden = true;
    document.querySelector('[data-rv-feed-empty]').hidden = true;

    let shown = 0;
    const showMore = () => {
      valid.slice(shown, shown + PAGE_SIZE).forEach((r) => list.appendChild(reviewItem(r)));
      shown = Math.min(total, shown + PAGE_SIZE);
      moreBtn.hidden = shown >= total;
    };
    moreBtn.addEventListener('click', showMore);
    showMore();
  }

  fetch(DATA_URL, { cache: 'no-cache' })
    .then((res) => (res.ok ? res.json() : []))
    .then((data) => { if (Array.isArray(data)) render(data); })
    .catch(() => { /* keeps the empty state */ });

  /* ------------------------------------------------------------------------
     2. Dialog with the review form
     ------------------------------------------------------------------------ */
  const dialog = document.querySelector('[data-review-dialog]');
  const form = document.querySelector('[data-review-form]');
  const success = document.querySelector('[data-review-success]');
  if (!dialog || !form) return;
  const canModal = typeof dialog.showModal === 'function';
  let opener = null;

  function openDialog() {
    opener = document.activeElement;
    if (canModal) { if (!dialog.open) dialog.showModal(); } else { dialog.setAttribute('open', ''); }
    document.body.classList.add('is-locked');
    const first = form.hidden ? success : form.querySelector('.stars__input');
    if (first) first.focus();
  }
  function closeDialog() {
    if (canModal && dialog.open) dialog.close(); else dialog.removeAttribute('open');
  }
  dialog.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    if (history.replaceState && location.hash === '#bewerten') history.replaceState(null, '', location.pathname);
    if (opener && opener.focus) opener.focus();
  });
  // Click on the dark backdrop closes the dialog
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });
  document.querySelectorAll('[data-review-open]').forEach((btn) => btn.addEventListener('click', openDialog));
  dialog.querySelectorAll('[data-review-close]').forEach((btn) => btn.addEventListener('click', closeDialog));
  // Old links (bewertung.html → bewertungen.html#bewerten) open the form directly
  if (location.hash === '#bewerten') openDialog();
  window.addEventListener('hashchange', () => { if (location.hash === '#bewerten') openDialog(); });

  /* ---- Stars: real radio buttons; the highlight follows choice and hover */
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');
  const formStart = Date.now();
  const ratingField = form.querySelector('[data-rating-field]');
  const ratingText = form.querySelector('[data-rating-text]');
  const ratingError = form.querySelector('[data-error-for="rating"]');
  const stars = Array.from(form.querySelectorAll('.stars__item'));
  const radios = stars.map((item) => item.querySelector('input'));
  const rating = () => Number((radios.find((r) => r.checked) || {}).value || 0);

  function paint(value) {
    stars.forEach((item, i) => item.classList.toggle('is-on', i < value));
    ratingText.textContent = RATING_TEXT[value];
  }
  function setRatingError(message) {
    ratingError.textContent = message || '';
    ratingField.classList.toggle('is-invalid', Boolean(message));
  }
  stars.forEach((item, i) => {
    item.addEventListener('mouseenter', () => paint(i + 1));
    item.addEventListener('mouseleave', () => paint(rating()));
  });
  radios.forEach((radio) => radio.addEventListener('change', () => { paint(rating()); setRatingError(''); }));
  paint(0);

  /* ---- Fields */
  const message = form.querySelector('#r-message');
  const email = form.querySelector('#r-email');
  const consent = form.querySelector('#r-consent');
  const consentError = form.querySelector('[data-error-for="r-consent"]');

  function setError(input, text) {
    const errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
    input.closest('.field').classList.toggle('is-invalid', Boolean(text));
    input.classList.toggle('is-invalid', Boolean(text));
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (errorEl) {
      errorEl.textContent = text || '';
      errorEl.id = errorEl.id || input.id + '-error';
      if (text) input.setAttribute('aria-describedby', errorEl.id);
    }
  }
  const validateMessage = () => (message.value.trim() ? '' : MSG.required);
  const validateEmail = () => (email.value.trim() && !EMAIL_RE.test(email.value.trim()) ? MSG.email : '');
  message.addEventListener('input', () => { if (message.getAttribute('aria-invalid') === 'true') setError(message, validateMessage()); });
  email.addEventListener('blur', () => setError(email, validateEmail()));
  consent.addEventListener('change', () => { if (consent.checked) consentError.textContent = ''; });

  function showStatus(text, type) {
    status.textContent = text;
    status.classList.toggle('is-error', type === 'error');
  }

  async function send(data) {
    submitBtn.disabled = true;
    showStatus(MSG.sending);
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      let body = {};
      try { body = await res.json(); } catch (e) { /* non-JSON reply */ }
      if (res.status === 429) { showStatus(MSG.rate, 'error'); return; }
      if (!res.ok || body.ok !== true) throw new Error('HTTP ' + res.status);
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      showStatus(MSG.failed, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const honeypot = form.querySelector('#r-website');
    if (honeypot && honeypot.value.trim() !== '') return;

    let firstInvalid = null;
    if (!rating()) { setRatingError(MSG.rating); firstInvalid = radios[0]; }
    const msgError = validateMessage();
    setError(message, msgError);
    if (msgError && !firstInvalid) firstInvalid = message;
    const mailError = validateEmail();
    setError(email, mailError);
    if (mailError && !firstInvalid) firstInvalid = email;
    consentError.textContent = consent.checked ? '' : MSG.consent;
    if (!consent.checked && !firstInvalid) firstInvalid = consent;
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = new FormData(form);
    data.delete('website');
    data.set('t', String(formStart));
    send(data);
  });
})();
