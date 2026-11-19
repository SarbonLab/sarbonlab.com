/* Декор: видео-петли поверх фоновых картинок в тёмных блоках. Каждая петля грузится, когда её блок
   подходит к экрану, и встаёт на паузу, когда уходит. При экономии трафика не грузятся. */
(function () {
  var LOOPS = [
    { sel: '.cta-box', src: '/decor/band-dark-loop-1080.mp4', minW: 0 },
    { sel: '.log-wrap, .fit-main', src: '/decor/net-dark-loop-1080.mp4', minW: 761 }
  ];
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
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        v.setAttribute('aria-hidden', 'true'); v.setAttribute('tabindex', '-1');
        v.addEventListener('playing', function () { v.classList.add('on'); });
        v.addEventListener('error', function () { v.remove(); });
        v.src = box.getAttribute('data-decor-src');
        box.appendChild(v);
      }
      if (v) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }
    });
  }, { rootMargin: '300px 0px' });
  LOOPS.forEach(function (l) {
    if (window.innerWidth < l.minW) return;
    document.querySelectorAll(l.sel).forEach(function (b) { b.setAttribute('data-decor-src', l.src); io.observe(b); });
  });
})();
