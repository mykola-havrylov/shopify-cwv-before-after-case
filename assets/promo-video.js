/* Promo video: loads and plays only while the section is on screen, with a pause button; poster only with reduced motion. */
document.querySelectorAll('[data-promo-video]').forEach((root) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const video = root.querySelector('video');
  const toggle = root.querySelector('.promo-video__toggle');
  let pausedByUser = false;

  toggle.addEventListener('click', () => {
    pausedByUser = !video.paused;
    if (pausedByUser) video.pause();
    else video.play().catch(() => {});
    toggle.textContent = pausedByUser ? root.dataset.labelPlay : root.dataset.labelPause;
  });

  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !pausedByUser) video.play().catch(() => {});
      else if (!entry.isIntersecting) video.pause();
    },
    { threshold: 0.25 },
  ).observe(root);

  toggle.hidden = false;
});
