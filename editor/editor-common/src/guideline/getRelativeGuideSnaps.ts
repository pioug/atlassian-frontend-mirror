import { roundToNearest } from '../media-single';

import type { RelativeGuides } from './types';

export const getRelativeGuideSnaps = (
	relativeGuides: RelativeGuides,
	aspectRatio: number,
): number[] => {
	const snapsWidthFromMatchingHeight = Object.keys(relativeGuides.height || {}).map((heightKey) => {
		const height = Number.parseInt(heightKey);
		return roundToNearest(height * aspectRatio);
	});

	const snapsWidthFromMatchingWidth = Object.keys(relativeGuides.width || {}).map((widthKey) => {
		return Number.parseInt(widthKey);
	});

	return [...snapsWidthFromMatchingWidth, ...snapsWidthFromMatchingHeight];
};
