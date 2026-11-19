/**
 * =========================================================================
 * CINEMATIC VIDEO BACKGROUND CONTROLLER (MotionSites Loop Architecture)
 * Seamless 60fps fade-in/fade-out continuous video loop via requestAnimationFrame
 * =========================================================================
 */

export function initHeroVideo() {
  const video = document.getElementById('hero-bg-video');
  if (!video) return;

  video.style.opacity = '0';
  video.style.transition = 'opacity 0.4s ease';

  let rafId = null;

  function monitorVideo() {
    if (video.duration && !video.paused) {
      const cur = video.currentTime;
      const dur = video.duration;

      // 1. Fade in over 0.5s at the start (opacity 0 to 1)
      if (cur < 0.5) {
        video.style.opacity = Math.min(1, cur / 0.5).toFixed(3);
      } 
      // 2. Fade out over 0.5s before the end (opacity 1 to 0)
      else if (dur > 1 && cur > dur - 0.5) {
        video.style.opacity = Math.max(0, (dur - cur) / 0.5).toFixed(3);
      } 
      // 3. Fully visible between 0.5s and (dur - 0.5s)
      else {
        video.style.opacity = '1';
      }
    }
    rafId = requestAnimationFrame(monitorVideo);
  }

  // 4. On ended event: set opacity to 0, wait 100ms, reset currentTime = 0, then play() again
  video.addEventListener('ended', () => {
    video.style.opacity = '0';
    setTimeout(() => {
      video.currentTime = 0;
      video.play().catch(() => {});
    }, 100);
  });

  // Start monitoring when video plays
  video.addEventListener('play', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(monitorVideo);
  });

  // Ensure muted and playsinline for mobile/Safari autoplay support
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      rafId = requestAnimationFrame(monitorVideo);
    }).catch(() => {
      // User gesture needed fallback
      const tryPlay = () => {
        video.play().then(() => {
          rafId = requestAnimationFrame(monitorVideo);
          window.removeEventListener('click', tryPlay);
          window.removeEventListener('touchstart', tryPlay);
        }).catch(() => {});
      };
      window.addEventListener('click', tryPlay, { once: true });
      window.addEventListener('touchstart', tryPlay, { once: true });
    });
  }
}

// Auto-run when ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideo);
  } else {
    initHeroVideo();
  }
}
