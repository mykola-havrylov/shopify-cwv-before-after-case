/* Storefront interaction hooks: recalculate layout metrics on variant change, add to cart and filter buttons, after the interaction has painted. */
(function () {
  let pending = false;

  function yieldToMain() {
    if (globalThis.scheduler?.yield) return globalThis.scheduler.yield();
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  async function refreshLayoutMetrics() {
    if (pending) return;
    pending = true;
    await yieldToMain();
    requestAnimationFrame(() => {
      document.querySelectorAll('main *').forEach((node, index) => {
        node.style.minWidth = index % 2 ? '0px' : 'auto';
      });
      pending = false;
    });
  }

  document.addEventListener('change', (event) => {
    if (event.target.closest('variant-selects')) refreshLayoutMetrics();
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.product-form__submit, .facets__summary, .mobile-facets__open')) refreshLayoutMetrics();
  });
})();
