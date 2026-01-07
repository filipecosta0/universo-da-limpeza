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

  const products = [
    {
      name: 'Desinfetante Lavanda 2L',
      code: 'DES-201',
      category: 'Desinfetantes',
      price: null,
      image: '/assets/produtos/desinfetante-lavanda-2l.png',
    },
    {
      name: 'Detergente Neutro 500ml',
      code: 'DET-112',
      category: 'Limpeza',
      price: null,
      image: '/assets/produtos/detergente-neutro-500ml.png',
    },
    {
      name: 'Álcool 70% 1L',
      code: 'ALC-070',
      category: 'Químicos',
      price: null,
      image: '/assets/produtos/alcool-70-1l.png',
    },
    {
      name: 'Água Sanitária 2L',
      code: 'AGS-220',
      category: 'Limpeza',
      price: null,
      image: '/assets/produtos/agua-sanitaria-2l.png',
    },
  ];

  const catalogGrid = document.getElementById('catalog-grid');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogCategory = document.getElementById('catalog-category');
  const catalogCount = document.getElementById('catalog-count');
  const catalogPagination = document.getElementById('catalog-pagination');

  if (catalogGrid && catalogSearch && catalogCategory && catalogCount && catalogPagination) {
    const categories = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean).map((c) => String(c)))
    ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

    categories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catalogCategory.appendChild(opt);
    });

    const state = {
      q: '',
      category: '',
      page: 1,
      pageSize: 12,
    };

    function buildProductLink(p) {
      const base = normalized ? `https://wa.me/${normalized}` : link;
      const text = encodeURIComponent(`Olá! Gostaria de informações sobre ${p.name} - Cód. ${p.code}`);
      if (!normalized) return base;
      return `${base}?text=${text}`;
    }

    function formatPrice(value) {
      if (value == null || value === '') return '';
      const num = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
      if (!Number.isFinite(num)) return String(value);
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function matches(p) {
      const q = state.q.trim().toLowerCase();
      if (q) {
        const hay = `${p.name} ${p.code} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (state.category && p.category !== state.category) return false;
      return true;
    }

    function getFiltered() {
      return products.filter(matches);
    }

    function renderGrid(items) {
      catalogGrid.innerHTML = '';

      if (!items.length) {
        const empty = document.createElement('div');
        empty.className = 'muted';
        empty.textContent = 'Nenhum produto encontrado.';
        catalogGrid.appendChild(empty);
        return;
      }

      const frag = document.createDocumentFragment();

      items.forEach((p) => {
        const card = document.createElement('article');
        card.className = 'product';

        const media = document.createElement('div');
        media.className = 'product__media';

        const skeleton = document.createElement('div');
        skeleton.className = 'product__skeleton';

        const img = document.createElement('img');
        img.className = 'product__img is-loading';
        img.alt = p.name;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = p.image || '';

        function showImg() {
          img.classList.remove('is-loading');
          if (skeleton.parentNode) skeleton.parentNode.removeChild(skeleton);
        }

        img.addEventListener('load', showImg);
        img.addEventListener('error', () => {
          img.removeAttribute('src');
          img.classList.remove('is-loading');
          if (skeleton.parentNode) skeleton.parentNode.removeChild(skeleton);
        });

        media.appendChild(skeleton);
        media.appendChild(img);

        const body = document.createElement('div');
        body.className = 'product__body';

        const name = document.createElement('h3');
        name.className = 'product__name';
        name.textContent = p.name;

        const code = document.createElement('div');
        code.className = 'product__code';
        code.textContent = `Cód. ${p.code}`;

        const price = formatPrice(p.price);
        let priceEl = null;
        if (price) {
          priceEl = document.createElement('div');
          priceEl.className = 'product__price';
          priceEl.textContent = price;
        }

        const actions = document.createElement('div');
        actions.className = 'product__actions';

        const buy = document.createElement('a');
        buy.className = 'btn btn--primary btn--sm';
        buy.href = buildProductLink(p);
        buy.target = '_blank';
        buy.rel = 'noopener noreferrer';
        buy.textContent = 'Solicitar no WhatsApp';

        actions.appendChild(buy);

        body.appendChild(name);
        body.appendChild(code);
        if (priceEl) body.appendChild(priceEl);
        body.appendChild(actions);

        card.appendChild(media);
        card.appendChild(body);
        frag.appendChild(card);
      });

      catalogGrid.appendChild(frag);
    }

    function renderPagination(total) {
      catalogPagination.innerHTML = '';
      const pages = Math.max(1, Math.ceil(total / state.pageSize));
      state.page = Math.min(state.page, pages);

      if (pages <= 1) return;

      const prev = document.createElement('button');
      prev.className = 'page-btn';
      prev.type = 'button';
      prev.textContent = '←';
      prev.disabled = state.page === 1;
      prev.addEventListener('click', () => {
        state.page = Math.max(1, state.page - 1);
        render();
      });

      const next = document.createElement('button');
      next.className = 'page-btn';
      next.type = 'button';
      next.textContent = '→';
      next.disabled = state.page === pages;
      next.addEventListener('click', () => {
        state.page = Math.min(pages, state.page + 1);
        render();
      });

      catalogPagination.appendChild(prev);

      for (let i = 1; i <= pages; i += 1) {
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.type = 'button';
        btn.textContent = String(i);
        if (i === state.page) btn.setAttribute('aria-current', 'page');
        btn.addEventListener('click', () => {
          state.page = i;
          render();
        });
        catalogPagination.appendChild(btn);
      }

      catalogPagination.appendChild(next);
    }

    function render() {
      const filtered = getFiltered();
      catalogCount.textContent = `${filtered.length} produto${filtered.length === 1 ? '' : 's'}`;

      const pages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
      state.page = Math.min(state.page, pages);

      const start = (state.page - 1) * state.pageSize;
      const pageItems = filtered.slice(start, start + state.pageSize);

      renderGrid(pageItems);
      renderPagination(filtered.length);
    }

    catalogSearch.addEventListener('input', () => {
      state.q = catalogSearch.value;
      state.page = 1;
      render();
    });

    catalogCategory.addEventListener('change', () => {
      state.category = catalogCategory.value;
      state.page = 1;
      render();
    });

    render();
  }
})();
