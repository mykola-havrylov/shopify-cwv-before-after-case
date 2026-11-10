# Decisions

## 1. Dawn v16.0.0 as the base theme, not Horizon

**Decision.** The theme is imported from Dawn tag `v16.0.0` (commit `bc39a7d2024f1e5c14c42f855bd3552b4913e204`), without Dawn's history.

**Reasons.**

- **Stable, versioned reference.** Dawn publishes tagged releases; `v16.0.0` (2026-08-10) is the latest release on 2026-10-15. A fixed tag makes the "Dawn stock" control point reproducible. The public Horizon repository has no tags or releases on the same date and receives continuous commits, so a pinned Horizon state would be an arbitrary commit.
- **Comparability.** Dawn is Shopify's reference theme for Online Store 2.0, and many existing stores run Dawn or themes derived from it. Typical customisations (carousels, review widgets, extra scripts, hardcoded images) map directly onto Dawn's sections and snippets, so the before/after result carries over to such stores.
- **Architecture.** Horizon is built around theme blocks (blocks defined at theme level and nested inside each other). That is a different structure, not a later version of Dawn, and would mix architecture effects into the measurements.

**Sources (checked 2026-10-15).**

- Dawn releases: https://github.com/Shopify/dawn/releases/tag/v16.0.0
- Dawn repository: https://github.com/Shopify/dawn
- Horizon repository: https://github.com/Shopify/horizon
- Theme blocks: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks

## 2. Measurement methodology

**Decision.** Lighthouse 13.5.0 from npm, pinned; 5 runs per URL; per-metric median; mobile primary, desktop separate; default Lighthouse throttling presets; `pb=0` on every URL; the published theme measured on the `myshopify.com` domain with the storefront password, unpublished themes on the same domain with `preview_theme_id=<id>`; served theme id checked before every series; Lighthouse/Chrome/OS versions, date, URL and theme id stored with every result. Details: [`perf/README.md`](../perf/README.md). Budgets fixed before the first optimisation: [`perf/budget.md`](../perf/budget.md).

**Reasons.**

- Shopify recommends at least three runs per URL and the median, because a single run can vary by 5 to 10 points. Five runs narrow the spread further at acceptable cost.
- Shopify's summary speed score weights home 17 %, product 40 %, collection 43 %; the Theme Store requires a plain average of at least 60 across those pages on mobile and desktop. Both are reported, separately from the per-metric tables.
- The preview bar is hidden with `pb=0`, as Shopify's testing guide says.
- Unpublished themes are measured on the store domain with `preview_theme_id=<id>`, the preview link form that `shopify theme dev` prints for its development theme. The storefront password is still required. Shopify answers a `preview_theme_id` request with a redirect that drops the parameter and keeps the preview in the session cookie, and headless Chrome with a fixed `Cookie` header does not follow that redirect to the preview, so the runner activates the preview once in its own session and measures the plain URL with the same cookie. The URL does not guarantee which theme is rendered, so the runner reads `Shopify.theme.id` from the served page and fails unless it matches the requested theme id.
- The local server of `shopify theme dev` (`127.0.0.1`) is never measured: it proxies and hot-reloads, so it is not the theme as served by Shopify's storefront. A development theme's preview link is measured only while its files are not changing; it is deleted on `shopify auth logout`, so a frozen state is measured from an unpublished theme instead.
- TBT is a lab proxy for responsiveness, not INP. The store is password-protected and has no traffic, so the Web Performance Dashboard and CrUX have no field data for it.
- The storefront password is sent through the documented `storefront_password` form (`POST /password` with a `password` field) and read from the environment, never from a file in the repository.

**Sources (checked 2026-10-15).**

- Testing for performance: https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance
- Theme Store requirements: https://shopify.dev/docs/storefronts/themes/store/requirements
- `theme dev` (development theme, preview link, deletion on logout): https://shopify.dev/docs/api/shopify-cli/theme/theme-dev
- Shopify Lighthouse CI: https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci
- Password template: https://shopify.dev/docs/storefronts/themes/architecture/templates/password
- `form` tag, `storefront_password`: https://shopify.dev/docs/api/liquid/tags/form

