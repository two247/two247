/**
 * =========================================================================
 * TWO247 ADVANCE SEARCH & INTERACTIVE TRAVEL CONCIERGE SYSTEM
 * Real-time dynamic filtering, guest pricing calculator & modal booking
 * =========================================================================
 */

// Package Catalog Database for Instant Dynamic Results & Modal
export const PACKAGES_DATA = [
  {
    id: "maldives-honeymoon",
    title: "Maldives Overwater Luxury Romance",
    destination: "maldives",
    category: "international",
    type: "honeymoon",
    duration: 5,
    durationText: "5 Days / 4 Nights",
    basePrice: 84999,
    priceFormatted: "₹84,999",
    rating: "5.0",
    reviews: 48,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    badge: "Overwater Villa",
    highlights: ["Private Water Villa with Sun Deck", "Scenic Speedboat Transfers", "All-Inclusive Dining & Sunset Cruise", "Dedicated 24/7 White Owl Concierge"],
    seasons: ["all", "winter", "festive", "spring"]
  },
  {
    id: "dubai-luxury-escape",
    title: "Dubai Glamour & Desert Safari",
    destination: "dubai",
    category: "international",
    type: "luxury",
    duration: 6,
    durationText: "6 Days / 5 Nights",
    basePrice: 48999,
    priceFormatted: "₹48,999",
    rating: "4.9",
    reviews: 62,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    highlights: ["Burj Khalifa Level 124 VIP Access", "Premium 4x4 Red Dune Safari & BBQ", "Marina Luxury Dinner Cruise", "5-Star Downtown Accommodation"],
    seasons: ["all", "winter", "spring"]
  },
  {
    id: "swiss-alps-grand-tour",
    title: "Swiss Alpine Magic & Scenic Trains",
    destination: "switzerland",
    category: "international",
    type: "luxury",
    duration: 8,
    durationText: "8 Days / 7 Nights",
    basePrice: 158000,
    priceFormatted: "₹1,58,000",
    rating: "5.0",
    reviews: 34,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    badge: "Scenic Alps",
    highlights: ["Swiss First Class Travel Pass", "Jungfraujoch Top of Europe Excursion", "Lake Geneva Private Boat Cruise", "Interlaken & Lucerne Boutique Hotels"],
    seasons: ["all", "winter", "summer"]
  },
  {
    id: "bali-tropical-paradise",
    title: "Bali Tropical Bliss & Ubud Sanctuary",
    destination: "bali",
    category: "international",
    type: "honeymoon",
    duration: 7,
    durationText: "7 Days / 6 Nights",
    basePrice: 36999,
    priceFormatted: "₹36,999",
    rating: "4.9",
    reviews: 55,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    badge: "Private Pool Villa",
    highlights: ["Private Pool Villa in Seminyak", "Ubud Sacred Jungle & Waterfall Tour", "Nusa Penida Island Day Excursion", "Traditional Balinese Spa Treatments"],
    seasons: ["all", "summer", "spring", "festive"]
  },
  {
    id: "kashmir-paradise-on-earth",
    title: "Kashmir Heavenly Valleys & Houseboats",
    destination: "kashmir",
    category: "domestic",
    type: "family",
    duration: 6,
    durationText: "6 Days / 5 Nights",
    basePrice: 28999,
    priceFormatted: "₹28,999",
    rating: "4.9",
    reviews: 73,
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80",
    badge: "Domestic Jewel",
    highlights: ["Dal Lake Luxury Houseboat Stay", "Gulmarg Gondola Phase 1 & 2 Tickets", "Pahalgam Betaab Valley Sightseeing", "Private Chauffeur Throughout"],
    seasons: ["all", "winter", "spring", "summer"]
  },
  {
    id: "paris-rome-classical",
    title: "Paris & Rome Classical Romance",
    destination: "paris",
    category: "international",
    type: "honeymoon",
    duration: 8,
    durationText: "8 Days / 7 Nights",
    basePrice: 142000,
    priceFormatted: "₹1,42,000",
    rating: "4.8",
    reviews: 29,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    badge: "European Romance",
    highlights: ["Skip-the-line Eiffel Tower & Seine Cruise", "Colosseum & Vatican Guided Tours", "High-speed Eurostar & Trenitalia Train", "Charming Boutique Stays with Breakfast"],
    seasons: ["all", "spring", "summer", "festive"]
  },
  {
    id: "kerala-backwaters-munnar",
    title: "Kerala Backwaters & Munnar Hills",
    destination: "kerala",
    category: "domestic",
    type: "family",
    duration: 5,
    durationText: "5 Days / 4 Nights",
    basePrice: 22999,
    priceFormatted: "₹22,999",
    rating: "4.8",
    reviews: 81,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    badge: "Ayurvedic Haven",
    highlights: ["Private Deluxe Houseboat in Alleppey", "Munnar Tea Gardens & Eravikulam Park", "Kathakali Performance & Spice Plantation", "All Meals Included on Houseboat"],
    seasons: ["all", "winter", "festive"]
  },
  {
    id: "andaman-island-escape",
    title: "Andaman Pristine Islands & Havelock Scuba",
    destination: "andaman",
    category: "domestic",
    type: "honeymoon",
    duration: 6,
    durationText: "6 Days / 5 Nights",
    basePrice: 34999,
    priceFormatted: "₹34,999",
    rating: "4.9",
    reviews: 42,
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
    badge: "Beach Sanctuary",
    highlights: ["Radhanagar Beach Sunset Experience", "Havelock Catamaran Cruise Transfers", "Snorkeling / Coral Reef Adventure", "Beachside Candlelight Dinner"],
    seasons: ["all", "winter", "spring"]
  }
];

