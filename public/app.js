(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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
