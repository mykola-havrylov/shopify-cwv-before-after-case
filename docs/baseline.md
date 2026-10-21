# Baseline customisations

The baseline is Dawn `v16.0.0` plus the kind of changes a store collects over a year or two of apps and quick fixes. Dawn's own files are unchanged except where listed in [`third-party-assets.md`](third-party-assets.md). Everything below runs locally: no external trackers, no real third-party scripts, no data collection, no request leaves the store domain and Shopify's CDN.

| #   | Customisation                           | Where                                                                                    | What it stands in for                                                                  |
| --- | --------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | Two synchronous scripts in `<head>`     | `assets/vendor-analytics.js`, `assets/vendor-tag-manager.js`, `layout/theme.liquid`      | An analytics tag and a tag manager container pasted into the layout without `defer`    |
| 2   | Images by absolute CDN URL, no `srcset` | `sections/hero-carousel.liquid`, `assets/theme-custom.css`, product cards and gallery    | Hand-written `<img>` and CSS backgrounds that point at the original upload             |
| 3   | No priority on the first-screen image   | `sections/hero-carousel.liquid`                                                          | A hero image with no `fetchpriority`, behind a carousel that reveals itself after load |
| 4   | jQuery carousel on the first screen     | `assets/jquery-3.7.1.min.js`, `assets/hero-carousel.js`, `sections/hero-carousel.liquid` | A slider plugin loaded for one component                                               |
| 5   | Reviews widget rendered late            | `assets/reviews-widget.js`                                                               | A reviews app that injects stars after its API answers, 1.2 s after load               |
| 6   | Autoplay video                          | `sections/promo-video.liquid`, `assets/hero-video.mp4`, `assets/hero-poster.jpg`         | A looping background video that starts on load                                         |
| 7   | Web fonts without `font-display`        | `layout/theme.liquid`                                                                    | `font_face` called without the `font_display` argument                                 |
| 8   | Global CSS                              | `assets/theme-custom.css`, `layout/theme.liquid`                                         | Page-specific stylesheets linked from the layout and loaded on every page              |
| 9   | Long interaction handler                | `assets/interaction-handlers.js`                                                         | A handler that recalculates layout metrics on variant change, add to cart and filters  |
| 10  | Excess resource hints                   | `layout/theme.liquid`                                                                    | Preconnects, DNS prefetches and preloads added "to be safe", on every page             |

## Details

- **Head scripts.** The two vendor-style scripts, the reviews widget, jQuery, the carousel and the interaction handlers are classic scripts without `defer` or `async`. Each vendor-style script blocks for a fixed time (70 ms and about 110 ms) with a busy wait; they only record events in memory.
- **Images.** The hero carousel uses absolute `cdn.shopify.com` URLs of the six slide files, with a `<picture>` that switches only between the mobile and the desktop original (1800×2250 and 3840×2160). The promo video section has a CSS `background-image` with an absolute URL. Product cards and the product gallery use `image_url` without a width, so they request the 3000×3750 originals, without `srcset`, `sizes`, dimensions or `loading="lazy"`.
- **Carousel.** Slides fade in and out, the container has a fixed aspect ratio, and the whole carousel stays `visibility: hidden` until jQuery has initialised it on document ready.
- **Reviews widget.** The ratings are derived from the product handle, so they are stable between runs. On the product page the block is inserted after the title, which moves the price and the add-to-cart button down; on cards it is appended to the card text.
- **Video.** A 10 second 1920×1080 clip, `autoplay muted loop playsinline`, with a poster. Source and license: [`third-party-assets.md`](third-party-assets.md).
- **Fonts.** The five `font_face` calls in the layout lose `font_display: 'swap'`, so the browser default applies.
- **Global CSS.** `theme-custom.css` and eight Dawn stylesheets that sections normally load for themselves are linked from the layout.
- **Interaction handler.** Variant change, the add-to-cart button and the filter buttons run a 180 ms loop that writes a style and reads `offsetHeight` on every element in `<main>`.
- **Resource hints.** Four preconnects and two DNS prefetches to Shopify hosts, and preloads for jQuery, the custom stylesheet, the video poster and the three slide images of the active viewport, on every page.

Theme Check is configured to ignore `ImgWidthAndHeight` for the three files with unsized images and `ParserBlockingScript` for the layout, so the baseline passes the CI gate at `--fail-level error`. See [`decisions.md`](decisions.md).
