/**
 * TWO247 — Hero Motion Controller ("Tides in Motion" & "Journeys in Motion")
 * Faithfully adapts the Tidewell motion system:
 * - 3D Paper plane Catmull-Rom flight & landing
 * - 7 Travel pixel icons pop-in & sequential icon-to-letter morphing headline
 * - Painterly coastal art cards fanning across the bottom with staggered entrance
 * - Scroll-reactive scattering with per-card inertia & interactive 3D pointer tilt
 */

export function initHeroMotion() {
  const heroSection = document.getElementById('hero-motion-section');
  if (!heroSection) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const paperPlaneEl = document.getElementById('hero-paper-plane');
  const headlineGroupEl = document.getElementById('hero-headline-group');
  const wordRowEl = document.getElementById('hero-word-row');
  const morphGapEl = document.getElementById('hero-morph-gap');
  const iconRowEl = document.getElementById('hero-icon-row');
  const cardsStageEl = document.getElementById('hero-cards-stage');

  // Asset Configuration (Higgsfield Image Proxy & CloudFront)
  const ASSET_PREFIX = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
  function higgsUrl(srcFile, width) {
    return `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(ASSET_PREFIX + srcFile)}&w=${width}&q=85`;
  }

  const GRID_A = higgsUrl('hf_20261118_061436_77e1a13d-60a0-4746-bf7b-53b2365609f5.png', 900);
  const GRID_B = higgsUrl('hf_20261118_061435_8a1828bc-a149-44ea-80fd-c4c33eef7407.png', 900);
  const STICKER_PLANE = higgsUrl('hf_20261118_061547_979f8673-f904-4102-90a0-6458bce33bc8.png', 1200);

  // 6 Coastal Travel Cards Data
  const CARDS_DATA = [
    { grid: GRID_B, pos: '100% 100%', title: 'Dawn Waters', dest: 'Maldives' },
    { grid: GRID_A, pos: '100% 0%',   title: 'Lavender Isle', dest: 'Seychelles' },
    { grid: GRID_A, pos: '0% 100%',   title: 'Harbour Haven', dest: 'Mediterranean' },
    { grid: GRID_A, pos: '100% 100%', title: 'Golden Surf', dest: 'Bali & Tropics' },
    { grid: GRID_B, pos: '0% 0%',     title: 'Guiding Light', dest: 'Nordic Coast' },
    { grid: GRID_B, pos: '100% 0%',   title: 'Ocean Swell', dest: 'Dubai Marina' }
  ];

  // 7 Travel Pixel Icons (9x9 SVGs, shape-rendering: crispEdges)
  const ICON_DATA = [
    // 0: plane
    ['........k', '......kkb', '....kkwkb', '..kkwwkb.', 'kkwwwkbb.', '..kkkbb..', '....kb...', '....k....', '.........'],
    // 1: shell
    ['...kkk...', '..kbwbk..', '.kbwbwbk.', 'kbwbwbwbk', 'kwbwbwbwk', '.kbwbwbk.', '..kbbbk..', '...kkk...', '.........'],
    // 2: boat
    ['....k....', '....kb...', '....kbb..', '...wkbbb.', '..wwkbbb.', '....k....', 'kkkkkkkkk', '.kpppppk.', '..kkkkk..'],
    // 3: lighthouse
    ['...kkk...', '..kbbbk..', '...kwk...', '...kbk...', '...kwk...', '...kbk...', '..kwwwk..', '..kbbbk..', '.kkkkkkk.'],
    // 4: fish
    ['.........', '...kkk..k', '..kbbbkkk', '.kbwbbbbk', 'kbbbbbkkk', '.kbbbbk.k', '..kkkk...', '.........', '.........'],
    // 5: wave
    ['.........', '...kkk...', '..kbbbk..', '.kbwwbbk.', 'kbw..kbbk', 'kb....kbk', 'bbbbbbbbb', 'kkkkkkkkk', '.........'],
    // 6: sun
    ['....p....', '.p..k..p.', '...kpk...', '..kpppk..', 'pkpppppkp', '..kpppk..', '...kpk...', '.p..k..p.', '....p....']
  ];

  const ICON_COLORS = {
    k: '#071A2B',
    b: '#38BDF8',
    w: '#FFFFFF',
    p: '#F59E0B'
  };

  function renderPixelIcon(iconIndex) {
    const rows = ICON_DATA[iconIndex];
    let rects = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const ch = rows[r][c];
        if (ICON_COLORS[ch]) {
          rects += `<rect x="${c}" y="${r}" width="1.02" height="1.02" fill="${ICON_COLORS[ch]}" />`;
        }
      }
    }
    return `<svg viewBox="0 0 9 9" shape-rendering="crispEdges" width="100%" height="100%">${rects}</svg>`;
  }

  // Setup Paper Plane Sprite
  if (paperPlaneEl) {
    paperPlaneEl.style.backgroundImage = `url(${STICKER_PLANE})`;
  }

  // Headline Setup: "Journeys in Motion" (or "Tides in Motion")
  const HEADLINE_TEXT = "Journeys in Motion";
  const charElements = [];
  wordRowEl.innerHTML = '';
  for (let i = 0; i < HEADLINE_TEXT.length; i++) {
    const ch = HEADLINE_TEXT[i];
    if (ch === ' ') {
      const sp = document.createElement('span');
      sp.className = 'hero-char-space';
      wordRowEl.appendChild(sp);
      charElements.push(null);
    } else {
      const sp = document.createElement('span');
      sp.className = 'hero-char-span';
      sp.textContent = ch;
      if (isReducedMotion) {
        sp.style.clipPath = 'none';
        sp.style.opacity = '1';
      }
      wordRowEl.appendChild(sp);
      charElements.push(sp);
    }
  }

  // Pixel Icons Setup (7 slots)
  const iconBoxes = [];
  iconRowEl.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const box = document.createElement('div');
    box.className = 'hero-icon-box';
    box.innerHTML = renderPixelIcon(i);
    if (isReducedMotion) {
      box.style.display = 'none';
    } else {
      box.style.opacity = '0';
      box.style.transform = 'scale(0)';
    }
    iconRowEl.appendChild(box);
    iconBoxes.push(box);
  }

  // Cards Setup (6 Hero Cards)
  const cardElements = [];
  const cardStates = [];
  cardsStageEl.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const cEl = document.createElement('div');
    cEl.className = 'hero-motion-card';
    cEl.style.backgroundImage = `url(${CARDS_DATA[i].grid})`;
    cEl.style.backgroundPosition = CARDS_DATA[i].pos;

    // Inner Frosted Badge
    const badge = document.createElement('div');
    badge.className = 'hero-card-badge';
    badge.innerHTML = `
      <div class="text-[9px] uppercase tracking-wider text-amber-300 font-semibold truncate">${CARDS_DATA[i].dest}</div>
      <div class="text-[11px] font-bold text-white truncate leading-tight">${CARDS_DATA[i].title}</div>
    `;
    cEl.appendChild(badge);

    cardsStageEl.appendChild(cEl);
    cardElements.push(cEl);
    cardStates.push({
      currentX: 0, currentY: 0, currentRot: 0, currentScale: 1, currentOpacity: 0,
      targetX: 0, targetY: 0, targetRot: 0, targetScale: 1, targetOpacity: 0,
      entranceDone: isReducedMotion
    });
  }

  // Scaling System
  let W = window.innerWidth;
  let H = window.innerHeight;
  let isMobile = false;
  let u = 1, n = 1, hfs = 56, ic = 36, cw = 200;

  function updateScaling() {
    W = window.innerWidth;
    H = window.innerHeight;
    isMobile = (W < 820 && W < H * 1.1);

    u = Math.min(W / 1440, H / 800);
    n = isMobile ? Math.min(1, W / 560) : Math.min(Math.max(W / 1440, 0.62), 1.25);
    hfs = isMobile ? Math.min(W * 0.085, H * 0.075) : Math.min(W * 0.052, H * 0.095);
    ic = hfs * 0.62;
    cw = isMobile ? Math.min(W * 0.28, H * 0.18) : Math.min(W / 1440, H / 780) * 205;

    document.documentElement.style.setProperty('--u', `${u}px`);
    document.documentElement.style.setProperty('--n', `${n}`);
    document.documentElement.style.setProperty('--hfs', `${hfs}px`);
    document.documentElement.style.setProperty('--ic', `${ic}px`);
    document.documentElement.style.setProperty('--cw', `${cw}px`);
  }

  window.addEventListener('resize', updateScaling);
  updateScaling();

  // Mouse Parallax & Tilt
  let pointerX = 0;
  let pointerY = 0;
  heroSection.addEventListener('pointermove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });
  heroSection.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
  });

  // Math & Easing Helpers
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function backOut(t, s = 1.15) {
    const t1 = t - 1;
    return t1 * t1 * ((s + 1) * t1 + s) + 1;
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpPose(pA, pB, t) {
    return {
      x: lerp(pA.x, pB.x, t),
      y: lerp(pA.y, pB.y, t),
      rot: lerp(pA.rot, pB.rot, t),
      scale: lerp(pA.scale, pB.scale, t),
      opacity: lerp(pA.opacity, pB.opacity, t)
    };
  }

  // Catmull-Rom Spline
  function catmullRom(p0, p1, p2, p3, u) {
    return 0.5 * (
      (2 * p1) +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * (u * u) +
      (-p0 + 3 * p1 - 3 * p2 + p3) * (u * u * u)
    );
  }

  function catmullRomDeriv(p0, p1, p2, p3, u) {
    return 0.5 * (
      (-p0 + p2) +
      2 * (2 * p0 - 5 * p1 + 4 * p2 - p3) * u +
      3 * (-p0 + 3 * p1 - 3 * p2 + p3) * (u * u)
    );
  }

  // Paper Plane Flight Waypoints (Exact from Tidewell specification)
  const PLANE_PATH = [
    { t: 0.33, x: -3.0, y: 73.0 },
    { t: 0.45, x: 4.0,  y: 71.0 },
    { t: 0.60, x: 13.0, y: 65.0 },
    { t: 0.70, x: 22.0, y: 55.0 },
    { t: 0.80, x: 31.0, y: 44.0 },
    { t: 0.87, x: 32.5, y: 47.5 },
    { t: 0.93, x: 26.0, y: 48.0 },
    { t: 1.00, x: 21.5, y: 45.0 },
    { t: 1.07, x: 22.5, y: 51.5 },
    { t: 1.15, x: 27.0, y: 52.0 },
    { t: 1.27, x: 38.0, y: 41.0 } // target landing slot
  ];

  // Card Pose Calculation (Fan & Scatter)
  function getFanPose(i) {
    const stageRect = cardsStageEl.getBoundingClientRect();
    const sW = stageRect.width || W;
    const sH = stageRect.height || 300;

    const R = isMobile ? sW * 1.35 : 1250 * sW / 1440;
    const stepR = 2 * Math.asin((1.05 * cw) / (2 * R));
    const theta = (i - 2.5) * stepR;
    const cx = sW * 0.5;
    const cy = sH * 0.82 + R;

    let x = cx + R * Math.sin(theta);
    if (!isMobile) x -= sW * 0.015;
    let y = cy - R * Math.cos(theta);
    if (isMobile) y += cw * 0.15;
    const rot = theta * 180 / Math.PI;

    return { x, y, rot, scale: 1, opacity: 1 };
  }

  const SCATTER_DESKTOP = [
    { xf: 0.06, yf: 0.45, rot: -20 },
    { xf: 0.16, yf: 0.85, rot: -12 },
    { xf: 0.84, yf: 0.82, rot: 14 },
    { xf: 0.35, yf: 1.05, rot: -8 },
    { xf: 0.94, yf: 0.42, rot: 16 },
    { xf: 0.65, yf: 1.05, rot: 9 }
  ];

  const SCATTER_MOBILE = [
    { xf: 0.06, yf: 0.60, rot: -20 },
    { xf: 0.45, yf: 0.66, rot: 12 },
    { xf: 0.94, yf: 0.60, rot: 16 },
    { xf: 0.22, yf: 0.93, rot: -14 },
    { xf: 0.72, yf: 0.96, rot: 9 },
    { xf: 0.50, yf: 1.30, rot: 0 }
  ];

  function getScatterPose(i) {
    const sc = isMobile ? SCATTER_MOBILE[i] : SCATTER_DESKTOP[i];
    const sRect = cardsStageEl.getBoundingClientRect();
    const sW = sRect.width || W;
    const sH = sRect.height || 300;
    return {
      x: sc.xf * sW,
      y: sc.yf * sH,
      rot: sc.rot,
      scale: 0.95,
      opacity: 0.65
    };
  }

  // Staggered Entrance Times for Cards 5, 2, 0, 1, 3, 4
  const ENTRANCE_TIMES = {
    5: 0.53,
    2: 0.60,
    0: 0.63,
    1: 0.70,
    3: 0.80,
    4: 0.86
  };

  // Animation Loop
  const startTime = performance.now();
  let lastFrameTime = startTime;

  function tick(now) {
    const dt = Math.min(100, now - lastFrameTime);
    lastFrameTime = now;
    const t = (now - startTime) / 1000;

    // Scroll progress within Hero Section
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const heroH = heroSection.offsetHeight || H;
    const scrollProgress = Math.max(0, Math.min(1, scrollY / (heroH * 0.75)));

    // 1. PAPER PLANE FLIGHT & LANDING
    if (!isReducedMotion && paperPlaneEl) {
      const heroRect = heroSection.getBoundingClientRect();
      const iconRowRect = iconRowEl.getBoundingClientRect();
      const landingX = (iconRowRect.left > 0 ? iconRowRect.left - heroRect.left + ic * 0.5 : W * 0.5 - 3.2 * ic);
      const landingY = (iconRowRect.top > 0 ? iconRowRect.top - heroRect.top + ic * 0.5 : H * 0.35);

      PLANE_PATH[10].x = (landingX / W) * 100;
      PLANE_PATH[10].y = (landingY / H) * 100;

      if (t >= 0.33 && t <= 1.27) {
        paperPlaneEl.style.display = 'block';
        let segIdx = 0;
        for (let i = 0; i < PLANE_PATH.length - 1; i++) {
          if (PLANE_PATH[i].t <= t && t <= PLANE_PATH[i + 1].t) {
            segIdx = i;
            break;
          }
        }
        const p0 = PLANE_PATH[Math.max(0, segIdx - 1)];
        const p1 = PLANE_PATH[segIdx];
        const p2 = PLANE_PATH[segIdx + 1];
        const p3 = PLANE_PATH[Math.min(PLANE_PATH.length - 1, segIdx + 2)];
        const segU = (t - p1.t) / (p2.t - p1.t);

        const pxPct = catmullRom(p0.x, p1.x, p2.x, p3.x, segU);
        const pyPct = catmullRom(p0.y, p1.y, p2.y, p3.y, segU);
        const dX = catmullRomDeriv(p0.x, p1.x, p2.x, p3.x, segU);
        const dY = catmullRomDeriv(p0.y, p1.y, p2.y, p3.y, segU);
        const rotDeg = Math.atan2(dY * H, dX * W) * 180 / Math.PI + 18;

        const px = (pxPct / 100) * W;
        const py = (pyPct / 100) * H;
        paperPlaneEl.style.transform = `translate3d(${px - u * 31}px, ${py - u * 31}px, 0) rotate(${rotDeg}deg)`;
        paperPlaneEl.style.opacity = '1';
      } else if (t > 1.27 && t <= 1.33) {
        // Shrink to 0.6 and fade out into the pixel plane
        const landU = (t - 1.27) / 0.06;
        paperPlaneEl.style.transform = `translate3d(${landingX - u * 31}px, ${landingY - u * 31}px, 0) scale(${1 - 0.4 * landU})`;
        paperPlaneEl.style.opacity = `${1 - landU}`;
      } else if (t > 1.33) {
        paperPlaneEl.style.display = 'none';
      }
    }

    // 2. PIXEL ICONS POP-IN (1.27s - 1.70s)
    if (!isReducedMotion) {
      if (t >= 1.27) {
        // Icon 0 (plane) appears as paper plane finishes landing
        if (t >= 1.27 && t <= 1.9) {
          const ic0U = Math.min(1, (t - 1.27) / 0.06);
          iconBoxes[0].style.opacity = `${ic0U}`;
          iconBoxes[0].style.transform = 'scale(1)';
        }
        // Icons 1 to 6 pop in sequentially
        for (let j = 0; j < 6; j++) {
          const tPop = 1.27 + (0.03 + j * 0.07);
          if (t >= tPop && t <= 1.9) {
            const popU = (t - tPop) / 0.32;
            if (popU > 0) {
              const scaleVal = backOut(Math.min(1, popU), 2.2);
              const fadeVal = Math.min(1, (t - tPop) / 0.12);
              iconBoxes[j + 1].style.opacity = `${fadeVal}`;
              iconBoxes[j + 1].style.transform = `scale(${scaleVal})`;
            }
          }
        }
      }

      // 3. ICON-TO-LETTER MORPH (1.9s -> ~5.2s)
      if (t >= 1.9) {
        const morphStep = Math.floor((t - 1.9) / 0.22);
        const totalChars = charElements.length;

        for (let c = 0; c < totalChars; c++) {
          const charEl = charElements[c];
          if (!charEl) continue; // space
          const stepStart = 1.9 + c * 0.22;
          if (t >= stepStart + 0.22) {
            charEl.style.clipPath = 'inset(0 0% 0 0)';
            charEl.style.opacity = '1';
          } else if (t >= stepStart) {
            const stepTau = (t - stepStart) / 0.22;
            let wipeU = 0;
            if (stepTau > 0.90) wipeU = 1;
            else if (stepTau > 0.32) wipeU = (stepTau - 0.32) / (0.90 - 0.32);
            charEl.style.clipPath = `inset(0 ${(1 - wipeU) * 100}% 0 0)`;
            charEl.style.opacity = '1';
          } else {
            charEl.style.clipPath = 'inset(0 100% 0 0)';
          }
        }

        // Remaining icons: ceil(7 * lettersLeft / 16)
        const lettersLeft = Math.max(0, totalChars - 1 - morphStep);
        const iconsRemaining = Math.max(0, Math.min(7, Math.ceil(7 * lettersLeft / 16)));

        for (let k = 0; k < 7; k++) {
          const box = iconBoxes[k];
          if (k < iconsRemaining) {
            box.style.display = 'inline-flex';
            box.style.transform = 'scale(1) rotate(0deg)';
            box.style.filter = 'brightness(1)';
            box.style.opacity = '1';
          } else if (k === iconsRemaining && morphStep < totalChars) {
            // Leftmost icon currently being consumed
            box.style.display = 'inline-flex';
            const stepStart = 1.9 + morphStep * 0.22;
            const stepTau = Math.min(1, Math.max(0, (t - stepStart) / 0.22));
            if (stepTau < 0.45) {
              const p1 = stepTau / 0.45;
              const sY = 1 - 0.84 * p1;
              const sX = 1 + 0.25 * p1;
              const rDeg = -28 * p1;
              const bVal = 1 - p1;
              box.style.transform = `scale(${sX}, ${sY}) rotate(${rDeg}deg)`;
              box.style.filter = `brightness(${bVal})`;
              box.style.opacity = '1';
            } else {
              const p2 = (stepTau - 0.45) / 0.55;
              const rDeg = -28 - 62 * p2;
              box.style.transform = `scale(1.25, 0.16) rotate(${rDeg}deg)`;
              box.style.filter = 'brightness(0)';
              box.style.opacity = `${1 - p2}`;
            }
          } else {
            box.style.display = 'none';
          }
        }

        if (iconsRemaining === 0) {
          morphGapEl.style.width = '0px';
          iconRowEl.style.display = 'none';
        }
      }
    }

    // 4. CARDS CHOREOGRAPHY & INERTIA
    const sH = cardsStageEl.offsetHeight || 300;
    for (let i = 0; i < 6; i++) {
      const card = cardStates[i];
      let targetPose;

      if (scrollProgress <= 0.05) {
        targetPose = getFanPose(i);
      } else {
        const blendT = easeInOutCubic(Math.min(1, (scrollProgress - 0.05) / 0.70));
        const fanP = getFanPose(i);
        const scP = getScatterPose(i);
        targetPose = lerpPose(fanP, scP, blendT);
        // Fade out cards as user scrolls well into the next section
        if (scrollProgress > 0.45) {
          targetPose.opacity = Math.max(0, 1 - (scrollProgress - 0.45) * 2.5);
        }
      }

      // Add gentle pointer tilt / parallax
      const tiltX = pointerY * 4;
      const tiltY = -pointerX * 5;
      const shiftX = pointerX * (10 + i * 3);
      const shiftY = pointerY * (6 + i * 2);

      targetPose.x += shiftX;
      targetPose.y += shiftY;
      targetPose.rot += (pointerX * 2);

      card.targetX = targetPose.x;
      card.targetY = targetPose.y;
      card.targetRot = targetPose.rot;
      card.targetScale = targetPose.scale;
      card.targetOpacity = targetPose.opacity;

      // Staggered Entrance Animation (t < 2.0s, order 5, 2, 0, 1, 3, 4)
      if (!isReducedMotion && t < 2.0 && scrollProgress < 0.01) {
        const eStart = ENTRANCE_TIMES[i];
        if (t < eStart) {
          card.currentX = targetPose.x;
          card.currentY = sH + cw * 1.2;
          card.currentRot = targetPose.rot + 8;
          card.currentOpacity = 1;
        } else {
          const eU = Math.min(1, (t - eStart) / 0.7);
          const eEase = backOut(eU, 1.15);
          card.currentX = targetPose.x;
          card.currentY = (sH + cw * 1.2) + (targetPose.y - (sH + cw * 1.2)) * eEase;
          card.currentRot = (targetPose.rot + 8) + (targetPose.rot - (targetPose.rot + 8)) * eEase;
          card.currentOpacity = 1;
          if (eU >= 1) card.entranceDone = true;
        }
      } else if (scrollProgress < 0.01 && card.entranceDone && !pointerX && !pointerY) {
        card.currentX = targetPose.x;
        card.currentY = targetPose.y;
        card.currentRot = targetPose.rot;
        card.currentScale = targetPose.scale;
        card.currentOpacity = targetPose.opacity;
      } else {
        // Per-card inertia: k = 1 - (1 - w)^(dt / 16.67)
        const wInertia = 0.055 + (i % 4) * 0.008;
        const kInertia = 1 - Math.pow(1 - wInertia, dt / 16.67);
        card.currentX += (targetPose.x - card.currentX) * kInertia;
        card.currentY += (targetPose.y - card.currentY) * kInertia;
        card.currentRot += (targetPose.rot - card.currentRot) * kInertia;
        card.currentScale += (targetPose.scale - card.currentScale) * kInertia;
        card.currentOpacity += (targetPose.opacity - card.currentOpacity) * kInertia;
      }

      // Apply transform & 3D tilt to card element
      cardElements[i].style.transform = `translate3d(${card.currentX}px, ${card.currentY}px, 0) rotate(${card.currentRot}deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${card.currentScale})`;
      cardElements[i].style.opacity = `${card.currentOpacity}`;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
