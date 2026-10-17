/* ==========================================================================
   PRINT LAB Trier: reviews page (bewertungen.html).

   1. Overview and list are built from the approved reviews (reviews.php;
      PRINT LAB approves each one with the link in the review e-mail).
      Nothing is invented: without reviews the page shows "Noch keine
      Bewertungen".
   2. "Bewertung abgeben" opens a dialog with the review form. It posts to
      anfrage.php (form=bewertung); the review is e-mailed to the shop and
      only appears here after it is approved.
   ========================================================================== */
(function () {
  'use strict';

  const ENDPOINT = 'anfrage.php';
  const DATA_URL = 'reviews.php';
  const PAGE_SIZE = 10;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  /* ---- Language: German in the HTML, English below (DE/EN switch in
     js/lang-switch.js). Texts made here follow the current language. */
  const EN = {
    skip: 'Skip to content', back: 'Back to home page',
    kicker: 'Reviews', title: 'What our customers say', write: 'Write a review', overview: 'Overview',
    google: 'Review us on Google', writeSite: 'Review on this website', newTab: '(opens in a new tab)',
    googleHint: 'Do you have a Google account? A review there helps us most:',
    emptyTitle: 'No reviews yet', emptyText: 'Have you ordered from us? Tell others how it went. Your review will be the first.',
    note: 'Before a review appears, we use the name, email address or order number to check that it belongs to an order with us. We only publish reviews we can match to an order, critical ones just like positive ones.',
    feedTitle: 'Latest reviews', feedEmpty: 'Our customers’ reviews will appear here as soon as we have checked them.',
    more: 'Show more reviews', close: 'Close', closeBtn: 'Close',
    dialogLead: 'How happy were you with quality, service and print?',
    ratingLabel: 'Your rating', nameLabel: 'Name or project', nameOpt: '(optional, otherwise “Anonymous”)', namePh: 'e.g. Max from SV Trier',
    messageLabel: 'Your experience', messagePh: 'Share your experience with PRINT LAB Trier …',
    emailLabel: 'Email', emailOpt: '(optional, only for questions, never published)',
    orderLabel: 'Order number', orderOpt: '(optional, helps us match your review, never published)', orderPh: 'e.g. from your invoice',
    consent: 'I agree that my review will be published on printlab-trier.de with the name given (or “Anonymous”).',
    consentHint: 'You can withdraw at any time by email to info@printlab-trier.de.',
    submit: 'Send review', privacy: 'More in our', privacyLink: 'privacy policy',
    thanks: 'Thank you!', thanksText: 'Your feedback helps us a lot. We will check your review and publish it here in the next few days.',
    thanksGoogle: 'Would you like to share it on Google too? We copy your text, you just paste it there.', copyGoogle: 'Copy text & review on Google',
    star1: '1 out of 5 stars', star2: '2 out of 5 stars', star3: '3 out of 5 stars', star4: '4 out of 5 stars', star5: '5 out of 5 stars', stars: 'stars',
    footerPayment: 'Payment & delivery', footerClaim: 'Claims', footerReview: 'Reviews', footerImprint: 'Imprint', footerPrivacy: 'Privacy',
    'aria.home': 'PRINT LAB Trier home page', 'aria.lang': 'Choose language'
  };
  const TEXT = {
    de: {
      ratings: ['Bitte wählen', 'Schlecht', 'Geht so', 'In Ordnung', 'Gut', 'Sehr gut'],
      one: 'Bewertung', many: 'Bewertungen', anonymous: 'Anonym', of5: 'von 5 Sternen', time: ' Uhr',
      required: 'Bitte fülle dieses Feld aus.',
      copied: 'Text kopiert. Füge ihn bei Google einfach ein (lange tippen oder Strg+V).',
      rating: 'Bitte wähle 1 bis 5 Sterne.',
      email: 'Bitte gib eine gültige E-Mail-Adresse ein oder lass das Feld leer.',
      consent: 'Bitte bestätige, dass wir deine Bewertung veröffentlichen dürfen.',
      sending: 'Wird gesendet …',
      rate: 'Zu viele Anfragen in kurzer Zeit. Bitte versuche es in einer Stunde erneut.',
      failed: 'Das Senden hat leider nicht geklappt. Schick uns deine Bewertung gerne per E-Mail an info@printlab-trier.de.'
    },
    en: {
      ratings: ['Please choose', 'Poor', 'Fair', 'Okay', 'Good', 'Very good'],
      one: 'review', many: 'reviews', anonymous: 'Anonymous', of5: 'out of 5 stars', time: '',
      required: 'Please fill in this field.',
      copied: 'Text copied. Just paste it on Google (long-press or Ctrl+V).',
      rating: 'Please choose 1 to 5 stars.',
      email: 'Please enter a valid email address or leave the field empty.',
      consent: 'Please confirm that we may publish your review.',
      sending: 'Sending …',
      rate: 'Too many requests in a short time. Please try again in an hour.',
      failed: 'Unfortunately sending did not work. Feel free to send us your review by email to info@printlab-trier.de.'
    }
  };
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'de');
  const T = (key) => TEXT[lang()][key];
  // Numbers: 4,90 in German, 4.90 in English
  const fmt = (n, digits) => { const s = n.toFixed(digits); return lang() === 'en' ? s : s.replace('.', ','); };
  window.PrintlabLang.init(EN, 'Reviews | PRINT LAB Trier');

  /* ------------------------------------------------------------------------
     1. Overview and list
     ------------------------------------------------------------------------ */
  const list = document.querySelector('[data-rv-list]');
  const moreBtn = document.querySelector('[data-rv-more]');

  function formatDate(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const sep = lang() === 'en' ? '/' : '.';
    const date = pad(d.getDate()) + sep + pad(d.getMonth() + 1) + sep + d.getFullYear();
    // Only show a time when the entry has one
    return /T\d{2}:\d{2}/.test(value) ? date + ', ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + T('time') : date;
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
    who.textContent = !r.name || r.name === 'Anonym' ? T('anonymous') : r.name;
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
    num.textContent = fmt(r.rating, 2) + ' / ' + fmt(5, 2);
    score.appendChild(num);
    const label = document.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = r.rating + ' ' + T('of5');
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
    document.querySelector('[data-rv-stars]').style.width = (average / 5 * 100) + '%';
    const paintSummary = () => {
      document.querySelector('[data-rv-average]').textContent = fmt(average, 2);
      document.querySelector('.rv-summary__of').textContent = '/ ' + fmt(5, 2);
      document.querySelector('[data-rv-count]').textContent = total + ' ' + (total === 1 ? T('one') : T('many'));
      document.querySelectorAll('[data-dist]').forEach((row) => {
        const stars = Number(row.dataset.dist);
        const pct = valid.filter((r) => r.rating === stars).length / total * 100;
        row.querySelector('.rv-dist__fill').style.width = pct + '%';
        row.querySelector('.rv-dist__pct').textContent = fmt(pct, 1) + ' %';
      });
    };
    paintSummary();
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
    document.addEventListener('printlab:lang', () => {
      paintSummary();
      list.textContent = '';
      valid.slice(0, shown).forEach((r) => list.appendChild(reviewItem(r)));
    });
  }

  // reviews.php returns the approved reviews from the server; reviews.json
  // (the repository copy) is the fallback, e.g. without PHP
  const getJson = (url) => fetch(url, { cache: 'no-cache' }).then((res) => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  });
  getJson(DATA_URL)
    .catch(() => getJson('reviews.json'))
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
    ratingText.textContent = T('ratings')[value];
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
  document.addEventListener('printlab:lang', () => paint(rating()));

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
  const validateMessage = () => (message.value.trim() ? '' : T('required'));
  const validateEmail = () => (email.value.trim() && !EMAIL_RE.test(email.value.trim()) ? T('email') : '');
  message.addEventListener('input', () => { if (message.getAttribute('aria-invalid') === 'true') setError(message, validateMessage()); });
  email.addEventListener('blur', () => setError(email, validateEmail()));
  consent.addEventListener('change', () => { if (consent.checked) consentError.textContent = ''; });

  function showStatus(text, type) {
    status.textContent = text;
    status.classList.toggle('is-error', type === 'error');
  }

  async function send(data) {
    submitBtn.disabled = true;
    showStatus(T('sending'));
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      let body = {};
      try { body = await res.json(); } catch (e) { /* non-JSON reply */ }
      if (res.status === 429) { showStatus(T('rate'), 'error'); return; }
      if (!res.ok || body.ok !== true) throw new Error('HTTP ' + res.status);
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      showStatus(T('failed'), 'error');
    } finally {
      submitBtn.disabled = false;
    }
  }

  /* ---- After sending: "Text kopieren & auf Google bewerten" copies the
     review text to the clipboard; the link itself opens Google in a new
     tab as usual (also when copying is not possible). */
  const googleCopy = success && success.querySelector('[data-review-google-copy]');
  const copyStatus = success && success.querySelector('[data-copy-status]');
  if (googleCopy) googleCopy.addEventListener('click', () => {
    const text = message.value.trim();
    if (!text || !navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(text).then(() => {
      if (copyStatus) copyStatus.textContent = T('copied');
    }).catch(() => { /* not allowed: the visitor types the review on Google */ });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const honeypot = form.querySelector('#r-website');
    if (honeypot && honeypot.value.trim() !== '') return;

    let firstInvalid = null;
    if (!rating()) { setRatingError(T('rating')); firstInvalid = radios[0]; }
    const msgError = validateMessage();
    setError(message, msgError);
    if (msgError && !firstInvalid) firstInvalid = message;
    const mailError = validateEmail();
    setError(email, mailError);
    if (mailError && !firstInvalid) firstInvalid = email;
    consentError.textContent = consent.checked ? '' : T('consent');
    if (!consent.checked && !firstInvalid) firstInvalid = consent;
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = new FormData(form);
    data.delete('website');
    data.set('t', String(formStart));
    data.set('elapsed', String(Math.round((Date.now() - formStart) / 1000)));
    send(data);
  });
})();
