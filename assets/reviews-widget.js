/* Local stand-in for a reviews app: fills the reserved rating slots after a simulated API round trip. */
(function () {
  const RESPONSE_DELAY_MS = 1200;

  function ratingFor(handle) {
    let hash = 0;
    for (const char of handle) hash = (hash * 31 + char.charCodeAt(0)) % 997;
    return { stars: 3.5 + (hash % 16) / 10, count: 12 + (hash % 180) };
  }

  function fill(slot, handle) {
    const { stars, count } = ratingFor(handle);
    slot.setAttribute('role', 'img');
    slot.setAttribute('aria-label', `${stars.toFixed(1)} out of 5 stars, ${count} reviews`);
    slot.innerHTML = `<span class="reviews-widget__stars" style="--rating: ${stars.toFixed(1)}"></span><span class="reviews-widget__count">${stars.toFixed(1)} (${count} reviews)</span>`;
  }

  function mount() {
    document.querySelectorAll('.card__information [data-reviews-slot]').forEach((slot) => {
      const link = slot.closest('.card__information').querySelector('a[href*="/products/"]');
      if (link) fill(slot, link.getAttribute('href'));
    });

    const productSlot = document.querySelector('.reviews-widget--product[data-reviews-slot]');
    if (productSlot) fill(productSlot, window.location.pathname);
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(mount, RESPONSE_DELAY_MS);
  });
})();
