/**
 * =========================================================================
 * TWO247 — Dynamic Customer Reviews Carousel
 * Auto-moving horizontal carousel synchronized directly with Cloud Firestore
 * =========================================================================
 */
import { getReviews } from "./data-service.js";

export async function initReviewsCarousel() {
  const track = document.getElementById("reviews-carousel-track");
  if (!track) return;

  const prevBtn = document.getElementById("rev-scroll-prev");
  const nextBtn = document.getElementById("rev-scroll-next");

  let autoScrollTimer = null;
  let isHovered = false;

  async function loadAndRender() {
    const list = await getReviews(true);

    if (!list || list.length === 0) {
      track.innerHTML = `<div class="py-12 text-center text-slate-400 text-xs w-full">Verified reviews will appear here.</div>`;
      return;
    }

    track.innerHTML = list.map(r => {
      const rating = Math.min(5, Math.max(1, Number(r.rating) || 5));
      const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      const name = r.clientName || r.name || "Verified Voyager";
      const dest = r.destinationVisited || r.destination || "Bespoke Journey";
      const loc = r.clientLocation || "";
      const text = r.reviewText || "Exceptional luxury travel coordination and on-ground concierge support.";
      const avatarUrl = r.avatarUrl || "";

      // Initials for avatar fallback
      const initials = name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "VO";

      const avatarMarkup = avatarUrl 
        ? `<img src="${avatarUrl}" alt="${name}" class="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200">`
        : `<div class="w-10 h-10 rounded-full bg-black text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">${initials}</div>`;

      return `
        <div class="review-carousel-card snap-start shrink-0 w-[290px] sm:w-[350px] md:w-[380px] bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between select-none">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="text-amber-500 text-sm tracking-wider font-bold" aria-label="${rating} out of 5 stars">
                ${stars}
              </div>
              <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                <svg class="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                <span>Verified</span>
              </span>
            </div>

            <p class="text-slate-800 text-xs sm:text-sm italic leading-relaxed line-clamp-4">
              "${text}"
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
            ${avatarMarkup}
            <div class="min-w-0">
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">${name}</h4>
              <p class="text-[11px] text-slate-500 truncate">${dest}${loc ? ' • ' + loc : ''}</p>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  await loadAndRender();

  // Scroll helpers
  function getScrollStep() {
    const card = track.querySelector(".review-carousel-card");
    return card ? card.offsetWidth + 24 : 360;
  }

  function scrollNext() {
    const step = getScrollStep();
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 15) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: step, behavior: "smooth" });
    }
  }

  function scrollPrev() {
    const step = getScrollStep();
    if (track.scrollLeft <= 15) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: -step, behavior: "smooth" });
    }
  }

  if (nextBtn) nextBtn.addEventListener("click", () => {
    scrollNext();
    restartTimer();
  });

  if (prevBtn) prevBtn.addEventListener("click", () => {
    scrollPrev();
    restartTimer();
  });

  // Auto-scroll logic with pause on hover
  function startAuto() {
    stopAuto();
    autoScrollTimer = setInterval(() => {
      if (!isHovered) scrollNext();
    }, 3500);
  }

  function stopAuto() {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }

  function restartTimer() {
    stopAuto();
    startAuto();
  }

  track.addEventListener("mouseenter", () => { isHovered = true; });
  track.addEventListener("mouseleave", () => { isHovered = false; });
  track.addEventListener("touchstart", () => { isHovered = true; }, { passive: true });
  track.addEventListener("touchend", () => { isHovered = false; restartTimer(); }, { passive: true });

  startAuto();

  // Re-render when admin saves review
  window.addEventListener("two247_reviews_updated", () => {
    loadAndRender();
  });
}
