import memoizeOne from 'memoize-one';

import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import {
	EXPAND_CONTAINER_PADDING,
	LAYOUT_COLUMN_PADDING,
	resizerHandleThumbWidth,
} from '@atlaskit/editor-common/styles';
import type { EditorContainerWidth } from '@atlaskit/editor-common/types';
import { type NodeType } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPadding,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
	akEditorCalculatedWideLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorDefaultLayoutWidth,
	akEditorMaxLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

const WIDTHS = {
	MIN: akEditorDefaultLayoutWidth,
	WIDE: akEditorCalculatedWideLayoutWidth,
	FULL: akEditorFullWidthLayoutWidth,
	MAX: akEditorMaxLayoutWidth,
};

export const GUIDELINE_KEYS = {
	lineLengthLeft: 'grid_left',
	lineLengthRight: 'grid_right',
	wideLeft: 'wide_left',
	wideRight: 'wide_right',
	fullWidthLeft: 'full_width_left',
	fullWidthRight: 'full_width_right',
	maxWidthLeft: 'max_width_left',
	maxWidthRight: 'max_width_right',
} as const;

const AK_NESTED_DND_GUTTER_OFFSET = 8;
const roundToNearest = (value: number, interval: number = 0.5): number =>
	Math.round(value / interval) * interval;

export const getGuidelines = memoizeOne(
	(
		isResizing: boolean,
		newWidth: number,
		getEditorWidth: () => EditorContainerWidth | undefined,
		nodeType?: NodeType | undefined,
	) => {
		const guidelines: GuidelineConfig[] = [];
		if (!isResizing) {
			return guidelines;
		}

		let innerPaddingOffset = 0;
		if (nodeType) {
			switch (nodeType.name) {
				case 'expand':
					innerPaddingOffset =
						EXPAND_CONTAINER_PADDING + resizerHandleThumbWidth + AK_NESTED_DND_GUTTER_OFFSET;
					break;
				case 'layoutSection':
					innerPaddingOffset = LAYOUT_COLUMN_PADDING + AK_NESTED_DND_GUTTER_OFFSET;
					break;
				default:
					break;
			}
		}
		const { width } = getEditorWidth() || {};

		const padding =
			width &&
			width <= akEditorFullPageNarrowBreakout &&
			editorExperiment('platform_editor_preview_panel_responsiveness', true, {
				exposure: true,
			})
				? akEditorGutterPaddingReduced
				: akEditorGutterPaddingDynamic();

		const fullWidth = width
			? Math.min(WIDTHS.FULL, width - 2 * padding - akEditorGutterPadding)
			: undefined;

		const maxWidth =
			width && expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true)
				? Math.min(WIDTHS.MAX, width - 2 * padding - akEditorGutterPadding)
				: undefined;

		guidelines.push({
			key: GUIDELINE_KEYS.lineLengthLeft,
			position: { x: -roundToNearest(WIDTHS.MIN / 2 + innerPaddingOffset) },
			active: newWidth === WIDTHS.MIN,
		});
		guidelines.push({
			key: GUIDELINE_KEYS.lineLengthRight,
			position: { x: roundToNearest(WIDTHS.MIN / 2 + innerPaddingOffset) },
			active: newWidth === WIDTHS.MIN,
		});

		guidelines.push({
			key: GUIDELINE_KEYS.wideLeft,
			position: { x: -roundToNearest(WIDTHS.WIDE / 2 + innerPaddingOffset) },
			active: newWidth === WIDTHS.WIDE,
		});
		guidelines.push({
			key: GUIDELINE_KEYS.wideRight,
			position: { x: roundToNearest(WIDTHS.WIDE / 2 + innerPaddingOffset) },
			active: newWidth === WIDTHS.WIDE,
		});

		if (fullWidth) {
			guidelines.push({
				key: GUIDELINE_KEYS.fullWidthLeft,
				position: { x: -roundToNearest(fullWidth / 2 + innerPaddingOffset) },
				active: newWidth === fullWidth,
			});
			guidelines.push({
				key: GUIDELINE_KEYS.fullWidthRight,
				position: { x: roundToNearest(fullWidth / 2 + innerPaddingOffset) },
				active: newWidth === fullWidth,
			});
		}

		if (maxWidth) {
			guidelines.push({
				key: GUIDELINE_KEYS.maxWidthLeft,
				position: { x: -roundToNearest(maxWidth / 2 + innerPaddingOffset) },
				active: newWidth === maxWidth,
			});
			guidelines.push({
				key: GUIDELINE_KEYS.maxWidthRight,
				position: { x: roundToNearest(maxWidth / 2 + innerPaddingOffset) },
				active: newWidth === maxWidth,
			});
		}

		return guidelines;
	},
);