## 3. Formatting and linting of imported Dawn files

**Decision.** Prettier skips Dawn's theme directories (`assets/*`, `config/*`, `layout/*`, `locales/*`, `sections/*`, `snippets/*`, `templates/*`); new own files there are added back with `!` entries in `.prettierignore`. ESLint lints all `assets/**/*.js`, but for the 36 JavaScript files imported from Dawn it turns off `no-undef`, `no-unused-vars`, `no-redeclare`, `no-self-assign` and `no-useless-assignment`. Theme Check runs `theme-check:recommended`; the only exceptions are two checks ignored for the files that carry the deliberate baseline problems (see decision 7).

**Reasons.**

- Prettier with the Liquid plugin would rewrite 256 Dawn files. Keeping upstream formatting keeps every later diff limited to real changes, which is what the before/after comparison shows.
- Dawn's scripts are classic scripts that share top-level functions and constants across files (`debounce`, `publish`, `PUB_SUB_EVENTS` and others), which ESLint reports as undefined or unused per file. The other findings are upstream code. New JavaScript gets the full recommended rule set.
- On the imported Dawn code `theme-check:recommended` reports 0 errors (9 warnings), so no check had to be disabled for it.

## 4. Demo catalog created through the Admin API

**Decision.** Products, variants, images, collections and menus are created by `npm run catalog:seed` from `data/products.csv`, `data/images/prompts.json` and `scripts/src/catalog.js`; nothing is entered by hand in the Shopify admin. `npm run catalog:verify` checks the store against the same files.

**Reasons.**

- The catalog is part of the measurement setup: every theme state is measured against the same products, images and pages, and a fresh store can be rebuilt identically.
- The script authenticates as a Dev Dashboard app with the client credentials grant; the token is requested at run time and kept in memory only. The grant works only for stores in the same organization as the app.
- Admin API version `2026-10` (the latest stable on 2026-10-15) is pinned. The client fails if Shopify serves a different version, because Shopify otherwise falls forward silently. Throttled requests are retried after the wait the cost data allows.
- Writes are idempotent: products are saved with `productSet` keyed by handle; collections are looked up by handle before `collectionCreate`; images are matched by alt text and uploaded through staged uploads only when missing; slides are matched by file name in Content > Files; menus are looked up by handle and updated with `menuUpdate` only when their items differ (a new store already has `main-menu` and `footer`), `menuCreate` only when a handle is missing.
- Collections are automated (`sources` with a product type condition), so membership follows the CSV.

**Sources (checked 2026-10-15).**

- Client credentials grant: https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant
- API versioning: https://shopify.dev/docs/api/usage/versioning
- `productSet`: https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productSet
- Collections with sources: https://shopify.dev/docs/apps/build/product-merchandising/products-and-collections/use-new-collections-model
- `menuUpdate`: https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/menuUpdate
- `menuCreate`: https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/menuCreate

## 5. Inventory is not tracked

**Decision.** Every variant is created with inventory tracking off (`inventoryItem.tracked: false`); `catalog:verify` fails if a variant is tracked or not available for sale.

**Reasons.**

- An untracked variant never goes out of stock, so product pages always render the add-to-cart state that is measured, never "Sold out". Checking that products are purchasable is a precondition of every measurement series.
- Stock levels are not part of this case; tracking them would only add a way for the measured page to change between runs.

## 6. Large original images

**Decision.** Product images are 3000x3750 px, carousel slides 3840x2160 (desktop) and 1800x2250 (mobile), JPEG of 0.5 to 2 MB. The seed and its dry run reject files outside the exact size or weight range.

**Reasons.**

- Merchants upload large camera or stock originals. The unoptimised theme references them directly, which is part of the problem being measured.
- The optimised theme uses the same files through `image_url` with explicit widths, so the difference comes from how the theme requests images, not from different source files. Shopify's CDN chooses the delivered format itself; no format conversion is claimed as an optimisation.

## 7. Theme Check exceptions for the baseline

**Decision.** `.theme-check.yml` ignores `ImgWidthAndHeight` for `sections/hero-carousel.liquid`, `snippets/card-product.liquid` and `snippets/product-media.liquid`, and `ParserBlockingScript` for `layout/theme.liquid`. Each entry is removed in the commit that fixes the file.

