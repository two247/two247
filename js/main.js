/**
 * TWO247 — Main Application Script
 * Initializes navbar, mobile menu, FAQ, animations, and forms.
 */
import { initNavbar } from './navbar.js';
import { initMobileMenu } from './mobile-menu.js';
import { initFAQ } from './faq.js';
import { initForms } from './forms.js';
import { initAnimations } from './animations.js';
import { initHeroMotion } from './hero-motion.js';
import { initPreloader } from './preloader.js';
import { initTextAppear } from './text-appear.js';
import { initAdvanceSearch } from './advance-search.js';
import { initHeroVideo } from './hero-video.js';
import { initReviewsCarousel } from './reviews-carousel.js';

// Global WhatsApp enquiry handler
window.sendWhatsAppEnquiry = (customMsg) => {
  const phone = "919886296699";
  const defaultMsg = customMsg || "Hello TWO247, I would like to enquire about a holiday package.";
  const encoded = encodeURIComponent(defaultMsg);
  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank", "noopener,noreferrer");
};

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initMobileMenu();
  initFAQ();
  initForms();
  initAnimations();
  initHeroMotion();
  initTextAppear();
  initAdvanceSearch();
  initHeroVideo();
  initReviewsCarousel();

  // Dynamic Copyright Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

import "/chatbot/widget.js";
