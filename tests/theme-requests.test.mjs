/*
 * Tests of the theme request count on a small Lighthouse result fixture.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { countThemeRequests } from '../perf/theme-requests.mjs';

const PAGE = 'https://store.myshopify.com/products/pack?pb=0';

function lhr(urls) {
  return {
    finalDisplayedUrl: PAGE,
    audits: { 'network-requests': { details: { items: urls.map((url) => ({ url })) } } },
  };
}

test('counts the document, /cdn/shop/ on the store and /s/files/ on cdn.shopify.com', () => {
  const urls = [
    PAGE,
    'https://store.myshopify.com/cdn/shop/t/2/assets/base.css',
    'https://cdn.shopify.com/s/files/1/0001/files/pack.jpg',
    'https://store.myshopify.com/cdn/shopifycloud/checkout-web/assets/app.js',
    'https://cdn.shopify.com/shopifycloud/shop-js/client.js',
    'https://monorail-edge.shopifysvc.com/v1/produce',
  ];
  assert.equal(countThemeRequests(lhr(urls)), 3);
});

test('a result without network requests counts as NaN', () => {
  assert.ok(Number.isNaN(countThemeRequests({ finalDisplayedUrl: PAGE, audits: {} })));
});
