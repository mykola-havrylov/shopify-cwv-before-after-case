# Performance budgets

Fixed on 2026-10-15, before any measurement of the baseline or any optimisation. Values are not changed to fit results; if a budget proves unrealistic, the original value stays in the README next to the explanation of the change.

- **Budget**: the target for the optimised `main` theme in the final benchmark (median of 5 runs).
- **Failure threshold**: the value at which a check fails (Lighthouse CI, once switched from report-only to required).

Both apply to each page (home, product, collection) separately, on the median of the runs. Lighthouse scoring curves referenced below are those of Lighthouse 13.5.0 (`p10` = score 0.9, `median` = score 0.5).

## Mobile (primary)

| Metric            | Budget     | Failure threshold | Reason                                                                                           |
| ----------------- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| Performance score | ≥ 80       | < 60              | Fail below the Theme Store floor of 60; the budget leaves margin for 5–10 points of run variance |
| LCP               | ≤ 2.5 s    | > 4.0 s           | Lighthouse mobile LCP curve: 2.5 s is `p10`, 4.0 s is `median`; same values as the CWV LCP bands |
| CLS               | ≤ 0.1      | > 0.25            | CWV "good" and "poor" boundaries, which are also the Lighthouse CLS curve                        |
| TBT               | ≤ 200 ms   | > 600 ms          | Lighthouse mobile TBT curve: `p10` 200 ms, `median` 600 ms; lab proxy only, not INP              |
| Page weight       | ≤ 1600 KiB | > 2667 KiB        | Fail where Lighthouse starts penalising total byte weight (`p10` 2667 KiB)                       |
| Theme requests    | ≤ 80       | > 120             | No Lighthouse threshold; caps request growth from added scripts, fonts and images                |

## Desktop

| Metric            | Budget     | Failure threshold | Reason                                                                        |
| ----------------- | ---------- | ----------------- | ----------------------------------------------------------------------------- |
| Performance score | ≥ 90       | < 60              | Same Theme Store floor; desktop runs without CPU slowdown, so a higher target |
| LCP               | ≤ 1.2 s    | > 2.4 s           | Lighthouse desktop LCP curve: `p10` 1.2 s, `median` 2.4 s                     |
| CLS               | ≤ 0.1      | > 0.25            | CWV boundaries, independent of form factor                                    |
| TBT               | ≤ 150 ms   | > 350 ms          | Lighthouse desktop TBT curve: `p10` 150 ms, `median` 350 ms                   |
| Page weight       | ≤ 2000 KiB | > 4000 KiB        | Wider viewport loads larger images; fail at the Lighthouse `median` 4000 KiB  |
| Theme requests    | ≤ 80       | > 120             | Same request set as mobile; the page structure does not change                |

## Aggregate

| Check                  | Threshold                                                        | Reason                                        |
| ---------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| Theme Store average    | Plain average of home, product, collection ≥ 60, per form factor | Shopify Theme Store requirement               |
| Shopify weighted score | Reported, no threshold                                           | Summary only; per-page thresholds above apply |

## Change log

- **2026-10-26, before the first optimisation: "Requests" became "Theme requests".** The budget originally counted every request of the page. Measuring Dawn stock showed 355–377 requests per page, about 160 of them to Shopify's checkout assets and most of the rest to Shop Pay and telemetry, none of which a theme controls and all of which are the same on every theme state. The values (budget 80, failure threshold 120) are unchanged; only what is counted changed. Definition and numbers: [`docs/decisions.md`](../docs/decisions.md). The total stays in every result as "All requests".