**Reasons.**

- Both checks are errors in `theme-check:recommended`, and the CI gate runs at `--fail-level error`. The baseline problems (images without dimensions, scripts without `defer` in the head) are exactly what these checks report.
- The ignores are limited to the files that carry the problem, so any new offence elsewhere still fails the gate, and a removed ignore shows in the diff next to the fix.

## 8. Requests are counted as theme requests

**Decision.** The request budget applies to "theme requests": the page document, files under `/cdn/shop/` on the store domain, and files under `/s/files/` on `cdn.shopify.com` (hard-coded file URLs). The total number of requests is still recorded as "All requests". The budget values in `perf/budget.md` did not change.

**Reasons.**

- Lighthouse on Dawn stock reports 355–377 requests per page, against a budget of 80. About 160 of them go to `/cdn/shopifycloud/checkout-web/`, about 75 to Shop Pay scripts, and about 30 to Shopify telemetry. These are the same on Dawn stock and on the baseline (160 and 163 checkout requests), so no theme change moves them.
- Counting only the requests the theme controls gives 45–50 on Dawn stock and 60–70 on the baseline, so the number reflects what the theme adds.
- Dawn stock and the baseline were measured again with the metric in place, so every row is the median of 5 runs.

## 9. Theme scripts deferred, vendor-style scripts loaded after load or on interaction

**Decision.** The layout loads jQuery, the reviews widget, the carousel and the interaction handlers with `defer`. The analytics-style and tag-manager-style scripts are added by a small inline loader on the first `pointerdown`, `keydown`, `scroll` or `touchstart`, or after the `load` event through `requestIdleCallback`, whichever comes first. No classic script without `defer` or `async` is left in the layout, and `ParserBlockingScript` is no longer ignored in `.theme-check.yml`.

**Reasons.**

- Shopify recommends `defer` for theme scripts, which keeps the parser and the preload scanner running, and loading analytics and tracking after `DOMContentLoaded` or on interaction.
- Loading the vendor-style scripts after `load` keeps them on every page view: they are deferred, not removed, so their events are still recorded for visitors who do not interact.
- A/B measurement, 5 runs, published theme before and development theme after, same session: mobile FCP on home fell from 3.43 s to 1.87 s and product LCP from 12.93 s to 3.18 s in 4 of 5 runs (one run stayed at 12.09 s). Mobile TBT rose from 134 to 351 ms on home and from 48 to 354 ms on product, because the two vendor-style scripts now run after first paint, inside the window that TBT counts, instead of before it. Home LCP, score and weight are `within run-to-run variance`. Results: `perf/results/o01-control/` and `perf/results/o01/`.

**Sources (checked 2026-10-26).**

- Use defer and async on non-critical scripts: https://shopify.dev/docs/storefronts/themes/best-practices/performance/defer-scripts
- Defer render-blocking CSS and JavaScript (analytics and tracking row): https://shopify.dev/docs/storefronts/themes/best-practices/performance/defer-non-critical-resources

## 10. Responsive images through `image_picker`, `image_url` and `image_tag`

**Decision.** The carousel slides are theme blocks with `image_picker` settings. Each slide renders a `<picture>` with a mobile `<source>` (`srcset` of 750, 1125 and 1500 px, `sizes="100vw"`) and a desktop `image_url | image_tag` with `widths`, `sizes`, `width`, `height` and the alt text of the file; the first slide is `eager`, the others `lazy`. The product card and the product gallery snippets are back to Dawn `v16.0.0`. The CSS `background-image` with an absolute URL behind the promo video is removed, because the poster covers it. The `ImgWidthAndHeight` ignores are removed from `.theme-check.yml`, which now only extends `theme-check:recommended`.

**Reasons.**

