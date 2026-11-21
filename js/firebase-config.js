/**
 * =========================================================================
 * TWO247 — Firebase Client Configuration & Service Initializer
 * Provides modular access to Firebase App, Analytics, Firestore, and Auth
 * =========================================================================
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCyWp4zN5VIen6wPvpwOLFdktuvvFWUtGY",
  authDomain: "two247-3684f.firebaseapp.com",
  projectId: "two247-3684f",
  storageBucket: "two247-3684f.firebasestorage.app",
  messagingSenderId: "654657532603",
  appId: "1:654657532603:web:421c49ae55a51ee06faf9e",
  measurementId: "G-H7HGPFC5K7"
};

// Initialize Firebase Core
export const app = initializeApp(firebaseConfig);

// Initialize Firestore Database & Authentication
export const db = getFirestore(app);
export const auth = getAuth(app);

// Safe Analytics Initialization (Supported in browser environments)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Global reference for legacy/inline compatibility if needed
if (typeof window !== "undefined") {
  window.two247Firebase = { app, db, auth, analytics };
}
