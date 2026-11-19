# Performance methodology

Lab measurements follow Shopify's [Testing for performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance) guide, with the stricter settings below.

| Parameter     | Value                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tool          | Lighthouse 13.5.0 via the `lighthouse` npm package (`perf/run.mjs`); Shopify Lighthouse CI in GitHub Actions                                                                                                                                                             |
| Form factor   | Mobile is primary; desktop is reported in a separate table                                                                                                                                                                                                               |
| Throttling    | Lighthouse defaults: mobile preset (simulated slow 4G, 4× CPU slowdown); desktop preset (`desktopConfig`)                                                                                                                                                                |
| Runs          | 5 per URL; each metric is reported as the median of the 5 runs. Shopify recommends at least 3, since a single run can vary by 5 to 10 points                                                                                                                             |
| Pages         | Baseline, final benchmark and CI: home, product, collection. Each incremental optimisation: home and product                                                                                                                                                             |
| URL           | Always with `pb=0` (preview bar off) and the storefront password. Published theme: `https://<store>.myshopify.com/<path>?pb=0`. Unpublished theme: the same store domain with `preview_theme_id=<id>`, `https://<store>.myshopify.com/<path>?preview_theme_id=<id>&pb=0` |
| Environment   | Lighthouse, Chrome, OS and Node versions, date, URL, theme id, throttling settings — stored next to every JSON                                                                                                                                                           |
| Summary score | Shopify weighted score, reported separately from the metric tables: home 17 %, product 40 %, collection 43 %                                                                                                                                                             |
| Floor         | Theme Store requirement: average Lighthouse performance score of at least 60 across home, product and collection, mobile and desktop separately                                                                                                                          |

Metrics are always reported separately: performance score, LCP, CLS, TBT, page weight and theme requests (all requests are reported next to them). A difference that is inside the spread of the 5 runs is labelled `within run-to-run variance`.

## What these numbers are not

- **TBT is not INP.** Total Blocking Time is a lab proxy for main-thread responsiveness. INP is a field metric (p75 of real visits). A single controlled visit is reported as a controlled interaction latency diagnostic, never as field INP or a Core Web Vitals pass or fail.
- **No field data.** The store is password-protected and has no real traffic, so the Web Performance Dashboard (Chrome RUM data) and CrUX have nothing to report for it.
- **No numbers from the local `shopify theme dev` server.** Only themes served by Shopify on the store domain are measured; the development theme's preview link counts only while its files are not changing, and the commit SHA is recorded with the result.

## Before each series

1. The measured theme id is printed and checked by the script (see below).
2. Products are purchasable: the product page shows an enabled add-to-cart button, not "Sold out".

## Running

Requires Node.js 22.19 or later and a local Chrome. The storefront password is read from `SHOP_PASSWORD` in the environment and is never printed; it can come from the shell or from a local `.env` file via `node --env-file=.env`. Unpublished themes need the password too.

To find a theme id: `shopify theme list --store <store>.myshopify.com`, or the number in the theme's URL in the Shopify admin. `shopify theme dev` also prints a preview link of this form for its development theme.

```bash
export SHOP_PASSWORD='<storefront password>'

# Published theme, mobile, 5 runs
node perf/run.mjs --store <store>.myshopify.com --label main --expect-theme-id <theme id> \
  --page home=/ --page product=/products/<handle> --page collection=/collections/<handle>

# Unpublished theme, desktop
node perf/run.mjs --store <store>.myshopify.com --label baseline --theme-id <theme id> --desktop \
  --page home=/ --page product=/products/<handle> --page collection=/collections/<handle>
```

| Option                   | Meaning                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `--store`                | Store domain; defaults to `SHOPIFY_SHOP` from the environment                                                                             |
| `--label`                | Output folder under `perf/results/`                                                                                                       |
| `--page name=/path`      | Page to measure; repeatable; default `home=/`                                                                                             |
| `--theme-id <id>`        | Measures an unpublished theme: activates `preview_theme_id=<id>` in the session, then measures the plain URL; implies `--expect-theme-id` |
| `--expect-theme-id <id>` | Fails unless the served page reports this theme id                                                                                        |
| `--runs <n>`             | Runs per page; default 5                                                                                                                  |
| `--desktop`              | Desktop preset instead of mobile                                                                                                          |

Before Lighthouse starts, the script unlocks the storefront, fetches each URL, fails if the response is the password page, prints the theme id from `Shopify.theme` on the page, and fails if it differs from the requested id. Every Lighthouse run starts a fresh headless Chrome.

