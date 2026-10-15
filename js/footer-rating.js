/* ==========================================================================
   PRINT LAB Trier: review summary in the footer of every page (stars,
   average, number of reviews; links to bewertungen.html). Uses only the
   approved reviews (reviews.php, fallback reviews.json) and stays hidden
   while there are none.
   ========================================================================== */
(function () {
  'use strict';

  const link = document.querySelector('[data-footer-rating]');
  if (!link) return;

  const getJson = (url) => fetch(url, { cache: 'no-cache' }).then((res) => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  });

  getJson('reviews.php').catch(() => getJson('reviews.json')).then((data) => {
    const ratings = (Array.isArray(data) ? data : [])
      .filter((r) => r && +r.rating >= 1 && +r.rating <= 5 && typeof r.text === 'string' && r.text.trim())
      .map((r) => Math.round(+r.rating));
    if (!ratings.length) return;
    const average = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;

    link.querySelector('[data-footer-stars]').style.width = (average / 5 * 100) + '%';
    // Follows the language switch on the home page (html lang)
    const paint = () => {
      const de = document.documentElement.lang !== 'en';
      const score = average.toFixed(2).replace('.', de ? ',' : '.');
      const count = ratings.length + ' ' + (de
        ? (ratings.length === 1 ? 'Bewertung' : 'Bewertungen')
        : (ratings.length === 1 ? 'review' : 'reviews'));
      link.querySelector('[data-footer-score]').textContent = score;
      link.querySelector('[data-footer-count]').textContent = count;
      link.setAttribute('aria-label', (de ? 'Kundenbewertungen: ' : 'Customer reviews: ') + score + ' / 5, ' + count);
    };
    paint();
    document.addEventListener('printlab:lang', paint);
    link.hidden = false;
  }).catch(() => { /* stays hidden */ });
})();
