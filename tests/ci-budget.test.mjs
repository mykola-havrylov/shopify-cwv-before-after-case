/*
 * Tests of the Lighthouse CI budget check: thresholds read from perf/budget.md, breaches and the summary report.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { breaches, pageOf, parseBudget, report } from '../perf/ci-budget.mjs';

const budget = parseBudget(await readFile(new URL('../perf/budget.md', import.meta.url), 'utf8'));

const PASSING_RUN = { score: 90, lcp: 2000, cls: 0, tbt: 100, weight: 1500 * 1024, themeRequests: 50 };

test('parseBudget reads the failure thresholds of perf/budget.md', () => {
  assert.deepEqual(Object.keys(budget).sort(), ['desktop', 'mobile']);
  assert.equal(budget.mobile.score.operator, '<');
  assert.equal(budget.mobile.score.value, 60);
  assert.equal(budget.mobile.lcp.operator, '>');
  assert.equal(budget.mobile.lcp.value, 4000);
  assert.equal(budget.mobile.weight.value, 2667 * 1024);
  assert.equal(budget.desktop.tbt.value, 350);
  assert.equal(budget.desktop.themeRequests.value, 120);
});

test('breaches compares with both operators', () => {
  const above = { operator: '>', value: 4000 };
  const below = { operator: '<', value: 60 };
  assert.equal(breaches(4001, above), true);
  assert.equal(breaches(4000, above), false);
  assert.equal(breaches(59, below), true);
  assert.equal(breaches(60, below), false);
});

test('a missing or non-numeric value is a breach', () => {
  for (const threshold of [
    { operator: '>', value: 4000 },
    { operator: '<', value: 60 },
  ]) {
    assert.equal(breaches(Number.NaN, threshold), true);
    assert.equal(breaches(undefined, threshold), true);
    assert.equal(breaches('100', threshold), true);
  }
});

test('pageOf maps URLs to the three measured pages', () => {
  assert.equal(pageOf('https://store.myshopify.com/?pb=0'), 'home');
  assert.equal(pageOf('https://store.myshopify.com/products/pack'), 'product');
  assert.equal(pageOf('https://store.myshopify.com/collections/all'), 'collection');
  assert.equal(pageOf('https://store.myshopify.com/cart'), null);
});

test('all three pages within the thresholds give no breach', () => {
  const pages = {
    mobile: Object.fromEntries(['home', 'product', 'collection'].map((p) => [p, { runs: [PASSING_RUN] }])),
  };
  const { failures, lines } = report(budget, { pages });
  assert.equal(failures, 0);
  assert.ok(lines.some((line) => line.startsWith('Theme Store average ✅')));
});

test('a missing page fails the Theme Store average check', () => {
  const pages = { mobile: { home: { runs: [PASSING_RUN] }, product: { runs: [PASSING_RUN] } } };
  const { failures, lines } = report(budget, { pages });
  assert.equal(failures, 1);
  assert.ok(lines.some((line) => line.includes('not computed: no results for collection')));
});

test('a missing metric in the runs is reported as a breach', () => {
  const run = { ...PASSING_RUN, lcp: Number.NaN };
  const pages = { mobile: Object.fromEntries(['home', 'product', 'collection'].map((p) => [p, { runs: [run] }])) };
  assert.equal(report(budget, { pages }).failures, 3);
});
