/* jQuery carousel for the home page hero: fade between slides, dots and arrows, autoplay. */
(function ($) {
  $.fn.heroCarousel = function (options) {
    const settings = $.extend({ interval: 5000 }, options);

    return this.each(function () {
      const $root = $(this);
      const $slides = $root.find('.hero-carousel__slide');
      const $dots = $root.find('.hero-carousel__dot');
      let current = 0;
      let timer = null;

      function show(index) {
        current = (index + $slides.length) % $slides.length;
        $slides.removeClass('is-active').eq(current).addClass('is-active');
        $dots.removeClass('is-active').eq(current).addClass('is-active');
      }

      function restart() {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(current + 1), settings.interval);
      }

      $root.on('click', '.hero-carousel__arrow--next', () => {
        show(current + 1);
        restart();
      });
      $root.on('click', '.hero-carousel__arrow--prev', () => {
        show(current - 1);
        restart();
      });
      $root.on('click', '.hero-carousel__dot', function () {
        show($dots.index(this));
        restart();
      });

      show(0);
      $root.addClass('is-ready');
      restart();
    });
  };

  $(function () {
    $('[data-hero-carousel]').heroCarousel({ interval: 5000 });
  });
})(window.jQuery);
