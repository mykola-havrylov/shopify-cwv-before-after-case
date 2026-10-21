/* Local stand-in for a reviews app: renders star ratings after a simulated API round trip. */
(function () {
  const RESPONSE_DELAY_MS = 1200;

  function ratingFor(handle) {
    let hash = 0;
    for (const char of handle) hash = (hash * 31 + char.charCodeAt(0)) % 997;
    return { stars: 3.5 + (hash % 16) / 10, count: 12 + (hash % 180) };
  }

  function build(handle, className) {
    const { stars, count } = ratingFor(handle);
    const element = document.createElement('div');
    element.className = className;
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', `${stars.toFixed(1)} out of 5 stars, ${count} reviews`);
    element.innerHTML = `<span class="reviews-widget__stars" style="--rating: ${stars.toFixed(1)}"></span><span class="reviews-widget__count">${stars.toFixed(1)} (${count} reviews)</span>`;
    return element;
  }

  function mount() {
    document.querySelectorAll('.card-wrapper .card__information').forEach((information) => {
      const link = information.querySelector('a[href*="/products/"]');
      if (!link || information.querySelector('.reviews-widget')) return;
      information.appendChild(build(link.getAttribute('href'), 'reviews-widget reviews-widget--card'));
    });

    const title = document.querySelector('.product__info-container .product__title');
    if (title && !document.querySelector('.reviews-widget--product')) {
      title.insertAdjacentElement(
        'afterend',
        build(window.location.pathname, 'reviews-widget reviews-widget--product'),
      );
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.setTimeout(mount, RESPONSE_DELAY_MS);
  });
})();
