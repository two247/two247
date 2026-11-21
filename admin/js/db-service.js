/**
 * =========================================================================
 * TWO247 Admin — Firestore Real Data Database Service
 * Provides full CRUD operations syncing directly with Google Cloud Firestore
 * =========================================================================
 */
import { db } from "../../js/firebase-config.js";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { packages as officialPackages } from "../../data/packages.js";
import { destinations as officialDestinations } from "../../data/destinations.js";

// Local storage caching helper
function getLocal(key, fallback = []) {
  try {
    const raw = localStorage.getItem(`two247_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal(key, data) {
  try {
    localStorage.setItem(`two247_${key}`, JSON.stringify(data));
  } catch (err) {
    console.warn("Local storage cache warning:", err);
  }
}

// =============================================================================
// 1. PACKAGES CRUD (Real Cloud Firestore)
// =============================================================================
export async function getPackages() {
  try {
    const snap = await getDocs(collection(db, "packages"));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocal("packages", items);
      return items;
    }
  } catch (err) {
    console.info("Firestore packages read:", err.message);
  }
  // If Firestore is brand new/empty, fall back to official dataset
  const cached = getLocal("packages", null);
  if (cached && cached.length > 0) return cached;
  setLocal("packages", officialPackages);
  return officialPackages;
}

export async function savePackage(data, id = null) {
  const pkgId = id || data.slug || `pkg-${Date.now()}`;
  const payload = {
    ...data,
    id: pkgId,
    updatedAt: new Date().toISOString()
  };

  // 1. Write to Firestore
  try {
    await setDoc(doc(db, "packages", pkgId), { ...payload, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Firestore package write:", err.message);
  }

  // 2. Sync local cache
  const list = getLocal("packages", officialPackages);
  const idx = list.findIndex(p => p.id === pkgId || p.slug === data.slug);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal("packages", list);

  return payload;
}

export async function deletePackage(id) {
  try {
    await deleteDoc(doc(db, "packages", id));
  } catch (err) {
    console.warn("Firestore package delete:", err.message);
  }
  const list = getLocal("packages", officialPackages).filter(p => p.id !== id && p.slug !== id);
  setLocal("packages", list);
  return true;
}

// =============================================================================
// 2. DESTINATIONS CRUD (Real Cloud Firestore)
// =============================================================================
export async function getDestinations() {
  try {
    const snap = await getDocs(collection(db, "destinations"));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocal("destinations", items);
      return items;
    }
  } catch (err) {
    console.info("Firestore destinations read:", err.message);
  }
  const cached = getLocal("destinations", null);
  if (cached && cached.length > 0) return cached;
  setLocal("destinations", officialDestinations);
  return officialDestinations;
}

export async function saveDestination(data, id = null) {
  const destId = id || data.slug || `dest-${Date.now()}`;
  const payload = {
    ...data,
    id: destId,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "destinations", destId), { ...payload, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Firestore destination write:", err.message);
  }

  const list = getLocal("destinations", officialDestinations);
  const idx = list.findIndex(d => d.id === destId || d.slug === data.slug);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal("destinations", list);

  return payload;
}

export async function deleteDestination(id) {
  try {
    await deleteDoc(doc(db, "destinations", id));
  } catch (err) {
    console.warn("Firestore destination delete:", err.message);
  }
  const list = getLocal("destinations", officialDestinations).filter(d => d.id !== id && d.slug !== id);
  setLocal("destinations", list);
  return true;
}

// =============================================================================
// 3. REVIEWS / TESTIMONIALS (Real Cloud Firestore — No Dummy Data)
// =============================================================================
export async function getReviews() {
  try {
    const snap = await getDocs(collection(db, "reviews"));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocal("reviews", items);
      return items;
    }
  } catch (err) {
    console.info("Firestore reviews read:", err.message);
  }
  return getLocal("reviews", []);
}

export async function saveReview(data, id = null) {
  const revId = id || `rev-${Date.now()}`;
  const payload = {
    ...data,
    id: revId,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "reviews", revId), { ...payload, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Firestore review write:", err.message);
  }

  const list = getLocal("reviews", []);
  const idx = list.findIndex(r => r.id === revId);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal("reviews", list);

  return payload;
}

export async function deleteReview(id) {
  try {
    await deleteDoc(doc(db, "reviews", id));
  } catch (err) {
    console.warn("Firestore review delete:", err.message);
  }
  const list = getLocal("reviews", []).filter(r => r.id !== id);
  setLocal("reviews", list);
  return true;
}

// =============================================================================
// 4. INQUIRIES & LEADS (Real Cloud Firestore — No Dummy Data)
// =============================================================================
export async function getInquiries() {
  try {
    // FIX: use orderBy on createdAt so newest leads appear first
    const snap = await getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc")));
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLocal("inquiries", items);
      return items;
    }
  } catch (err) {
    // FIX: orderBy requires a composite index; fall back gracefully if index missing
    try {
      const snap = await getDocs(collection(db, "inquiries"));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLocal("inquiries", items);
        return items;
      }
    } catch (innerErr) {
      console.info("Firestore inquiries read:", innerErr.message);
    }
  }
  return getLocal("inquiries", []);
}

export async function updateInquiryStatus(id, newStatus) {
  try {
    await setDoc(doc(db, "inquiries", id), { status: newStatus, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn("Firestore inquiry update:", err.message);
  }

  const list = getLocal("inquiries", []);
  const item = list.find(x => x.id === id);
  if (item) {
    item.status = newStatus;
    setLocal("inquiries", list);
  }
  return true;
}

export async function deleteInquiry(id) {
  try {
    await deleteDoc(doc(db, "inquiries", id));
  } catch (err) {
    console.warn("Firestore inquiry delete:", err.message);
  }
  const list = getLocal("inquiries", []).filter(x => x.id !== id);
  setLocal("inquiries", list);
  return true;
}

// =============================================================================
// 5. ONE-CLICK SYNC OFFICIAL PACKAGES & DESTINATIONS TO CLOUD FIRESTORE
// =============================================================================
export async function syncAllToFirestore() {
  let pkgCount = 0;
  let destCount = 0;

  for (const pkg of officialPackages) {
    const id = pkg.slug || pkg.id;
    await setDoc(doc(db, "packages", id), {
      ...pkg,
      id,
      syncedAt: serverTimestamp()
    }, { merge: true });
    pkgCount++;
  }

  for (const dest of officialDestinations) {
    const id = dest.slug || dest.id;
    await setDoc(doc(db, "destinations", id), {
      ...dest,
      id,
      syncedAt: serverTimestamp()
    }, { merge: true });
    destCount++;
  }

  return { packages: pkgCount, destinations: destCount };
}
