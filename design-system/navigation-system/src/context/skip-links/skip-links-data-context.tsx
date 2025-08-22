import { createContext, useContext, useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type SkipLinkData } from './types';

/**
 * Provides a way to store skip links
 *
 * Note: This will be cleaned up with fg('platform_dst_nav4_skip_links_hydration_fix')
 */
export const SkipLinksDataContext = createContext<SkipLinkData[]>([]);

const assignIndex = (num: number, arr: number[]): number => {
	if (!arr.includes(num)) {
		return num;
	}
	return assignIndex(num + 1, arr);
};

/**
 * Sorts an array of skip links by list indexes.
 *
 * Skip links with custom list indexes are positioned first, followed by regular skip links,
 * which are automatically assigned available index positions to avoid conflicts.
 */
export const sortSkipLinks = (arr: SkipLinkData[]) => {
	const customLinks = arr.filter((link: SkipLinkData) => Number.isInteger(link.listIndex));
	if (customLinks.length === 0) {
		return arr;
	}

	const usedIndexes = customLinks.map((a) => a.listIndex) as number[];

	const regularLinksWithIndex = arr
		.filter((link) => link.listIndex === undefined)
		.map((link, index) => {
			const listIndex = assignIndex(index, usedIndexes);
			usedIndexes.push(listIndex);
			return {
				...link,
				listIndex,
			};
		});
	return [...customLinks, ...regularLinksWithIndex].sort((a, b) => a.listIndex! - b.listIndex!);
};

/**
 * Returns memoized and sorted skip links.
 *
 * TODO: when cleaning up fg('platform_dst_nav4_skip_links_hydration_fix'), we can inline this inside `SkipLinksContainer`.
 */
export function useSortedSkipLinks(providedLinks: Array<SkipLinkData>): Array<SkipLinkData> {
	const skipLinksData = useContext(SkipLinksDataContext);

	const links = fg('platform_dst_nav4_skip_links_hydration_fix') ? providedLinks : skipLinksData;

	return useMemo(() => {
		return sortSkipLinks(links);
	}, [links]);
}
