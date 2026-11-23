/**
 * =========================================================================
 * TWO247 — Unified Cloud Firestore & Local Sync Data Service
 * Single Source of Truth for Packages, Destinations, Reviews, Leads, & Gallery
 * =========================================================================
 */
import { db } from "./firebase-config.js";
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  addDoc,
  deleteDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { packages as defaultPackages } from "../data/packages.js";
import { destinations as defaultDestinations } from "../data/destinations.js";

// Safe local storage caching helpers with Stale-While-Revalidate pattern
export function getLocalCache(key, fallback = []) {
  try {
    const raw = localStorage.getItem(`two247_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocalCache(key, data) {
  try {
    localStorage.setItem(`two247_${key}`, JSON.stringify(data));
  } catch (err) {
    console.warn(`Local storage cache warning (${key}):`, err);
  }
}

// Currency number parser & Indian formatter
export function parsePriceNumber(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

export function formatIndianPrice(num) {
  const n = parseInt(num, 10);
  if (isNaN(n) || n <= 0) return "₹48,000";
  return "₹" + n.toLocaleString("en-IN");
}

// =============================================================================
// 1. HOLIDAY PACKAGES (Real Firestore + Instant Cache)
// =============================================================================

export async function getPackages() {
  const cached = getLocalCache("packages", null);
  
  // Non-blocking background fetch & sync
  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, "packages"));
      if (!snap.empty) {
        const items = snap.docs.map(d => {
          const data = d.data();
          const pNum = data.startingPriceNum || parsePriceNumber(data.startingPrice || data.priceFormatted || data.basePrice || data.price) || 48000;
          let pFmt = data.startingPrice;
          if (!pFmt || typeof pFmt !== "string" || pFmt.trim() === "" || pFmt === "undefined" || pFmt === "null") {
            pFmt = formatIndianPrice(pNum);
          } else if (!pFmt.startsWith("₹") && !isNaN(parseInt(pFmt, 10))) {
            pFmt = formatIndianPrice(pFmt);
          }
          return {
            id: d.id,
            ...data,
            startingPrice: pFmt,
            startingPriceNum: pNum,
            basePrice: pNum,
            priceFormatted: pFmt
          };
        });
        setLocalCache("packages", items);
        return items;
      }
    } catch (err) {
      console.info("Firestore packages read:", err.message);
    }
    return null;
  })();

  if (cached && cached.length > 0) {
    // Revalidate in background
    fetchPromise.catch(() => {});
    return cached;
  }

  const live = await fetchPromise;
  if (live && live.length > 0) return live;

  // Fallback to official dataset if database is brand new
  setLocalCache("packages", defaultPackages);
  return defaultPackages;
}

export async function getPackageBySlug(slug) {
  if (!slug) return null;
  const all = await getPackages();
  const lower = slug.toLowerCase();
  return all.find(p => (p.slug && p.slug.toLowerCase() === lower) || (p.id && p.id.toLowerCase() === lower)) || null;
}

/**
 * Safe Package Save (Preserves ALL existing fields and arrays)
 */
export async function savePackage(data, id = null) {
  const pkgId = id || data.slug || `pkg-${Date.now()}`;
  
  // 1. Fetch existing document from Firestore or local cache to ensure NO field is lost
  let existing = {};
  try {
    const docRef = doc(db, "packages", pkgId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      existing = snap.data();
    }
  } catch (err) {
    console.warn("Could not fetch remote package for merge:", err.message);
  }

  if (Object.keys(existing).length === 0) {
    const localList = getLocalCache("packages", defaultPackages);
    const found = localList.find(p => p.id === pkgId || p.slug === data.slug);
    if (found) existing = { ...found };
  }

  // 2. Synchronize pricing representation (Single Source of Truth)
  const priceNum = data.startingPriceNum || parsePriceNumber(data.startingPrice || existing.startingPrice);
  const priceFormatted = data.startingPrice || formatIndianPrice(priceNum) || existing.startingPrice || "₹0";

  // 3. Build merged payload preserving all metadata and arrays
  const merged = {
    ...existing,
    ...data,
    id: pkgId,
    startingPrice: priceFormatted,
    startingPriceNum: priceNum,
    basePrice: priceNum,
    priceFormatted: priceFormatted,
    updatedAt: new Date().toISOString()
  };

  // Ensure arrays are preserved if not provided in form
  if (!data.itinerary || !Array.isArray(data.itinerary) || data.itinerary.length === 0) {
    if (existing.itinerary && existing.itinerary.length > 0) merged.itinerary = existing.itinerary;
  }
  if (!data.inclusions || !Array.isArray(data.inclusions) || data.inclusions.length === 0) {
    if (existing.inclusions && existing.inclusions.length > 0) merged.inclusions = existing.inclusions;
  }
  if (!data.exclusions || !Array.isArray(data.exclusions) || data.exclusions.length === 0) {
    if (existing.exclusions && existing.exclusions.length > 0) merged.exclusions = existing.exclusions;
  }
  if (!data.highlights || !Array.isArray(data.highlights) || data.highlights.length === 0) {
    if (existing.highlights && existing.highlights.length > 0) merged.highlights = existing.highlights;
  }
  if (!data.gallery || !Array.isArray(data.gallery) || data.gallery.length === 0) {
    if (existing.gallery && existing.gallery.length > 0) merged.gallery = existing.gallery;
  }

  // 4. Write to Firestore using merge: true
  try {
    await setDoc(doc(db, "packages", pkgId), {
      ...merged,
      serverTime: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore package write error:", err.message);
  }

  // 5. Update local cache
  const list = getLocalCache("packages", defaultPackages);
  const idx = list.findIndex(p => p.id === pkgId || p.slug === merged.slug);
  if (idx >= 0) list[idx] = merged;
  else list.unshift(merged);
  setLocalCache("packages", list);

  // Notify any active views
  try {
    window.dispatchEvent(new CustomEvent("two247_packages_updated", { detail: merged }));
  } catch (_) {}

  return merged;
}

export async function deletePackage(id) {
  try {
    await deleteDoc(doc(db, "packages", id));
  } catch (err) {
    console.warn("Firestore package delete error:", err.message);
  }
  const list = getLocalCache("packages", defaultPackages).filter(p => p.id !== id && p.slug !== id);
  setLocalCache("packages", list);
  return true;
}

// =============================================================================
// 2. DESTINATIONS CRUD (Real Firestore + Single Source Base Price)
// =============================================================================

export async function getDestinations() {
  const cached = getLocalCache("destinations", null);

  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, "destinations"));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLocalCache("destinations", items);
        return items;
      }
    } catch (err) {
      console.info("Firestore destinations read:", err.message);
    }
    return null;
  })();

  if (cached && cached.length > 0) {
    fetchPromise.catch(() => {});
    return cached;
  }

  const live = await fetchPromise;
  if (live && live.length > 0) return live;

  setLocalCache("destinations", defaultDestinations);
  return defaultDestinations;
}

export async function getDestinationBySlug(slug) {
  if (!slug) return null;
  const all = await getDestinations();
  const lower = slug.toLowerCase();
  return all.find(d => (d.slug && d.slug.toLowerCase() === lower) || (d.id && d.id.toLowerCase() === lower)) || null;
}

export async function saveDestination(data, id = null) {
  const destId = id || data.slug || `dest-${Date.now()}`;
  
  let existing = {};
  try {
    const docRef = doc(db, "destinations", destId);
    const snap = await getDoc(docRef);
    if (snap.exists()) existing = snap.data();
  } catch (err) {
    console.warn("Could not fetch remote destination for merge:", err.message);
  }

  const merged = {
    ...existing,
    ...data,
    id: destId,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "destinations", destId), {
      ...merged,
      serverTime: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore destination write error:", err.message);
  }

  const list = getLocalCache("destinations", defaultDestinations);
  const idx = list.findIndex(d => d.id === destId || d.slug === merged.slug);
  if (idx >= 0) list[idx] = merged;
  else list.unshift(merged);
  setLocalCache("destinations", list);

  return merged;
}

export async function deleteDestination(id) {
  try {
    await deleteDoc(doc(db, "destinations", id));
  } catch (err) {
    console.warn("Firestore destination delete error:", err.message);
  }
  const list = getLocalCache("destinations", defaultDestinations).filter(d => d.id !== id && d.slug !== id);
  setLocalCache("destinations", list);
  return true;
}

// =============================================================================
// 3. REVIEWS & FEEDBACK (Real Firestore — Admin Moderated & Frontend Carousel)
// =============================================================================

export const DEFAULT_REVIEWS = [
  {
    id: "rev-default-1",
    clientName: "Ananya & Karan",
    name: "Ananya & Karan",
    rating: 5,
    destination: "Dubai",
    destinationVisited: "Dubai Luxury Tour",
    reviewText: "Our flight arrived in Dubai late at night, and the 24/7 WhatsApp concierge coordinated with our private van driver seamlessly. The desert safari and Burj Khalifa tickets were flawless.",
    status: "published",
    avatarUrl: "",
    clientLocation: "Mumbai",
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev-default-2",
    clientName: "Rahul & Sneha",
    name: "Rahul & Sneha",
    rating: 5,
    destination: "Maldives",
    destinationVisited: "Maldives Overwater Honeymoon",
    reviewText: "Everything in our Maldives honeymoon was arranged to absolute perfection. Speedboat meet-and-greet, complimentary candlelight dinner, and overwater villa upgrade. Outstanding service!",
    status: "published",
    avatarUrl: "",
    clientLocation: "Bangalore",
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev-default-3",
    clientName: "Vikram Malhotra & Family",
    name: "Vikram Malhotra & Family",
    rating: 5,
    destination: "Singapore",
    destinationVisited: "Singapore Family Discovery",
    reviewText: "Our family vacation to Singapore was so smoothly paced. Sentosa cable cars, Universal Studios pass, and child-friendly hotel suites. Truly appreciated having a 24/7 point of contact.",
    status: "published",
    avatarUrl: "",
    clientLocation: "Delhi",
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rev-default-4",
    clientName: "Dr. Arvind & Priya Swaminathan",
    name: "Dr. Arvind & Priya Swaminathan",
    rating: 5,
    destination: "Switzerland",
    destinationVisited: "Swiss Alpine Grand Tour",
    reviewText: "First class Swiss train passes, boutique mountain chalets in Grindelwald, and flawless concierge assistance when our train was delayed. TWO247 is unmatched.",
    status: "published",
    avatarUrl: "",
    clientLocation: "Chennai",
    verified: true,
    createdAt: new Date().toISOString()
  }
];

export async function getReviews(publishedOnly = false) {
  const cached = getLocalCache("reviews", null);

  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, "reviews"));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLocalCache("reviews", items);
        return items;
      }
    } catch (err) {
      console.info("Firestore reviews read:", err.message);
    }
    return null;
  })();

  let list = cached;
  if (!list || list.length === 0) {
    const live = await fetchPromise;
    list = live && live.length > 0 ? live : DEFAULT_REVIEWS;
    if (!cached) setLocalCache("reviews", list);
  } else {
    fetchPromise.catch(() => {});
  }

  if (publishedOnly) {
    const filtered = list.filter(r => (r.status || "published").toLowerCase() === "published");
    return filtered.length > 0 ? filtered : DEFAULT_REVIEWS;
  }
  return list;
}

export async function saveReview(data, id = null) {
  const revId = id || `rev-${Date.now()}`;
  
  let existing = {};
  try {
    const docRef = doc(db, "reviews", revId);
    const snap = await getDoc(docRef);
    if (snap.exists()) existing = snap.data();
  } catch (_) {}

  const merged = {
    ...existing,
    ...data,
    id: revId,
    clientName: data.clientName || data.name || "Valued Voyager",
    name: data.clientName || data.name || "Valued Voyager",
    rating: Number(data.rating) || 5,
    status: data.status || "published",
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "reviews", revId), {
      ...merged,
      serverTime: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore review write error:", err.message);
  }

  const list = getLocalCache("reviews", DEFAULT_REVIEWS);
  const idx = list.findIndex(r => r.id === revId);
  if (idx >= 0) list[idx] = merged;
  else list.unshift(merged);
  setLocalCache("reviews", list);

  return merged;
}

export async function deleteReview(id) {
  try {
    await deleteDoc(doc(db, "reviews", id));
  } catch (err) {
    console.warn("Firestore review delete error:", err.message);
  }
  const list = getLocalCache("reviews", DEFAULT_REVIEWS).filter(r => r.id !== id);
  setLocalCache("reviews", list);
  return true;
}

// =============================================================================
// 4. CUSTOMER LEADS & ENQUIRY SUBMISSIONS (Firestore /inquiries)
// =============================================================================

export async function submitInquiry(leadData) {
  const payload = {
    name: leadData.name || leadData.guestName || "Guest",
    guestName: leadData.name || leadData.guestName || "Guest",
    phone: String(leadData.phone || "").trim(),
    email: String(leadData.email || "").trim(),
    destination: leadData.destination || "Bespoke Request",
    travelMonth: leadData.travelDate || leadData.travelMonth || "Flexible",
    guests: leadData.guests || leadData.travellers || (leadData.adults ? `${leadData.adults} Adults${leadData.children ? ', ' + leadData.children + ' Kids' : ''}` : "2 Adults"),
    travelers: leadData.guests || leadData.travellers || "2 Adults",
    budget: leadData.budget || "Flexible",
    tripType: leadData.tripType || "Luxury",
    message: leadData.message || leadData.requirements || leadData.notes || "",
    notes: leadData.message || leadData.requirements || leadData.notes || "",
    status: "new",
    source: leadData.source || window.location.pathname || "website-enquiry",
    createdAt: new Date().toISOString()
  };

  // 1. Write to Cloud Firestore collection /inquiries
  let docId = `inq-${Date.now()}`;
  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      ...payload,
      serverTime: serverTimestamp()
    });
    docId = docRef.id;
    payload.id = docId;
  } catch (err) {
    console.warn("Firestore inquiry write error (saving to local cache fallback):", err.message);
    payload.id = docId;
  }

  // 2. Cache in local storage for instant Admin visibility
  const list = getLocalCache("inquiries", []);
  list.unshift(payload);
  setLocalCache("inquiries", list);

  return payload;
}

export async function getInquiries() {
  try {
    // Try query with order first
    let snap;
    try {
      snap = await getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc")));
    } catch {
      snap = await getDocs(collection(db, "inquiries"));
    }

    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort in memory by createdAt descending
      items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setLocalCache("inquiries", items);
      return items;
    }
  } catch (err) {
    console.info("Firestore inquiries read:", err.message);
  }
  return getLocalCache("inquiries", []);
}

export async function updateInquiryStatus(id, newStatus) {
  try {
    await setDoc(doc(db, "inquiries", id), {
      status: newStatus,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore inquiry status update error:", err.message);
  }

  const list = getLocalCache("inquiries", []);
  const item = list.find(x => x.id === id);
  if (item) {
    item.status = newStatus;
    setLocalCache("inquiries", list);
  }
  return true;
}

export async function deleteInquiry(id) {
  try {
    await deleteDoc(doc(db, "inquiries", id));
  } catch (err) {
    console.warn("Firestore inquiry delete error:", err.message);
  }
  const list = getLocalCache("inquiries", []).filter(x => x.id !== id);
  setLocalCache("inquiries", list);
  return true;
}

// =============================================================================
// 5. GALLERY CRUD (Real Firestore /gallery + Dynamic Lightbox)
// =============================================================================

export const DEFAULT_GALLERY = [
  {
    id: "gal-maldives",
    title: "Maldives Overwater Sanctuary",
    category: "islands",
    tag: "MALDIVES",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85",
    desc: "Private ocean villa with direct lagoon access, glass flooring, and infinity pool overlooking coral atolls.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-cappadocia",
    title: "Cappadocia Sunrise Balloons",
    category: "heritage",
    tag: "TURKEY",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    desc: "Dozens of vibrant hot-air balloons ascending over fairy chimneys and ancient valleys of Goreme at dawn.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-dubai",
    title: "Lahbab Red Dune Sunset",
    category: "skylines",
    tag: "DUBAI",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    desc: "Private luxury 4x4 desert safari camp nestled in deep crimson sands under starry Arabian skies.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-swiss",
    title: "Swiss Alpine Jungfrau Ridge",
    category: "alpine",
    tag: "SWITZERLAND",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    desc: "Snowcapped Eiger and Jungfrau summits framing green mountain meadows and historic cogwheel trains.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-amsterdam",
    title: "Keizersgracht Historic Bridges",
    category: "heritage",
    tag: "NETHERLANDS",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=85",
    desc: "Twilight salon boat cruise through Amsterdam's Golden Age canal rings and illuminated arched bridges.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-singapore",
    title: "Gardens by the Bay Supertrees",
    category: "skylines",
    tag: "SINGAPORE",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    desc: "Futuristic illuminated grove and OCBC Skyway connecting botanical marvels under the Marina Bay skyline.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-bali",
    title: "Ubud Sacred Rice Terraces",
    category: "islands",
    tag: "BALI",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    desc: "Early morning mist clearing over emerald stepped hillsides and traditional Balinese subak water temples.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-krakow",
    title: "Wawel Royal Cathedral",
    category: "heritage",
    tag: "POLAND",
    image: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=85",
    desc: "Gothic and Renaissance coronation castle overlooking the Vistula River in the heart of historic Krakow.",
    createdAt: new Date().toISOString()
  }
];

export async function getGalleryItems() {
  const cached = getLocalCache("gallery", null);

  const fetchPromise = (async () => {
    try {
      const snap = await getDocs(collection(db, "gallery"));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setLocalCache("gallery", items);
        return items;
      }
    } catch (err) {
      console.info("Firestore gallery read:", err.message);
    }
    return null;
  })();

  if (cached && cached.length > 0) {
    fetchPromise.catch(() => {});
    return cached;
  }

  const live = await fetchPromise;
  if (live && live.length > 0) return live;

  setLocalCache("gallery", DEFAULT_GALLERY);
  return DEFAULT_GALLERY;
}

export async function saveGalleryItem(data, id = null) {
  const galId = id || `gal-${Date.now()}`;
  
  let existing = {};
  try {
    const docRef = doc(db, "gallery", galId);
    const snap = await getDoc(docRef);
    if (snap.exists()) existing = snap.data();
  } catch (_) {}

  const merged = {
    ...existing,
    ...data,
    id: galId,
    title: data.title || "Luxury Moment",
    category: (data.category || "islands").toLowerCase(),
    tag: (data.tag || data.category || "HORIZONS").toUpperCase(),
    image: data.image || "",
    desc: data.desc || data.description || "",
    updatedAt: new Date().toISOString(),
    createdAt: existing.createdAt || new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "gallery", galId), {
      ...merged,
      serverTime: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore gallery write error:", err.message);
  }

  const list = getLocalCache("gallery", DEFAULT_GALLERY);
  const idx = list.findIndex(g => g.id === galId);
  if (idx >= 0) list[idx] = merged;
  else list.unshift(merged);
  setLocalCache("gallery", list);

  return merged;
}

export async function deleteGalleryItem(id) {
  try {
    await deleteDoc(doc(db, "gallery", id));
  } catch (err) {
    console.warn("Firestore gallery delete error:", err.message);
  }
  const list = getLocalCache("gallery", DEFAULT_GALLERY).filter(g => g.id !== id);
  setLocalCache("gallery", list);
  return true;
}

// =============================================================================
// 6. ONE-CLICK INITIAL SYNC TO CLOUD FIRESTORE
// =============================================================================

export async function syncAllToFirestore() {
  let pkgCount = 0;
  let destCount = 0;
  let galCount = 0;
  let revCount = 0;

  for (const pkg of defaultPackages) {
    const id = pkg.slug || pkg.id;
    await setDoc(doc(db, "packages", id), {
      ...pkg,
      id,
      syncedAt: serverTimestamp()
    }, { merge: true });
    pkgCount++;
  }

  for (const dest of defaultDestinations) {
    const id = dest.slug || dest.id;
    await setDoc(doc(db, "destinations", id), {
      ...dest,
      id,
      syncedAt: serverTimestamp()
    }, { merge: true });
    destCount++;
  }

  for (const gal of DEFAULT_GALLERY) {
    await setDoc(doc(db, "gallery", gal.id), {
      ...gal,
      syncedAt: serverTimestamp()
    }, { merge: true });
    galCount++;
  }

  for (const rev of DEFAULT_REVIEWS) {
    await setDoc(doc(db, "reviews", rev.id), {
      ...rev,
      syncedAt: serverTimestamp()
    }, { merge: true });
    revCount++;
  }

  return { packages: pkgCount, destinations: destCount, gallery: galCount, reviews: revCount };
}
