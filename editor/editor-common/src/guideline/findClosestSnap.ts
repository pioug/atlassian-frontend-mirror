import { MEDIA_DYNAMIC_GUIDELINE_PREFIX } from './constants';
import type { GuidelineSnap } from './types';

/**
 * Returns keys of guidelines that are closest to the image and withthin the snapGap.
 * If both default and dynamic guidelines present, only returns default guidelines
 */
export const findClosestSnap = (
	mediaSingleWidth: number,
	snapArray: number[],
	guidelineSnaps: GuidelineSnap[],
	snapGap: number = 0,
): {
	gap: number;
	// only highlight default guidelines
	// when there are both default and dynamic guidelines to be highlighted
	keys: string[];
} => {
	const closestGapIndex = snapArray.reduce(
		(prev, curr, index) =>
			Math.abs(curr - mediaSingleWidth) < Math.abs(snapArray[prev] - mediaSingleWidth)
				? index
				: prev,
		0,
	);

	const gap = Math.abs(snapArray[closestGapIndex] - mediaSingleWidth);
	if (gap < snapGap) {
		const snappingWidth = snapArray[closestGapIndex];
		const guidelineKeys: string[] = [];
		// find wich guideline have the matching snap width
		guidelineSnaps.forEach((gs) => {
			if (gs.width === snappingWidth) {
				guidelineKeys.push(gs.guidelineKey);
			}
		});

		const defaultGuidelineKeys = guidelineKeys.filter(
			(guidelineKey) => !guidelineKey.startsWith(MEDIA_DYNAMIC_GUIDELINE_PREFIX),
		);

		return {
			gap,
			// only highlight default guidelines
			// when there are both default and dynamic guidelines to be highlighted
			keys:
				defaultGuidelineKeys.length && defaultGuidelineKeys.length < guidelineKeys.length
					? defaultGuidelineKeys
					: guidelineKeys,
		};
	}
	return { gap, keys: [] };
};
