import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import type { IntlShape } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import type { QuickInsertItem } from '../provider-factory';
import type { QuickInsertHandler, QuickInsertHandlerFn } from '../types';

const processQuickInsertItems = (
	items: Array<QuickInsertHandler>,
	intl: IntlShape,
): Array<QuickInsertItem | QuickInsertHandlerFn> => {
	return items.reduce(
		(acc: Array<QuickInsertItem | QuickInsertHandlerFn>, item: QuickInsertHandler) => {
			if (
				typeof item === 'function' &&
				// we preserve handler items with disableMemo so that we
				// can process them in a later step outside of memoizations
				!item.disableMemo
			) {
				const quickInsertItems = item(intl);
				return acc.concat(quickInsertItems);
			}
			return acc.concat(item);
		},
		[],
	);
};

const memoizedProcessQuickInsertItems = memoizeOne(processQuickInsertItems);

export const memoProcessQuickInsertItems = (
	items: Array<QuickInsertHandler>,
	intl: IntlShape,
): QuickInsertItem[] => {
	const memoizedResults = memoizedProcessQuickInsertItems(items, intl);

	const hasDisabledMemos = items.some((item) => typeof item === 'function' && item.disableMemo);

	if (!hasDisabledMemos) {
		return memoizedResults as QuickInsertItem[];
	}

	return memoizedResults.flatMap((item) =>
		typeof item === 'function' && item.disableMemo ? item(intl) : item,
	) as QuickInsertItem[];
};

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

const optionsWithPriorityRemoved = {
	threshold: 0.3,
	includeScore: true,
	keys: [
		{ name: 'title', weight: 0.57 },
		{ name: 'keywords', weight: 0.08 },
		{ name: 'description', weight: 0.04 },
		{ name: 'keyshortcut', weight: 0.01 },
	],
};

/**
 * This function is used to find and sort QuickInsertItems based on a given query string.
 *
 * @export
 * @param {string} query - The query string to be used in the search.
 * @param {QuickInsertItem[]} items - An array of QuickInsertItems to be searched.
 * @returns {QuickInsertItem[]} - Returns a sorted array of QuickInsertItems based on the priority. If the query string is empty, it will return the array sorted by priority. If a query string is provided, it will return an array of QuickInsertItems that match the query string, sorted by relevance to the query.
 */
export function find(
	query: string,
	items: QuickInsertItem[],
	prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction | undefined,
): QuickInsertItem[] {
	if (query === '') {
		// Copy and sort list by priority
		return items
			.slice(0)
			.sort(
				(a, b) =>
					(a.priority || Number.POSITIVE_INFINITY) - (b.priority || Number.POSITIVE_INFINITY),
			);
	}

	const fuseOptions: Fuse.IFuseOptions<QuickInsertItem> = {
		...(fg('platform_editor_remove_quick_insert_priority_key')
			? optionsWithPriorityRemoved
			: options),
	};

	if (prioritySortingFn) {
		const sortFn = prioritySortingFn(items);
		// prioritySortingFn will trigger the experiment exposure, but sortFn
		// will be undefined for the control group.
		if (sortFn) {
			fuseOptions.sortFn = sortFn;
		}
	}

	const fuse = new Fuse(items, fuseOptions);

	return fuse.search(query).map((result) => result.item);
}