- `image_tag` generates a `srcset` and the `width` and `height` attributes, and Shopify recommends a `sizes` value that matches the rendered width so the browser does not fetch the largest candidate.
- `image_picker` returns an image object, keeps the focal point and alt text of the file, and removes the hard-coded CDN URLs from the section. Template values use `shopify://shop_images/<file name>`.
- A/B measurement, 5 runs, published theme before and development theme after, same session. Page weight fell from 13024 to 11405 KiB on home and from 3844 to 3120 KiB on the product page (mobile). Home LCP fell from 16.48 s to 10.70 s on mobile and from 3.37 s to 1.73 s on desktop. Product mobile LCP is 3.18 s in all 5 runs, against 12.62 s in 4 of 5 control runs. TBT, CLS and the scores on mobile home and desktop product are `within run-to-run variance`. Results: `perf/results/o02-control/` and `perf/results/o02/`.
- The six slide preloads in the layout are unchanged, so home still downloads the originals of the slides through them next to the new `srcset` candidates; the gain on home is therefore smaller than the weight of the images suggests.
- The control of this series runs the code of decision 9 and shows the product page LCP in two states, 12.6 s in 4 of 5 runs and 2.9 s in one. The gain reported for decision 9 on that page (4 of 5 runs at about 3.1 s) is therefore not a stable result of that change.

**Sources (checked 2026-10-27).**

- Serve correctly sized images with srcset and sizes: https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-responsive-images
- `image_tag`: https://shopify.dev/docs/api/liquid/filters/image_tag
- `image_picker` setting: https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings

## 11. Theme Check runs the pinned Shopify CLI directly in CI

**Decision.** The CI job runs `npx --yes @shopify/cli@5.0.1 theme check --fail-level error` instead of the `shopify/theme-check-action` GitHub Action.

**Reasons.**

- The action installs the latest `@shopify/cli` on every run (`npm install --no-package-lock --no-save @shopify/cli`) and then reads the JSON report of `theme check` as a list. Shopify CLI 5.0.0 changed that report to an object (`valid`, `issues`, `errorCount`, `warningCount`, `infoCount`), so the action fails with `e.filter is not a function` before it reports anything, regardless of the theme.
- Pinning the CLI version makes the check repeatable: the same commit gives the same result on every run until the version is changed on purpose. On 5.0.1 the check gives the same result as on 4.9.4: 0 errors and 21 warnings.
- The check keeps its exit code, so `--fail-level error` still fails the job; the inline annotations on the pull request that the action created are no longer produced.

## 12. `fetchpriority="high"` on the verified LCP image

**Decision.** The first hero slide image on the home page and the first product image on the product page carry `fetchpriority="high"`; every other image keeps the browser default. The product snippet sets it only when the image is first and not lazy-loaded, so each page has exactly one.

**Reasons.**

- The LCP element was taken from the Lighthouse results of decision 10 (`lcp-discovery-insight`), not assumed: the first slide image (`img.hero-carousel__image`) on home, mobile and desktop, and the first gallery image (`img.image-magnify-lightbox`) on the product page. Both were discoverable in the HTML and eagerly loaded; neither had a priority hint.
- Shopify recommends `fetchpriority="high"` on the LCP image only, one per page, never together with `loading="lazy"`.
- A/B measurement, 5 runs, published theme before and development theme after, same session. Lighthouse now reports the hint as applied and the LCP request at `High` priority instead of `Medium`. LCP, score, TBT, CLS and weight on home and product, mobile and desktop, are `within run-to-run variance`: home mobile LCP 10.36–11.05 s before and 10.35–11.30 s after; the product page on mobile keeps two states (about 3 s and about 8.6 s) in both series. Results: `perf/results/o03-control/` and `perf/results/o03/`.
- The LCP image already started early, and most of its LCP time is element render delay (about 1.9 to 2.1 s observed on home mobile). The six slide preloads in the layout, which also load on the product page, are left for the resource hints change.

**Sources (checked 2026-11-06).**

- Mark the LCP image with `fetchpriority="high"`: https://shopify.dev/docs/storefronts/themes/best-practices/performance/set-fetchpriority-high-on-lcp-image
- `image_tag`: https://shopify.dev/docs/api/liquid/filters/image_tag

## 13. Hero carousel on CSS scroll snap, jQuery removed

