/**
 * =========================================================================
 * TWO247 ADVANCE SEARCH & DYNAMIC PACKAGES SHOWCASE
 * Real-time Firestore synchronization, category filtering & interactive modal
 * =========================================================================
 */
import { getPackages, parsePriceNumber, formatIndianPrice } from "./data-service.js";

let livePackages = [];

function normalizePkg(p) {
  const priceNum = p.startingPriceNum || parsePriceNumber(p.startingPrice || p.priceFormatted || p.basePrice);
  const priceFmt = p.startingPrice || formatIndianPrice(priceNum);
  const slug = p.slug || p.id || "";
  const name = p.name || p.title || "Luxury Holiday Package";
  const dest = (p.destination || "").trim();

  return {
    id: slug,
    slug: slug,
    title: name,
    name: name,
    destination: dest.toLowerCase(),
    destinationDisplay: dest || "Global",
    category: (p.category || "").toLowerCase(),
    categoryType: (p.categoryType || "").toLowerCase(),
    type: (p.type || p.category || "luxury").toLowerCase(),
    duration: parseInt(p.duration) || 5,
    durationText: p.duration || p.durationText || "5 Days / 4 Nights",
    basePrice: priceNum,
    priceFormatted: priceFmt,
    startingPrice: priceFmt,
    rating: p.rating || "5.0",
    reviews: p.reviewCount || p.reviews || 42,
    image: p.image || "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    badge: p.badge || dest || "Curated",
    highlights: Array.isArray(p.highlights) && p.highlights.length > 0 ? p.highlights : ["Verified Luxury Stay", "Private Airport Transfers", "24/7 WhatsApp Concierge"],
    seasons: Array.isArray(p.seasons) ? p.seasons : ["all"],
    itinerary: p.itinerary || []
  };
}

