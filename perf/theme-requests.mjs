/*
 * Counts the requests of a Lighthouse result that the theme controls: the page document, files under /cdn/shop/ on
 * the store domain, and files under /s/files/ on cdn.shopify.com. Requests made by Shopify's platform scripts
 * (checkout, Shop Pay, telemetry, pixels) are not counted. Definition: docs/decisions.md.
 */
const CDN_HOST = 'cdn.shopify.com';

export function countThemeRequests(lhr) {
  const items = lhr.audits['network-requests']?.details?.items;
  if (!items) return Number.NaN;
  const storeHost = new URL(lhr.finalDisplayedUrl).host;
  return items.filter(({ url }) => {
    if (url === lhr.finalDisplayedUrl) return true;
    const { host, pathname } = new URL(url);
    if (host === storeHost) return pathname.startsWith('/cdn/shop/');
    return host === CDN_HOST && pathname.startsWith('/s/files/');
  }).length;
}
