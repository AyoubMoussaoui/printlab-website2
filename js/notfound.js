/* PRINT LAB Trier: 404 page. English texts for the DE/EN switch
   (js/lang-switch.js); German is in the HTML. */
(function () {
  'use strict';

  const EN = {
    back: 'Back to home page',
    title: 'Page not found', code: 'Error 404',
    text: 'Unfortunately this page does not exist (any more). You will find everything about our services on the home page. Or send us your request directly.',
    home: 'Go to home page', request: 'Send a request',
    footerPayment: 'Payment & delivery', footerClaim: 'Claims', footerReview: 'Reviews', footerImprint: 'Imprint', footerPrivacy: 'Privacy',
    'aria.home': 'PRINT LAB Trier home page', 'aria.lang': 'Choose language'
  };
  window.PrintlabLang.init(EN, 'Page not found | PRINT LAB Trier');
})();
