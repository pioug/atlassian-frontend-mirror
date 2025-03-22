import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';

import { fg } from '@atlaskit/platform-feature-flags';

type Operation = 'UPDATE' | 'APPEND';

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_get
// https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L13126
export const internalGet = (
	obj: Object,
	path: Array<any> | string,
	defaultValue: any = undefined,
): any => {
	const travel = (regexp: RegExp) =>
		String.prototype.split
			.call(path, regexp)
			.filter(Boolean)
			.reduce(
				(res: Record<string, any> | undefined, key: string) =>
					res !== null && res !== undefined ? res[key] : res,
				obj,
			);
	const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
	return result === undefined || result === obj ? defaultValue : result;
};

// https://stackoverflow.com/a/54733755/14857724
// https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L13673
export const internalSet = (obj: Object, providedPath: Array<any> | string, value: any): any => {
	// When obj is not an object, fail gracefully
	if (Object(obj) !== obj) {
		return obj;
	}

	// If not yet an array, get the keys from the string-path
	const path: string[] = !Array.isArray(providedPath)
		? providedPath.toString().match(/[^.[\]]+/g) || []
		: providedPath;

	// Iterate all of them except the last one
	const result = path.slice(0, -1).reduce((acc: Record<string, any>, c, index: number) => {
		// Does the key exist and is its value an object?
		return Object(acc[c]) === acc[c]
			? acc[c] // Yes: then follow that path
			: // No: create the key. Is the next key a potential array-index?
				(acc[c] =
					Math.abs(parseInt(path[index + 1])) >> 0 === +path[index + 1]
						? [] // Yes: assign a new array object
						: {}); // No: assign a new plain object
	}, obj);

	// Finally assign the value to the last key
	result[path[path.length - 1]] = value;

	// Return the top-level object to allow chaining
	return obj;
};

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
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	const get = fg('dst-a11y-remove-lodash-from-table-tree') ? internalGet : lodashGet;
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	const set = fg('dst-a11y-remove-lodash-from-table-tree') ? internalSet : lodashSet;

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
