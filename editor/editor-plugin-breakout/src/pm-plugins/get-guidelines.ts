import memoizeOne from 'memoize-one';

import { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import {
	EXPAND_CONTAINER_PADDING,
	LAYOUT_COLUMN_PADDING,
	resizerHandleThumbWidth,
} from '@atlaskit/editor-common/styles';
import { EditorContainerWidth } from '@atlaskit/editor-common/types';
import { NodeType } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPadding,
	akEditorCalculatedWideLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles';

const WIDTHS = {
	MIN: akEditorDefaultLayoutWidth,
	MAX: akEditorFullWidthLayoutWidth,
};

const GUIDELINE_KEYS = {
	lineLength: 'grid',
	wide: 'wide',
	fullWidth: 'full_width',
};

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
		const { width, lineLength } = getEditorWidth() || {};
		// TODO: ED-28109 - use breakoutWideScaleRatio to calculate wide guideline
		const wide = akEditorCalculatedWideLayoutWidth;
		const fullWidth = width
			? Math.min(WIDTHS.MAX, width - 2 * akEditorGutterPaddingDynamic() - akEditorGutterPadding)
			: undefined;

		if (lineLength) {
			guidelines.push({
				key: `${GUIDELINE_KEYS.lineLength}_left`,
				position: { x: -roundToNearest(lineLength / 2 + innerPaddingOffset) },
				active: newWidth === lineLength,
			});
			guidelines.push({
				key: `${GUIDELINE_KEYS.lineLength}_right`,
				position: { x: roundToNearest(lineLength / 2 + innerPaddingOffset) },
				active: newWidth === lineLength,
			});
		}

		guidelines.push({
			key: `${GUIDELINE_KEYS.wide}_left`,
			position: { x: -roundToNearest(wide / 2 + innerPaddingOffset) },
			active: newWidth === wide,
		});
		guidelines.push({
			key: `${GUIDELINE_KEYS.wide}_right`,
			position: { x: roundToNearest(wide / 2 + innerPaddingOffset) },
			active: newWidth === wide,
		});

		if (fullWidth) {
			guidelines.push({
				key: `${GUIDELINE_KEYS.fullWidth}_left`,
				position: { x: -roundToNearest(fullWidth / 2 + innerPaddingOffset) },
				active: newWidth === fullWidth,
			});
			guidelines.push({
				key: `${GUIDELINE_KEYS.fullWidth}_right`,
				position: { x: roundToNearest(fullWidth / 2 + innerPaddingOffset) },
				active: newWidth === fullWidth,
			});
		}

		return guidelines;
	},
);
