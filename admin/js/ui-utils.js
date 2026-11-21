/**
 * =========================================================================
 * TWO247 Admin — UI Utilities & Toast Notification Manager
 * =========================================================================
 */

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement("div");
    toastContainer.className = "admin-toast-container";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Display a floating toast message
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration
 */
export function showToast(message, type = "success", duration = 3200) {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;

  const icon = type === "success" 
    ? `<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`
    : type === "error"
    ? `<svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
    : `<svg class="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>`;

  // FIX: Use textContent for message to prevent XSS from toast messages containing HTML
  const msgSpan = document.createElement("span");
  msgSpan.className = "flex-1";
  msgSpan.textContent = message;

  toast.innerHTML = icon;
  toast.appendChild(msgSpan);

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * FIX: Sanitize user-sourced strings before inserting into innerHTML
 * Prevents XSS in dynamically rendered table rows and cards
 * @param {string} str
 * @returns {string}
 */
export function sanitize(str) {
  if (str === null || str === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Parse currency string to raw integer
 * e.g. "₹1,40,000" -> 140000
 */
export function parseCurrencyNumber(str) {
  if (!str) return 0;
  const cleaned = String(str).replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Format raw number to Indian Rupee representation
 * e.g. 140000 -> "₹1,40,000"
 */
export function formatCurrencyIndian(num) {
  const n = parseInt(num, 10);
  if (isNaN(n) || n === 0) return "";
  return "₹" + n.toLocaleString("en-IN");
}

// Make globally accessible
window.showToast = showToast;
window.sanitize = sanitize;
window.parseCurrencyNumber = parseCurrencyNumber;
window.formatCurrencyIndian = formatCurrencyIndian;
