/**
 * =========================================================================
 * TWO247 Admin — Hardened Authentication Guard & Session Controller
 * Enterprise Session Management, Inactivity Detection, Anti-FOUC Cloak,
 * and Multi-Tab Synchronized Secure Sign-Out.
 * =========================================================================
 */
import { auth } from "../../js/firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Session Configuration (20-minute inactivity limit, 2-minute warning modal)
const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000;
const WARNING_BEFORE_TIMEOUT_MS = 2 * 60 * 1000;
const CHECK_INTERVAL_MS = 5 * 1000;

const SESSION_STORAGE_LAST_ACTIVE = "two247_admin_last_active";
const LOCAL_STORAGE_LOGOUT_EVENT = "two247_admin_logout_signal";

const isLoginPage = window.location.pathname.endsWith("login.html");

let sessionCheckInterval = null;
let countdownInterval = null;
let isSigningOut = false;

// 1. Anti-FOUC Security Splash / Overlay
function ensureAuthOverlay() {
  if (isLoginPage) return null;
  let overlay = document.getElementById("admin-auth-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "admin-auth-overlay";
    overlay.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="../assets/logo/owl-mark.svg" alt="TWO247" class="h-10 w-10 animate-pulse">
      </div>
      <div class="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
        <svg class="w-4 h-4 animate-spin text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Verifying Executive Security...</span>
      </div>
    `;
    document.body.prepend(overlay);
  }
  return overlay;
}

function removeAuthOverlay() {
  const overlay = document.getElementById("admin-auth-overlay");
  if (overlay) {
    overlay.classList.add("hidden-cloak");
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }
}

// 2. Inactivity Warning Modal
function ensureTimeoutModal() {
  let modal = document.getElementById("admin-timeout-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "admin-timeout-modal";
    modal.innerHTML = `
      <div class="timeout-card">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">Session Expiring Soon</h3>
        <p class="text-xs text-slate-400 leading-relaxed mb-6">
          For executive security, your session will automatically terminate in
          <span id="timeout-countdown" class="font-bold text-amber-400">120</span> seconds
          due to inactivity.
        </p>
        <div class="flex items-center justify-center gap-3">
          <button id="timeout-stay-btn" type="button" class="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-md cursor-pointer">
            Stay Signed In
          </button>
          <button id="timeout-logout-btn" type="button" class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold transition-all cursor-pointer">
            Sign Out Now
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("timeout-stay-btn")?.addEventListener("click", () => {
      recordUserActivity();
      hideTimeoutModal();
    });

    document.getElementById("timeout-logout-btn")?.addEventListener("click", () => {
      handleAdminSignOut({ reason: "manual" });
    });
  }
  return modal;
}

function showTimeoutModal(remainingSeconds) {
  const modal = ensureTimeoutModal();
  const countdownEl = document.getElementById("timeout-countdown");
  if (countdownEl) countdownEl.textContent = Math.max(0, Math.floor(remainingSeconds));
  modal.classList.add("is-active");

  if (!countdownInterval) {
    let currentRemaining = Math.max(0, Math.floor(remainingSeconds));
    countdownInterval = setInterval(() => {
      currentRemaining -= 1;
      if (countdownEl) countdownEl.textContent = Math.max(0, currentRemaining);
      if (currentRemaining <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        handleAdminSignOut({ reason: "timeout" });
      }
    }, 1000);
  }
}

