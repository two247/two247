/**
 * TWO247 Traveler Preloader Controller
 * Powered by Lottie Traveler with Airline Tickets & Carrying Luggage (#8443720)
 */

export function initPreloader() {
  const preloader = document.getElementById("two247-preloader");
  if (!preloader) return;

  // Respect reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dismissPreloader();
    return;
  }

  // Prevent scroll during loading
  document.body.classList.add("overflow-hidden");

  const progressText = document.getElementById("preloader-percent");
  const progressBar = document.getElementById("preloader-progress-bar");
  const statusText = document.getElementById("preloader-status");
  const skipBtn = document.getElementById("preloader-skip");

  const statusCues = [
    "Packing flight tickets & luggage...",
    "Connecting 24/7 travel desk...",
    "Curating bespoke itineraries...",
    "Ready for departure. Enjoy your trip!"
  ];

  let progress = 0;
  let statusIndex = 0;
  let isDismissed = false;

  function updateStatus(msg) {
    if (!statusText) return;
    statusText.style.opacity = "0";
    statusText.style.transform = "translateY(3px)";
    setTimeout(() => {
      statusText.textContent = msg;
      statusText.style.opacity = "1";
      statusText.style.transform = "translateY(0)";
    }, 120);
  }

  function dismissPreloader() {
    if (isDismissed || !preloader) return;
    isDismissed = true;
    clearInterval(progressInterval);

    preloader.classList.add("preloader-hidden");
    document.body.classList.remove("overflow-hidden");

    setTimeout(() => {
      preloader.style.display = "none";
      preloader.setAttribute("aria-hidden", "true");
    }, 550);
  }

  // Animate progress smoothly (completes in ~1.4s)
  const progressInterval = setInterval(() => {
    if (isDismissed) return;

    // Organic non-linear acceleration
    let step = 3;
    if (progress < 30) step = Math.floor(Math.random() * 5) + 3;
    else if (progress < 70) step = Math.floor(Math.random() * 7) + 4;
    else step = Math.floor(Math.random() * 8) + 5;

    progress = Math.min(100, progress + step);

    if (progressText) progressText.textContent = `${progress}%`;
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Status transitions
    if (progress >= 30 && statusIndex === 0) {
      statusIndex = 1;
      updateStatus(statusCues[1]);
    } else if (progress >= 65 && statusIndex === 1) {
      statusIndex = 2;
      updateStatus(statusCues[2]);
    } else if (progress >= 92 && statusIndex === 2) {
      statusIndex = 3;
      updateStatus(statusCues[3]);
    }

    if (progress >= 100) {
      clearInterval(progressInterval);
      setTimeout(dismissPreloader, 250);
    }
  }, 40);

  // Skip Button
  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismissPreloader();
    });
  }

  // Click anywhere to dismiss
  preloader.addEventListener("click", (e) => {
    // Only dismiss if clicking container or backdrop
    dismissPreloader();
  });

  // Escape key dismisses
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !isDismissed) {
      dismissPreloader();
    }
  });

  // Window load safety: if window takes longer to load, max display 1.8s
  setTimeout(dismissPreloader, 1800);
}

// Auto-run if script is loaded standalone or via module
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreloader);
} else {
  initPreloader();
}
