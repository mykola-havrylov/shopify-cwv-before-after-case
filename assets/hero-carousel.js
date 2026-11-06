/* Home page hero carousel: CSS scroll snap track, arrows and dots scroll it, the dot of the visible slide is marked. */
document.querySelectorAll('[data-hero-carousel]').forEach((root) => {
  const track = root.querySelector('.hero-carousel__track');
  const dots = root.querySelectorAll('.hero-carousel__dot');
  let current = 0;
  let frame = 0;

  const scrollToSlide = (index) => {
    const count = dots.length;
    track.scrollTo({ left: ((index + count) % count) * track.clientWidth });
  };

  const markCurrent = () => {
    frame = 0;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    if (index === current || !dots[index]) return;
    dots[current].removeAttribute('aria-current');
    dots[index].setAttribute('aria-current', 'true');
    current = index;
  };

  track.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(markCurrent);
    },
    { passive: true },
  );

  root.querySelector('.hero-carousel__arrow--prev').addEventListener('click', () => scrollToSlide(current - 1));
  root.querySelector('.hero-carousel__arrow--next').addEventListener('click', () => scrollToSlide(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => scrollToSlide(index)));
});
