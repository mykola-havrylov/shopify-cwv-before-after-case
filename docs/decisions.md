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

## 11. Theme Check runs the pinned Shopify CLI directly in CI

**Decision.** The CI job runs `npx --yes @shopify/cli@5.0.1 theme check --fail-level error` instead of the `shopify/theme-check-action` GitHub Action.

**Reasons.**

- The action installs the latest `@shopify/cli` on every run (`npm install --no-package-lock --no-save @shopify/cli`) and then reads the JSON report of `theme check` as a list. Shopify CLI 5.0.0 changed that report to an object (`valid`, `issues`, `errorCount`, `warningCount`, `infoCount`), so the action fails with `e.filter is not a function` before it reports anything, regardless of the theme.
- Pinning the CLI version makes the check repeatable: the same commit gives the same result on every run until the version is changed on purpose. On 5.0.1 the check gives the same result as on 4.9.4: 0 errors and 21 warnings.
- The check keeps its exit code, so `--fail-level error` still fails the job; the inline annotations on the pull request that the action created are no longer produced.
