/* ==========================================================================
   PRINT LAB Trier: review summary (stars, average, number of reviews;
   links to the reviews page) in the footer of every page and, small, above
   the headline on the home page. Uses only the approved reviews
   (reviews.php, fallback reviews.json). Without reviews the footer summary
   stays hidden and the home page one is removed. Also fills in the current
   year in the footer.
   ========================================================================== */
(function () {
  'use strict';

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  const footer = document.querySelector('[data-footer-rating]');
  const hero = document.querySelector('[data-hero-rating]');
  if (!footer && !hero) return;
  const noReviews = () => { if (hero) hero.hidden = true; };

  const getJson = (url) => fetch(url, { cache: 'no-cache' }).then((res) => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  });

  getJson('reviews.php').catch(() => getJson('reviews.json')).then((data) => {
    const ratings = (Array.isArray(data) ? data : [])
      .filter((r) => r && +r.rating >= 1 && +r.rating <= 5 && typeof r.text === 'string' && r.text.trim())
      .map((r) => Math.round(+r.rating));
    if (!ratings.length) { noReviews(); return; }
    const average = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
    const width = (average / 5 * 100) + '%';
    if (footer) footer.querySelector('[data-footer-stars]').style.width = width;
    if (hero) hero.querySelector('[data-hero-stars]').style.width = width;

    // Follows the language switch on the home page (html lang)
    const paint = () => {
      const de = document.documentElement.lang !== 'en';
      const score = average.toFixed(2).replace('.', de ? ',' : '.');
      const count = ratings.length + ' ' + (de
        ? (ratings.length === 1 ? 'Bewertung' : 'Bewertungen')
        : (ratings.length === 1 ? 'review' : 'reviews'));
      const label = (de ? 'Kundenbewertungen: ' : 'Customer reviews: ') + score + ' / 5, ' + count;
      if (footer) {
        footer.querySelector('[data-footer-score]').textContent = score;
        footer.querySelector('[data-footer-count]').textContent = count;
        footer.setAttribute('aria-label', label);
      }
      if (hero) {
        hero.querySelector('[data-hero-score]').textContent = score;
        hero.querySelector('[data-hero-count]').textContent = count;
        hero.setAttribute('aria-label', label);
      }
    };
    paint();
    document.addEventListener('printlab:lang', paint);
    if (footer) footer.hidden = false;
    if (hero) hero.classList.add('is-ready');
  }).catch(noReviews);
})();
