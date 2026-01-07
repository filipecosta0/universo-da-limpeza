(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  const savedTheme = window.localStorage ? localStorage.getItem('theme') : null;
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      if (window.localStorage) localStorage.setItem('theme', next);
    });
  }

  const mobileNav = document.getElementById('mobile-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  function openNav() {
    if (!mobileNav) return;
    document.body.classList.add('nav-open');
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    if (!mobileNav) return;
    document.body.classList.remove('nav-open');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle) navToggle.addEventListener('click', openNav);
  if (navClose) navClose.addEventListener('click', closeNav);

  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeNav();
    });

    mobileNav.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', closeNav);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  const storeNumber = window.__WHATSAPP_STORE_NUMBER__ || '';
  const prefill = window.__WHATSAPP_PREFILL__ || 'Olá! Vim pela landing page da Universo da Limpeza e gostaria de atendimento.';

  const normalized = String(storeNumber).replace(/\D+/g, '');

  function buildWaLink() {
    const base = normalized ? `https://wa.me/${normalized}` : 'https://wa.me/';
    const text = encodeURIComponent(prefill);
    if (!normalized) return base;
    return `${base}?text=${text}`;
  }

  const link = buildWaLink();

  document.querySelectorAll('[data-whatsapp-cta]').forEach((el) => {
    el.setAttribute('href', link);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });
})();