**Decision.** The hero slides sit in a horizontal track with `scroll-snap-type: x mandatory`; swiping, the arrows and the dots scroll it. A vanilla script of about 30 lines, loaded with `defer` from the section and so only on pages that render it, wires the arrows and dots and marks the dot of the visible slide with `aria-current`. The carousel is visible from the first paint. Slides change on user action only; autoplay is removed. jQuery, its preload and its script tag are removed from the layout, and the file is deleted from `main`.

**Reasons.**

- The jQuery carousel kept the whole hero at `visibility: hidden` until the plugin had run after jQuery, so the LCP image was downloaded early but painted only after two deferred scripts. In the control run below, element render delay is 513 ms of the observed home mobile LCP; with the change it is 29 ms.
- jQuery was used by the carousel only. Native scroll snap gives swipe and snapping without a library; the script only handles clicks and the current dot.
- Without autoplay the carousel needs no pause control for WCAG 2.2.2 and runs no timer on the main thread.
- A/B measurement, 5 runs, published theme before and development theme after, same session. Home mobile LCP fell from 10.41 s to 3.10 s (median; 9.89–10.61 s before, 3.03–3.18 s in 4 of 5 runs after, one run at 9.18 s) and the score from 55 to 83. Home desktop LCP fell from 2.21 s to 0.81 s and the score from 79 to 98. Theme requests fell by one on home and by two on the product page. TBT, weight and the product page metrics are `within run-to-run variance`; the product page on mobile keeps its two states (about 2.8 s and about 8.3 s) in both series. Results: `perf/results/o04-control/` and `perf/results/o04/`.
- Home CLS rose from 0 to 0.013 on mobile and 0.010 on desktop, in every run. The shifted element is the slide caption: the hero height uses `--header-height`, which the Dawn header sets from JavaScript after the first paint, so the visible hero shrinks once by the header height. The same shift happened before, while the hero was still hidden, and was not counted. It is left for the change that reserves layout space.

**Sources (checked 2026-11-06).**

- CSS scroll snap: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap
- Use defer and async on non-critical scripts: https://shopify.dev/docs/storefronts/themes/best-practices/performance/defer-scripts
- WCAG 2.2, Success Criterion 2.2.2 Pause, Stop, Hide: https://www.w3.org/TR/WCAG22/#pause-stop-hide

## 14. Layout space reserved for the hero height and the ratings

**Decision.** An inline script at the start of the hero section sets `--header-height` from the rendered header before the hero is parsed. The product title block and the product card render an empty rating slot (`.reviews-widget`, `min-height: 1lh`), and the reviews stand-in fills these slots instead of inserting new elements. The 1.2 s simulated API delay is unchanged.

**Reasons.**

- The hero height is `100svh` minus `--header-height`. Dawn sets that property in the header's `{% javascript %}` block, which Shopify serves as a separate deferred file, so the first frame painted the hero at the full viewport height and the caption, link and arrows moved once the property arrived (823 px to 758 px on mobile). The header markup is already in the DOM when the hero section starts, so reading its height there costs one layout and gives the final value before the first paint.
- The reviews stand-in inserted a block after the product title and at the end of each card 1.2 s after `DOMContentLoaded`, which moved the price, the variant picker and the buy buttons on the product page and the card grid on collections. A slot of the final height keeps the page still while the content arrives, as an app block of a reviews app does. Dawn hides every empty `div` (`div:empty { display: none }` in `base.css`), so the slot overrides it with `.reviews-widget:empty`.
- A/B measurement, 5 runs, published theme before and development theme after, same session. CLS fell to 0 on home (from 0.013 on mobile and 0.010 on desktop) and on the product page (from 0.009 on mobile and 0.005 on desktop), in every run. LCP, TBT, score and weight are `within run-to-run variance`; the product page on mobile keeps its two states (about 2.9 s and about 8.4 s). Results: `perf/results/o05-control/` and `perf/results/o05/`.
- The collection page is not part of the incremental series. A `layout-shift` observer on the development theme, 4× CPU slowdown, records no shift there after the change, against 0.0091 on mobile and 0.0035 on desktop before.

**Sources (checked 2026-11-06).**

