/* Декор: видео-петли поверх фоновых картинок. Только на широких экранах, без экономии трафика
   и без «уменьшения движения»; каждая петля грузится, когда её блок подходит к экрану. */
(function () {
  var LOOPS = [
    { sel: '.hero', src: '/decor/hero-light-loop.mp4' },
    { sel: '.cta-box', src: '/decor/band-dark-loop.mp4' },
    { sel: '.log-wrap, .fit-main', src: '/decor/net-dark-loop.mp4' }
  ];
  var mq = window.matchMedia;
  if (!mq || mq('(prefers-reduced-motion: reduce)').matches || !mq('(min-width: 900px)').matches) return;
  var c = navigator.connection;
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return;
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var box = e.target, v = box.querySelector(':scope > .decor-video');
      if (e.isIntersecting && !v) {
        v = document.createElement('video');
        v.className = 'decor-video';
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
        v.setAttribute('aria-hidden', 'true'); v.setAttribute('tabindex', '-1');
        v.addEventListener('playing', function () { v.classList.add('on'); box.classList.add('decor-playing'); });
        v.addEventListener('error', function () { v.remove(); });
        v.src = box.getAttribute('data-decor-src');
        box.appendChild(v);
      }
      if (v) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }
    });
  }, { rootMargin: '300px 0px' });
  LOOPS.forEach(function (l) {
    document.querySelectorAll(l.sel).forEach(function (b) { b.setAttribute('data-decor-src', l.src); io.observe(b); });
  });
})();
