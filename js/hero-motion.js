import { switchHeroVideo, resetHeroVideo } from './hero-video.js';

/**
 * TWO247 — Luxury Hero Motion Controller
 * Features:
 * - Zero-layout-shift animated typography & rotating luxury travel ticker
 * - Professional dual-tone vector icons (Flights, Yachts, Tropical Islands, Compass, 24/7 Concierge)
 * - 5 3D interactive floating destination cards with continuous ambient wave motion & mouse parallax
 * - Fully responsive, stable sizing with zero cumulative layout shift (CLS)
 */

export function initHeroMotion() {
  const heroSection = document.getElementById('hero-motion-section') || document.querySelector('section[aria-label="Hero Introduction"]') || document.querySelector('.hero-editorial-headline');
  if (!heroSection) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const cardsStage = document.getElementById('hero-cards-stage');
  const tickerContainer = document.getElementById('hero-ticker-track');

  // Professional SVG Icons Library (Obsidian Palette #000000)
  const ICONS = {
    flight: `<svg class="w-4 h-4 text-[#000000] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>`,
    island: `<svg class="w-4 h-4 text-[#000000] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8c0-2.8-2.2-5-5-5a5 5 0 0 0-5 5c2.8 0 5 2.2 5 5"/><path d="M13 7.1a5 5 0 0 1 5 4.9c-2.8 0-5 2.2-5 5"/><path d="M13 17.5v4.5"/><path d="M2 22h20"/><path d="M11 12a4 4 0 0 0-4-4"/></svg>`,
    compass: `<svg class="w-4 h-4 text-[#000000] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fill-opacity="0.3"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`,
    yacht: `<svg class="w-4 h-4 text-[#000000] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a4 4 0 0 0 4-2 4 4 0 0 1 4-2 4 4 0 0 1 4 2 4 4 0 0 0 4 2 4 4 0 0 0 4-2"/><path d="M4 14l2-8h12l2 8"/><path d="M12 6V2l4 2-4 2"/></svg>`,
    concierge: `<svg class="w-4 h-4 text-[#000000] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>`,
    star: `<svg class="w-3.5 h-3.5 text-[#000000] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
  };

  // 1. ROTATING HIGHLIGHT TICKER (Stable Layout, Zero Shift)
  const TICKER_ITEMS = [
    { icon: ICONS.flight, text: "Curated International Escapes & Luxury Flights" },
    { icon: ICONS.island, text: "Maldives & Tropical Overwater Villa Holidays" },
    { icon: ICONS.compass, text: "Personalized Itineraries Planned by Specialists" },
    { icon: ICONS.yacht, text: "Private Catamaran & Coastal Yacht Cruises" },
    { icon: ICONS.concierge, text: "Continuous 24/7 Dedicated Trip Coordinator" }
  ];

  if (tickerContainer) {
    tickerContainer.innerHTML = '';
    const badgeEl = document.createElement('div');
    badgeEl.className = 'hero-ticker-badge';
    tickerContainer.appendChild(badgeEl);

    let currentTickerIdx = 0;
    function renderTickerItem(idx) {
      const item = TICKER_ITEMS[idx];
      badgeEl.innerHTML = `
        <span class="ticker-icon-wrap">${item.icon}</span>
        <span class="ticker-text font-semibold text-slate-800 text-xs sm:text-sm tracking-wide">${item.text}</span>
      `;
    }

    renderTickerItem(0);

    if (!isReducedMotion) {
      setInterval(() => {
        badgeEl.style.opacity = '0';
        badgeEl.style.transform = 'translateY(6px)';
        setTimeout(() => {
          currentTickerIdx = (currentTickerIdx + 1) % TICKER_ITEMS.length;
          renderTickerItem(currentTickerIdx);
          badgeEl.style.opacity = '1';
          badgeEl.style.transform = 'translateY(0)';
        }, 300);
      }, 3400);
    }
  }

  // 2. CURATED 5 DESTINATION CARDS
  const DESTINATION_CARDS = [
    {
      title: "Maldives Romance",
      tag: "MALDIVES",
      price: "₹84,999",
      rating: "5.0",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80",
      link: "packages/maldives-honeymoon.html",
      video: "https://res.cloudinary.com/n4bywdyq/video/upload/v1795243230/vidssave.com_Maldives_12K_HDR_60fps_Dolby_Vision_480P.mp4"
    },
    {
      title: "Luxury Dubai Escape",
      tag: "DUBAI",
      price: "₹48,000",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
      link: "packages/dubai-luxury-escape.html",
      video: "https://res.cloudinary.com/n4bywdyq/video/upload/v1795243380/vidssave.com_DUBAI_IN_1_MINUTE_360P.mp4"
    },
    {
      title: "Swiss Alpine Wonders",
      tag: "EUROPE",
      price: "₹1,58,000",
      rating: "5.0",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
      link: "packages.html",
      video: "https://res.cloudinary.com/n4bywdyq/video/upload/v1795243638/vidssave.com_Paris_Status_I_Paris_Whatsapp_Status_Video_I_Paris_Attractions_I_Paris_Whatsapp_Status_%E0%A4%AA%E0%A5%87%E0%A4%B0%E0%A4%BF%E0%A4%B8_%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A5%87%E0%A4%9F%E0%A4%B8_1080P.mp4"
    },
    {
      title: "Bali Tropical Serenity",
      tag: "INDONESIA",
      price: "₹36,999",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      link: "packages.html",
      video: "https://res.cloudinary.com/n4bywdyq/video/upload/v1795245269/New_project_3_2026-11-21_12-23.mp4"
    },
    {
      title: "Singapore Skyline",
      tag: "SINGAPORE",
      price: "₹48,000",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
      link: "destinations/singapore.html",
      video: "https://res.cloudinary.com/n4bywdyq/video/upload/v1795244169/vidssave.com_Singapore_Status_I_Singapore_Whatsapp_Status_Video_Singapore_Attractions_Singapore_Whatsapp_Status_480P.mp4"
    }
  ];

  if (!cardsStage) return;
  cardsStage.innerHTML = '';

  const cardElements = [];
  const cardStates = [];

  DESTINATION_CARDS.forEach((cData, i) => {
    const aEl = document.createElement('a');
    aEl.href = cData.link;
    aEl.className = 'hero-floating-card group';
    aEl.setAttribute('aria-label', `${cData.title} package from ${cData.price}`);
    aEl.setAttribute('data-video', cData.video);

    aEl.innerHTML = `
      <div class="card-image-wrap">
        <img src="${cData.image}" alt="${cData.title}" class="card-img" loading="eager">
        <div class="card-gradient-overlay"></div>
      </div>
      <div class="card-content-badge">
        <div class="flex items-center justify-between gap-1 mb-1">
          <span class="card-dest-tag">${cData.tag}</span>
          <div class="flex items-center gap-0.5 text-amber-400 text-[10px] font-bold">
            ${ICONS.star}
            <span>${cData.rating}</span>
          </div>
        </div>
        <div class="card-title">${cData.title}</div>
        <div class="flex items-center justify-between mt-1 pt-1 border-t border-white/15">
          <span class="text-[9px] uppercase tracking-wider text-slate-300">From</span>
          <span class="card-price">${cData.price}</span>
        </div>
      </div>
    `;

    cardsStage.appendChild(aEl);
    cardElements.push(aEl);
    cardStates.push({
      baseAngle: (i - 2) * 5.5, // gentle fan angles: -11, -5.5, 0, +5.5, +11
      phase: i * 0.9,
      currentY: 0,
      currentRot: (i - 2) * 5.5,
      isHovered: false
    });

    aEl.addEventListener('mouseenter', () => {
      cardStates[i].isHovered = true;
      switchHeroVideo(cData.video);
    });

    aEl.addEventListener('mouseleave', () => {
      cardStates[i].isHovered = false;
    });

    aEl.addEventListener('touchstart', () => {
      switchHeroVideo(cData.video);
    }, { passive: true });
  });

  // Revert to default background when cursor leaves cards area
  cardsStage.addEventListener('mouseleave', () => {
    resetHeroVideo(300);
  });

  // 3. MOUSE PARALLAX TRACKING
  let mouseX = 0;
  let mouseY = 0;

  heroSection.addEventListener('pointermove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  heroSection.addEventListener('pointerleave', () => {
    mouseX = 0;
    mouseY = 0;
    resetHeroVideo(250);
  });

  // 4. ANIMATION TICK LOOP (Continuous Gentle Floating Wave + Parallax)
  let startTime = performance.now();
  let lastTime = startTime;

  function tick(now) {
    const elapsed = (now - startTime) / 1000;
    const dt = Math.min(100, now - lastTime);
    lastTime = now;

    // Entrance animation completion (first 1.2s)
    const entranceProgress = Math.min(1, elapsed / 0.9);
    const entranceEase = 1 - Math.pow(1 - entranceProgress, 3);

    cardElements.forEach((el, i) => {
      const state = cardStates[i];

      if (isReducedMotion) {
        el.style.transform = `rotate(${state.baseAngle}deg)`;
        el.style.opacity = '1';
        return;
      }

      // Sine wave breathing hover
      const floatY = Math.sin(elapsed * 1.8 + state.phase) * 5;
      const targetParallaxX = mouseX * (10 + (2 - Math.abs(i - 2)) * 4);
      const targetParallaxY = mouseY * 6;

      const hoverLift = state.isHovered ? -16 : 0;
      const hoverScale = state.isHovered ? 1.08 : 1;
      const hoverRot = state.isHovered ? 0 : state.baseAngle + (mouseX * 2);

      // Staggered rise on entrance
      const staggerDelay = i * 0.1;
      const cardEntrance = Math.max(0, Math.min(1, (elapsed - staggerDelay) / 0.7));
      const cardEase = 1 - Math.pow(1 - cardEntrance, 3);
      const entranceOffsetY = (1 - cardEase) * 60;

      const totalY = floatY + targetParallaxY + hoverLift + entranceOffsetY;
      const totalX = targetParallaxX;

      el.style.transform = `translate3d(${totalX}px, ${totalY}px, 0) rotate(${hoverRot}deg) scale(${hoverScale})`;
      el.style.opacity = `${cardEase}`;
      el.style.zIndex = state.isHovered ? 30 : (10 + (2 - Math.abs(i - 2)));
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
