# Shopify CWV before/after case

A Dawn `v16.0.0` theme for a fictional outdoor-gear store, deliberately slowed down with ten typical storefront problems and then optimised one change at a time, with every step measured by reproducible Lighthouse runs.

| Theme           | Storefront                                                                    | Code                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Optimised       | [cwv-demo.myshopify.com](https://cwv-demo.myshopify.com/?pb=0)                | [`main`](https://github.com/mykola-havrylov/shopify-cwv-before-after-case/tree/main)                                  |
| Slow (baseline) | [preview](https://cwv-demo.myshopify.com/?preview_theme_id=146800902228&pb=0) | [`baseline`](https://github.com/mykola-havrylov/shopify-cwv-before-after-case/tree/baseline)                          |
| Dawn stock      | [preview](https://cwv-demo.myshopify.com/?preview_theme_id=146928992340&pb=0) | Dawn [`v16.0.0`](https://github.com/Shopify/dawn/releases/tag/v16.0.0)                                                |
| Difference      |                                                                               | [`compare/baseline...main`](https://github.com/mykola-havrylov/shopify-cwv-before-after-case/compare/baseline...main) |

Storefront password: `bielde`

Fernpeak Outfitters is a fictional store; its product photography and hero slides are AI-generated, see [`docs/ai-assets.md`](docs/ai-assets.md).

## Result

Final benchmark, 2026-11-17, all three themes in one session, 5 runs per page, medians. Mobile is the primary form factor.

| Mobile                 | Dawn stock |  Baseline |     Main |
| ---------------------- | ---------: | --------: | -------: |
| Shopify weighted score |       95.4 |      50.7 |     82.0 |
| Theme Store average    |       95.7 |      51.0 |     81.3 |
| Home LCP               |     2.04 s |   14.96 s |   4.52 s |
| Product LCP            |     2.73 s |   13.01 s |   5.08 s |
| Collection LCP         |     2.17 s |    6.93 s |   2.01 s |
| Home page weight       |   1791 KiB | 12940 KiB | 2395 KiB |

`main` keeps every feature the baseline adds (see [Same features](#same-features)). Against the baseline on mobile it cuts LCP 2.6–3.4×, TBT 2.2–2.9× and page weight 2.2–5.4×, depending on the page. It does not reach Dawn stock on mobile: Dawn has no hero carousel, video or vendor-style scripts, and the mobile LCP of `main` on home and product missed the failure threshold of the budget in this session (see [Budgets](#budgets)).

## Methodology

Full method: [`perf/README.md`](perf/README.md). In short:

- Lighthouse 13.5.0 through `perf/run.mjs`, Chrome 157, Ubuntu (Linux 7.3), default mobile preset (simulated slow 4G, 4× CPU slowdown) and desktop preset.
- 5 runs per URL, each metric reported as its own median; the full result of the run with the median score is stored next to every run's metrics.
- URLs on the store domain with `pb=0`; unpublished themes through `preview_theme_id`. The script checks the served theme id before measuring; products were purchasable (no "Sold out") before each series.
- Pages: home `/`, product `/products/ridge-22-daypack`, collection `/collections/backpacks`.
- Metrics are reported separately. A difference inside the spread of the runs is labelled `within run-to-run variance`. The Shopify weighted score (home 17 %, product 40 %, collection 43 %) and the plain Theme Store average are summaries, not a replacement for the metrics.
- Theme requests count the requests the theme controls; every result also keeps all requests, about 370–400 per page, most of them checkout, Shop Pay and telemetry requests that are the same on every theme ([decision 8](docs/decisions.md#8-requests-are-counted-as-theme-requests)).
- Budgets and failure thresholds were fixed in [`perf/budget.md`](perf/budget.md) before the first optimisation and have not been changed to fit results.

## Final benchmark

### Mobile

| Page       | Theme      | Score |     LCP |   CLS |    TBT |    FCP |    Weight | Theme requests |
| ---------- | ---------- | ----: | ------: | ----: | -----: | -----: | --------: | -------------: |
| Home       | Dawn stock |    97 |  2.04 s | 0.000 |  14 ms | 2.03 s |  1791 KiB |             50 |
| Home       | Baseline   |    52 | 14.96 s | 0.000 | 350 ms | 3.48 s | 12940 KiB |             70 |
| Home       | Main       |    80 |  4.52 s | 0.000 | 125 ms | 1.88 s |  2395 KiB |             62 |
| Product    | Dawn stock |    93 |  2.73 s | 0.000 |  45 ms | 2.13 s |  1805 KiB |             45 |
| Product    | Baseline   |    52 | 13.01 s | 0.009 | 338 ms | 3.79 s |  3894 KiB |             64 |
| Product    | Main       |    70 |  5.08 s | 0.000 | 153 ms | 3.33 s |  1800 KiB |             50 |
| Collection | Dawn stock |    97 |  2.17 s | 0.000 |  42 ms | 1.87 s |  1715 KiB |             45 |
| Collection | Baseline   |    49 |  6.93 s | 0.009 | 592 ms | 3.10 s |  3777 KiB |             60 |
| Collection | Main       |    94 |  2.01 s | 0.000 | 201 ms | 1.89 s |  1709 KiB |             50 |

Shopify weighted score: Dawn stock 95.4, baseline 50.7, main 82.0. Theme Store average (floor 60): 95.7, 51.0, 81.3.

Mobile LCP of `main` has two states, as in the incremental series: home 3.33–6.56 s across the five runs, product 2.58 s and 3.33 s in two runs and 5.08–5.13 s in three. The baseline is stable in its slowness (home 14.81–15.04 s, product 12.87–13.01 s). Dawn stock also has a slow run on product and on collection (4.86 s and 4.85 s).

### Desktop

| Page       | Theme      | Score |    LCP |   CLS |    TBT |    FCP |    Weight | Theme requests |
| ---------- | ---------- | ----: | -----: | ----: | -----: | -----: | --------: | -------------: |
| Home       | Dawn stock |    99 | 0.63 s | 0.000 |   0 ms | 0.61 s |  1789 KiB |             50 |
| Home       | Baseline   |    72 | 3.09 s | 0.000 |  87 ms | 0.58 s | 13528 KiB |             70 |
| Home       | Main       |    99 | 0.75 s | 0.000 |  10 ms | 0.57 s |  2562 KiB |             62 |
| Product    | Dawn stock |    99 | 0.64 s | 0.001 |   0 ms | 0.56 s |  1888 KiB |             46 |
| Product    | Baseline   |    94 | 1.07 s | 0.005 |  87 ms | 0.62 s |  4462 KiB |             64 |
| Product    | Main       |    99 | 0.68 s | 0.001 |  10 ms | 0.58 s |  1849 KiB |             51 |
| Collection | Dawn stock |    99 | 0.58 s | 0.004 |   0 ms | 0.54 s |  1697 KiB |             45 |
| Collection | Baseline   |    92 | 1.03 s | 0.004 | 128 ms | 0.62 s |  4314 KiB |             60 |
| Collection | Main       |    99 | 0.70 s | 0.004 |  10 ms | 0.56 s |  1675 KiB |             50 |

Shopify weighted score: Dawn stock 99.0, baseline 89.4, main 99.0. Theme Store average: 99.0, 86.0, 99.0.

Home pages are not like for like: Dawn stock home has no hero, so its LCP element is a product card, while the LCP element of the baseline and `main` home is the full-screen first slide of the hero carousel.

Results: [`perf/results/final-dawn-stock/`](perf/results/final-dawn-stock/), [`perf/results/final-baseline/`](perf/results/final-baseline/), [`perf/results/final-main/`](perf/results/final-main/); every folder has `summary.md`, the per-run metrics in `<page>-<form>.runs.json`, the full Lighthouse result in `<page>-<form>.json` and the environment in `environment.json`.

### Budgets

`main` against [`perf/budget.md`](perf/budget.md), final benchmark medians. "Budget" is the target; "fail" means the failure threshold is crossed.

| Mobile         | Home             | Product          | Collection          |
| -------------- | ---------------- | ---------------- | ------------------- |
| Score          | 80, met          | 70, missed       | 94, met             |
| LCP            | 4.52 s, **fail** | 5.08 s, **fail** | 2.01 s, met         |
| CLS            | 0.000, met       | 0.000, met       | 0.000, met          |
| TBT            | 125 ms, met      | 153 ms, met      | 201 ms, missed by 1 |
| Page weight    | 2395 KiB, missed | 1800 KiB, missed | 1709 KiB, missed    |
| Theme requests | 62, met          | 50, met          | 50, met             |

On desktop every page meets every budget except home page weight (2562 KiB against 2000; failure threshold 4000). The Theme Store average is 81.3 on mobile and 99.0 on desktop, above the floor of 60. A missed budget is a value between the target and the failure threshold.

## Same features

The baseline problems are described in [`docs/baseline.md`](docs/baseline.md). `main` keeps each feature and changes how it is delivered.

| #   | Baseline                                     | Main                                                                                                                             | Decision                                                                                                                                                                                                    |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Two synchronous vendor-style scripts in head | The same scripts, loaded after `load` or on the first interaction; the tag-manager stand-in runs each tag in its own task        | [9](docs/decisions.md#9-theme-scripts-deferred-vendor-style-scripts-loaded-after-load-or-on-interaction), [19](docs/decisions.md#19-long-tasks-split-and-layout-reads-removed-from-the-interaction-handler) |
| 2   | Original images by absolute CDN URL          | `image_picker` settings, `image_url` + `image_tag` with `widths`, `sizes`, dimensions and `loading`; Dawn's own card and gallery | [10](docs/decisions.md#10-responsive-images-through-image_picker-image_url-and-image_tag)                                                                                                                   |
| 3   | No priority on the LCP image                 | `fetchpriority="high"` on the verified LCP image, exactly one per page                                                           | [12](docs/decisions.md#12-fetchpriorityhigh-on-the-verified-lcp-image)                                                                                                                                      |
| 4   | jQuery carousel hidden until initialised     | CSS scroll snap with a 30-line script for arrows and dots, visible from the first paint; slides change on user action only       | [13](docs/decisions.md#13-hero-carousel-on-css-scroll-snap-jquery-removed)                                                                                                                                  |
| 5   | Reviews widget that shifts the layout        | The same widget and delay, in a slot of the final height                                                                         | [14](docs/decisions.md#14-layout-space-reserved-for-the-hero-height-and-the-ratings)                                                                                                                        |
| 6   | Autoplay video                               | `preload="none"`, plays while on screen, pause button, poster only with reduced motion                                           | [15](docs/decisions.md#15-promo-video-loaded-and-played-only-on-screen)                                                                                                                                     |
| 7   | Fonts without `font-display`                 | `font_display: 'swap'`, as in Dawn                                                                                               | [16](docs/decisions.md#16-font-display-swap-restored-on-the-theme-fonts)                                                                                                                                    |
| 8   | Global CSS on every page                     | Stylesheets loaded by the sections that use them                                                                                 | [17](docs/decisions.md#17-stylesheets-scoped-to-the-sections-that-use-them)                                                                                                                                 |
| 9   | 180 ms interaction handler                   | The same style writes, after yielding to the browser, without forced layout                                                      | [19](docs/decisions.md#19-long-tasks-split-and-layout-reads-removed-from-the-interaction-handler)                                                                                                           |
| 10  | Excess resource hints                        | Dawn's own hints only                                                                                                            | [18](docs/decisions.md#18-resource-hints-reduced-to-dawns-own)                                                                                                                                              |

One behaviour changed on purpose: the baseline carousel advanced by itself, `main` changes slides on user action only, so the carousel needs no pause control (WCAG 2.2.2).

## Step by step

Each optimisation was merged separately and tagged `o01`–`o10`. Every step was measured as an A/B pair in one session: the published theme before the change as control, the development theme with the change after it, home and product, 5 runs each. Mobile medians, control → after; the remaining metrics of each step are `within run-to-run variance` unless named. Full results and reasoning: the linked decision and `perf/results/oNN-control/`, `perf/results/oNN/`.

| Tag   | Change                                      | Effect (mobile, median, control → after)                                                                                                                                                                        | Decision                                                                                                 |
| ----- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `o01` | Scripts deferred                            | Home FCP 3.43 → 1.87 s. TBT rose 134 → 351 ms on home and 49 → 354 ms on product: the vendor-style scripts moved from before first paint into the window TBT counts. Product LCP 12.93 → 3.18 s, in 4 of 5 runs | [9](docs/decisions.md#9-theme-scripts-deferred-vendor-style-scripts-loaded-after-load-or-on-interaction) |
| `o02` | Responsive images                           | Weight 13024 → 11405 KiB on home, 3844 → 3120 KiB on product. Home LCP 16.48 → 10.70 s (desktop 3.37 → 1.73 s)                                                                                                  | [10](docs/decisions.md#10-responsive-images-through-image_picker-image_url-and-image_tag)                |
| `o03` | `fetchpriority="high"` on the LCP image     | `within run-to-run variance`; the LCP request moved from `Medium` to `High` priority                                                                                                                            | [12](docs/decisions.md#12-fetchpriorityhigh-on-the-verified-lcp-image)                                   |
| `o04` | Carousel on CSS scroll snap, jQuery removed | Home LCP 10.41 → 3.10 s, score 55 → 83 (desktop LCP 2.21 → 0.81 s). Home CLS 0 → 0.013, fixed in the next step                                                                                                  | [13](docs/decisions.md#13-hero-carousel-on-css-scroll-snap-jquery-removed)                               |
| `o05` | Reserved layout space                       | CLS 0.013 → 0 on home, 0.009 → 0 on product                                                                                                                                                                     | [14](docs/decisions.md#14-layout-space-reserved-for-the-hero-height-and-the-ratings)                     |
| `o06` | Video on screen only                        | Home weight 11264 → 3481 KiB (desktop 11970 → 4204 KiB), theme requests 71 → 68                                                                                                                                 | [15](docs/decisions.md#15-promo-video-loaded-and-played-only-on-screen)                                  |
| `o07` | `font-display: swap`                        | `within run-to-run variance`                                                                                                                                                                                    | [16](docs/decisions.md#16-font-display-swap-restored-on-the-theme-fonts)                                 |
| `o08` | Scoped CSS                                  | Theme requests 68 → 65 on home, 59 → 54 on product. Home LCP 4.70 → 3.10 s, all five runs in the fast state                                                                                                     | [17](docs/decisions.md#17-stylesheets-scoped-to-the-sections-that-use-them)                              |
| `o09` | Resource hints reduced                      | Weight 3464 → 2371 KiB on home, 3021 → 1768 KiB on product. Product LCP 2.73–3.33 s in all five runs. Product TBT rose 320 → 493 ms: the same long tasks in a shorter window                                    | [18](docs/decisions.md#18-resource-hints-reduced-to-dawns-own)                                           |
| `o10` | Long tasks split, forced layout removed     | TBT 503 → 191 ms on product, 346 → 158 ms on home (desktop 39–43 → 10 ms)                                                                                                                                       | [19](docs/decisions.md#19-long-tasks-split-and-layout-reads-removed-from-the-interaction-handler)        |

The controls of different steps differ because each step was measured in its own session, and the mobile LCP of the product page and, after `o04`, of home switches between a fast and a slow state from run to run. A step is credited with an LCP change only where the runs before and after separate clearly.

## Interaction latency diagnostic

Lighthouse loads pages without interacting, so TBT does not cover the theme's own event handlers, and INP needs field data. `perf/interaction.mjs` replays variant select and add to cart on the product page and opening the filters on a collection page in Chrome with mobile emulation and a 4× CPU slowdown, 5 visits per theme, and splits each interaction into input delay, processing time and presentation delay from Event Timing entries, with the scripts behind it taken from long animation frames ([decision 20](docs/decisions.md#20-interaction-latency-diagnostic-in-a-scripted-browser)).

This is a controlled interaction latency diagnostic in the lab, not field INP and not a Core Web Vitals pass or fail.

| Interaction    | Baseline latency | Main latency | Baseline processing | Main processing |
| -------------- | ---------------: | -----------: | ------------------: | --------------: |
| Variant select |           264 ms |        24 ms |              192 ms |           12 ms |
| Add to cart    |           216 ms |        40 ms |              194 ms |           12 ms |
| Open filters   |           208 ms |        48 ms |              188 ms |            8 ms |

On the baseline about 180 ms of every interaction is `interaction-handlers.js`, most of it forced style and layout on variant select. On `main` no animation frame around the interactions reaches the 50 ms long-frame threshold.

Results and DevTools traces: [`perf/results/interaction-baseline/`](perf/results/interaction-baseline/), [`perf/results/interaction-main/`](perf/results/interaction-main/). A trace opens in Chrome DevTools: Performance panel → Load profile, with the `.json.gz` file selected as it is.

## Lighthouse CI

[`.github/workflows/lighthouse.yml`](.github/workflows/lighthouse.yml) runs Shopify's Lighthouse CI action on every pull request and every push to `main`: it uploads the commit as a development theme, measures home, product and collection, and `perf/ci-budget.mjs` checks the medians against the failure thresholds read from [`perf/budget.md`](perf/budget.md). It authenticates with a Theme Access password. The workflow reports budget breaches without failing: the runner's CPU is about 1.5× slower than the local machine by Lighthouse's benchmark index, and its TBT is dominated by Shopify's platform scripts and varies between runs (collection 362–989 ms on one pull request), so a required check would fail on the runner rather than on the theme. Required mode fails on a breach, as a local run on the baseline's results shows (11 breaches, exit code 1). Details: [`perf/README.md`](perf/README.md#lighthouse-ci), [decision 21](docs/decisions.md#21-lighthouse-ci-through-shopifys-action-budgets-checked-from-perfbudgetmd).

## Reproduction

Requirements: Node.js 22.19 or later, a local Chrome, and the storefront password.

```bash
npm ci
export SHOP_PASSWORD='<storefront password>'

# Final benchmark, one theme, mobile (add --desktop for desktop)
node perf/run.mjs --store cwv-demo.myshopify.com --label final-main --expect-theme-id 146574082132 \
  --page home=/ --page product=/products/ridge-22-daypack --page collection=/collections/backpacks
node perf/run.mjs --store cwv-demo.myshopify.com --label final-baseline --theme-id 146800902228 \
  --page home=/ --page product=/products/ridge-22-daypack --page collection=/collections/backpacks
node perf/run.mjs --store cwv-demo.myshopify.com --label final-dawn-stock --theme-id 146928992340 \
  --page home=/ --page product=/products/ridge-22-daypack --page collection=/collections/backpacks

# Interaction latency diagnostic
node perf/interaction.mjs --store cwv-demo.myshopify.com --label interaction-main --expect-theme-id 146574082132 \
  --product /products/ridge-22-daypack --collection /collections/backpacks --trace
```

On another store: create the catalogue with `npm run catalog:seed` (Admin API credentials of a Dev Dashboard app in `.env`, see [`.env.example`](.env.example) and [`data/catalog.md`](data/catalog.md)), push `main` and `baseline` as themes, add Dawn `v16.0.0` as the third, and use their theme ids above.

Checks: `npm run format:check`, `npm run lint`, `npm run theme-check`.

## Limitations

- **Synthetic store.** The baseline problems are local simulations: the vendor-style scripts are busy waits that send nothing, the reviews widget is a timer. They reproduce the cost of the real thing, not its exact behaviour.
- **No field data.** The store is password-protected and has no real traffic, so CrUX and the Web Performance Dashboard have nothing to report. No result here is a Core Web Vitals assessment.
- **TBT is not INP.** TBT is a lab proxy for main-thread blocking during load; the interaction diagnostic is a single scripted scenario in the lab.
- **Lab numbers depend on the machine.** Lighthouse's simulated throttling (Lantern) scales what the local Chrome observes, so the same theme gives different absolute numbers on different machines. Every table here comes from one Ubuntu machine, and comparisons are made only within one session.
- **Two-state mobile LCP.** Mobile LCP of home and product switches between a fast and a slow state between runs, on `main` and, less often, on Dawn stock; five runs per series cannot pin down how often each state occurs.
- **Lighthouse CI** uses 3 mobile runs on a GitHub-hosted runner with a slower CPU; it guards against regressions in report mode and is not the source of the reported results.
- **Video poster.** The `poster` of the promo video below the first screen (`hero-poster.jpg`, 161 KiB) is requested at the same time as the LCP slide on home.

## Licenses

Dawn and the files derived from it are under Shopify's theme license in [`LICENSE.md`](LICENSE.md); the rest of the repository is under the MIT license in [`LICENSE`](LICENSE). Changed Dawn files, the video and other external assets: [`docs/third-party-assets.md`](docs/third-party-assets.md); npm packages: [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
