// Idempotent navigation menus. A new store already has `main-menu` and `footer`, so a menu is looked up by handle
// and replaced with menuUpdate only when its items differ; menuCreate is used only when the handle does not exist.
// Docs: https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/menuUpdate
import { assertNoUserErrors } from './user-errors.js';

const MENUS_QUERY = `#graphql
  query Menus {
    menus(first: 50) {
      nodes {
        id
        handle
        title
        items {
          title
          type
          resourceId
          url
          items {
            id
          }
        }
      }
    }
  }
`;

const COLLECTION_ID = `#graphql
  query CollectionId($handle: String!) {
    collectionByIdentifier(identifier: { handle: $handle }) {
      id
    }
  }
`;

const MENU_UPDATE = `#graphql
  mutation UpdateMenu($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
    menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
      menu {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const MENU_CREATE = `#graphql
  mutation CreateMenu($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
    menuCreate(title: $title, handle: $handle, items: $items) {
      menu {
        id
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export async function listMenus(client) {
  const { menus } = await client.graphql(MENUS_QUERY);
  return new Map(menus.nodes.map((menu) => [menu.handle, menu]));
}

export async function menuItems(client, menu) {
  const items = [];
  for (const item of menu.items) {
    if (!item.collection) {
      items.push({ title: item.title, type: item.type, url: item.url, items: [] });
      continue;
    }
    const { collectionByIdentifier } = await client.graphql(COLLECTION_ID, { handle: item.collection });
    if (!collectionByIdentifier) throw new Error(`Menu "${menu.handle}": collection "${item.collection}" is missing.`);
    items.push({
      title: item.title,
      type: 'COLLECTION',
      resourceId: collectionByIdentifier.id,
      url: `/collections/${item.collection}`,
      items: [],
    });
  }
  return items;
}

export function compareMenu(found, items) {
  if (!found) return ['missing in the store'];
  const problems = [];
  if (found.items.length !== items.length) {
    problems.push(`${found.items.length} items, expected ${items.length}`);
  }
  items.forEach((item, index) => {
    const actual = found.items[index];
    if (!actual) return;
    const target = item.resourceId ?? item.url;
    const actualTarget = item.resourceId ? actual.resourceId : actual.url;
    if (actual.title !== item.title || actual.type !== item.type || actualTarget !== target) {
      problems.push(`item ${index + 1} is "${actual.title}" (${actual.type}), expected "${item.title}" (${item.type})`);
    }
    if (actual.items.length > 0) problems.push(`item ${index + 1} has nested items`);
  });
  return problems;
}

export async function ensureMenu(client, menu, existing) {
  const items = await menuItems(client, menu);
  const found = existing.get(menu.handle);

  if (!found) {
    const { menuCreate } = await client.graphql(MENU_CREATE, { title: menu.title, handle: menu.handle, items });
    assertNoUserErrors(`Creating menu "${menu.handle}"`, menuCreate.userErrors);
    return { status: 'created' };
  }
  if (compareMenu(found, items).length === 0) return { status: 'unchanged' };

  const { menuUpdate } = await client.graphql(MENU_UPDATE, {
    id: found.id,
    title: found.title,
    handle: menu.handle,
    items,
  });
  assertNoUserErrors(`Updating menu "${menu.handle}"`, menuUpdate.userErrors);
  return { status: 'updated' };
}
