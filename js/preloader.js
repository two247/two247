/**
 * TWO247 Luxury White Preloader Controller
 * Minimalist White Background, Logo Only, Zero Text
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

  let progress = 0;
  let isDismissed = false;

  function dismissPreloader() {
    if (isDismissed || !preloader) return;
    isDismissed = true;
    clearInterval(progressInterval);

    preloader.classList.add("preloader-hidden");
    document.body.classList.remove("overflow-hidden");

    setTimeout(() => {
      preloader.style.display = "none";
      preloader.setAttribute("aria-hidden", "true");
    }, 480);
  }

  // Animate progress bar smoothly (finishes in ~1.1s)
  const progressInterval = setInterval(() => {
    if (isDismissed) return;

    // Organic non-linear acceleration
    let step = 4;
    if (progress < 40) step = Math.floor(Math.random() * 6) + 4;
    else if (progress < 80) step = Math.floor(Math.random() * 8) + 6;
    else step = Math.floor(Math.random() * 10) + 8;

    progress = Math.min(100, progress + step);

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(progressInterval);
      setTimeout(dismissPreloader, 200);
    }
  }, 35);

  // Skip Button
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

  // Safety threshold: maximum display time 1.4s
  setTimeout(dismissPreloader, 1400);
}

// Auto-run if script is loaded standalone or via module
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreloader);
} else {
  initPreloader();
}
