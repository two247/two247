/**
 * =========================================================================
 * TWO247 Admin — Firestore & Local Database Service
 * Provides robust CRUD operations with real-time Firestore sync & fallback
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

import { packages as defaultPackages } from "../../data/packages.js";
import { destinations as defaultDestinations } from "../../data/destinations.js";

// Fallback seed data for reviews
const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    clientName: "Rohan & Meera Singhania",
    clientLocation: "Mumbai",
    destination: "Maldives",
    rating: 5,
    reviewText: "The private catamaran pickup and overwater villa with ocean sunset were completely otherworldly. TWO247 handled every detail 24/7 on WhatsApp.",
    travelDate: "Oct 2026",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "published"
  },
  {
    id: "rev-2",
    clientName: "Aditya & Priya Chawla",
    clientLocation: "Delhi NCR",
    destination: "Switzerland & Paris",
    rating: 5,
    reviewText: "Jungfraujoch first-class trains and our Seine twilight cruise were flawlessly orchestrated. Not a single hitch.",
    travelDate: "Sep 2026",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "published"
  },
  {
    id: "rev-3",
    clientName: "Vikram & Sunita Malhotra",
    clientLocation: "Bengaluru",
    destination: "Dubai",
    rating: 5,
    reviewText: "Burj Khalifa sky lounge VIP entry and private red dune desert dinner were the highlights of our anniversary.",
    travelDate: "Nov 2026",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "published"
  }
];

// Fallback seed data for leads/inquiries
const DEFAULT_INQUIRIES = [
  {
    id: "inq-1",
    guestName: "Kavita Sharma",
    phone: "+91 98201 54321",
    email: "kavita.sharma@gmail.com",
    destination: "Turkey (Cappadocia & Istanbul)",
    travelMonth: "April 2027",
    guests: "2 Adults",
    budget: "₹1,40,000+",
    status: "New",
    source: "WhatsApp Consultation",
    createdAt: new Date().toISOString()
  },
  {
    id: "inq-2",
    guestName: "Arjun Nambiar",
    phone: "+91 98450 11223",
    email: "arjun.n@outlook.com",
    destination: "New Zealand Fjords",
    travelMonth: "Dec 2026",
    guests: "2 Adults, 1 Child",
    budget: "₹1,71,000+",
    status: "Contacted",
    source: "Custom Trip Form",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// LocalStorage helpers for seamless offline/pre-firestore operation
function getLocal(key, fallback) {
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
    console.warn("Storage full/error:", err);
  }
}

// -----------------------------------------------------------------------------
// 1. PACKAGES CRUD
// -----------------------------------------------------------------------------
export async function getPackages() {
  try {
    const snap = await getDocs(collection(db, "packages"));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.info("Firestore packages using local cache:", err.message);
  }
  return getLocal("packages", defaultPackages);
}

export async function savePackage(data, id = null) {
  const pkgId = id || data.slug || `pkg-${Date.now()}`;
  const payload = {
    ...data,
    id: pkgId,
    updatedAt: new Date().toISOString()
  };

  // 1. Try Firestore
  try {
    await setDoc(doc(db, "packages", pkgId), { ...payload, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Firestore save failed, saving locally:", err.message);
  }

  // 2. Always sync local cache
  const list = getLocal("packages", defaultPackages);
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
    console.warn("Firestore delete failed:", err.message);
  }
  const list = getLocal("packages", defaultPackages).filter(p => p.id !== id && p.slug !== id);
  setLocal("packages", list);
  return true;
}

// -----------------------------------------------------------------------------
// 2. DESTINATIONS CRUD
// -----------------------------------------------------------------------------
export async function getDestinations() {
  try {
    const snap = await getDocs(collection(db, "destinations"));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.info("Firestore destinations using local cache:", err.message);
  }
  return getLocal("destinations", defaultDestinations);
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
    console.warn("Firestore save failed:", err.message);
  }

  const list = getLocal("destinations", defaultDestinations);
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
    console.warn("Firestore delete failed:", err.message);
  }
  const list = getLocal("destinations", defaultDestinations).filter(d => d.id !== id && d.slug !== id);
  setLocal("destinations", list);
  return true;
}

// -----------------------------------------------------------------------------
// 3. REVIEWS / TESTIMONIALS CRUD
// -----------------------------------------------------------------------------
export async function getReviews() {
  try {
    const snap = await getDocs(collection(db, "reviews"));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.info("Firestore reviews using local cache:", err.message);
  }
  return getLocal("reviews", DEFAULT_REVIEWS);
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
    console.warn("Firestore review save:", err.message);
  }

  const list = getLocal("reviews", DEFAULT_REVIEWS);
  const idx = list.findIndex(r => r.id === revId);
  if (idx >= 0) list[idx] = payload;
  else list.unshift(payload);
  setLocal("reviews", list);

  return payload;
}

export async function deleteReview(id) {
  try {
    await deleteDoc(doc(db, "reviews", id));
  } catch (err) {}
  const list = getLocal("reviews", DEFAULT_REVIEWS).filter(r => r.id !== id);
  setLocal("reviews", list);
  return true;
}

// -----------------------------------------------------------------------------
// 4. INQUIRIES & LEADS MANAGEMENT
// -----------------------------------------------------------------------------
export async function getInquiries() {
  try {
    const snap = await getDocs(collection(db, "inquiries"));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {}
  return getLocal("inquiries", DEFAULT_INQUIRIES);
}

export async function updateInquiryStatus(id, newStatus) {
  try {
    await setDoc(doc(db, "inquiries", id), { status: newStatus, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {}

  const list = getLocal("inquiries", DEFAULT_INQUIRIES);
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
  } catch (err) {}
  const list = getLocal("inquiries", DEFAULT_INQUIRIES).filter(x => x.id !== id);
  setLocal("inquiries", list);
  return true;
}