function hideTimeoutModal() {
  const modal = document.getElementById("admin-timeout-modal");
  if (modal) {
    modal.classList.remove("is-active");
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// 3. User Activity Tracking
function recordUserActivity() {
  if (isSigningOut) return;
  const now = Date.now();
  sessionStorage.setItem(SESSION_STORAGE_LAST_ACTIVE, now.toString());
}

function setupActivityListeners() {
  const events = ["mousedown", "keydown", "scroll", "touchstart"];
  let lastRecorded = 0;

  const onActivity = () => {
    const now = Date.now();
    // Throttle writing to sessionStorage
    if (now - lastRecorded > 3000) {
      lastRecorded = now;
      const modal = document.getElementById("admin-timeout-modal");
      // If modal is active, user must explicitly click "Stay Signed In"
      if (!modal || !modal.classList.contains("is-active")) {
        recordUserActivity();
      }
    }
  };

  events.forEach(evt => window.addEventListener(evt, onActivity, { passive: true }));
}

// 4. Inactivity Monitor Loop
function startSessionInactivityMonitor() {
  if (sessionCheckInterval) clearInterval(sessionCheckInterval);

  // Initialize timestamp if missing
  if (!sessionStorage.getItem(SESSION_STORAGE_LAST_ACTIVE)) {
    recordUserActivity();
  }

  sessionCheckInterval = setInterval(() => {
    if (isSigningOut) return;

    const rawLastActive = sessionStorage.getItem(SESSION_STORAGE_LAST_ACTIVE);
    const lastActive = rawLastActive ? parseInt(rawLastActive, 10) : Date.now();
    const elapsed = Date.now() - lastActive;

    if (elapsed >= INACTIVITY_TIMEOUT_MS) {
      // Session has expired
      handleAdminSignOut({ reason: "timeout" });
    } else if (elapsed >= (INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_TIMEOUT_MS)) {
      // In warning threshold
      const remainingSecs = (INACTIVITY_TIMEOUT_MS - elapsed) / 1000;
      showTimeoutModal(remainingSecs);
    } else {
      hideTimeoutModal();
    }
  }, CHECK_INTERVAL_MS);
}

// 5. Cross-Tab Session Synchronization
function setupCrossTabSync() {
  window.addEventListener("storage", (e) => {
    if (e.key === LOCAL_STORAGE_LOGOUT_EVENT && e.newValue && !isSigningOut) {
      // Another tab signed out
      handleAdminSignOut({ reason: "cross_tab", silent: true });
    }
  });
}

// 6. Back-Forward Cache (bfcache) Protection
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    // Page was restored from Back-Forward cache; force verification reload
    window.location.reload();
  }
});

/**
 * Main Guard Initializer
 * @param {Function} onUserReady Callback when user authentication is confirmed
 */
export function initAuthGuard(onUserReady) {
  if (!isLoginPage) {
    ensureAuthOverlay();
  }

  setupCrossTabSync();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const email = user.email || "Administrator";
      const emailEls = document.querySelectorAll("#admin-user-email");
      emailEls.forEach(el => el.textContent = email);

      if (isLoginPage) {
        window.location.replace("index.html");
        return;
      }

      recordUserActivity();
      setupActivityListeners();
      startSessionInactivityMonitor();
      removeAuthOverlay();

      if (typeof onUserReady === "function") {
        onUserReady(user);
      }
    } else {
      if (!isLoginPage) {
        window.location.replace("login.html?reason=unauthorized");
      }
    }
  });
}

/**
 * Hardened Admin Sign Out
 * @param {Object} [options]
 * @param {'manual'|'timeout'|'security'|'cross_tab'} [options.reason='manual']
 * @param {boolean} [options.silent=false]
 */
export async function handleAdminSignOut(options = {}) {
  if (isSigningOut) return;
  isSigningOut = true;

  const reason = options.reason || "manual";

  // Stop background timers
  if (sessionCheckInterval) clearInterval(sessionCheckInterval);
  if (countdownInterval) clearInterval(countdownInterval);

  // Update button UI state if present
  const signoutBtns = document.querySelectorAll("button[onclick*='handleAdminSignOut']");
  signoutBtns.forEach(btn => {
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="w-4 h-4 animate-spin text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Signing Out...</span>
    `;
  });

  try {
    // Notify other open tabs to log out
    localStorage.setItem(LOCAL_STORAGE_LOGOUT_EVENT, Date.now().toString());

    // Clear session storage & admin sensitive items in local storage
    sessionStorage.clear();
    const adminKeysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("two247_admin_") || key === "two247_demo_admin" || key === "two247_demo_email")) {
        adminKeysToRemove.push(key);
      }
    }
    adminKeysToRemove.forEach(k => localStorage.removeItem(k));

    // Sign out from Firebase Auth
    await signOut(auth);
  } catch (err) {
    console.warn("Sign out cleanup error:", err);
  } finally {
    const dest = `login.html?reason=${encodeURIComponent(reason)}`;
    window.location.replace(dest);
  }
}

// Make globally accessible for template buttons
window.handleAdminSignOut = handleAdminSignOut;
