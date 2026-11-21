/**
 * TWO247 — Editorial Motion & Micro Animations
 * High-performance IntersectionObserver for text reveals, card cascades, and stagger effects.
 * Inspired by luxury editorial travel design (Aman, Black Tomato, Pelorus).
 */

export function initAnimations() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: immediate reveal
  if (isReducedMotion) {
    document.querySelectorAll('.appear-text, .appear-card, .appear-fade, .reveal-on-scroll').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  // 1. Setup Stagger Groups (Container dynamically delays its cards)
  const staggerGroups = document.querySelectorAll('[data-stagger-group]');
  staggerGroups.forEach(group => {
    const items = group.children;
    Array.from(items).forEach((item, index) => {
      if (!item.classList.contains('appear-card')) {
        item.classList.add('appear-card');
      }
      item.style.setProperty('--stagger-delay', `${Math.min(index * 80, 480)}ms`);
    });
  });

  // 2. Global Intersection Observer for Scroll Reveals
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with appear classes
  const elementsToObserve = document.querySelectorAll('.appear-text, .appear-card, .appear-fade, .reveal-on-scroll');
  elementsToObserve.forEach(el => {
    revealObserver.observe(el);
  });

  // 3. Dynamic Card Stagger Helper (for dynamic search/filter renders)
  window.triggerCardAppear = (container) => {
    if (!container) return;
    const cards = container.querySelectorAll('.editorial-card, .travel-card, .appear-card');
    cards.forEach((card, idx) => {
      card.classList.add('appear-card');
      card.style.setProperty('--stagger-delay', `${Math.min(idx * 75, 450)}ms`);
      // Double rAF ensures the initial opacity:0 is registered before transition kicks in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('is-visible');
        });
      });
    });
  };
}
