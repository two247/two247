/**
 * =========================================================================
 * TWO247 Admin — Authentication Guard & Session Controller
 * Protects admin views and handles Firebase Auth state
 * =========================================================================
 */
import { auth } from "../../js/firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const isLoginPage = window.location.pathname.endsWith("login.html");

export function initAuthGuard(onUserReady) {
  // Check local demo bypass state (useful before Firebase users are created)
  const isDemoAdmin = sessionStorage.getItem("two247_demo_admin") === "true";

  onAuthStateChanged(auth, (user) => {
    if (user || isDemoAdmin) {
      const email = user ? user.email : "admin@two247.in";
      const emailEl = document.getElementById("admin-user-email");
      if (emailEl) emailEl.textContent = email;

      if (isLoginPage) {
        window.location.href = "index.html";
        return;
      }

      if (typeof onUserReady === "function") {
        onUserReady(user || { email, isDemo: true });
      }
    } else {
      if (!isLoginPage) {
        window.location.href = "login.html";
      }
    }
  });
}

export async function handleAdminSignOut() {
  try {
    sessionStorage.removeItem("two247_demo_admin");
    await signOut(auth);
  } catch (err) {
    console.warn("Sign out err:", err);
  } finally {
    window.location.href = "login.html";
  }
}

window.handleAdminSignOut = handleAdminSignOut;
