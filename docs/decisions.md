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

**Decision.** Prettier skips Dawn's theme directories (`assets/*`, `config/*`, `layout/*`, `locales/*`, `sections/*`, `snippets/*`, `templates/*`); new own files there are added back with `!` entries in `.prettierignore`. ESLint lints all `assets/**/*.js`, but for the 36 JavaScript files imported from Dawn it turns off `no-undef`, `no-unused-vars`, `no-redeclare`, `no-self-assign` and `no-useless-assignment`. Theme Check runs `theme-check:recommended` with no check disabled.

**Reasons.**

- Prettier with the Liquid plugin would rewrite 256 Dawn files. Keeping upstream formatting keeps every later diff limited to real changes, which is what the before/after comparison shows.
- Dawn's scripts are classic scripts that share top-level functions and constants across files (`debounce`, `publish`, `PUB_SUB_EVENTS` and others), which ESLint reports as undefined or unused per file. The other findings are upstream code. New JavaScript gets the full recommended rule set.
- On the imported Dawn code `theme-check:recommended` reports 0 errors (9 warnings), so no check needs to be disabled.

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
