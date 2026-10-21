/* Local stand-in for a third-party analytics tag: runs synchronously, sends nothing. */
(function () {
  function spin(ms) {
    const end = performance.now() + ms;
    while (performance.now() < end);
  }

  const queue = [];
  spin(70);

  window.vendorAnalytics = {
    track(name, detail) {
      queue.push({ name, detail, at: Date.now() });
    },
  };

  document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button');
    if (target) window.vendorAnalytics.track('click', target.textContent.trim().slice(0, 40));
  });
})();