export async function initAdvanceSearch() {
  const searchForm = document.getElementById("advance-search-form");
  const tabPills = document.querySelectorAll(".search-tab-pill");
  const destInput = document.getElementById("search-destination");
  const seasonSelect = document.getElementById("search-season");
  const styleSelect = document.getElementById("search-style");
  const budgetSelect = document.getElementById("search-budget");
  const submitBtn = document.getElementById("search-submit-btn");
  const quickFilters = document.querySelectorAll(".quick-filter-chip");
  const resultsCountBadge = document.getElementById("search-results-count");
  const packagesGrid = document.getElementById("interactive-packages-grid");

  let activeTab = "all";
  let activeQuickFilter = "all";

  // Load live packages from Firestore (or instant cache)
  const rawPackages = await getPackages();
  livePackages = rawPackages.map(normalizePkg);

  // Listen for admin package updates in real-time
  window.addEventListener("two247_packages_updated", async () => {
    const fresh = await getPackages();
    livePackages = fresh.map(normalizePkg);
    runFilter();
  });

  // 1. Tab Navigation (All, International, Domestic, Honeymoon, Luxury, Villas)
  tabPills.forEach(pill => {
    pill.addEventListener("click", () => {
      tabPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeTab = (pill.dataset.category || "all").toLowerCase();
      activeQuickFilter = "all";
      quickFilters.forEach(c => c.classList.remove("active"));
      runFilter();
    });
  });

  // Also support category triggers from elsewhere on the page
  document.querySelectorAll("[data-category-trigger]").forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      const cat = trigger.dataset.categoryTrigger.toLowerCase();
      tabPills.forEach(p => {
        if ((p.dataset.category || "").toLowerCase() === cat) {
          p.classList.add("active");
        } else {
          p.classList.remove("active");
        }
      });
      activeTab = cat;
      runFilter();
    });
  });

  // Global reset helper
  window.resetTwo247Filters = function() {
    activeTab = "all";
    activeQuickFilter = "all";
    tabPills.forEach(p => {
      if ((p.dataset.category || "").toLowerCase() === "all") p.classList.add("active");
      else p.classList.remove("active");
    });
    quickFilters.forEach(c => c.classList.remove("active"));
    if (destInput) destInput.value = "";
    if (seasonSelect) seasonSelect.value = "all";
    if (styleSelect) styleSelect.value = "all";
    if (budgetSelect) budgetSelect.value = "all";
    runFilter();
  };

  // 3. Search Inputs
  if (destInput) destInput.addEventListener("input", debounce(runFilter, 250));
  if (seasonSelect) seasonSelect.addEventListener("change", runFilter);
  if (styleSelect) styleSelect.addEventListener("change", runFilter);
  if (budgetSelect) budgetSelect.addEventListener("change", runFilter);

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runFilter();
      const packagesSection = document.getElementById("curated-packages");
      if (packagesSection) {
        packagesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // 4. Filtering Engine
  function runFilter() {
    const destVal = destInput ? destInput.value.trim().toLowerCase() : "";
    const seasonVal = seasonSelect ? seasonSelect.value : "all";
    const styleVal = styleSelect ? styleSelect.value : "all";
    const budgetVal = budgetSelect ? budgetSelect.value : "all";

    const filtered = livePackages.filter(pkg => {
      // Category Tab Filter
      if (activeTab !== "all") {
        if (activeTab === "international") {
          const match = pkg.category === "international" || pkg.categoryType === "international";
          if (!match) return false;
        } else if (activeTab === "domestic") {
          const match = pkg.category === "domestic" || pkg.categoryType === "domestic" || pkg.destination.includes("kashmir") || pkg.destination.includes("india");
          if (!match) return false;
        } else if (activeTab === "honeymoon") {
          const match = pkg.type === "honeymoon" || pkg.category === "honeymoon" || pkg.categoryType === "honeymoon" || pkg.title.toLowerCase().includes("honeymoon") || pkg.title.toLowerCase().includes("romance");
          if (!match) return false;
        } else if (activeTab === "luxury") {
          const match = pkg.type === "luxury" || pkg.category === "luxury" || pkg.categoryType === "luxury" || pkg.title.toLowerCase().includes("luxury") || pkg.title.toLowerCase().includes("elegance");
          if (!match) return false;
        } else if (activeTab === "villas" || activeTab === "villa") {
          const match = pkg.title.toLowerCase().includes("villa") || pkg.badge.toLowerCase().includes("villa") || pkg.category.includes("villa") || pkg.type.includes("villa");
          if (!match) return false;
        } else {
          const match = pkg.category === activeTab || pkg.categoryType === activeTab || pkg.type === activeTab;
          if (!match) return false;
        }
      }

      // Destination input match
      if (destVal && destVal !== "all") {
        const destMatch = pkg.destination.includes(destVal) || pkg.title.toLowerCase().includes(destVal);
        if (!destMatch) return false;
      }

      // Season match
      if (seasonVal !== "all") {
        if (!pkg.seasons.includes(seasonVal) && !pkg.seasons.includes("all")) return false;
      }

      // Style match
      if (styleVal !== "all") {
        if (pkg.type !== styleVal && pkg.category !== styleVal) return false;
      }

      // Budget match
      if (budgetVal !== "all") {
        if (budgetVal === "under50k" && pkg.basePrice > 50000) return false;
        if (budgetVal === "50k-100k" && (pkg.basePrice < 50000 || pkg.basePrice > 100000)) return false;
        if (budgetVal === "above100k" && pkg.basePrice <= 100000) return false;
      }

      return true;
    });

    // Update Counter
    if (resultsCountBadge) {
      resultsCountBadge.textContent = `${filtered.length} Packages Available`;
    }

    // Render in Grid
    if (packagesGrid) {
      renderPackagesGrid(filtered, packagesGrid);
    }
  }

  // Initial render
  runFilter();
}

/**
 * Render dynamic packages grid with high-contrast typography and single-source pricing
 */