## Output

`perf/results/<label>/`:

| File                      | Content                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `<page>-<form>.json`      | Full Lighthouse result of the run with the median performance score                                  |
| `<page>-<form>.runs.json` | Metrics of every run and their medians                                                               |
| `environment.json`        | Lighthouse, Chrome, OS, Node; per page and form factor: date, URL, theme, settings                   |
| `summary.md`              | Median table for all pages in the label, weighted score and plain average when all three pages exist |

Medians are computed per metric, so the values in `summary.md` can come from different runs; the stored full result is the run with the median score.

Budgets and failure thresholds: [`budget.md`](budget.md).

## A/B asymmetry

In every step `oNN` the control is the published theme on its plain URL and the "after" side is an unpublished development theme measured through `preview_theme_id`. The stored Lighthouse results show that the two are not served alike:

- `theme-hot-reload.js` (`/cdn/shopifycloud/theme-hot-reload/`, 4.5 KiB transferred) loads on every unpublished theme — baseline, Dawn stock and every "after" series — and on no published one. It is a platform path, so it adds to page weight and all requests, not to theme requests.
- In the stored control results some theme stylesheets have `transferSize: 0`: 9–10 on every page of the `o04`–`o08` controls, 10 on three of four pages of the `o02` control, 10 on both desktop pages of the `o01` control and on one page of the `o03` control, 2–4 on every page of the `o09` and `o10` controls. No "after" series, baseline or Dawn stock result has any. The cause is not established.

Both add bytes and a script only to the "after" side, so the effect credited to a step is conservative. Where a control page has 9–10 such stylesheets, the same files transfer 37–57 KiB in the "after" result up to `o07` and 20–22 KiB in `o08`; the 2–4 files of `o09` and `o10` transfer 12–21 KiB.

Example, `o07` mobile weight: home 3452 → 3501 KiB, product 2993 → 3039 KiB, with no overlap between the runs (home 3447–3454 against 3499–3503 KiB, product 2989–2994 against 3034–3040 KiB). The stored control has 10 (home) and 9 (product) stylesheets at `transferSize: 0` that transfer 40.6 and 39.1 KiB in the "after" result; with the 4.5 KiB of `theme-hot-reload.js` that is 45.1 of the 49 KiB on home and 43.6 of the 46 KiB on product. Sources: `perf/results/o07-control/` and `perf/results/o07/`, `<page>-mobile.json` and `<page>-mobile.runs.json`.

The final benchmark has the same split with the opposite sign: `main` is the published theme, baseline and Dawn stock are previews, so only they load `theme-hot-reload.js`; `final-main` has 2 stylesheets at `transferSize: 0` on the desktop product and collection pages.

Only the result of the median-score run is stored per series, so the stylesheet counts above come from one run each. A future series should measure both sides as unpublished previews, for example the control as a duplicate of the published theme.

## Slow LCP runs: a hypothesis

Mobile LCP of home and product is multimodal (README, Final benchmark). The LCP breakdown in the stored results points at painting, not loading. In the slow stored runs the observed `elementRenderDelay` is 826–2011 ms: `o07` home (LCP 10.09 s, 2011 ms) and product (8.48 s, 826 ms), `final-main` product (5.08 s, 1034 ms). In the faster stored runs of `o08`, `o09`, `o10` home and product and `final-main` home (LCP 2.73–4.57 s) it is 24–49 ms. Time to first byte, resource load delay and resource load duration stay within 18–400 ms in all of them, so the LCP image has arrived and its paint is delayed. Source: the `lcp-breakdown-insight` audit of `<page>-mobile.json` in those folders.

This is a hypothesis. Only one full result per series is stored, the run with the median score, so the other runs cannot be checked, and not every slow run fits: the `o09` control home result (LCP 6.24 s) has an `elementRenderDelay` of 28 ms. Future series should keep the full result of all five runs.

## Lighthouse CI

`.github/workflows/lighthouse.yml` runs on every pull request from this repository and on every push to `main`:

