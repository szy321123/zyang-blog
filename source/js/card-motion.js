(() => {
  const SELECTOR = '.download-card, .sites-card, .tools-card';

  function revealCards() {
    const cards = Array.from(document.querySelectorAll(SELECTOR));
    if (!cards.length) return;

    document.documentElement.classList.add('card-motion-enabled');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-revealed'));
      return;
    }

    cards.forEach((card) => card.classList.remove('is-revealed'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    });

    cards.forEach((card) => observer.observe(card));
  }

  document.addEventListener('DOMContentLoaded', revealCards);
  document.addEventListener('pjax:complete', revealCards);
})();
