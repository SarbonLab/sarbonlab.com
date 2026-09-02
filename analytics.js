/* Аналитика SarbonLab.
   Здесь живут счётчики и отправка целей по кликам.

   На сайте нет страницы «спасибо»: все обращения уходят кликом в WhatsApp,
   на телефон или на почту. Поэтому конверсии считаются событиями на клики,
   а не переходом на отдельный адрес.

   Цели:
     form_whatsapp  — заполнил форму на контактах и нажал отправку (самый горячий)
     whatsapp_click — любая другая кнопка WhatsApp
     phone_click    — клик по номеру телефона
     email_click    — клик по почте
*/
(function () {
  'use strict';

  var YM_ID = 112184697;

  /* ---------- Яндекс.Метрика ---------- */
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) { return; }
    }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + YM_ID, 'ym');

  ym(YM_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true
  });

  /* ---------- Отправка цели ---------- */
  function goal(name, params) {
    try { if (window.ym) { ym(YM_ID, 'reachGoal', name, params); } } catch (e) {}
    // Сюда же добавится gtag, когда появится идентификатор GA4.
    try { if (window.gtag) { window.gtag('event', name, params); } } catch (e) {}
  }

  /* ---------- Клики ---------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target;
    if (!el || !el.closest) { return; }
    var node = el.closest('a, button');
    if (!node) { return; }

    var params = { page: location.pathname };

    // Кнопка формы на странице контактов — самое горячее обращение.
    if (node.id === 'send') {
      params.place = 'form';
      goal('form_whatsapp', params);
      return;
    }

    var href = node.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1) {
      params.place = node.classList.contains('fab') ? 'fab'
                   : node.classList.contains('btn-sm') ? 'header'
                   : 'body';
      goal('whatsapp_click', params);
    } else if (href.indexOf('tel:') === 0) {
      goal('phone_click', params);
    } else if (href.indexOf('mailto:') === 0) {
      goal('email_click', params);
    }
  }, true);
})();
