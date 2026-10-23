/* PRINT LAB Trier: runs in <head> on every page, before the first paint.
   - Marks JS as available (the home page's scroll-reveal only hides
     content then).
   - If English was chosen earlier, the page stays invisible for a moment
     until the page script has switched the texts, so German does not flash
     up first. The page script removes .lang-pending; a CSS fallback shows
     the page after one second in any case.
   A separate file so the Content Security Policy can forbid inline scripts. */
document.documentElement.classList.add('js');
try {
  if (localStorage.getItem('printlab-lang') === 'en') document.documentElement.classList.add('lang-pending');
} catch (e) { /* storage blocked: German */ }

/* Christmas campaign ("Weihnachtsaktion"), by the date in Germany:
   from ANNOUNCE it is announced (html.promo-soon), from START to END it is
   running (html.promo-now), afterwards everything is hidden again. The
   banner and notes are in the HTML and only shown through these classes,
   so nothing jumps when the page loads. Same dates in anfrage.php. */
(function () {
  var ANNOUNCE = '2026-10-23', START = '2026-11-14', END = '2026-12-14';
  var today;
  try {
    var parts = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    today = parts.year + '-' + parts.month + '-' + parts.day;
  } catch (e) {
    var d = new Date();
    today = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  if (today >= START && today <= END) document.documentElement.classList.add('promo-now');
  else if (today >= ANNOUNCE && today < START) document.documentElement.classList.add('promo-soon');
})();
