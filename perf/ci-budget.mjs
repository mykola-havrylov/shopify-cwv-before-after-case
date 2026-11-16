/*
 * Budget check for Lighthouse CI: reads the Lighthouse results of a run, takes the median per page and compares it
 * with the failure thresholds in perf/budget.md, plus the Theme Store average. Writes a summary table; in required
 * mode a breach fails the step, in report mode it is only reported. Usage: perf/README.md.
 */
import { appendFile, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { extractMetrics, median } from './metrics.mjs';

const BUDGET_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'budget.md');
const PAGE_WEIGHTS = { home: 0.17, product: 0.4, collection: 0.43 };
const THEME_STORE_FLOOR = 60;
const UNITS = { '': 1, ms: 1, s: 1000, KiB: 1024 };
const METRICS = {
  'Performance score': { key: 'score', format: (v) => v.toFixed(0) },
  LCP: { key: 'lcp', format: (v) => `${(v / 1000).toFixed(2)} s` },
  CLS: { key: 'cls', format: (v) => v.toFixed(3) },
  TBT: { key: 'tbt', format: (v) => `${v.toFixed(0)} ms` },
  'Page weight': { key: 'weight', format: (v) => `${(v / 1024).toFixed(0)} KiB` },
  'Theme requests': { key: 'themeRequests', format: (v) => v.toFixed(0) },
};

function parseThreshold(cell) {
  const match = cell.trim().match(/^([<>])\s*([\d.]+)\s*(ms|s|KiB)?$/);
  if (!match) throw new Error(`Unreadable failure threshold "${cell}" in perf/budget.md.`);
  const [, operator, value, unit = ''] = match;
  return { operator, value: Number(value) * UNITS[unit], text: cell.trim() };
}

function parseBudget(markdown) {
  const thresholds = {};
  for (const section of markdown.split(/^## /m)) {
    const formFactor = section.startsWith('Mobile') ? 'mobile' : section.startsWith('Desktop') ? 'desktop' : null;
    if (!formFactor) continue;
    thresholds[formFactor] = {};
    for (const line of section.split('\n')) {
      const cells = line.split('|').map((cell) => cell.trim());
      const metric = METRICS[cells[1]];
      if (metric) thresholds[formFactor][metric.key] = { ...parseThreshold(cells[3]), name: cells[1] };
    }
    const missing = Object.values(METRICS).filter(({ key }) => !thresholds[formFactor][key]);
    if (missing.length) throw new Error(`perf/budget.md has no ${formFactor} threshold for ${missing[0].key}.`);
  }
  return thresholds;
}

function pageOf(url) {
  const { pathname } = new URL(url);
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/products/')) return 'product';
  if (pathname.startsWith('/collections/')) return 'collection';
  return null;
}

function breaches(value, threshold) {
  return threshold.operator === '<' ? value < threshold.value : value > threshold.value;
}

async function readResults(dir) {
  const files = (await readdir(dir).catch(() => [])).filter((file) => /^lhr-.*\.json$/.test(file));
  const pages = {};
  for (const file of files) {
    const lhr = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    const page = pageOf(lhr.requestedUrl ?? lhr.finalDisplayedUrl);
    if (!page) continue;
    const formFactor = lhr.configSettings.formFactor;
    pages[formFactor] ??= {};
    pages[formFactor][page] ??= { runs: [], url: lhr.requestedUrl };
    pages[formFactor][page].runs.push(extractMetrics(lhr));
  }
  const links = JSON.parse(await readFile(path.join(dir, 'links.json'), 'utf8').catch(() => '{}'));
  return { pages, links };
}

function report(thresholds, { pages, links }) {
  const lines = [];
  let failures = 0;
  for (const [formFactor, byPage] of Object.entries(pages)) {
    const limits = thresholds[formFactor];
    lines.push(`### ${formFactor}`, '', `| Page | Runs | ${Object.keys(METRICS).join(' | ')} | Report |`);
    lines.push(
      `| --- | ---: | ${Object.keys(METRICS)
        .map(() => '---:')
        .join(' | ')} | --- |`,
    );
    const scores = {};
    for (const page of Object.keys(PAGE_WEIGHTS).filter((name) => byPage[name])) {
      const { runs, url } = byPage[page];
      const cells = Object.values(METRICS).map(({ key, format }) => {
        const value = median(runs.map((run) => run[key]));
        if (key === 'score') scores[page] = value;
        const failed = breaches(value, limits[key]);
        failures += failed ? 1 : 0;
        return `${failed ? '❌' : '✅'} ${format(value)}`;
      });
      const link = links[url] ? `[report](${links[url]})` : '';
      lines.push(`| ${page} | ${runs.length} | ${cells.join(' | ')} | ${link} |`);
    }
    lines.push(
      '',
      `Failure thresholds (${formFactor}): ${Object.values(limits)
        .map((l) => `${l.name} ${l.text}`)
        .join(', ')}.`,
    );
    if (Object.keys(PAGE_WEIGHTS).every((page) => page in scores)) {
      const average = Object.values(scores).reduce((sum, score) => sum + score, 0) / 3;
      const weighted = Object.entries(PAGE_WEIGHTS).reduce((sum, [page, weight]) => sum + scores[page] * weight, 0);
      const failed = average < THEME_STORE_FLOOR;
      failures += failed ? 1 : 0;
      lines.push(
        `Theme Store average ${failed ? '❌' : '✅'} ${average.toFixed(1)} (floor ${THEME_STORE_FLOOR}); ` +
          `Shopify weighted score ${weighted.toFixed(1)} (home 17 %, product 40 %, collection 43 %).`,
      );
    }
    lines.push('');
  }
  return { lines, failures };
}

async function main() {
  const { values } = parseArgs({
    options: {
      dir: { type: 'string', default: '.lighthouseci' },
      mode: { type: 'string', default: 'report' },
    },
    strict: true,
  });
  if (!['report', 'required'].includes(values.mode)) throw new Error('--mode must be "report" or "required".');

  const thresholds = parseBudget(await readFile(BUDGET_FILE, 'utf8'));
  const results = await readResults(values.dir);
  const output = ['## Performance budgets', '', `Mode: ${values.mode}. Medians of the Lighthouse CI runs.`, ''];
  let failures;
  if (Object.keys(results.pages).length === 0) {
    output.push(`No Lighthouse results found in \`${values.dir}\`.`);
    failures = 1;
  } else {
    const { lines, failures: count } = report(thresholds, results);
    output.push(...lines, `${count} breach(es) of the failure thresholds.`);
    failures = count;
  }

  const text = `${output.join('\n')}\n`;
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, text);
  console.log(text);
  if (failures && values.mode === 'required') process.exitCode = 1;
  else if (failures) console.log(`::warning::${failures} performance budget breach(es); report-only mode.`);
}

try {
  await main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
