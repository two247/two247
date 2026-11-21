/**
 * =========================================================================
 * TWO247 Admin — Authentication Guard & Session Controller
 * Protects admin views and handles Firebase Auth & Executive Session state
 * =========================================================================
 */
import { auth } from "../../js/firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const isLoginPage = window.location.pathname.endsWith("login.html");

export function initAuthGuard(onUserReady) {
  // Check local executive session state (ensures admin access even if Firebase Auth service provider is pending)
  const isDemoAdmin = sessionStorage.getItem("two247_demo_admin") === "true";
  const demoEmail = sessionStorage.getItem("two247_demo_email") || "two247web@gmail.com";

  if (isDemoAdmin) {
    const emailEls = document.querySelectorAll("#admin-user-email");
    emailEls.forEach(el => el.textContent = demoEmail);

    if (isLoginPage) {
      window.location.href = "index.html";
      return;
    }

    if (typeof onUserReady === "function") {
      onUserReady({ email: demoEmail, isDemo: true, uid: "executive-admin" });
    }
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const email = user.email || "Administrator";
      const emailEls = document.querySelectorAll("#admin-user-email");
      emailEls.forEach(el => el.textContent = email);

      if (isLoginPage) {
        window.location.href = "index.html";
        return;
      }

      if (typeof onUserReady === "function") {
        onUserReady(user);
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
    sessionStorage.removeItem("two247_demo_email");
    sessionStorage.removeItem("two247_admin_auth");
    await signOut(auth);
  } catch (err) {
    console.warn("Sign out err:", err);
  } finally {
    window.location.href = "login.html";
  }
}

window.handleAdminSignOut = handleAdminSignOut;
