import get from 'lodash/get';
import set from 'lodash/set';

function updateRootItems(
  rootItems,
  allItems = [],
  { key, keysCache, operation },
) {
  const newKeysCache = { ...keysCache };
  // If it is not an append operation we can ignore allItems as they will be swaped with new items
  const allBaseItems = operation === 'UPDATE' ? [] : [...allItems];
  const startIndexWith = allBaseItems.length;
  rootItems.forEach((rootItem, index) => {
    const rootItemKey = rootItem[key];
    if (rootItemKey === undefined) {
      throw new Error(
        `[ERROR] Property '${key}' not found in rootItem[${index}]`,
      );
    } else {
      newKeysCache[rootItem[key]] = index + startIndexWith;
    }
  });

  return {
    keysCache: newKeysCache,
    items: allBaseItems.concat(rootItems),
  };
}

function updateChildItems(
  newitems,
  allTableItems,
  itemParent,
  { key, keysCache, operation },
) {
  const newKeysCache = { ...keysCache };
  const parentCacheKey = itemParent[key];

  if (parentCacheKey === undefined) {
    throw new Error(`[Table Tree] Property '${key}' not found in parent item`);
  }
  const parentLocation = newKeysCache[parentCacheKey];
  const allItemsCopy = [...allTableItems];
  const objectToChange = get(allItemsCopy, parentLocation);
  const baseChildrenOfObjectToChange =
    operation === 'UPDATE' ? [] : get(objectToChange, 'children', []);
  objectToChange.children = baseChildrenOfObjectToChange.concat(newitems);

  // Update cache
  newitems.forEach((item, index) => {
    newKeysCache[item[key]] = `${parentLocation}.children[${
      index + baseChildrenOfObjectToChange.length
    }]`;
  });

  return {
    keysCache: newKeysCache,
    items: set(allItemsCopy, parentLocation, objectToChange),
  };
}

/**
 * This helper class will create a cache of all the id's in the items object and
 * path to the object.
 * Example:
 * [{
 *   // item 1,
 *   id: 1,
 *   children:[{
 *     // item 1.1,
 *     id: '2'
 *   }]
 * }]
 *
 * Cache will look something like:
 * {1: 0, 2: '0.children[0]'}
 */
export default class TableTreeDataHelper {
  key;

  keysCache;

  constructor({ key = 'key' } = {}) {
    this.key = key;
    this.keysCache = {};
  }

  updateItems(items, allItems = [], parentItem) {
    const options = {
      key: this.key,
      keysCache: this.keysCache,
      operation: 'UPDATE',
    };
    if (!parentItem) {
      const { keysCache, items: updatedRootItems } = updateRootItems(
        items,
        allItems,
        options,
      );
      this.keysCache = keysCache;
      return updatedRootItems;
    }

    const { keysCache, items: updatedItems } = updateChildItems(
      items,
      allItems,
      parentItem,
      options,
    );
    this.keysCache = keysCache;
    return updatedItems;
  }

  appendItems(items, allItems = [], parentItem) {
    const options = {
      key: this.key,
      keysCache: this.keysCache,
      operation: 'APPEND',
    };
    if (!parentItem) {
      const { keysCache, items: updatedRootItems } = updateRootItems(
        items,
        allItems,
        options,
      );
      this.keysCache = keysCache;
      return updatedRootItems;
    }

    const { keysCache, items: updatedItems } = updateChildItems(
      items,
      allItems,
      parentItem,
      options,
    );
    this.keysCache = keysCache;
    return updatedItems;
  }
}
