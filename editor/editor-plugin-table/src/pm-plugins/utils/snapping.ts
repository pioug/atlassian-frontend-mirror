import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import { isVerticalPosition } from '@atlaskit/editor-common/guideline';
import {
	akEditorCalculatedWideLayoutWidth,
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
	akEditorMaxWidthLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

const numberOfLanesInDefaultLayoutWidth = 12;

const calculateSubSnappingWidths = (totalLanes: number, totalWidth: number) =>
	new Array(Math.round(totalLanes / 2) - 1)
		.fill(totalWidth / totalLanes)
		.map((v, i) => v * (i + 1) * 2);

export const calculateDefaultSnappings = (lengthOffset: number = 0) => [
	...calculateSubSnappingWidths(
		numberOfLanesInDefaultLayoutWidth,
		akEditorDefaultLayoutWidth + lengthOffset,
	),
	akEditorDefaultLayoutWidth + lengthOffset,
	akEditorCalculatedWideLayoutWidth + lengthOffset,
	akEditorFullWidthLayoutWidth + lengthOffset,
];

export type GuidelineExcludeConfig = {
	breakoutPoints: boolean;
	innerGuidelines: boolean;
};

const getPadding = (editorContainerWidth: number) => {
	return editorContainerWidth <= akEditorFullPageNarrowBreakout &&
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
		? akEditorGutterPaddingReduced
		: akEditorGutterPaddingDynamic();
};

// FF TablePreserve for calculateDefaultSnappings
export const calculateDefaultTablePreserveSnappings = (
	lengthOffset = 0,
	editorContainerWidth = akEditorFullWidthLayoutWidth,
	exclude: GuidelineExcludeConfig = {
		innerGuidelines: false,
		breakoutPoints: false,
	},
) => {
	const padding = getPadding(editorContainerWidth);

	const dynamicFullWidthLine =
		editorContainerWidth - padding * 2 >= akEditorFullWidthLayoutWidth
			? akEditorFullWidthLayoutWidth
			: editorContainerWidth - padding * 2;

	const dynamicMaxWidthLine =
		editorContainerWidth - padding * 2 >= akEditorMaxWidthLayoutWidth
			? akEditorMaxWidthLayoutWidth
			: editorContainerWidth - padding * 2;

	const guides = [dynamicFullWidthLine - lengthOffset];

	if (
		expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true) ||
		expValEquals('confluence_max_width_content_appearance', 'isEnabled', true)
	) {
		guides.push(dynamicMaxWidthLine - lengthOffset);
	}

	if (!exclude.breakoutPoints) {
		guides.unshift(
			akEditorDefaultLayoutWidth + lengthOffset,
			akEditorCalculatedWideLayoutWidth + lengthOffset,
		);
	}

	if (!exclude.innerGuidelines) {
		guides.unshift(
			0,
			...calculateSubSnappingWidths(
				numberOfLanesInDefaultLayoutWidth,
				akEditorDefaultLayoutWidth + lengthOffset,
			),
		);
	}

	return guides;
};

export const defaultSnappingWidths = calculateDefaultSnappings();

export const PRESERVE_TABLE_SNAPPING_LENGTH_OFFSET = 0;
// FF TablePreserve for defaultSnappingWidths
export const defaultTablePreserveSnappingWidths = (
	lengthOffset: number,
	editorContainerWidth: number,
	exclude: GuidelineExcludeConfig = {
		innerGuidelines: false,
		breakoutPoints: false,
	},
) => {
	const padding = getPadding(editorContainerWidth);
	return editorContainerWidth - padding * 2 > akEditorFullWidthLayoutWidth
		? calculateDefaultSnappings()
		: calculateDefaultTablePreserveSnappings(lengthOffset, editorContainerWidth, exclude); // lengthOffset was hardcoded 0 here, created PRESERVE_TABLE_SNAPPING_LENGTH_OFFSET instead.
};

/**
 * Returns keys of guidelines that are closest to the table and within the snapGap
 */
export const findClosestSnap = (
	currentWidth: number,
	snapWidths: number[],
	guidelines: GuidelineConfig[],
	snapGap: number = 0,
	tolerance: number = 0,
) => {
	const closestGapIndex = snapWidths.reduce(
		(prev, curr, index) =>
			Math.abs(curr - currentWidth) < Math.abs(snapWidths[prev] - currentWidth) ? index : prev,
		0,
	);
	const gap = Math.abs(snapWidths[closestGapIndex] - currentWidth);
	if (gap < snapGap) {
		const snappingWidth = Math.round(snapWidths[closestGapIndex]);
		const guidelineKeys = guidelines.reduce<string[]>((acc, guideline) => {
			// NOTE: The snap points are based on the guidelines, however their formatted as a length value whereas the guidelines
			// are point based. The point base x coords are calculated by halving the lengths. This means we can convert the
			// point base position to length by simply multiplying by 2.
			const length = Math.round(
				Math.abs(
					isVerticalPosition(guideline.position) ? guideline.position.x : guideline.position.y,
				) * 2,
			);
			if (snappingWidth >= length - tolerance && snappingWidth <= length + tolerance) {
				acc.push(guideline.key);
			}
			return acc;
		}, []);

		return {
			gap,
			keys: guidelineKeys,
		};
	}
	return { gap, keys: [] };
};
