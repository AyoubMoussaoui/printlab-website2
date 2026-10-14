/* ==========================================================================
   PRINT LAB Trier: review form (bewertung.html).
   Posts to anfrage.php with form=bewertung; the review is e-mailed to the
   shop and only published on the website after checking and with consent.
   ========================================================================== */
(function () {
  'use strict';

  const ENDPOINT = 'anfrage.php';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const RATING_TEXT = ['Bitte wählen', 'Schlecht', 'Geht so', 'In Ordnung', 'Gut', 'Sehr gut'];
  const MSG = {
    required: 'Bitte fülle dieses Feld aus.',
    rating: 'Bitte wähle 1 bis 5 Sterne.',
    email: 'Bitte gib eine gültige E-Mail-Adresse ein oder lass das Feld leer.',
    sending: 'Wird gesendet …',
    rate: 'Zu viele Anfragen in kurzer Zeit. Bitte versuche es in einer Stunde erneut.',
    failed: 'Das Senden hat leider nicht geklappt. Schick uns dein Feedback gerne per E-Mail an info@printlab-trier.de.'
  };

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  const form = document.querySelector('[data-review-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[type="submit"]');
  const success = document.querySelector('[data-review-success]');
  const formStart = Date.now();

  /* ---- Stars: real radio buttons (keyboard and screen readers work as
     usual); the highlight follows the choice and the hovered star */
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

  /* ---- Text fields */
  const fields = ['r-name', 'r-message', 'r-email'].map((id) => form.querySelector('#' + id));

  function validate(input) {
    const value = input.value.trim();
    if (input.required && !value) return MSG.required;
    if (input.type === 'email' && value && !EMAIL_RE.test(value)) return MSG.email;
    return '';
  }

  function setError(input, message) {
    const errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
    input.closest('.field').classList.toggle('is-invalid', Boolean(message));
    input.classList.toggle('is-invalid', Boolean(message));
    input.classList.toggle('is-valid', !message && input.value.trim() !== '');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.id = errorEl.id || input.id + '-error';
      if (message) input.setAttribute('aria-describedby', errorEl.id);
    }
  }

  fields.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) setError(input, validate(input)); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') setError(input, validate(input)); });
  });

  function showStatus(message, type) {
    status.textContent = message;
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
      if (success.getBoundingClientRect().top < 0) {
        window.scrollTo({ top: Math.max(0, success.getBoundingClientRect().top + window.pageYOffset - 24), behavior: 'smooth' });
      }
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
    if (!rating()) {
      setRatingError(MSG.rating);
      firstInvalid = radios[0];
    }
    fields.forEach((input) => {
      const message = validate(input);
      setError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = new FormData(form);
    data.delete('website');
    data.set('t', String(formStart));
    send(data);
  });
})();
