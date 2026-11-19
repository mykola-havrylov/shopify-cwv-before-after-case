/*
 * Tests of the median shared by the local runner and the budget check.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { median } from '../perf/metrics.mjs';

test('median of an odd count is the middle value', () => {
  assert.equal(median([5, 1, 3]), 3);
});

test('median of an even count is the mean of the two middle values', () => {
  assert.equal(median([4, 1, 3, 2]), 2.5);
});

test('median of no values is NaN', () => {
  assert.ok(Number.isNaN(median([])));
});

test('median does not reorder its input', () => {
  const values = [3, 1, 2];
  median(values);
  assert.deepEqual(values, [3, 1, 2]);
});