- Cumulative Layout Shift: https://web.dev/articles/cls
- Section assets, `{% javascript %}` loaded with `defer`: https://shopify.dev/docs/storefronts/themes/architecture/sections/section-assets
- `lh` unit: https://developer.mozilla.org/en-US/docs/Web/CSS/length#lh

## 15. Promo video loaded and played only on screen

**Decision.** The promo video has `preload="none"` and no `autoplay`; the poster is shown until it plays. A deferred script from the section starts playback while at least a quarter of the section is on screen and pauses it off screen. A visible button pauses and resumes it, and a pause by the visitor holds when the section scrolls back into view. With `prefers-reduced-motion: reduce` the script does nothing, so only the poster is shown and the video is never requested. The pause label is a new key, `sections.video.pause_video`, in every storefront locale; the play label reuses Dawn's `products.product.media.play_video`.

**Reasons.**

- The section sits below the hero, yet `autoplay` made the browser download the 7.8 MB clip on every home page visit, whether or not the visitor scrolled to it. Lighthouse loaded about 7.7 MB of it in the control runs below.
- A looping video that starts by itself and plays next to other content needs a way to pause it (WCAG 2.2.2). The button label changes between pause and play, so it carries no `aria-pressed`.
- A/B measurement, 5 runs, published theme before and development theme after, same session. Home page weight fell from 11264 to 3481 KiB on mobile and from 11970 to 4204 KiB on desktop, and theme requests from 71 to 68; no request for the video is made without scrolling. LCP, TBT, CLS and the scores are `within run-to-run variance`: home mobile LCP was about 3.3 s with one or two runs near 10 s in both series, and the product page, which this change does not touch, keeps its two states. Results: `perf/results/o06-control/` and `perf/results/o06/`.
- A browser check on the development theme confirmed the behaviour: no video request at the top of the page, playback once the section is on screen, the pause held after scrolling away and back, a pause off screen, and no request with reduced motion.

**Sources (checked 2026-11-06).**

