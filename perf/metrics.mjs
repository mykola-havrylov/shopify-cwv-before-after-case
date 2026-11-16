/*
 * Metrics taken from a Lighthouse result and the median used for every series, shared by the local runner and the
 * budget check in CI. Definitions: perf/README.md.
 */
import { countThemeRequests } from './theme-requests.mjs';

export function extractMetrics(lhr) {
  const audit = (id) => lhr.audits[id]?.numericValue ?? Number.NaN;
  return {
    score: (lhr.categories.performance.score ?? Number.NaN) * 100,
    lcp: audit('largest-contentful-paint'),
    cls: audit('cumulative-layout-shift'),
    tbt: audit('total-blocking-time'),
    fcp: audit('first-contentful-paint'),
    weight: audit('total-byte-weight'),
    themeRequests: countThemeRequests(lhr),
    requests: lhr.audits['network-requests']?.details?.items?.length ?? Number.NaN,
  };
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
