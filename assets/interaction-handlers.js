/* Storefront interaction hooks: recalculate layout metrics on variant change, add to cart and filter buttons. */
(function () {
  const WORK_MS = 180;

  function refreshLayoutMetrics() {
    const nodes = document.querySelectorAll('main *');
    const end = performance.now() + WORK_MS;
    let index = 0;
    while (performance.now() < end && nodes.length > 0) {
      const node = nodes[index % nodes.length];
      node.style.minWidth = index % 2 ? '0px' : 'auto';
      void node.offsetHeight;
      index += 1;
    }
  }

  document.addEventListener('change', (event) => {
    if (event.target.closest('variant-selects')) refreshLayoutMetrics();
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.product-form__submit, .facets__summary, .mobile-facets__open')) refreshLayoutMetrics();
  });
})();
