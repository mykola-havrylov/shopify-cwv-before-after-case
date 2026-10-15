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

**Decision.** Lighthouse 13.5.0 from npm, pinned; 5 runs per URL; per-metric median; mobile primary, desktop separate; default Lighthouse throttling presets; `pb=0` on every URL; the published theme measured on the `myshopify.com` domain with the storefront password, unpublished themes through the `shopifypreview.com` preview link; served theme id checked before every series; Lighthouse/Chrome/OS versions, date, URL and theme id stored with every result. Details: [`perf/README.md`](../perf/README.md). Budgets fixed before the first optimisation: [`perf/budget.md`](../perf/budget.md).

**Reasons.**

- Shopify recommends at least three runs per URL and the median, because a single run can vary by 5 to 10 points. Five runs narrow the spread further at acceptable cost.
- Shopify's summary speed score weights home 17 %, product 40 %, collection 43 %; the Theme Store requires a plain average of at least 60 across those pages on mobile and desktop. Both are reported, separately from the per-metric tables.
- The preview bar is hidden with `pb=0`, as Shopify's testing guide says.
- Unpublished themes are measured through the `shopifypreview.com` link copied from the preview bar, as Shopify's testing guide describes; it needs no store password. The link does not show which theme it serves, so the runner reads `Shopify.theme.id` from the served page and fails unless it matches the expected theme id.
- Local development server (`shopify theme dev`) output is never measured: it is not the theme as served by Shopify's storefront.
- TBT is a lab proxy for responsiveness, not INP. The store is password-protected and has no traffic, so the Web Performance Dashboard and CrUX have no field data for it.
- The storefront password is sent through the documented `storefront_password` form (`POST /password` with a `password` field) and read from the environment, never from a file in the repository.

**Sources (checked 2026-10-15).**

- Testing for performance: https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance
- Theme Store requirements: https://shopify.dev/docs/storefronts/themes/store/requirements
- Shopify Lighthouse CI: https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci
- Password template: https://shopify.dev/docs/storefronts/themes/architecture/templates/password
- `form` tag, `storefront_password`: https://shopify.dev/docs/api/liquid/tags/form

## 3. Formatting and linting of imported Dawn files

**Decision.** Prettier skips Dawn's theme directories (`assets/*`, `config/*`, `layout/*`, `locales/*`, `sections/*`, `snippets/*`, `templates/*`); new own files there are added back with `!` entries in `.prettierignore`. ESLint lints all `assets/**/*.js`, but for the 36 JavaScript files imported from Dawn it turns off `no-undef`, `no-unused-vars`, `no-redeclare`, `no-self-assign` and `no-useless-assignment`. Theme Check runs `theme-check:recommended` with no check disabled.

**Reasons.**

- Prettier with the Liquid plugin would rewrite 256 Dawn files. Keeping upstream formatting keeps every later diff limited to real changes, which is what the before/after comparison shows.
- Dawn's scripts are classic scripts that share top-level functions and constants across files (`debounce`, `publish`, `PUB_SUB_EVENTS` and others), which ESLint reports as undefined or unused per file. The other findings are upstream code. New JavaScript gets the full recommended rule set.
- On the imported Dawn code `theme-check:recommended` reports 0 errors (9 warnings), so no check needs to be disabled.
