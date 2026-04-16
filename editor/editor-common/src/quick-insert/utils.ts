import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import type { IntlShape } from 'react-intl';

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

	const fuseOptions: Fuse.IFuseOptions<QuickInsertItem> = { ...options };

	if (prioritySortingFn) {
		const sortFn = prioritySortingFn(items);
		// prioritySortingFn will trigger the experiment exposure, but sortFn
		// will be undefined for the control group.
		if (sortFn) {
			fuseOptions.sortFn = sortFn;
		}
	}

	const fuse = new Fuse(items, fuseOptions);
	const results = fuse.search(query);

	if (fg('jim-lower-ranking-in-jira-macro-search')) {
		// searching for jira work items macro first
		const datasourceIndex = results.findIndex(
			(r) => r.item.id === 'datasource' && r.item.keywords?.includes('jira'),
		);

		//  then searching for the legacy jira macro
		const legacyIndex = results.findIndex(
			(r) => typeof r.item.key === 'string' && r.item.key.endsWith(':jira'),
		);

		// the jira legcy macro is found before the jira work items macro then swap the two
		if (
			datasourceIndex > 0 &&
			legacyIndex >= 0 &&
			legacyIndex < datasourceIndex &&
			Math.abs((results[datasourceIndex].score ?? 0) - (results[legacyIndex].score ?? 0)) < 0.2
		) {
			const [datasource] = results.splice(datasourceIndex, 1);
			results.splice(legacyIndex, 0, datasource);
		}
	}

	return results.map((result) => result.item);
}
