/**
 * TWO247 — Navbar Scroll & State Handler
 * Matches index.html navbar behavior across all pages.
 * Manages transparent-to-solid transitions, shadows, logo switching, and mobile button styling.
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
  const isAlwaysSolid = navbar.dataset.solid === 'true';

  // Identify active page based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = navbar.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href')?.split('/').pop()?.split('?')[0];
    if (linkHref && (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html'))) {
      link.dataset.active = 'true';
      link.classList.add('text-brand-orange');
      link.classList.remove('text-white');
    }
  });

  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    const linkHref = link.getAttribute('href')?.split('/').pop()?.split('?')[0];
    if (linkHref && (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html'))) {
      link.classList.add('text-brand-orange');
      link.classList.remove('text-brand-navy');
    }
  });

  const handleScroll = () => {
    const isScrolled = window.scrollY > 40 || isAlwaysSolid;
    if (isScrolled) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-3.5', 'border-b', 'border-slate-100');
      navbar.classList.remove('bg-transparent', 'py-5');

      // Light navbar: non-active links turn dark text
      navLinks.forEach(link => {
        if (link.dataset.active === 'true') {
          link.classList.add('text-brand-orange');
          link.classList.remove('text-white', 'text-brand-text');
        } else {
          link.classList.remove('text-white');
          link.classList.add('text-brand-text', 'hover:text-brand-orange');
        }
      });

      // Update mobile menu button icon color for high contrast
      if (mobileBtn) {
        mobileBtn.classList.remove('text-white');
        mobileBtn.classList.add('text-brand-navy');
      }

      // Switch to color/dark logo
      if (navLogo) {
        navLogo.src = `${prefix}assets/logo/two247-logo-transparent.png`;
      }
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-3.5', 'border-b', 'border-slate-100');
      navbar.classList.add('bg-transparent', 'py-5');

      // Transparent hero navbar: non-active links turn white
      navLinks.forEach(link => {
        if (link.dataset.active === 'true') {
          link.classList.add('text-brand-orange');
          link.classList.remove('text-white', 'text-brand-text');
        } else {
          link.classList.add('text-white', 'hover:text-brand-orange');
          link.classList.remove('text-brand-text');
        }
      });

      if (mobileBtn) {
        mobileBtn.classList.add('text-white');
        mobileBtn.classList.remove('text-brand-navy');
      }

      // Switch to white logo
      if (navLogo) {
        navLogo.src = `${prefix}assets/logo/two247-logo-white.png`;
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
