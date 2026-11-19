/**
 * TWO247 Luxury White Preloader Controller
 * Minimalist White Background, Owl Animation + Logo Only
 * Duration: Exactly 3.0 Seconds
 */

export function initPreloader() {
  const preloader = document.getElementById("two247-preloader");
  if (!preloader) return;

  // Respect reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dismissPreloader();
    return;
  }

  // Prevent background scroll during loading
  document.body.classList.add("overflow-hidden");

  const progressBar = document.getElementById("preloader-progress-bar");
  const skipBtn = document.getElementById("preloader-skip");

  const DURATION = 3000; // 3 seconds display time
  const startTime = performance.now();
  let isDismissed = false;
  let rafId = null;

  function dismissPreloader() {
    if (isDismissed || !preloader) return;
    isDismissed = true;
    if (rafId) cancelAnimationFrame(rafId);

    preloader.classList.add("preloader-hidden");
    document.body.classList.remove("overflow-hidden");

    setTimeout(() => {
      preloader.style.display = "none";
      preloader.setAttribute("aria-hidden", "true");
    }, 480);
  }

  // Smooth 60fps progress animation across the 3-second duration
  function tick(now) {
    if (isDismissed) return;
    const elapsed = now - startTime;
    const progress = Math.min(100, (elapsed / (DURATION - 200)) * 100);

    if (progressBar) {
      progressBar.style.width = `${progress.toFixed(1)}%`;
    }

    if (elapsed >= DURATION) {
      dismissPreloader();
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  rafId = requestAnimationFrame(tick);

  // Skip Button for instant dismissal
  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismissPreloader();
    });
  }

  // Click anywhere on preloader to dismiss instantly
  preloader.addEventListener("click", () => {
    dismissPreloader();
  });

  // Escape key dismisses
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !isDismissed) {
      dismissPreloader();
    }
  });

  // Safety threshold fallback
  setTimeout(dismissPreloader, DURATION + 200);
}

// Auto-run if script is loaded standalone or via module
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreloader);
} else {
  initPreloader();
}
