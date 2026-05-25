import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import { akEditorGutterPaddingDynamic } from '@atlaskit/editor-shared-styles';

import { EVEN_SHARE_RATIO } from './constants';

export const sumWidths = (widths: Array<number>): number =>
	widths.reduce((sum, width) => sum + width, 0);

// 2px absorbs sub-pixel rounding in `getRenderedColgroupColumnWidths`.
const SUB_PIXEL_ROUNDING_ALLOWANCE = 2;

/**
 * Clamps each desired width to `[tableCellMinWidth, MAX × evenShare]`. Greedy
 * columns (paragraphs) hit the ceiling and wrap; small columns stay at their
 * natural width. Leftover canvas budget grows ceiling-hitters up to their
 * desired; overflow reclaims from ceiling-hitters only.
 */
export const distributeByEvenShareRatio = (
	desiredWidths: Array<number>,
	editorContainerWidth: number,
): Array<number> => {
	if (desiredWidths.length === 0 || !isFinite(editorContainerWidth) || editorContainerWidth <= 0) {
		return desiredWidths;
	}

	const usableWidth = Math.max(
		editorContainerWidth - akEditorGutterPaddingDynamic() * 2,
		tableCellMinWidth * desiredWidths.length,
	);
	const evenShare = usableWidth / desiredWidths.length;
	const ceiling = EVEN_SHARE_RATIO.MAX * evenShare;
	const isCompactColumn = (width: number): boolean => width <= ceiling;

	const desiredCeil = desiredWidths.map((desired) =>
		Math.max(tableCellMinWidth, Math.ceil(desired) + SUB_PIXEL_ROUNDING_ALLOWANCE),
	);
	const capped = desiredCeil.map((desired) =>
		isCompactColumn(desired) ? desired : Math.min(ceiling, desired),
	);

	const sum = sumWidths(capped);

	// Underflow: grow non-protected ceiling-hitters into the leftover, up to their desired.
	if (sum < usableWidth) {
		const leftover = usableWidth - sum;
		const growthHeadroom = capped.map((width, index) =>
			!isCompactColumn(desiredCeil[index]) && width >= ceiling
				? Math.max(desiredCeil[index] - width, 0)
				: 0,
		);
		const totalHeadroom = sumWidths(growthHeadroom);
		if (totalHeadroom > 0) {
			const totalGrowth = Math.min(leftover, totalHeadroom);
			return capped.map((width, index) => {
				const headroom = growthHeadroom[index];
				if (headroom <= 0) {
					return width;
				}
				return width + (headroom / totalHeadroom) * totalGrowth;
			});
		}
		return capped;
	}

	if (sum === usableWidth) {
		return capped;
	}

	// Overflow: reclaim from non-protected ceiling-hitters only.
	const overage = sum - usableWidth;
	const slacks = capped.map((width, index) =>
		!isCompactColumn(desiredCeil[index]) && width >= ceiling ? Math.max(width - tableCellMinWidth, 0) : 0,
	);
	const totalSlack = sumWidths(slacks);
	if (totalSlack <= 0) {
		return capped;
	}

	return capped.map((width, index) => {
		const slack = slacks[index];
		if (slack <= 0) {
			return width;
		}
		const share = (slack / totalSlack) * Math.min(overage, totalSlack);
		return Math.max(width - share, tableCellMinWidth);
	});
};
