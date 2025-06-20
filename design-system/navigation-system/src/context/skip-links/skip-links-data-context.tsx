import { createContext, useContext, useMemo } from 'react';

import { type SkipLinkData } from './types';

/**
 * Provides a way to store skip links
 */
export const SkipLinksDataContext = createContext<SkipLinkData[]>([]);

const assignIndex = (num: number, arr: number[]): number => {
	if (!arr.includes(num)) {
		return num;
	}
	return assignIndex(num + 1, arr);
};

const sortSkipLinks = (arr: SkipLinkData[]) => {
	const customLinks = arr.filter((link: SkipLinkData) => Number.isInteger(link.listIndex));
	if (customLinks.length === 0) {
		return arr;
	}
	const usedIndexes = customLinks.map((a) => a.listIndex) as number[];
	const regularLinksWithIdx = arr
		.filter((link) => link.listIndex === undefined)
		.map((link, idx) => {
			const listIndex = assignIndex(idx, usedIndexes);
			usedIndexes.push(listIndex);
			return {
				...link,
				listIndex,
			};
		});
	return [...customLinks, ...regularLinksWithIdx].sort((a, b) => a.listIndex! - b.listIndex!);
};

export const useSortedSkipLinks = () => {
	const skipLinksData = useContext(SkipLinksDataContext);
	return useMemo(() => {
		return sortSkipLinks(skipLinksData);
	}, [skipLinksData]);
};
