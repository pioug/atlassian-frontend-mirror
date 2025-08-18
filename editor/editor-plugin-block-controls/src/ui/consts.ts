import { DRAG_HANDLE_WIDTH } from '@atlaskit/editor-common/styles';
import { akEditorUnitZIndex, akRichMediaResizeZIndex } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

export const DRAG_HANDLE_HEIGHT = 24;

export const DRAG_HANDLE_BORDER_RADIUS = 4;
export const DRAG_HANDLE_ZINDEX = akRichMediaResizeZIndex + akEditorUnitZIndex; //place above legacy resizer
export const DRAG_HANDLE_DEFAULT_GAP = 8;
export const DRAG_HANDLE_NARROW_GAP = 4;
export const DRAG_HANDLE_MAX_GAP = 12;
export const DRAG_HANDLE_MAX_WIDTH_PLUS_GAP = DRAG_HANDLE_WIDTH + DRAG_HANDLE_MAX_GAP;

export const DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT = 4 + 2; // 4px for the divider vertical padding and 2px for the divider height
export const DRAG_HANDLE_H1_TOP_ADJUSTMENT = 5;
export const DRAG_HANDLE_H2_TOP_ADJUSTMENT = 2;
export const DRAG_HANDLE_H3_TOP_ADJUSTMENT = 1;
export const DRAG_HANDLE_H4_TOP_ADJUSTMENT = 3;
export const DRAG_HANDLE_H5_TOP_ADJUSTMENT = 3;
export const DRAG_HANDLE_H6_TOP_ADJUSTMENT = 3;
export const DRAG_HANDLE_LAYOUT_SECTION_TOP_ADJUSTMENT = 8;
export const DRAG_HANDLE_PARAGRAPH_TOP_ADJUSTMENT = 2;

/** We only want to shift-select nodes that are at the top level of a document.
 *  This is because funky things happen when selecting inside of tableCells, but we
 *  also want to avoid heavily nested cases to descope potential corner cases.
 *  Various top level nodes have their selection 'from' at depths other than 0,
 *  so we allow for some leniency to capture them all. e.g. Table is depth 3.
 */
export const DRAG_HANDLE_MAX_SHIFT_CLICK_DEPTH = 3;
export const STICKY_CONTROLS_TOP_MARGIN = 8;

export const QUICK_INSERT_HEIGHT = 24;
export const QUICK_INSERT_WIDTH = 24;
export const QUICK_INSERT_DIMENSIONS = { width: QUICK_INSERT_WIDTH, height: QUICK_INSERT_HEIGHT };
export const QUICK_INSERT_LEFT_OFFSET = 16;

const nodeTypeExcludeList = ['embedCard', 'mediaSingle', 'table'];
const breakoutResizableNodes = ['expand', 'layoutSection', 'codeBlock'];

export const dragHandleGap = (nodeType: string, parentNodeType?: string) => {
	if (parentNodeType && parentNodeType !== 'doc') {
		return DRAG_HANDLE_NARROW_GAP;
	}

	if (
		editorExperiment('platform_editor_breakout_resizing', true) &&
		breakoutResizableNodes.includes(nodeType)
	) {
		if (nodeType === 'layoutSection') {
			return DRAG_HANDLE_MAX_GAP + 20;
		} else {
			return DRAG_HANDLE_MAX_GAP;
		}
	}
	if (nodeType === 'layoutSection') {
		return DRAG_HANDLE_DEFAULT_GAP + 20;
	}

	if (nodeTypeExcludeList.includes(nodeType)) {
		return DRAG_HANDLE_MAX_GAP;
	}

	return DRAG_HANDLE_DEFAULT_GAP;
};

// use for returning hap only for root level elements
export const rootElementGap = (nodeType: string) => {
	if (
		nodeTypeExcludeList.includes(nodeType) ||
		(editorExperiment('platform_editor_breakout_resizing', true) &&
			breakoutResizableNodes.includes(nodeType))
	) {
		if (nodeType === 'layoutSection') {
			return DRAG_HANDLE_MAX_GAP + 20;
		} else {
			return DRAG_HANDLE_MAX_GAP;
		}
	}

	if (nodeType === 'layoutSection') {
		return DRAG_HANDLE_MAX_GAP + 12;
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
	if (editorExperiment('advanced_layouts', true)) {
		switch (nodeType) {
			case 'layoutSection':
				return DRAG_HANDLE_LAYOUT_SECTION_TOP_ADJUSTMENT;
		}
	}

	switch (nodeType) {
		case 'rule':
			return -DRAG_HANDLE_DIVIDER_TOP_ADJUSTMENT;
		case 'table':
			return DRAG_HANDLE_HEIGHT;
		case 'paragraph':
			return DRAG_HANDLE_PARAGRAPH_TOP_ADJUSTMENT;
		case 'heading-1':
			return DRAG_HANDLE_H1_TOP_ADJUSTMENT;
		case 'heading-2':
			return DRAG_HANDLE_H2_TOP_ADJUSTMENT;
		case 'heading-3':
			return -DRAG_HANDLE_H3_TOP_ADJUSTMENT;
		case 'heading-4':
			return -DRAG_HANDLE_H4_TOP_ADJUSTMENT;
		case 'heading-5':
			return -DRAG_HANDLE_H5_TOP_ADJUSTMENT;
		case 'heading-6':
			return -DRAG_HANDLE_H6_TOP_ADJUSTMENT;
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

export const spacingBetweenNodesForPreview: { [key: string]: { top: string; bottom: string } } = {
	paragraph: { top: '0.75rem', bottom: '0' },
	heading1: { top: '1.45833em', bottom: '0' },
	heading2: { top: '1.4em', bottom: '0' },
	heading3: { top: '1.31249em', bottom: '0' },
	heading4: { top: '1.25em', bottom: '0' },
	heading5: { top: '1.45833em', bottom: '0' },
	heading6: { top: '1.59091em', bottom: '0' },
	table: { top: '0', bottom: '0' },
	bulletList: { top: '10px', bottom: '0' },
	orderedList: { top: '10px', bottom: '0' },
	decisionList: { top: '0.5rem', bottom: '0' },
	taskList: { top: '0.75rem', bottom: '0' },
	codeBlock: { top: '0.75rem', bottom: '0' },
	panel: { top: '0.75rem', bottom: '0' },
	rule: { top: '1.5rem', bottom: '1.5rem' },
	mediaSingle: { top: '24px', bottom: '24px' },
	media: { top: '24px', bottom: '24px' },
	bodiedExtension: { top: '0', bottom: '0' },
	extension: { top: '0', bottom: '0' },
	layoutSection: { top: '0', bottom: '0' },
	blockquote: { top: '0', bottom: '0' },
	embedCard: { top: '24px', bottom: '24px' },
	blockCard: { top: '0.75rem', bottom: '0' },
	default: { top: '0', bottom: '0' },
};

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
	expand: { top: 4, bottom: 0 },
	nestedExpand: { top: 1, bottom: 0 },
	default: { top: 0, bottom: 0 },
};

export const DEFAULT_COLUMN_DISTRIBUTIONS: { [key: number]: number } = {
	1: 100,
	2: 50,
	3: 33.33,
	4: 25,
	5: 20,
};

export const BLOCK_MENU_WIDTH = 220;

// 	Temporarily disable BLOCK MENU feature until Q4 FY25.
//  For more details, refer to ticket ED-26972 https://product-fabric.atlassian.net/browse/ED-26972
export const BLOCK_MENU_ENABLED = false;
