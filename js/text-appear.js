/**
 * =========================================================================
 * MOTIONSITES-INSPIRED TEXT APPEAR & REVEAL ENGINE
 * High-End Kinetic Typography, Word-by-Word Masking & Scroll Trigger
 * =========================================================================
 */

export function initTextAppear() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Prepare and split elements with [data-text-appear]
  const targetElements = document.querySelectorAll('[data-text-appear]');
  
  targetElements.forEach((el) => {
    // Prevent duplicate splitting
    if (el.dataset.textAppearInitialized === 'true') return;
    el.dataset.textAppearInitialized = 'true';

    const mode = el.dataset.textAppear || 'words'; // 'words', 'lines', or 'chars'
    const delayBase = parseFloat(el.dataset.appearDelay || '0');
    const stagger = parseFloat(el.dataset.appearStagger || '0.04');

    if (isReducedMotion) {
      el.style.opacity = '1';
      return;
    }

    if (mode === 'words') {
      splitElementIntoWords(el, delayBase, stagger);
    } else if (mode === 'lines') {
      splitElementIntoLines(el, delayBase, stagger);
    }
  });

  // 2. Setup IntersectionObserver for scroll-triggered elements
  const scrollElements = document.querySelectorAll('[data-text-appear]:not([data-appear-manual])');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerAppear(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    scrollElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    scrollElements.forEach(el => triggerAppear(el));
  }

  // 3. Hero Immediate Trigger (coordinated with Preloader or instant)
  const heroRevealGroup = document.querySelectorAll('.hero-text-appear');
  const triggerHero = () => {
    heroRevealGroup.forEach((el, idx) => {
      setTimeout(() => {
        triggerAppear(el);
      }, idx * 120 + 80);
    });
  };

  // If preloader is active, wait for it or trigger after short buffer
  const preloader = document.getElementById('two247-preloader');
  if (preloader && !preloader.classList.contains('preloader-hidden')) {
    // Listen for custom event or fallback timer
    const checkDismiss = setInterval(() => {
      if (preloader.classList.contains('preloader-hidden') || preloader.style.display === 'none') {
        clearInterval(checkDismiss);
        setTimeout(triggerHero, 150);
      }
    }, 100);
    // Absolute fallback
    setTimeout(() => {
      clearInterval(checkDismiss);
      triggerHero();
    }, 3200);
  } else {
    setTimeout(triggerHero, 100);
  }
}

/**
 * Splits text content of an element into masked word tokens safely,
 * traversing text nodes while preserving existing HTML element nodes (e.g. <span>, <em>).
 */
function splitElementIntoWords(el, baseDelay = 0, stagger = 0.04) {
  let wordIdx = 0;

  function tokenizeNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text) return document.createDocumentFragment();
      const tokens = text.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      tokens.forEach(token => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(token));
          return;
        }
        const wrap = document.createElement('span');
        wrap.className = 'text-reveal-wrap';

        const item = document.createElement('span');
        item.className = 'text-reveal-item';
        item.textContent = token;

        const computedDelay = (baseDelay + wordIdx * stagger).toFixed(3);
        item.style.transitionDelay = `${computedDelay}s`;

        wrap.appendChild(item);
        frag.appendChild(wrap);
        wordIdx++;
      });
      return frag;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      Array.from(node.childNodes).forEach(child => {
        clone.appendChild(tokenizeNode(child));
      });
      return clone;
    }
    return node.cloneNode(true);
  }

  const fragment = document.createDocumentFragment();
  Array.from(el.childNodes).forEach(child => {
    fragment.appendChild(tokenizeNode(child));
  });

  el.innerHTML = '';
  el.appendChild(fragment);
  el.classList.add('text-reveal-container');
}

/**
 * Splits text by linebreaks or direct children
 */
function splitElementIntoLines(el, baseDelay = 0, stagger = 0.08) {
  const lines = el.innerHTML.split(/<br\s*\/?>/i);
  let lineIdx = 0;

  const fragment = document.createDocumentFragment();

  lines.forEach((lineText, idx) => {
    const wrap = document.createElement('span');
    wrap.className = 'text-reveal-wrap block';

    const item = document.createElement('span');
    item.className = 'text-reveal-item block';
    item.innerHTML = lineText.trim();
    
    const computedDelay = (baseDelay + lineIdx * stagger).toFixed(3);
    item.style.transitionDelay = `${computedDelay}s`;
    
    wrap.appendChild(item);
    fragment.appendChild(wrap);
    lineIdx++;

    if (idx < lines.length - 1) {
      fragment.appendChild(document.createElement('br'));
    }
  });

  el.innerHTML = '';
  el.appendChild(fragment);
  el.classList.add('text-reveal-container');
}

/**
 * Triggers the reveal animation on an element
 */
export function triggerAppear(element) {
  if (!element) return;
  element.classList.add('text-reveal-active');
  const items = element.querySelectorAll('.text-reveal-item');
  items.forEach(item => item.classList.add('is-revealed'));
}

// Auto-run when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextAppear);
  } else {
    initTextAppear();
  }
}
