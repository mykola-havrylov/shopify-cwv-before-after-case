/*
 * Controlled interaction latency diagnostic: variant select and add to cart on a product page,
 * opening the filters on a collection page. Event Timing phases, long animation frames with
 * script attribution, per-interaction medians and one DevTools trace per page.
 * Usage and methodology: perf/README.md.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { gzipSync } from 'node:zlib';
import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';

const RESULTS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'results');
const VIEWPORT = { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true };
const CPU_SLOWDOWN = 4;
const SETTLE_MS = 5000;
const AFTER_INTERACTION_MS = 3000;
const PHASES = ['duration', 'inputDelay', 'processing', 'presentation'];
const STEPS = [
  { key: 'variant', label: 'Variant select', page: 'product' },
  { key: 'addToCart', label: 'Add to cart', page: 'product' },
  { key: 'filters', label: 'Open filters', page: 'collection' },
];

function fail(message) {
  throw new Error(message);
}

function parseCli() {
  const { values } = parseArgs({
    options: {
      store: { type: 'string', default: process.env.SHOPIFY_SHOP },
      label: { type: 'string' },
      product: { type: 'string' },
      collection: { type: 'string' },
      'theme-id': { type: 'string' },
      'expect-theme-id': { type: 'string' },
      runs: { type: 'string', default: '5' },
      trace: { type: 'boolean', default: false },
    },
    strict: true,
  });

  if (!values.label || !/^[\w.-]+$/.test(values.label)) fail('--label is required: letters, digits, ".", "_", "-".');
  if (!values.store) fail('--store <store>.myshopify.com is required (or SHOPIFY_SHOP in the environment).');
  if (!values.product?.startsWith('/products/')) fail('--product /products/<handle> is required.');
  if (!values.collection?.startsWith('/collections/')) fail('--collection /collections/<handle> is required.');
  if (!process.env.SHOP_PASSWORD) fail('SHOP_PASSWORD is not set in the environment.');

  const runs = Number(values.runs);
  if (!Number.isInteger(runs) || runs < 1) fail('--runs must be a positive integer.');

  const previewThemeId = values['theme-id'];
  const expectedThemeId = values['expect-theme-id'] ?? previewThemeId;
  if (!expectedThemeId) fail('--theme-id or --expect-theme-id is required.');
  for (const id of [previewThemeId, expectedThemeId]) {
    if (id && !/^\d+$/.test(id)) fail('Theme ids are numeric.');
  }
  if (previewThemeId && expectedThemeId !== previewThemeId) {
    fail('--theme-id and --expect-theme-id must be the same theme.');
  }

  const host = values.store.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  return {
    origin: `https://${host.includes('.') ? host : `${host}.myshopify.com`}`,
    label: values.label,
    pages: { product: values.product, collection: values.collection },
    previewThemeId,
    expectedThemeId,
    runs,
    trace: values.trace,
  };
}

function pageUrl(origin, pagePath, previewThemeId) {
  const url = new URL(pagePath, origin);
  if (previewThemeId) url.searchParams.set('preview_theme_id', previewThemeId);
  url.searchParams.set('pb', '0');
  return url.toString();
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function installObservers() {
  globalThis.__diagnostic = { events: [], frames: [] };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.interactionId) continue;
      globalThis.__diagnostic.events.push({
        name: entry.name,
        startTime: entry.startTime,
        duration: entry.duration,
        processingStart: entry.processingStart,
        processingEnd: entry.processingEnd,
      });
    }
  }).observe({ type: 'event', durationThreshold: 16, buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      globalThis.__diagnostic.frames.push({
        startTime: entry.startTime,
        duration: entry.duration,
        blockingDuration: entry.blockingDuration,
        scripts: entry.scripts.map((script) => ({
          source: script.sourceURL,
          invoker: script.invoker,
          duration: script.duration,
          forcedLayout: script.forcedStyleAndLayoutDuration,
        })),
      });
    }
  }).observe({ type: 'long-animation-frame', buffered: true });
}

async function openPage(page, url, expectedThemeId) {
  await page.goto(url, { waitUntil: 'load' });
  if (new URL(page.url()).pathname === '/password') fail(`${url} returned the password page.`);
  const themeId = await page.evaluate(() => String(globalThis.Shopify?.theme?.id ?? ''));
  if (themeId !== expectedThemeId)
    fail(`measured theme ${themeId} differs from the requested theme ${expectedThemeId}.`);
  await wait(SETTLE_MS);
}

function scriptName(source) {
  if (!source) return '(inline or browser)';
  return new URL(source).pathname.split('/').pop();
}

async function measure(page, action) {
  const since = await page.evaluate(() => performance.now());
  await action();
  await wait(AFTER_INTERACTION_MS);
  const { events, frames } = await page.evaluate(() => globalThis.__diagnostic);
  const own = events.filter((entry) => entry.startTime >= since);
  if (own.length === 0) return { duration: null, inputDelay: null, processing: null, presentation: null, scripts: [] };

  const start = Math.min(...own.map((entry) => entry.startTime));
  const end = Math.max(...own.map((entry) => entry.startTime + entry.duration));
  const processingStart = Math.min(...own.map((entry) => entry.processingStart));
  const processingEnd = Math.max(...own.map((entry) => entry.processingEnd));
  const scripts = frames
    .filter((frame) => frame.startTime < end && frame.startTime + frame.duration > start - 500)
    .flatMap((frame) => frame.scripts)
    .filter((script) => script.duration >= 5)
    .map((script) => ({
      script: scriptName(script.source),
      invoker: script.invoker,
      duration: Math.round(script.duration),
      forcedLayout: Math.round(script.forcedLayout),
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  return {
    duration: Math.round(end - start),
    inputDelay: Math.round(processingStart - start),
    processing: Math.round(processingEnd - processingStart),
    presentation: Math.round(end - processingEnd),
    scripts,
  };
}

async function startTrace(page, traceFile) {
  if (!traceFile) return async () => {};
  await page.tracing.start({ screenshots: false });
  return async () => writeFile(traceFile, gzipSync(await page.tracing.stop()));
}

async function runProduct(page, url, expectedThemeId, traceFile) {
  await openPage(page, url, expectedThemeId);
  const purchasable = await page.$eval('.product-form__submit', (button) => !button.disabled).catch(() => false);
  if (!purchasable) fail(`${url}: the add to cart button is missing or disabled (sold out?).`);
  const stopTrace = await startTrace(page, traceFile);

  const variant = await measure(page, async () => {
    const labelFor = await page.evaluate(() => {
      const input = globalThis.document.querySelector(
        'variant-selects input[type="radio"]:not(:checked):not(:disabled)',
      );
      return input?.id ?? null;
    });
    if (!labelFor) fail(`${url}: no other variant to select.`);
    const label = await page.$(`label[for="${labelFor}"]`);
    await label.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await label.click();
  });

  const addToCart = await measure(page, async () => {
    const button = await page.$('.product-form__submit');
    await button.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await button.click();
    await page.waitForSelector('cart-notification .active, #cart-notification.active, cart-drawer.active', {
      timeout: 15000,
    });
  });

  await stopTrace();
  return { variant, addToCart };
}

async function runCollection(page, url, expectedThemeId, traceFile) {
  await openPage(page, url, expectedThemeId);
  const stopTrace = await startTrace(page, traceFile);
  const filters = await measure(page, async () => {
    const opener = await page.$('.mobile-facets__open');
    if (!opener) fail(`${url}: the mobile filter button was not found.`);
    await opener.click();
  });
  await stopTrace();
  return { filters };
}

async function newVisit(browser, options) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.goto(`${options.origin}/password`, { waitUntil: 'domcontentloaded' });
  if (await page.$('input[type="password"]')) {
    await page.type('input[type="password"]', process.env.SHOP_PASSWORD);
    await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
  }
  if (options.previewThemeId) {
    await page.goto(pageUrl(options.origin, '/', options.previewThemeId), { waitUntil: 'domcontentloaded' });
  }
  await page.setViewport(VIEWPORT);
  await page.evaluateOnNewDocument(installObservers);
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
  return { context, page };
}

function median(values) {
  const sorted = values.filter((value) => value !== null).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function formatMs(value) {
  return value === null ? '< 16' : value.toFixed(0);
}

async function main() {
  const options = parseCli();
  const dir = path.join(RESULTS_DIR, options.label);
  await mkdir(dir, { recursive: true });

  const urls = {
    product: pageUrl(options.origin, options.pages.product),
    collection: pageUrl(options.origin, options.pages.collection),
  };
  const browser = await puppeteer.launch({
    executablePath: chromeLauncher.Launcher.getInstallations()[0],
    headless: true,
    args: ['--no-first-run'],
  });

  try {
    console.log(`Origin ${options.origin}, theme ${options.expectedThemeId}, ${options.runs} visit(s).`);
    const runs = [];
    for (let index = 0; index < options.runs; index += 1) {
      const { context, page } = await newVisit(browser, options);
      try {
        const run = {
          ...(await runProduct(page, urls.product, options.expectedThemeId)),
          ...(await runCollection(page, urls.collection, options.expectedThemeId)),
        };
        runs.push(run);
        console.log(
          `  visit ${index + 1}/${options.runs}: ${STEPS.map((step) => `${step.key} ${formatMs(run[step.key].duration)} ms`).join(', ')}`,
        );
      } finally {
        await context.close();
      }
    }

    if (options.trace) {
      const { context, page } = await newVisit(browser, options);
      try {
        await runProduct(page, urls.product, options.expectedThemeId, path.join(dir, 'product-trace.json.gz'));
        await runCollection(page, urls.collection, options.expectedThemeId, path.join(dir, 'collection-trace.json.gz'));
        console.log('  traces: product-trace.json.gz, collection-trace.json.gz');
      } finally {
        await context.close();
      }
    }

    const medians = Object.fromEntries(
      STEPS.map((step) => [
        step.key,
        Object.fromEntries(PHASES.map((phase) => [phase, median(runs.map((run) => run[step.key][phase]))])),
      ]),
    );
    await writeFile(
      path.join(dir, 'interaction.runs.json'),
      `${JSON.stringify({ urls, median: medians, runs }, null, 2)}\n`,
    );
    await writeFile(
      path.join(dir, 'environment.json'),
      `${JSON.stringify(
        {
          date: new Date().toISOString(),
          chrome: (await browser.version()).split('/').pop(),
          puppeteer: JSON.parse(await readFile(path.join(RESULTS_DIR, '..', '..', 'package.json'), 'utf8'))
            .devDependencies['puppeteer-core'],
          os: `${os.type()} ${os.release()} ${os.arch()}`,
          node: process.version,
          origin: options.origin,
          themeId: options.expectedThemeId,
          urls,
          visits: options.runs,
          viewport: VIEWPORT,
          cpuSlowdown: CPU_SLOWDOWN,
          network: 'not throttled',
          settleMs: SETTLE_MS,
          afterInteractionMs: AFTER_INTERACTION_MS,
        },
        null,
        2,
      )}\n`,
    );

    const lines = [
      `# ${options.label}`,
      '',
      'Controlled interaction latency diagnostic, not field INP. Medians per phase in ms. ' +
        'Generated by `perf/interaction.mjs`; environment in `environment.json`.',
      '',
      '| Interaction | Visits | Latency | Input delay | Processing | Presentation |',
      '| --- | ---: | ---: | ---: | ---: | ---: |',
      ...STEPS.map(
        (step) =>
          `| ${step.label} | ${runs.length} | ${PHASES.map((phase) => formatMs(medians[step.key][phase])).join(' | ')} |`,
      ),
      '',
      '`< 16`: no Event Timing entry reached the 16 ms reporting threshold.',
    ];
    await writeFile(path.join(dir, 'summary.md'), `${lines.join('\n')}\n`);
    console.log(`\n${lines.join('\n')}`);
  } finally {
    await browser.close();
  }
}

try {
  await main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