function renderPackagesGrid(items, container) {
  if (!items.length) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div class="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">No Matching Packages Found</h3>
        <p class="text-slate-500 text-sm max-w-md mx-auto mb-6">We curate custom trips for every location worldwide. Let our 24/7 travel designers craft this exact itinerary for you, or reset your filters to explore all featured packages.</p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onclick="window.resetTwo247Filters && window.resetTwo247Filters()" class="btn-primary text-xs sm:text-sm !bg-slate-950 hover:!bg-black cursor-pointer">
            Reset All Filters (Show All Packages)
          </button>
          <button type="button" onclick="window.sendWhatsAppEnquiry('Hello TWO247, I am looking for a custom holiday package.')" class="btn-secondary text-xs sm:text-sm cursor-pointer">
            Plan Custom Itinerary with White Owl 24/7 Desk
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(pkg => `
    <article class="editorial-card group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 hover:border-black/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full" data-package-id="${pkg.id}">
      
      <!-- Top Image -->
      <div class="relative h-60 w-full overflow-hidden bg-slate-100">
        <img src="${pkg.image}" alt="${pkg.title}" class="card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        <span class="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-black tracking-wider uppercase shadow-sm">
          ${pkg.destinationDisplay}
        </span>
      </div>

      <!-- Content Area -->
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <!-- Meta Top: Destination + Rating -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#6F6F6F]">
              ${pkg.destinationDisplay.toUpperCase()} • 24/7 SUPPORT
            </span>
            <div class="flex items-center gap-1 text-xs font-semibold text-slate-900">
              <span class="text-amber-500">★</span>
              <span>${pkg.rating}</span>
              <span class="text-slate-400 font-normal text-[11px]">(${pkg.reviews})</span>
            </div>
          </div>

          <h3 class="text-lg font-bold text-slate-900 group-hover:text-neutral-700 transition-colors leading-snug mb-2">
            <a href="package/package-details.html?pkg=${pkg.slug || pkg.id}">${pkg.title}</a>
          </h3>

          <!-- Duration Line -->
          <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-4">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/>
            </svg>
            <span>${pkg.durationText}</span>
          </div>
          
          <ul class="space-y-1.5 mb-6 text-xs text-slate-600">
            ${pkg.highlights.slice(0, 3).map(h => `
              <li class="flex items-center gap-2">
                <span class="text-amber-500 font-bold">✓</span>
                <span class="truncate">${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Price & Action Footer -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="min-w-0 shrink-0">
            <span class="text-[10px] sm:text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">Starting from</span>
            <div class="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 leading-tight whitespace-nowrap">
              ${pkg.priceFormatted}
              <span class="text-[10px] sm:text-[11px] font-normal text-slate-500 whitespace-nowrap">/ person</span>
            </div>
          </div>
          
          <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button onclick="window.openPackageModal('${pkg.id}')" class="whitespace-nowrap shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer" aria-label="View Itinerary for ${pkg.title}">
              Quick View
            </button>
            <a href="package/package-details.html?pkg=${pkg.slug || pkg.id}" class="whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full bg-black hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95" aria-label="View details for ${pkg.title}">
              <span>Details</span>
              <span class="text-xs">→</span>
            </a>
          </div>
        </div>

      </div>

    </article>
  `).join('');

  if (window.triggerCardAppear) {
    window.triggerCardAppear(container);
  }
}

/**
 * Interactive Modal Window for Package Quick View & Dynamic Guest Calculator
 */
window.openPackageModal = function(packageId) {
  const pkg = livePackages.find(p => p.id === packageId || p.slug === packageId);
  if (!pkg) return;

  let guests = 2;

  let modal = document.getElementById("package-quick-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "package-quick-modal";
    modal.className = "fixed inset-0 z-[9990] flex items-center justify-center p-4 modal-backdrop-blur opacity-0 pointer-events-none transition-opacity duration-300";
    document.body.appendChild(modal);
  }

  function updateModalContent() {
    const totalPrice = (pkg.basePrice * guests).toLocaleString("en-IN");

    modal.innerHTML = `
      <div class="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        
        <!-- Close Button -->
        <button onclick="window.closePackageModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer" aria-label="Close modal">
          ✕
        </button>

        <!-- Header -->
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">
          <span>${pkg.destinationDisplay.toUpperCase()}</span>
          <span>•</span>
          <span>${pkg.durationText}</span>
        </div>
        <h2 class="text-2xl font-black text-slate-900 leading-tight mb-4">${pkg.title}</h2>

        <div class="relative h-48 w-full rounded-2xl overflow-hidden mb-6 bg-slate-100">
          <img src="${pkg.image}" alt="${pkg.title}" class="w-full h-full object-cover">
          <div class="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400">
            ★ ${pkg.rating} Handcrafted Rating
          </div>
        </div>

        <!-- Inclusions & Highlights -->
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Included Experience:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-xs text-slate-700">
          ${pkg.highlights.map(h => `
            <div class="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span class="text-amber-500 font-bold">✓</span>
              <span>${h}</span>
            </div>
          `).join('')}
        </div>

        <!-- Dynamic Guest Price Calculator -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span class="text-xs text-slate-500 block mb-1 font-semibold">Travelers:</span>
            <div class="flex items-center gap-3">
              <button id="calc-minus" class="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer">-</button>
              <span id="calc-guest-count" class="text-sm font-bold text-slate-900">${guests} Adults</span>
              <button id="calc-plus" class="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer">+</button>
            </div>
          </div>

          <div class="text-right">
            <span class="text-xs text-slate-400 block font-medium">Estimated Total Price:</span>
            <span id="calc-total-price" class="text-2xl font-black text-slate-900">₹${totalPrice}</span>
            <span class="text-[10px] text-slate-400 block">Single source pricing • Inclusive of taxes</span>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <button id="calc-whatsapp-btn" class="btn-primary w-full text-center text-sm py-3 flex items-center justify-center gap-2 cursor-pointer">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.04-1.93-.478-1.579-.661-2.593-2.28-2.671-2.385-.078-.105-.636-.849-.636-1.621 0-.772.4-1.15.542-1.306.144-.156.312-.195.416-.195.105 0 .21.002.302.007.098.005.228-.037.357.272.132.316.452 1.104.492 1.185.04.082.066.177.013.283-.053.106-.079.172-.157.264-.078.093-.165.207-.235.278-.078.079-.16.165-.069.322.091.156.406.669.871 1.084.598.534 1.103.7 1.26.778.156.079.247.069.34-.04.093-.108.398-.464.505-.623.106-.159.213-.133.357-.079.144.053.916.432 1.073.511.157.079.262.119.301.185.04.066.04.382-.104.787z"/>
            </svg>
            Book via WhatsApp Concierge
          </button>
          <a href="package/package-details.html?pkg=${pkg.slug || pkg.id}" class="btn-outline-dark w-full text-center text-sm py-3">
            Full Itinerary & Details →
          </a>
        </div>

      </div>
    `;

    document.getElementById("calc-minus")?.addEventListener("click", () => {
      if (guests > 1) {
        guests--;
        updateModalContent();
      }
    });

    document.getElementById("calc-plus")?.addEventListener("click", () => {
      if (guests < 20) {
        guests++;
        updateModalContent();
      }
    });

    document.getElementById("calc-whatsapp-btn")?.addEventListener("click", () => {
      const msg = `Hello TWO247, I want to book "${pkg.title}" (${pkg.durationText}) for ${guests} travelers (Est. Total: ₹${(pkg.basePrice * guests).toLocaleString("en-IN")}). Please confirm availability.`;
      if (typeof window.sendWhatsAppEnquiry === "function") {
        window.sendWhatsAppEnquiry(msg);
      } else {
        window.open(`https://wa.me/919499907081?text=${encodeURIComponent(msg)}`, "_blank");
      }
    });
  }

  updateModalContent();

  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.firstElementChild?.classList.remove("scale-95");
  modal.firstElementChild?.classList.add("scale-100");
  document.body.classList.add("overflow-hidden");

  modal.onclick = window.closePackageModal;
};

window.closePackageModal = function() {
  const modal = document.getElementById("package-quick-modal");
  if (!modal) return;
  modal.classList.add("opacity-0", "pointer-events-none");
  modal.firstElementChild?.classList.remove("scale-100");
  modal.firstElementChild?.classList.add("scale-95");
  document.body.classList.remove("overflow-hidden");
};

window.bookPackageInstant = function(packageId) {
  const pkg = livePackages.find(p => p.id === packageId || p.slug === packageId);
  if (!pkg) return;
  const msg = `Hello TWO247, I would like to book the "${pkg.title}" package (${pkg.durationText}, Starting at ${pkg.priceFormatted}). Please connect me with a holiday specialist.`;
  if (typeof window.sendWhatsAppEnquiry === "function") {
    window.sendWhatsAppEnquiry(msg);
  } else {
    window.open(`https://wa.me/919499907081?text=${encodeURIComponent(msg)}`, "_blank");
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.closePackageModal();
  }
});

function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdvanceSearch);
  } else {
    initAdvanceSearch();
  }
}
