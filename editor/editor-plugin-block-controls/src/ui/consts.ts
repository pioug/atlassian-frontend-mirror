import { akEditorUnitZIndex, akRichMediaResizeZIndex } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
export const DRAG_HANDLE_HEIGHT = 24;
export const DRAG_HANDLE_WIDTH = 12;
export const DRAG_HANDLE_BORDER_RADIUS = 4;
export const DRAG_HANDLE_ZINDEX = akRichMediaResizeZIndex + akEditorUnitZIndex; //place above legacy resizer
export const DRAG_HANDLE_DEFAULT_GAP = 8;
export const DRAG_HANDLE_NARROW_GAP = 4;
export const DRAG_HANDLE_MAX_GAP = 12;
export const DRAG_HANDLE_MAX_WIDTH_PLUS_GAP = DRAG_HANDLE_WIDTH + DRAG_HANDLE_MAX_GAP;

export const DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT = 4 + 2; // 4px for the divider vertical padding and 2px for the divider height

const nodeTypeExcludeList = ['embedCard', 'mediaSingle', 'table'];

export const dragHandleGap = (nodeType: string, parentNodeType?: string) => {
	if (parentNodeType && parentNodeType !== 'doc') {
		return DRAG_HANDLE_NARROW_GAP;
	}
	if (nodeType === 'layoutSection' && fg('platform_editor_advanced_layouts_breakout_resizing')) {
		return DRAG_HANDLE_MAX_GAP + 12;
	}
	if (nodeTypeExcludeList.includes(nodeType)) {
		return DRAG_HANDLE_MAX_GAP;
	}

	return DRAG_HANDLE_DEFAULT_GAP;
};

export const getNestedNodeLeftPaddingMargin = (nodeType?: string) => {
	switch (nodeType) {
		case 'bodiedExtension':
			return '28px';
		case 'expand':
		case 'nestedExpand':
			return '24px';
		case 'layoutColumn':
			return '20px';
		case 'panel':
			return '40px';
		case 'tableCell':
			return '8px';
		case 'tableHeader':
			return '8px';
		default:
			return `${DRAG_HANDLE_WIDTH + DRAG_HANDLE_NARROW_GAP}px`;
	}
};

export const topPositionAdjustment = (nodeType: string) => {
	if (fg('platform_editor_advanced_layouts_breakout_resizing')) {
		switch (nodeType) {
			case 'rule':
				return -DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT;
			case 'table':
				return DRAG_HANDLE_HEIGHT;
			case 'layoutSection':
				return 8;
			default:
				return 0;
		}
	}

	switch (nodeType) {
		case 'rule':
			return -DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT;
		case 'table':
			return DRAG_HANDLE_HEIGHT;
		default:
			return 0;
	}
};

export const dropTargetMarginMap: { [key: number]: string } = {
	[-24]: token('space.negative.300', '-24px'),
	[-20]: token('space.negative.250', '-20px'),
	[-16]: token('space.negative.200', '-16px'),
	[-12]: token('space.negative.150', '-12px'),
	[-8]: token('space.negative.100', '-8px'),
	[-6]: token('space.negative.075', '-6px'),
	[-4]: token('space.negative.050', '-4px'),
	[-2]: token('space.negative.025', '-2px'),
	0: token('space.0', '0'),
	2: token('space.025', '2px'),
	4: token('space.050', '4px'),
	6: token('space.075', '6px'),
	8: token('space.100', '8px'),
	12: token('space.150', '12px'),
	16: token('space.200', '16px'),
	20: token('space.250', '20px'),
	24: token('space.300', '24px'),
};

/**
 * This document serves as a quick reference map for correlating various space matches
 * to the table provided above.
 * For instance, the number 1 will correspond to \{0: token('space.0', '0')\}.
 */
export const spaceLookupMap = Object.fromEntries(
	// 49 = -24 -> 0 -> 24 totaling 49 entries.
	Array.from({ length: 49 }, (_, index) => {
		const currKeyValue = index - 24;
		const keyValues: number[] = Object.keys(dropTargetMarginMap).map(Number);

		const value = keyValues.reduce((acc, curr) => {
			return Math.abs(currKeyValue - curr) < Math.abs(currKeyValue - acc) ? curr : acc;
		}, 1000);

		return [currKeyValue, dropTargetMarginMap[value]];
	}),
);

// This table contains the "margins" of different nodes
// Note this is not the actually margin of the DOM elements,
// but a percepted margin, e.g. a paragraph has additional margin
// due to the line height and the white spaces.
export const nodeMargins: { [key: string]: { top: number; bottom: number } } = {
	table: { top: 24, bottom: 16 },
	paragraph: { top: 12, bottom: 6 },
	bulletList: { top: 16, bottom: 0 },
	orderedList: { top: 16, bottom: 0 },
	decisionList: { top: 12, bottom: 0 },
	taskList: { top: 8, bottom: 0 },
	codeBlock: { top: 12, bottom: 0 },
	panel: { top: 8, bottom: 0 },
	rule: { top: 24, bottom: 24 },
	mediaSingle: { top: 24, bottom: 24 },
	media: { top: 24, bottom: 24 },
	bodiedExtension: { top: 0, bottom: 0 },
	extension: { top: 12, bottom: 12 },
	heading1: { top: 40, bottom: 0 },
	heading2: { top: 40, bottom: 0 },
	heading3: { top: 36, bottom: 0 },
	heading4: { top: 22, bottom: 0 },
	heading5: { top: 22, bottom: 0 },
	heading6: { top: 18, bottom: 0 },
	layoutSection: { top: 8, bottom: 0 },
	blockquote: { top: 12, bottom: 0 },
	default: { top: 0, bottom: 0 },
};

export const DEFAULT_COLUMN_DISTRIBUTIONS: { [key: number]: number } = {
	1: 100,
	2: 50,
	3: 33.33,
	4: 25,
	5: 20,
};