export function initAdvanceSearch() {
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

  // 1. Tab Navigation
  tabPills.forEach(pill => {
    pill.addEventListener("click", () => {
      tabPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeTab = pill.dataset.category || "all";
      runFilter();
    });
  });

  // 2. Quick Filter Chips
  quickFilters.forEach(chip => {
    chip.addEventListener("click", () => {
      quickFilters.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeQuickFilter = chip.dataset.filter || "all";
      runFilter();
    });
  });

  // 3. Inputs Change Listener
  [destInput, seasonSelect, styleSelect, budgetSelect].forEach(input => {
    if (input) {
      input.addEventListener("change", runFilter);
      if (input.tagName === "INPUT") {
        input.addEventListener("input", debounce(runFilter, 250));
      }
    }
  });

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runFilter();
      // Smooth scroll to packages showcase
      const packagesSection = document.getElementById("curated-packages") || document.getElementById("packages-section");
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

    const filtered = PACKAGES_DATA.filter(pkg => {
      // Category Tab
      if (activeTab !== "all") {
        if (activeTab === "international" && pkg.category !== "international") return false;
        if (activeTab === "domestic" && pkg.category !== "domestic") return false;
        if (activeTab === "honeymoon" && pkg.type !== "honeymoon") return false;
        if (activeTab === "luxury" && pkg.type !== "luxury") return false;
      }

      // Quick Filter
      if (activeQuickFilter !== "all") {
        if (activeQuickFilter === "honeymoon" && pkg.type !== "honeymoon") return false;
        if (activeQuickFilter === "luxury" && pkg.type !== "luxury") return false;
        if (activeQuickFilter === "under50k" && pkg.basePrice > 50000) return false;
        if (activeQuickFilter === "maldives" && pkg.destination !== "maldives") return false;
        if (activeQuickFilter === "switzerland" && pkg.destination !== "switzerland") return false;
        if (activeQuickFilter === "dubai" && pkg.destination !== "dubai") return false;
        if (activeQuickFilter === "bali" && pkg.destination !== "bali") return false;
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
        if (pkg.type !== styleVal) return false;
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
 * Render dynamic packages grid with pure white cards, high-contrast typography and interactive action buttons
 */
function renderPackagesGrid(items, container) {
  if (!items.length) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div class="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center text-brand-orange">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">No Matching Packages Found</h3>
        <p class="text-slate-500 text-sm max-w-md mx-auto mb-6">We curate custom trips for every location worldwide. Let our 24/7 travel designers craft this exact itinerary for you.</p>
        <button onclick="window.sendWhatsAppEnquiry('Hello TWO247, I am looking for a custom holiday package.')" class="btn-primary text-sm">
          Plan Custom Itinerary with White Owl 24/7 Desk
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(pkg => `
    <article class="editorial-card group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 hover:border-amber-400/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between" data-package-id="${pkg.id}">
      
      <!-- Top Image & Badges -->
      <div class="relative h-60 w-full overflow-hidden bg-slate-100">
        <img src="${pkg.image}" alt="${pkg.title}" class="card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
        
        <!-- Category Badge -->
        <span class="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-900 tracking-wider uppercase shadow-sm">
          ${pkg.badge}
        </span>

        <!-- Rating Badge -->
        <div class="absolute top-4 right-4 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-[11px] font-bold text-amber-400 flex items-center gap-1 shadow-sm">
          <span>★</span>
          <span>${pkg.rating}</span>
          <span class="text-slate-300 font-normal">(${pkg.reviews})</span>
        </div>

        <!-- Duration Pin -->
        <div class="absolute bottom-3 left-4 text-xs font-semibold text-white flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2"/>
          </svg>
          <span>${pkg.durationText}</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-brand-orange block mb-1">
            ${pkg.destination.toUpperCase()} • 24/7 SUPPORT
          </span>
          <h3 class="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug mb-3">
            ${pkg.title}
          </h3>
          
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
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span class="text-[11px] text-slate-400 block font-medium">Starting from</span>
            <div class="text-xl font-extrabold text-slate-900">
              ${pkg.priceFormatted}
              <span class="text-[11px] font-normal text-slate-500">/ person</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button onclick="window.openPackageModal('${pkg.id}')" class="px-3.5 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer" aria-label="View Itinerary for ${pkg.title}">
              Quick View
            </button>
            <button onclick="window.bookPackageInstant('${pkg.id}')" class="btn-primary text-xs py-2 px-4 shadow-sm" aria-label="Book ${pkg.title}">
              Book Now
            </button>
          </div>
        </div>

      </div>

    </article>
  `).join('');
}

/**
 * Interactive Modal Window for Package Quick View & Dynamic Guest Calculator
 */
window.openPackageModal = function(packageId) {
  const pkg = PACKAGES_DATA.find(p => p.id === packageId);
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
        <button onclick="window.closePackageModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors" aria-label="Close modal">
          ✕
        </button>

        <!-- Header -->
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">
          <span>${pkg.destination.toUpperCase()}</span>
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
              <button id="calc-minus" class="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center">-</button>
              <span id="calc-guest-count" class="text-sm font-bold text-slate-900">${guests} Adults</span>
              <button id="calc-plus" class="w-7 h-7 rounded-full bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center">+</button>
            </div>
          </div>

          <div class="text-right">
            <span class="text-xs text-slate-400 block font-medium">Estimated Total Price:</span>
            <span id="calc-total-price" class="text-2xl font-black text-slate-900">₹${totalPrice}</span>
            <span class="text-[10px] text-slate-400 block">Inclusive of taxes & 24/7 care</span>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <button id="calc-whatsapp-btn" class="btn-primary w-full text-center text-sm py-3 flex items-center justify-center gap-2">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.04-1.93-.478-1.579-.661-2.593-2.28-2.671-2.385-.078-.105-.636-.849-.636-1.621 0-.772.4-1.15.542-1.306.144-.156.312-.195.416-.195.105 0 .21.002.302.007.098.005.228-.037.357.272.132.316.452 1.104.492 1.185.04.082.066.177.013.283-.053.106-.079.172-.157.264-.078.093-.165.207-.235.278-.078.079-.16.165-.069.322.091.156.406.669.871 1.084.598.534 1.103.7 1.26.778.156.079.247.069.34-.04.093-.108.398-.464.505-.623.106-.159.213-.133.357-.079.144.053.916.432 1.073.511.157.079.262.119.301.185.04.066.04.382-.104.787z"/>
            </svg>
            Book via 24/7 WhatsApp Concierge
          </button>
          <a href="custom-trip.html?package=${pkg.id}&guests=${guests}" class="btn-outline-dark w-full text-center text-sm py-3">
            Customize This Itinerary
          </a>
        </div>

      </div>
    `;

    // Re-bind calculator events
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
      window.sendWhatsAppEnquiry(msg);
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
  const pkg = PACKAGES_DATA.find(p => p.id === packageId);
  if (!pkg) return;
  const msg = `Hello TWO247, I would like to book the "${pkg.title}" package (${pkg.durationText}, Starting at ${pkg.priceFormatted}). Please connect me with a holiday specialist.`;
  window.sendWhatsAppEnquiry(msg);
};

// Escape key to close modal
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

// Auto-run if element exists
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdvanceSearch);
  } else {
    initAdvanceSearch();
  }
}
