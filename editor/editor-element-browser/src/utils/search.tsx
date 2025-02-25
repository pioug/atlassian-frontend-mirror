import Fuse from 'fuse.js';

import type { InsertPanelItem } from '../types';

// Copied from platform/packages/editor/editor-common/src/quick-insert/utils.ts

const options = {
	threshold: 0.3,
	includeScore: true,
	keys: [
		{ name: 'title', weight: 0.57 },
		{ name: 'priority', weight: 0.3 },
		{ name: 'keywords', weight: 0.08 },
		{ name: 'description', weight: 0.04 },
		{ name: 'keyshortcut', weight: 0.01 },
	],
};

// If an item has an id, it is a native editor element
// for the demo we could also use item.shouldDisplayAtTop (can potentially be
// replaced by item.isEditorExtention or something similar).
// For now, let's test search usring id as it is closer to production implementation.
const prioritySortingFn = (items: InsertPanelItem[]) => {
	return (a: Fuse.FuseSortFunctionArg, b: Fuse.FuseSortFunctionArg): number => {
		if (items[a.idx].id && items[b.idx].id) {
			return a.score - b.score;
		} else if (items[a.idx].id) {
			return -1;
		} else {
			return 1;
		}
	};
};

/**
 * This function is used to find and sort InsertPanelItem based on a given query string.
 *
 * @export
 * @param {string} query - The query string to be used in the search.
 * @param {InsertPanelItem[]} items - An array of InsertPanelItem to be searched.
 * @returns {InsertPanelItem[]} - Returns a sorted array of InsertPanelItem based on the priority. If the query string is empty,
 * it will return the array sorted by priority. If a query string is provided, it will return an array of QuickInsertItems that
 * match the query string, sorted by relevance to the query.
 */
export function find(query: string, items: InsertPanelItem[]): InsertPanelItem[] {
	if (query === '') {
		// Copy and sort list by priority
		return items
			.slice(0)
			.sort(
				(a, b) =>
					(a.priority || Number.POSITIVE_INFINITY) - (b.priority || Number.POSITIVE_INFINITY),
			);
	}

	const fuseOptions: Fuse.IFuseOptions<InsertPanelItem> = {
		...options,
		sortFn: prioritySortingFn(items),
	};
	const fuse = new Fuse(items, fuseOptions);

	return fuse.search(query).map((result) => result.item);
}
