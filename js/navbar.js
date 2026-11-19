/**
 * TWO247 — Navbar Scroll & State Handler
 * Follows MotionSites minimalist editorial standard:
 * Active link: text-[#000000], non-active links: text-[#6F6F6F] hover:text-[#000000]
 * Manages clean white backdrop-blur transitions, brand logos, and mobile toggle styling.
 */
export function initNavbar() {
  const navbar = document.getElementById('navbar') || document.getElementById('main-navbar');
  const navLogo = document.getElementById('nav-logo');
  if (!navbar) return;

  // Prevent multiple bindings
  if (navbar.dataset.navbarInitialized === 'true') return;
  navbar.dataset.navbarInitialized = 'true';

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const isSubfolder = (navLogo && navLogo.getAttribute('src')?.startsWith('../')) || 
                      (window.location.pathname.includes('/destinations/') || 
                       window.location.pathname.includes('/packages/') || 
                       window.location.pathname.includes('/blog/') || 
                       window.location.pathname.includes('/pages/') ||
                       window.location.pathname.includes('/destination/') ||
                       window.location.pathname.includes('/package/'));
  const prefix = isSubfolder ? '../' : '';

  // Identify active page based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = navbar.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href')?.split('/').pop()?.split('?')[0];
    if (linkHref && (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html'))) {
      link.dataset.active = 'true';
      link.classList.remove('text-[#6F6F6F]', 'text-slate-500', 'text-white', 'text-brand-orange');
      link.classList.add('text-[#000000]', 'font-semibold');
    } else {
      link.classList.remove('text-[#000000]', 'text-brand-orange');
      link.classList.add('text-[#6F6F6F]', 'hover:text-[#000000]');
    }
  });

  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    const linkHref = link.getAttribute('href')?.split('/').pop()?.split('?')[0];
    if (linkHref && (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html'))) {
      link.dataset.active = 'true';
      link.classList.remove('text-[#6F6F6F]', 'text-slate-800', 'text-brand-navy', 'text-brand-orange');
      link.classList.add('text-[#000000]', 'font-semibold');
    } else {
      link.classList.remove('text-[#000000]', 'text-brand-orange');
      link.classList.add('text-[#6F6F6F]', 'hover:text-[#000000]');
    }
  });

  const handleScroll = () => {
    const isScrolled = window.scrollY > 20;
    if (isScrolled) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-slate-100');
      navbar.classList.remove('bg-transparent');

      // Update mobile menu button icon color for high contrast
      if (mobileBtn) {
        mobileBtn.classList.remove('text-white');
        mobileBtn.classList.add('text-[#000000]');
      }

      // Switch to clean logo if image tag exists
      if (navLogo) {
        navLogo.src = `${prefix}assets/logo/two247-logo-transparent.png`;
      }
    } else {
      // Default top position
      navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'border-b', 'border-slate-100');
      navbar.classList.remove('shadow-sm');

      if (mobileBtn) {
        mobileBtn.classList.remove('text-white');
        mobileBtn.classList.add('text-[#000000]');
      }

      if (navLogo) {
        navLogo.src = `${prefix}assets/logo/two247-logo-transparent.png`;
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

// Auto-run if loaded directly in DOM
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
}
