# Performance methodology

Lab measurements follow Shopify's [Testing for performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance) guide, with the stricter settings below.

| Parameter     | Value                                                                                                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool          | Lighthouse 13.5.0 via the `lighthouse` npm package (`perf/run.mjs`); Shopify Lighthouse CI in GitHub Actions                                                                                                                                                        |
| Form factor   | Mobile is primary; desktop is reported in a separate table                                                                                                                                                                                                          |
| Throttling    | Lighthouse defaults: mobile preset (simulated slow 4G, 4× CPU slowdown); desktop preset (`desktopConfig`)                                                                                                                                                           |
| Runs          | 5 per URL; each metric is reported as the median of the 5 runs. Shopify recommends at least 3, since a single run can vary by 5 to 10 points                                                                                                                        |
| Pages         | Baseline, final benchmark and CI: home, product, collection. Each incremental optimisation: home and product                                                                                                                                                        |
| URL           | Always with `pb=0` (preview bar off). Published theme: `https://<store>.myshopify.com/<path>?pb=0` with the storefront password. Unpublished theme: the `shopifypreview.com` preview link from the admin preview bar, `https://<id>.shopifypreview.com/<path>?pb=0` |
| Environment   | Lighthouse, Chrome, OS and Node versions, date, URL, theme id, throttling settings — stored next to every JSON                                                                                                                                                      |
| Summary score | Shopify weighted score, reported separately from the metric tables: home 17 %, product 40 %, collection 43 %                                                                                                                                                        |
| Floor         | Theme Store requirement: average Lighthouse performance score of at least 60 across home, product and collection, mobile and desktop separately                                                                                                                     |

Metrics are always reported separately: performance score, LCP, CLS, TBT, page weight and requests. A difference that is inside the spread of the 5 runs is labelled `within run-to-run variance`.

## What these numbers are not

- **TBT is not INP.** Total Blocking Time is a lab proxy for main-thread responsiveness. INP is a field metric (p75 of real visits). A single controlled visit is reported as a controlled interaction latency diagnostic, never as field INP or a Core Web Vitals pass or fail.
- **No field data.** The store is password-protected and has no real traffic, so the Web Performance Dashboard (Chrome RUM data) and CrUX have nothing to report for it.
- **No numbers from `shopify theme dev`.** Only themes uploaded to the store are measured.

## Before each series

1. The measured theme id is printed and checked by the script (see below).
2. Products are purchasable: the product page shows an enabled add-to-cart button, not "Sold out".

## Running

Requires Node.js 22.19 or later and a local Chrome. The storefront password is read from `SHOP_PASSWORD` in the environment and is never printed; it can come from the shell or from a local `.env` file via `node --env-file=.env`. Preview links work without the password.

To get a preview link: in the Shopify admin, open **Online Store → Themes**, preview the theme, and copy the link from the preview bar.

```powershell
$env:SHOP_PASSWORD = '<storefront password>'

# Published theme, mobile, 5 runs
node perf/run.mjs --store <store>.myshopify.com --label main `
  --page home=/ --page product=/products/<handle> --page collection=/collections/<handle>

# Unpublished theme, desktop
node perf/run.mjs --label baseline --preview-url https://<id>.shopifypreview.com --expect-theme-id <theme id> --desktop `
  --page home=/ --page product=/products/<handle> --page collection=/collections/<handle>
```

| Option                   | Meaning                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `--store`                | Store domain; defaults to `SHOP_STORE` from the environment                                              |
| `--label`                | Output folder under `perf/results/`                                                                      |
| `--page name=/path`      | Page to measure; repeatable; default `home=/`                                                            |
| `--preview-url <url>`    | Measures the `shopifypreview.com` preview link instead of the store domain; requires `--expect-theme-id` |
| `--expect-theme-id <id>` | Fails unless the served page reports this theme id                                                       |
| `--runs <n>`             | Runs per page; default 5                                                                                 |
| `--desktop`              | Desktop preset instead of mobile                                                                         |

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
