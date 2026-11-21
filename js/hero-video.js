/**
 * =========================================================================
 * CINEMATIC VIDEO BACKGROUND CONTROLLER (TWO247 Dual-Layer Crossfade)
 * Seamless 60fps fade-in/fade-out continuous video loop + Destination Switcher
 * =========================================================================
 */

export const DEFAULT_HERO_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

let activeVideo = null;
let inactiveVideo = null;
let currentVideoSrc = DEFAULT_HERO_VIDEO;
let resetTimer = null;
let switchToken = 0;

export function initHeroVideo() {
  const container = document.querySelector('.hero-video-container');
  if (!container) return;

  activeVideo = document.getElementById('hero-bg-video');
  inactiveVideo = document.getElementById('hero-bg-video-secondary');

  if (!activeVideo) return;

  // If secondary video element is not in DOM, create it dynamically
  if (!inactiveVideo) {
    inactiveVideo = document.createElement('video');
    inactiveVideo.id = 'hero-bg-video-secondary';
    inactiveVideo.className = 'hero-video-element';
    inactiveVideo.muted = true;
    inactiveVideo.loop = true;
    inactiveVideo.playsInline = true;
    inactiveVideo.setAttribute('playsinline', '');
    inactiveVideo.setAttribute('muted', '');
    inactiveVideo.setAttribute('aria-hidden', 'true');
    const overlay = container.querySelector('.hero-video-gradient-overlay');
    if (overlay) {
      container.insertBefore(inactiveVideo, overlay);
    } else {
      container.appendChild(inactiveVideo);
    }
  }

  // Ensure attributes for reliable autoplay
  [activeVideo, inactiveVideo].forEach((v) => {
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('muted', '');
    v.setAttribute('aria-hidden', 'true');
    v.loop = true;
  });

  // Activate primary video
  activeVideo.classList.add('is-active');
  inactiveVideo.classList.remove('is-active');

  const playPromise = activeVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      const tryPlay = () => {
        if (activeVideo) activeVideo.play().catch(() => {});
        window.removeEventListener('click', tryPlay);
        window.removeEventListener('touchstart', tryPlay);
        window.removeEventListener('scroll', tryPlay);
      };
      window.addEventListener('click', tryPlay, { once: true });
      window.addEventListener('touchstart', tryPlay, { once: true });
      window.addEventListener('scroll', tryPlay, { once: true });
    });
  }
}

/**
 * Switch hero background video to a specific destination video with crossfade
 * @param {string} newSrc - Destination video URL
 */
export function switchHeroVideo(newSrc) {
  if (!newSrc) return;
  if (resetTimer) {
    clearTimeout(resetTimer);
    resetTimer = null;
  }

  if (currentVideoSrc === newSrc) return;
  currentVideoSrc = newSrc;
  const currentToken = ++switchToken;

  if (!activeVideo || !inactiveVideo) {
    initHeroVideo();
    if (!activeVideo || !inactiveVideo) return;
  }

  const outgoing = activeVideo;
  const incoming = inactiveVideo;

  // Prepare incoming video
  incoming.src = newSrc;
  incoming.currentTime = 0;
  incoming.muted = true;
  incoming.playsInline = true;
  incoming.loop = true;

  const startTransition = () => {
    if (currentToken !== switchToken) return; // Stale request check

    // Crossfade: incoming to 1, outgoing to 0
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');

    // Swap active/inactive pointers
    activeVideo = incoming;
    inactiveVideo = outgoing;

    // After fade completes, pause the outgoing video to save resources
    setTimeout(() => {
      if (outgoing !== activeVideo) {
        outgoing.pause();
      }
    }, 700);
  };

  const playPromise = incoming.play();
  if (playPromise !== undefined) {
    playPromise.then(startTransition).catch(() => {
      // Fallback if browser requires readyState
      incoming.oncanplay = () => {
        incoming.oncanplay = null;
        incoming.play().then(startTransition).catch(startTransition);
      };
    });
  } else {
    startTransition();
  }
}

/**
 * Reset hero video back to default scenery video (debounced)
 * @param {number} delay - debounce time in ms (default 280ms)
 */
export function resetHeroVideo(delay = 280) {
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    if (currentVideoSrc !== DEFAULT_HERO_VIDEO) {
      switchHeroVideo(DEFAULT_HERO_VIDEO);
    }
  }, delay);
}

// Auto-run when ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideo);
  } else {
    initHeroVideo();
  }
}
