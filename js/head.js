/* PRINT LAB Trier: runs in <head> before the first paint. Marks JS as
   available (scroll-reveal only hides content then). A separate file so the
   Content Security Policy can forbid inline scripts. */
document.documentElement.classList.add('js');