1. Shopify's Lighthouse CI action (`shopify/lighthouse-ci-action` v1.4.0, pinned to its commit) authenticates with a Theme Access password (repository secret `SHOP_THEME_TOKEN`), uploads the checked-out theme as a development theme, unlocks the storefront with the password and runs Lighthouse on home, `/products/ridge-22-daypack` and `/collections/backpacks` with `preview_theme_id` and `pb=0`. It uses Lighthouse CI's defaults: 3 runs per URL, mobile. Its own assertion is the performance score of 60 from the failure thresholds; its accessibility assertion is turned off, because the budgets have none. Reports go to Lighthouse CI's temporary public storage.
2. `perf/ci-budget.mjs` reads the results the action leaves in `.lighthouseci/`, takes the median per page and compares it with every failure threshold of [`budget.md`](budget.md), read from that file, plus the Theme Store average of 60. The table, the Shopify weighted score and the report links are written to the job summary.

The workflow is report-only: `BUDGET_MODE: report` lets the Lighthouse step and the budget step report breaches without failing the job. Setting `BUDGET_MODE: required` in the workflow makes either of them fail the job; the thresholds are the same in both modes, and the job can then be made a required status check in the branch rules.

The repository is checked out into `theme/`: the action writes a CommonJS helper into the workspace root, where this repository's `package.json` (`"type": "module"`) would make Node load it as an ES module.

Limits of the CI numbers: 3 runs instead of 5, mobile only, a GitHub-hosted runner instead of the local machine. The runner's CPU is slower (Lighthouse CPU benchmark index about 2450 against about 3600 locally) while the same 4× slowdown applies, so TBT on the runner is higher and varies more, mostly in Shopify's platform scripts; the workflow therefore stays in report mode (decision 21 in [`docs/decisions.md`](../docs/decisions.md)). They watch for regressions; the results in `perf/results/` come from `perf/run.mjs`. The Shopify CLI inside the action is not pinned by the action. The development theme it creates is not removed by the action; Shopify deletes development themes after seven days of inactivity, and they do not count toward the theme limit.

```bash
# The budget check on local results, e.g. a .lighthouseci/ folder from a local lhci run
node perf/ci-budget.mjs --dir .lighthouseci --mode report
```

## Interaction latency diagnostic

`perf/interaction.mjs` replays one scenario in a real Chrome driven by Puppeteer: on the product page it selects another variant and adds the product to the cart, on the collection page it opens the filters. It is a controlled interaction latency diagnostic in the lab, not field INP and not a Core Web Vitals pass or fail.

| Parameter   | Value                                                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Device      | 412 × 823 viewport, device pixel ratio 1.75, mobile and touch emulation (the size of Lighthouse's mobile preset)                                                    |
| CPU         | 4× slowdown through the DevTools protocol; the network is not throttled, because the interactions are measured after the page has loaded                            |
| Visits      | 5 per theme, each in a new browser context (empty cart, fresh storefront session); every phase is reported as the median of the 5 visits                            |
| Timing      | Each page is left idle for 5 s after `load`, so deferred and on-load scripts have run; each interaction is followed by 3 s of idle time                             |
| Latency     | Event Timing entries of the interaction: input delay, processing time and presentation delay, the three phases INP is made of; entries below 16 ms are not reported |
| Attribution | Long animation frames around the interaction, with the scripts that ran in them, their invoker and the time spent in forced style and layout                        |
| Traces      | With `--trace`, one extra visit records a DevTools trace of the interactions on each page; it is not counted in the medians                                         |

```bash
export SHOP_PASSWORD='<storefront password>'

node perf/interaction.mjs --store <store>.myshopify.com --label interaction-main --expect-theme-id <theme id> \
  --product /products/<handle> --collection /collections/<handle> --trace

node perf/interaction.mjs --store <store>.myshopify.com --label interaction-baseline --theme-id <theme id> \
  --product /products/<handle> --collection /collections/<handle> --trace
```

The theme id options behave as in `perf/run.mjs`; the run fails on the password page, on a different theme id, or when the add to cart button is missing or disabled.

`perf/results/<label>/`:

| File                       | Content                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `interaction.runs.json`    | Phases and script attribution of every interaction in every visit, and the medians   |
| `environment.json`         | Chrome, Puppeteer, OS and Node versions, date, URLs, theme id and the settings above |
| `summary.md`               | Median phases per interaction                                                        |
| `product-trace.json.gz`    | DevTools trace of the product page interactions (with `--trace`)                     |
| `collection-trace.json.gz` | DevTools trace of opening the filters (with `--trace`)                               |

A trace opens in Chrome DevTools: Performance panel → Load profile, with the `.json.gz` file selected as it is. The Interactions track shows each interaction with its phases, and the Main track shows the scripts and the forced layouts behind it.
