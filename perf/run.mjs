/*
 * Lighthouse runner for the storefront: N runs per page, per-metric medians,
 * theme id and password-page guards, JSON evidence and a summary table.
 * Usage and methodology: perf/README.md.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse, { desktopConfig } from 'lighthouse';
import { countThemeRequests } from './theme-requests.mjs';

const RESULTS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'results');
const PAGE_WEIGHTS = { home: 0.17, product: 0.4, collection: 0.43 };
const METRICS = [
  { key: 'score', label: 'Score', format: (v) => v.toFixed(0) },
  { key: 'lcp', label: 'LCP (s)', format: (v) => (v / 1000).toFixed(2) },
  { key: 'cls', label: 'CLS', format: (v) => v.toFixed(3) },
  { key: 'tbt', label: 'TBT (ms)', format: (v) => v.toFixed(0) },
  { key: 'fcp', label: 'FCP (s)', format: (v) => (v / 1000).toFixed(2) },
  { key: 'weight', label: 'Weight (KiB)', format: (v) => (v / 1024).toFixed(0) },
  { key: 'themeRequests', label: 'Theme requests', format: (v) => v.toFixed(0) },
  { key: 'requests', label: 'All requests', format: (v) => v.toFixed(0) },
];

let chromeVersion = 'unknown';

function fail(message) {
  throw new Error(message);
}

function parseCli() {
  const { values } = parseArgs({
    options: {
      store: { type: 'string', default: process.env.SHOPIFY_SHOP },
      label: { type: 'string' },
      page: { type: 'string', multiple: true, default: ['home=/'] },
      'theme-id': { type: 'string' },
      'expect-theme-id': { type: 'string' },
      runs: { type: 'string', default: '5' },
      desktop: { type: 'boolean', default: false },
    },
    strict: true,
  });

  if (!values.label || !/^[\w.-]+$/.test(values.label)) fail('--label is required: letters, digits, ".", "_", "-".');
  if (!values.store) fail('--store <store>.myshopify.com is required (or SHOPIFY_SHOP in the environment).');

  const runs = Number(values.runs);
  if (!Number.isInteger(runs) || runs < 1) fail('--runs must be a positive integer.');

  const previewThemeId = values['theme-id'];
  const expectedThemeId = values['expect-theme-id'] ?? previewThemeId;
  for (const id of [previewThemeId, expectedThemeId]) {
    if (id && !/^\d+$/.test(id)) fail('Theme ids are numeric.');
  }
  if (previewThemeId && expectedThemeId !== previewThemeId) {
    fail('--theme-id and --expect-theme-id must be the same theme.');
  }

  const host = values.store.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const origin = `https://${host.includes('.') ? host : `${host}.myshopify.com`}`;
  const pages = values.page.map((entry) => {
    const [name, pagePath] = entry.split('=');
    if (!name || !pagePath?.startsWith('/')) fail(`--page expects name=/path, got "${entry}".`);
    return { name, path: pagePath };
  });

  return {
    origin,
    previewThemeId,
    label: values.label,
    pages,
    expectedThemeId,
    runs,
    formFactor: values.desktop ? 'desktop' : 'mobile',
  };
}

function buildUrl(origin, pagePath, previewThemeId) {
  const url = new URL(pagePath, origin);
  if (previewThemeId) url.searchParams.set('preview_theme_id', previewThemeId);
  url.searchParams.set('pb', '0');
  return url.toString();
}

async function activatePreview(origin, pagePath, previewThemeId, jar) {
  const { response, finalUrl, body } = await request(buildUrl(origin, pagePath, previewThemeId), jar);
  if (!response.ok) fail(`Preview of theme ${previewThemeId} answered HTTP ${response.status}.`);
  if (isPasswordPage(finalUrl, body)) fail('The preview request returned the password page.');
}

function hostCookies(jar, url) {
  const { host } = new URL(url);
  if (!jar.has(host)) jar.set(host, new Map());
  return jar.get(host);
}

function storeCookies(cookies, response) {
  for (const header of response.headers.getSetCookie()) {
    const [pair] = header.split(';');
    const index = pair.indexOf('=');
    if (index > 0) cookies.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
  }
}

function cookieHeader(cookies) {
  return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ');
}

async function request(url, jar, init = {}) {
  let current = url;
  let options = init;
  for (let hop = 0; hop < 10; hop += 1) {
    const response = await fetch(current, {
      ...options,
      redirect: 'manual',
      headers: { ...options.headers, cookie: cookieHeader(hostCookies(jar, current)) },
    });
    storeCookies(hostCookies(jar, current), response);
    const location = response.headers.get('location');
    if (response.status < 300 || response.status >= 400 || !location) {
      return { response, finalUrl: current, body: await response.text() };
    }
    current = new URL(location, current).toString();
    options = {};
  }
  fail(`Too many redirects for ${url}.`);
}

async function unlockStorefront(origin, jar) {
  const password = process.env.SHOP_PASSWORD;
  if (!password) return false;
  const body = new URLSearchParams({ form_type: 'storefront_password', utf8: '✓', password });
  await request(`${origin}/password`, jar, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  return true;
}

function isPasswordPage(finalUrl, html) {
  return new URL(finalUrl).pathname === '/password' || html.includes('value="storefront_password"');
}

function readTheme(html) {
  const match = html.match(/Shopify\.theme\s*=\s*(\{.*?\});/s);
  if (!match) return null;
  try {
    const theme = JSON.parse(match[1]);
    return { id: String(theme.id), name: theme.name, role: theme.role };
  } catch {
    return null;
  }
}

async function preflight(url, jar, expectedThemeId) {
  const { response, finalUrl, body } = await request(url, jar);
  if (!response.ok) fail(`${url} answered HTTP ${response.status}.`);
  if (isPasswordPage(finalUrl, body)) {
    fail(`${url} returned the password page. Set SHOP_PASSWORD in the shell environment.`);
  }
  const theme = readTheme(body);
  if (!theme) fail(`Shopify.theme was not found on ${url}.`);
  console.log(`  theme: ${theme.id} "${theme.name}" (${theme.role})`);
  if (expectedThemeId && theme.id !== expectedThemeId) {
    fail(`measured theme ${theme.id} differs from the requested theme ${expectedThemeId}.`);
  }
  return theme;
}

function extractMetrics(lhr) {
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

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

async function runLighthouse(url, cookie, formFactor) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run'] });
  try {
    const flags = {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
      extraHeaders: cookie ? { Cookie: cookie } : undefined,
    };
    const result = await lighthouse(url, flags, formFactor === 'desktop' ? desktopConfig : undefined);
    const { lhr } = result;
    const version = await (await fetch(`http://127.0.0.1:${chrome.port}/json/version`)).json();
    chromeVersion = version.Browser.split('/').pop();
    if (lhr.runtimeError) fail(`Lighthouse runtime error: ${lhr.runtimeError.code}.`);
    if (new URL(lhr.finalDisplayedUrl).pathname === '/password') fail('Lighthouse landed on the password page.');
    return lhr;
  } finally {
    await chrome.kill();
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeSummary(dir, label) {
  const files = (await readdir(dir)).filter((file) => file.endsWith('.runs.json')).sort();
  const rows = await Promise.all(files.map((file) => readJson(path.join(dir, file), null)));
  const lines = [
    `# ${label}`,
    '',
    'Medians per metric. Generated by `perf/run.mjs`; environment in `environment.json`.',
    '',
    `| Page | Form | Runs | ${METRICS.map((metric) => metric.label).join(' | ')} |`,
    `| --- | --- | --- | ${METRICS.map(() => '---:').join(' | ')} |`,
  ];
  for (const row of rows.filter(Boolean)) {
    const cells = METRICS.map((metric) => metric.format(row.median[metric.key]));
    lines.push(`| ${row.page} | ${row.formFactor} | ${row.runs.length} | ${cells.join(' | ')} |`);
  }

  for (const formFactor of ['mobile', 'desktop']) {
    const scores = Object.fromEntries(
      rows.filter((row) => row?.formFactor === formFactor).map((row) => [row.page, row.median.score]),
    );
    if (!Object.keys(PAGE_WEIGHTS).every((page) => page in scores)) continue;
    const weighted = Object.entries(PAGE_WEIGHTS).reduce((sum, [page, weight]) => sum + scores[page] * weight, 0);
    const average = Object.keys(PAGE_WEIGHTS).reduce((sum, page) => sum + scores[page], 0) / 3;
    lines.push(
      '',
      `${formFactor}: Shopify weighted score ${weighted.toFixed(1)} (home 17 %, product 40 %, collection 43 %); ` +
        `plain average ${average.toFixed(1)} (Theme Store floor 60).`,
    );
  }

  await writeFile(path.join(dir, 'summary.md'), `${lines.join('\n')}\n`);
  return lines.join('\n');
}

async function main() {
  const options = parseCli();
  const dir = path.join(RESULTS_DIR, options.label);
  await mkdir(dir, { recursive: true });

  const jar = new Map();
  const access = `password ${(await unlockStorefront(options.origin, jar)) ? 'set' : 'not set'}`;
  console.log(`Origin ${options.origin}, ${options.formFactor}, ${options.runs} run(s), ${access}.`);

  const environmentFile = path.join(dir, 'environment.json');
  const environment = await readJson(environmentFile, { measurements: {} });

  for (const page of options.pages) {
    if (options.previewThemeId) await activatePreview(options.origin, page.path, options.previewThemeId, jar);
    const url = buildUrl(options.origin, page.path);
    console.log(`${page.name}: ${url}`);
    const theme = await preflight(url, jar, options.expectedThemeId);
    const cookie = cookieHeader(hostCookies(jar, options.origin));

    const runs = [];
    const reports = [];
    for (let index = 0; index < options.runs; index += 1) {
      const lhr = await runLighthouse(url, cookie, options.formFactor);
      const metrics = extractMetrics(lhr);
      runs.push(metrics);
      reports.push(lhr);
      console.log(
        `  run ${index + 1}/${options.runs}: score ${metrics.score.toFixed(0)}, LCP ${(metrics.lcp / 1000).toFixed(2)} s`,
      );
    }

    const medianMetrics = Object.fromEntries(
      METRICS.map(({ key }) => [key, median(runs.map((metrics) => metrics[key]))]),
    );
    const order = runs.map((metrics, index) => ({ index, score: metrics.score })).sort((a, b) => a.score - b.score);
    const representative = reports[order[Math.floor((order.length - 1) / 2)].index];

    const name = `${page.name}-${options.formFactor}`;
    await writeFile(path.join(dir, `${name}.json`), JSON.stringify(representative));
    await writeFile(
      path.join(dir, `${name}.runs.json`),
      `${JSON.stringify({ page: page.name, formFactor: options.formFactor, url, median: medianMetrics, runs }, null, 2)}\n`,
    );

    const settings = representative.configSettings;
    environment.lighthouse = representative.lighthouseVersion;
    environment.chrome = chromeVersion;
    environment.os = `${os.type()} ${os.release()} ${os.arch()}`;
    environment.node = process.version;
    environment.measurements[name] = {
      date: new Date().toISOString(),
      url,
      theme,
      runs: options.runs,
      formFactor: settings.formFactor,
      throttlingMethod: settings.throttlingMethod,
      throttling: settings.throttling,
      screenEmulation: settings.screenEmulation,
      benchmarkIndex: representative.environment.benchmarkIndex,
    };
    await writeFile(environmentFile, `${JSON.stringify(environment, null, 2)}\n`);
  }

  console.log(`\n${await writeSummary(dir, options.label)}`);
}

try {
  await main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
