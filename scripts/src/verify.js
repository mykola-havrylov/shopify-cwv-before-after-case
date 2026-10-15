// Read-only check that the store matches data/products.csv, the image plan, the collections and the menus.
import { COLLECTIONS, MENUS, expectedMembers } from './catalog.js';
import { listFiles } from './media.js';
import { compareMenu, listMenus, menuItems } from './menus.js';

const PRODUCT_CHECK = `#graphql
  query ProductCheck($handle: String!, $publicationId: ID!) {
    productByIdentifier(identifier: { handle: $handle }) {
      id
      status
      publishedOnPublication(publicationId: $publicationId)
      media(first: 50) {
        nodes {
          alt
          status
          mediaContentType
        }
      }
      variants(first: 50) {
        nodes {
          sku
          price
          availableForSale
          inventoryItem {
            tracked
          }
          media(first: 1) {
            nodes {
              alt
              status
            }
          }
        }
      }
    }
  }
`;

const COLLECTION_CHECK = `#graphql
  query CollectionCheck($handle: String!, $publicationId: ID!) {
    collectionByIdentifier(identifier: { handle: $handle }) {
      id
      publishedOnPublication(publicationId: $publicationId)
      products(first: 50) {
        nodes {
          handle
        }
      }
    }
  }
`;

const PRODUCTS_COUNT = `#graphql
  query ProductsCount {
    productsCount {
      count
    }
  }
`;

const sameSet = (a, b) => a.length === b.length && a.every((item) => b.includes(item));

export function checkProduct(product, entries, found) {
  if (!found) return ['missing in the store'];
  const problems = [];
  if (found.status !== product.status) problems.push(`status ${found.status}, expected ${product.status}`);
  if (product.published && !found.publishedOnPublication) problems.push('not published to the Online Store');

  const skus = found.variants.nodes.map(({ sku }) => sku);
  const expectedSkus = product.variants.map(({ sku }) => sku);
  if (!sameSet(skus, expectedSkus)) problems.push(`variants ${skus.join(', ')}, expected ${expectedSkus.join(', ')}`);

  for (const variant of product.variants) {
    const node = found.variants.nodes.find(({ sku }) => sku === variant.sku);
    if (!node) continue;
    if (Number(node.price) !== Number(variant.price)) problems.push(`${variant.sku}: price ${node.price}`);
    if (!node.availableForSale) problems.push(`${variant.sku}: not available for sale`);
    if (node.inventoryItem.tracked !== variant.tracked) {
      problems.push(`${variant.sku}: inventory ${node.inventoryItem.tracked ? 'tracked' : 'not tracked'}`);
    }

    const entry = entries.find(({ sku }) => sku === variant.sku);
    const media = node.media.nodes[0];
    if (entry && media?.alt !== entry.alt) problems.push(`${variant.sku}: variant image is not "${entry.filename}"`);
    else if (entry && media?.status !== 'READY') problems.push(`${variant.sku}: image status ${media?.status}`);
  }

  const images = found.media.nodes.filter(({ mediaContentType }) => mediaContentType === 'IMAGE');
  if (images.length !== entries.length) problems.push(`${images.length} images, expected ${entries.length}`);
  return problems;
}

export async function verifyStore({ client, products, plan, publicationId }) {
  const rows = [];

  for (const product of products) {
    const { productByIdentifier } = await client.graphql(PRODUCT_CHECK, { handle: product.handle, publicationId });
    const entries = plan.filter((entry) => entry.kind === 'product' && entry.handle === product.handle);
    rows.push({ kind: 'product', name: product.handle, problems: checkProduct(product, entries, productByIdentifier) });
  }

  const { productsCount } = await client.graphql(PRODUCTS_COUNT);
  if (productsCount.count !== products.length) {
    rows.push({
      kind: 'store',
      name: 'products',
      problems: [`${productsCount.count} products in the store, expected ${products.length}`],
    });
  }

  for (const collection of COLLECTIONS) {
    const { collectionByIdentifier: found } = await client.graphql(COLLECTION_CHECK, {
      handle: collection.handle,
      publicationId,
    });
    const problems = [];
    if (!found) problems.push('missing in the store');
    else {
      if (!found.publishedOnPublication) problems.push('not published to the Online Store');
      const members = found.products.nodes.map(({ handle }) => handle);
      const expected = expectedMembers(collection, products);
      if (!sameSet(members, expected)) {
        problems.push(`contains ${members.join(', ') || 'nothing'}; expected ${expected.join(', ')}`);
      }
    }
    rows.push({ kind: 'collection', name: collection.handle, problems });
  }

  const menus = await listMenus(client);
  for (const menu of MENUS) {
    let problems;
    try {
      problems = compareMenu(menus.get(menu.handle), await menuItems(client, menu));
    } catch (error) {
      problems = [error.message];
    }
    rows.push({ kind: 'menu', name: menu.handle, problems });
  }

  const files = await listFiles(client);
  for (const entry of plan.filter(({ kind }) => kind !== 'product')) {
    const status = files.get(entry.filename)?.fileStatus;
    rows.push({
      kind: 'file',
      name: entry.filename,
      problems: status === 'READY' ? [] : [`status ${status ?? 'missing'}`],
    });
  }

  return { rows, ok: rows.every(({ problems }) => problems.length === 0) };
}