- Lazy load video (preload, poster, IntersectionObserver): https://web.dev/articles/lazy-loading-video
- `preload` attribute of `<video>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#preload
- WCAG 2.2, Success Criterion 2.2.2 Pause, Stop, Hide: https://www.w3.org/TR/WCAG22/#pause-stop-hide

## 16. `font-display: swap` restored on the theme fonts

**Decision.** The five `font_face` calls in the layout pass `font_display: 'swap'` again, as Dawn `v16.0.0` does.

**Reasons.**

- Without the parameter the generated `@font-face` rules have no `font-display`, so the browser applies its default block period and can hide text while a font file is still loading. With `swap` the text is painted in the fallback font at once and changes face when the file arrives.
- A browser check on the development theme reads every `@font-face` rule from the page: none has a `font-display` value on the published theme, all have `swap` after the change.
- A/B measurement, 5 runs, published theme before and development theme after, same session. LCP, FCP, TBT, CLS, weight and the scores on home and product, mobile and desktop, are `within run-to-run variance`. In this session most mobile runs of both series landed in the slow state (home LCP about 9.8 s, product about 8.3 s) and one or two in the fast one. Results: `perf/results/o07-control/` and `perf/results/o07/`.
- No lab gain was expected: the theme uses one font family, its regular weight is a 13 KiB file that is preloaded and arrives before the first contentful paint, and Lighthouse reported no font display issue in the control runs. The change protects visitors on slower connections than the Lighthouse profile, where the font can arrive after the text is ready.

**Sources (checked 2026-11-10).**

- `font_face` filter, `font_display` parameter: https://shopify.dev/docs/api/liquid/filters/font_face
- `font-display`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display

## 17. Stylesheets scoped to the sections that use them

**Decision.** The layout no longer loads eight Dawn stylesheets on every page (`section-main-product`, `component-facets`, `component-card`, `component-slider`, `component-image-with-text`, `quick-order-list`, `mask-blobs`, `section-image-banner`); the Dawn sections that need them already load them. The hero carousel and promo video styles moved from the global `theme-custom.css` to `section-hero-carousel.css` and `section-promo-video.css`, loaded by their sections. `theme-custom.css` keeps only the reviews widget styles, which product cards and the product page use on most templates.

**Reasons.**

- Every stylesheet in `<head>` blocks the first paint until it is downloaded, including the ones a page does not use: the product page loaded the facets and image banner styles, the home page the main product styles. Dawn loads section styles from the section file, so a stylesheet arrives only with the markup it styles.
- Stylesheet links per page fell from 33 to 27 on home, 38 to 30 on the product page and 37 to 29 on a collection, and none of the removed ones was in `<head>` any more. Screenshots of the first viewport of the three pages, mobile and desktop, are pixel-identical before and after.
- A/B measurement, 5 runs, published theme before and development theme after, same session. Theme requests fell from 68 to 65 on home and from 60 to 55 on the product page. On home mobile all five runs after the change landed in the fast state, LCP 3.04–3.40 s and FCP 1.86–1.96 s, against 3.64–4.70 s and 1.95–2.09 s in the fast runs before, plus two slow runs near 9.5 s; the median fell from 4.70 to 3.10 s and the score from 68 to 81. Desktop home LCP went from 0.84–0.95 s to 0.77–0.79 s. The product page metrics, TBT, CLS and weight are `within run-to-run variance`; the slow mobile state appeared in one of ten runs after the change and in four of ten before, which five-run series cannot separate from chance. Results: `perf/results/o08-control/` and `perf/results/o08/`.

**Sources (checked 2026-11-10).**

- Defer render-blocking CSS and JavaScript: https://shopify.dev/docs/storefronts/themes/best-practices/performance/defer-non-critical-resources
- Section assets: https://shopify.dev/docs/storefronts/themes/architecture/sections/section-assets

## 18. Resource hints reduced to Dawn's own

**Decision.** The layout drops the thirteen hints the baseline added: the preconnects to `cdn.shopify.com`, `monorail-edge.shopifysvc.com` and `shop.app`, the DNS prefetches to `cdn.shopify.com` and `monorail-edge.shopifysvc.com`, and the preloads of `theme-custom.css`, the video poster and the six slide originals. The hints that Dawn `v16.0.0` ships, the font preconnect and the font preloads, stay unchanged.

**Reasons.**

- Shopify already preconnects to `cdn.shopify.com` through its response headers, which the browser acts on before the document, so the theme's hints to that origin duplicated it; Lighthouse lists that platform hint next to the theme's. The analytics endpoint and Shop Pay are first requested after 0.3 to 0.7 s by platform scripts and take no part in the first render, yet their preconnects opened connections in the critical window.
- `theme-custom.css` is linked in `<head>`, so its preload added nothing. The poster belongs to a home section below the fold and the slides to the home hero, but their preloads ran on every template: the product page downloaded the poster and three slide originals (about 1.2 MB on mobile) next to its own LCP image. The slide preloads also pointed at the original files, which the `srcset` of the hero never requests, through hard-coded CDN URLs.
- A browser check on the development theme confirms that the product page no longer requests any slide or the poster and that home requests only the `srcset` candidates; the LCP elements are unchanged.
- A/B measurement, 5 runs, published theme before and development theme after, same session. Page weight fell from 3021 to 1768 KiB on the product page and from 3464 to 2371 KiB on home (mobile), and from 3647 to 1871 KiB and from 4159 to 2534 KiB on desktop. Theme requests fell from 55 to 51 on the product page and from 65 to 62 on home. Product mobile LCP was 2.73–3.33 s in all five runs, against three of five control runs at 8.2–9.1 s; this is the first series in which the product page did not show its slow state, which fits the bandwidth the preloads took from its LCP image. Product mobile TBT rose from 320 to 564 ms (median): the long tasks are the same two vendor-style scripts of decision 9, with the same durations, but they now fall inside the shorter window between first paint and interactive. Home LCP and the desktop metrics are `within run-to-run variance`. Results: `perf/results/o09-control/` and `perf/results/o09/`.

**Sources (checked 2026-11-10).**

- Use preconnect: https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-preconnect
- Use preload resource hints sparingly: https://shopify.dev/docs/storefronts/themes/best-practices/performance/use-preload-resource-hints-sparingly
- `uses-rel-preconnect`: https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect
