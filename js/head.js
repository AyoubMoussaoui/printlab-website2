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
