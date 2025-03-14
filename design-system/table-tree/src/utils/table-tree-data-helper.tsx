// TODO: Replace with native function
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_get
import get from 'lodash/get';
// TODO: Replace with native function
// https://stackoverflow.com/a/54733755/14857724
import set from 'lodash/set';

type Operation = 'UPDATE' | 'APPEND';

function updateRootItems<T extends any>(
	rootItems: T[],
	allItems: T[] = [],
	{ key, keysCache, operation }: { key: keyof T; keysCache: any; operation: Operation },
) {
	const newKeysCache = { ...keysCache };
	// If it is not an append operation we can ignore allItems as they will be swaped with new items
	const allBaseItems = operation === 'UPDATE' ? [] : [...allItems];
	const startIndexWith = allBaseItems.length;
	rootItems.forEach((rootItem, index) => {
		const rootItemKey = rootItem[key];
		if (rootItemKey === undefined) {
			throw new Error(`[ERROR] Property '${String(key)}' not found in rootItem[${index}]`);
		} else {
			newKeysCache[rootItem[key]] = index + startIndexWith;
		}
	});

	return {
		keysCache: newKeysCache,
		items: allBaseItems.concat(rootItems),
	};
}

function updateChildItems<T extends any>(
	newitems: T[],
	allTableItems: T[],
	itemParent: T,
	{ key, keysCache, operation }: { key: keyof T; keysCache: any; operation: Operation },
) {
	const newKeysCache = { ...keysCache };
	const parentCacheKey = itemParent[key];

	if (parentCacheKey === undefined) {
		throw new Error(`[Table Tree] Property '${String(key)}' not found in parent item`);
	}
	const parentLocation = newKeysCache[parentCacheKey];
	const allItemsCopy = [...allTableItems];
	const objectToChange = get(allItemsCopy, parentLocation);
	const baseChildrenOfObjectToChange =
		operation === 'UPDATE' ? [] : (get(objectToChange, 'children', []) as T[]);
	(objectToChange as any).children = baseChildrenOfObjectToChange.concat(newitems);

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
export default class TableTreeDataHelper<T extends any = any> {
	key: keyof T;

	keysCache: any;

	constructor({ key = 'key' as keyof T } = {}) {
		this.key = key;
		this.keysCache = {};
	}

	updateItems(items: T[], allItems: T[] = [], parentItem?: T | null) {
		const options = {
			key: this.key,
			keysCache: this.keysCache,
			operation: 'UPDATE' as Operation,
		};
		if (!parentItem) {
			const { keysCache, items: updatedRootItems } = updateRootItems(items, allItems, options);
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

	appendItems(items: T[], allItems: T[] = [], parentItem?: T | null) {
		const options = {
			key: this.key,
			keysCache: this.keysCache,
			operation: 'APPEND' as Operation,
		};
		if (!parentItem) {
			const { keysCache, items: updatedRootItems } = updateRootItems(items, allItems, options);
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
