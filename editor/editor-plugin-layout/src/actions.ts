import { type IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	LAYOUT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { layoutMessages as messages } from '@atlaskit/editor-common/messages';
import type { Command, TOOLBAR_MENU_TYPE } from '@atlaskit/editor-common/types';
import { flatmap, getStepRange, isEmptyDocument, mapChildren } from '@atlaskit/editor-common/utils';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';

import { EVEN_DISTRIBUTED_COL_WIDTHS } from './consts';
import { pluginKey } from './pm-plugins/plugin-key';
import type { LayoutState } from './pm-plugins/types';
import type { Change, PresetLayout } from './types';
import { isPreRelease2 } from './utils/preRelease';

export const ONE_COL_LAYOUTS: PresetLayout[] = ['single'];
export const TWO_COL_LAYOUTS: PresetLayout[] = [
	'two_equal',
	'two_left_sidebar',
	'two_right_sidebar',
];
export const THREE_COL_LAYOUTS: PresetLayout[] = ['three_equal', 'three_with_sidebars'];
export const FOUR_COL_LAYOUTS: PresetLayout[] = ['four_equal'];
export const FIVE_COL_LAYOUTS: PresetLayout[] = ['five_equal'];

const getWidthsForPreset = (presetLayout: PresetLayout): number[] => {
	if (isPreRelease2()) {
		switch (presetLayout) {
			case 'single':
				return [100];
			case 'two_equal':
				return [50, 50];
			case 'three_equal':
				return [33.33, 33.33, 33.33];
			case 'two_left_sidebar':
				return [33.33, 66.66];
			case 'two_right_sidebar':
				return [66.66, 33.33];
			case 'three_with_sidebars':
				return [25, 50, 25];
			case 'four_equal':
				return [25, 25, 25, 25];
			case 'five_equal':
				return [20, 20, 20, 20, 20];
		}
	}

	switch (presetLayout) {
		case 'single':
			return [100];
		case 'two_equal':
			return [50, 50];
		case 'three_equal':
			return [33.33, 33.33, 33.33];
		case 'two_left_sidebar':
			return [33.33, 66.66];
		case 'two_right_sidebar':
			return [66.66, 33.33];
		case 'three_with_sidebars':
			return [25, 50, 25];
	}

	return [];
};

/**
 * Finds layout preset based on the width attrs of all the layoutColumn nodes
 * inside the layoutSection node
 */
export const getPresetLayout = (section: Node): PresetLayout | undefined => {
	const widths = mapChildren(section, (column) => column.attrs.width).join(',');

	if (isPreRelease2()) {
		switch (widths) {
			case '100':
				return 'single';
			case '33.33,33.33,33.33':
				return 'three_equal';
			case '25,50,25':
				return 'three_with_sidebars';
			case '50,50':
				return 'two_equal';
			case '33.33,66.66':
				return 'two_left_sidebar';
			case '66.66,33.33':
				return 'two_right_sidebar';
			case '25,25,25,25':
				return 'four_equal';
			case '20,20,20,20,20':
				return 'five_equal';
		}
		return;
	}

	switch (widths) {
		case '100':
			return 'single';
		case '33.33,33.33,33.33':
			return 'three_equal';
		case '25,50,25':
			return 'three_with_sidebars';
		case '50,50':
			return 'two_equal';
		case '33.33,66.66':
			return 'two_left_sidebar';
		case '66.66,33.33':
			return 'two_right_sidebar';
	}
	return;
};

export const getSelectedLayout = (
	maybeLayoutSection: Node | undefined,
	current: PresetLayout,
): PresetLayout => {
	if (maybeLayoutSection && getPresetLayout(maybeLayoutSection)) {
		return getPresetLayout(maybeLayoutSection) || current;
	}
	return current;
};

const createPlaceholderNode = (schema: Schema, formatMessage?: IntlShape['formatMessage']) => {
	if (!formatMessage) {
		return undefined;
	}
	const { paragraph, placeholder } = schema.nodes;
	//create a paragraph node with content of placeholder node
	const placeholderNode = placeholder.createChecked({
		text: formatMessage(messages.layoutPlaceholder),
	}) as Node;
	return paragraph.createAndFill(undefined, placeholderNode) as Node;
};

export const createMultiColumnLayoutSection = (
	state: EditorState,
	numberOfColumns: number,
	formatMessage: IntlShape['formatMessage'],
) => {
	const { layoutSection, layoutColumn } = state.schema.nodes;

	const placeholder = createPlaceholderNode(state.schema, formatMessage);
	const layoutColumnNode = layoutColumn.createAndFill(
		{ width: EVEN_DISTRIBUTED_COL_WIDTHS[numberOfColumns] },
		placeholder,
	) as Node;

	const columns = Fragment.fromArray(
		Array.from({ length: numberOfColumns }, () => layoutColumnNode),
	);
	return layoutSection.createAndFill(undefined, columns) as Node;
};

export const createDefaultLayoutSection = (
	state: EditorState,
	formatMessage?: IntlShape['formatMessage'],
) => {
	const { layoutSection, layoutColumn } = state.schema.nodes;

	const placeholder = isPreRelease2()
		? createPlaceholderNode(state.schema, formatMessage)
		: undefined;

	// create a 50-50 layout by default
	const columns = Fragment.fromArray([
		layoutColumn.createAndFill({ width: 50 }, placeholder) as Node,
		layoutColumn.createAndFill({ width: 50 }, placeholder) as Node,
	]);

	return layoutSection.createAndFill(undefined, columns) as Node;
};

export const insertLayoutColumns: Command = (state, dispatch) => {
	if (dispatch) {
		dispatch(safeInsert(createDefaultLayoutSection(state))(state.tr));
	}
	return true;
};

export const insertLayoutColumnsWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: TOOLBAR_MENU_TYPE, formatMessage?: IntlShape['formatMessage']): Command =>
		withAnalytics(editorAnalyticsAPI, {
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
			attributes: {
				inputMethod,
			},
			eventType: EVENT_TYPE.TRACK,
		})((state, dispatch) => {
			if (dispatch) {
				dispatch(safeInsert(createDefaultLayoutSection(state, formatMessage))(state.tr));
			}
			return true;
		});

/**
 * Add a column to the right of existing layout
 */
function addColumn(schema: Schema, pos: number, formatMessage?: IntlShape['formatMessage']) {
	if (!isPreRelease2()) {
		return (tr: Transaction) => {
			tr.replaceWith(
				tr.mapping.map(pos),
				tr.mapping.map(pos),
				schema.nodes.layoutColumn.createAndFill() as Node,
			);
		};
	}
	const placeholder = createPlaceholderNode(schema, formatMessage);
	return (tr: Transaction) => {
		tr.replaceWith(
			tr.mapping.map(pos),
			tr.mapping.map(pos),
			schema.nodes.layoutColumn.createAndFill(undefined, placeholder) as Node,
		);
	};
}
const containPlaceholderOnly = (node: Node, schema: Schema) =>
	node.childCount === 1 &&
	node.firstChild?.childCount === 1 &&
	node.firstChild?.firstChild?.type === schema.nodes.placeholder;
function removeLastColumnInLayout(column: Node, columnPos: number, insideRightEdgePos: number) {
	return (tr: Transaction) => {
		// check if the column only contains a paragraph with a placeholder text
		// if so, remove the whole column, otherwise just remove the paragraph
		if (isEmptyDocument(column) || containPlaceholderOnly(column, tr.doc.type.schema)) {
			tr.replaceRange(
				tr.mapping.map(columnPos - 1),
				tr.mapping.map(insideRightEdgePos),
				Slice.empty,
			);
		} else {
			tr.replaceRange(tr.mapping.map(columnPos - 1), tr.mapping.map(columnPos + 1), Slice.empty);
		}
	};
}

const fromTwoColsToThree = addColumn;
const fromOneColToTwo = addColumn;
const fromTwoColsToOne = removeLastColumnInLayout;
const fromThreeColsToTwo = removeLastColumnInLayout;
const fromOneColToThree = (schema: Schema, pos: number) => {
	return (tr: Transaction) => {
		addColumn(schema, pos)(tr);
		addColumn(schema, pos)(tr);
	};
};
const fromThreeColstoOne = (node: Node, tr: Transaction, insideRightEdgePos: number) => {
	const thirdColumn = node.content.child(2);
	fromThreeColsToTwo(
		thirdColumn,
		insideRightEdgePos - thirdColumn.nodeSize,
		insideRightEdgePos,
	)(tr);

	const secondColumn = node.content.child(1);
	fromTwoColsToOne(
		secondColumn,
		insideRightEdgePos - thirdColumn.nodeSize - secondColumn.nodeSize,
		insideRightEdgePos,
	)(tr);
};

const increaseColumns = (
	schema: Schema,
	pos: number,
	newColumnsNumber = 1,
	formatMessage?: IntlShape['formatMessage'],
) => {
	return (tr: Transaction) => {
		for (let i = 0; i < newColumnsNumber; i++) {
			addColumn(schema, pos, formatMessage)(tr);
		}
	};
};

const decreaseColumns = (node: Node, insideRightEdgePos: number, columnsNumberToRemove = 1) => {
	return (tr: Transaction) => {
		let endPos = insideRightEdgePos;
		let lastColumn = node.content.lastChild;
		for (let i = 0; i < columnsNumberToRemove; i++) {
			lastColumn && removeLastColumnInLayout(lastColumn, endPos - lastColumn.nodeSize, endPos)(tr);
			endPos -= lastColumn?.nodeSize || 0;
			lastColumn = node.content.child(node.childCount - i - 2);
		}
	};
};

/**
 * Handles switching from 2 -> 3 cols, or 3 -> 2 cols
 * Switching from 2 -> 3 just adds a new one at the end
 * Switching from 3 -> 2 moves all the content of the third col inside the second before
 * removing it
 */
function forceColumnStructure(
	state: EditorState,
	node: Node,
	pos: number,
	presetLayout: PresetLayout,
	formatMessage?: IntlShape['formatMessage'],
): Transaction {
	const tr = state.tr;
	const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
	const numCols = node.childCount;

	// 3 columns -> 2 columns
	if (TWO_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 3) {
		const thirdColumn = node.content.child(2);
		const columnPos = insideRightEdgeOfLayoutSection - thirdColumn.nodeSize;
		fromThreeColsToTwo(thirdColumn, columnPos, insideRightEdgeOfLayoutSection)(tr);

		// 2 columns -> 3 columns
	} else if (THREE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 2) {
		fromTwoColsToThree(state.schema, insideRightEdgeOfLayoutSection, formatMessage)(tr);

		// 2 columns -> 1 column
	} else if (ONE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 2) {
		const secondColumn = node.content.child(1);
		const columnPos = insideRightEdgeOfLayoutSection - secondColumn.nodeSize;
		fromTwoColsToOne(secondColumn, columnPos, insideRightEdgeOfLayoutSection)(tr);

		// 3 columns -> 1 column
	} else if (ONE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 3) {
		fromThreeColstoOne(node, tr, insideRightEdgeOfLayoutSection);

		// 1 column -> 2 columns
	} else if (TWO_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 1) {
		fromOneColToTwo(state.schema, insideRightEdgeOfLayoutSection)(tr);
		// 1 column -> 3 columns
	} else if (THREE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 1) {
		fromOneColToThree(state.schema, insideRightEdgeOfLayoutSection)(tr);
	}
	return tr;
}

function forceColumnStructureNew(
	state: EditorState,
	node: Node,
	pos: number,
	presetLayout: PresetLayout,
	formatMessage?: IntlShape['formatMessage'],
): Transaction {
	const tr = state.tr;
	const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
	const numCols = node.childCount;

	const columnChange = getWidthsForPreset(presetLayout).length - numCols;
	if (columnChange > 0) {
		increaseColumns(state.schema, insideRightEdgeOfLayoutSection, columnChange, formatMessage)(tr);
	} else if (columnChange < 0) {
		decreaseColumns(node, insideRightEdgeOfLayoutSection, -columnChange)(tr);
	}
	return tr;
}

function columnWidth(node: Node, schema: Schema, widths: number[]): Fragment {
	const { layoutColumn } = schema.nodes;
	const truncatedWidths: number[] = widths.map((w) => Number(w.toFixed(2)));

	return flatmap(node.content, (column, idx) => {
		if (column.type === layoutColumn) {
			return layoutColumn.create(
				{
					...column.attrs,
					width: truncatedWidths[idx],
				},
				column.content,
				column.marks,
			);
		} else {
			return column;
		}
	});
}

function forceColumnWidths(
	state: EditorState,
	tr: Transaction,
	pos: number,
	presetLayout: PresetLayout,
) {
	const node = tr.doc.nodeAt(pos);
	if (!node) {
		return tr;
	}

	return tr.replaceWith(
		pos + 1,
		pos + node.nodeSize - 1,
		columnWidth(node, state.schema, getWidthsForPreset(presetLayout)),
	);
}

export function forceSectionToPresetLayout(
	state: EditorState,
	node: Node,
	pos: number,
	presetLayout: PresetLayout,
	formatMessage?: IntlShape['formatMessage'],
): Transaction {
	const forceColumnStructureFn = isPreRelease2() ? forceColumnStructureNew : forceColumnStructure;
	let tr = forceColumnStructureFn(state, node, pos, presetLayout, formatMessage);

	// save the selection here, since forcing column widths causes a change over the
	// entire layoutSection, which remaps selection to the end. not remapping here
	// is safe because the structure is no longer changing.
	const selection = tr.selection;

	tr = forceColumnWidths(state, tr, pos, presetLayout);

	const selectionPos$ = tr.doc.resolve(selection.$from.pos);

	return tr.setSelection(
		state.selection instanceof NodeSelection
			? new NodeSelection(selectionPos$)
			: new TextSelection(selectionPos$),
	);
}

export const setPresetLayout =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(layout: PresetLayout, formatMessage?: IntlShape['formatMessage']): Command =>
	(state, dispatch) => {
		const { pos, selectedLayout } = pluginKey.getState(state) as LayoutState;
		if (selectedLayout === layout || pos === null) {
			return false;
		}

		const node = state.doc.nodeAt(pos);
		if (!node) {
			return false;
		}

		let tr = forceSectionToPresetLayout(state, node, pos, layout, formatMessage);
		if (tr) {
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.CHANGED_LAYOUT,
				actionSubject: ACTION_SUBJECT.LAYOUT,
				attributes: {
					previousLayout: formatLayoutName(selectedLayout as PresetLayout),
					newLayout: formatLayoutName(layout),
				},
				eventType: EVENT_TYPE.TRACK,
			})(tr);
			tr.setMeta('scrollIntoView', false);
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};

function layoutNeedChanges(node: Node): boolean {
	return !getPresetLayout(node);
}

function getLayoutChange(node: Node, pos: number, schema: Schema): Change | undefined {
	if (node.type === schema.nodes.layoutSection) {
		if (!layoutNeedChanges(node)) {
			return;
		}

		const presetLayout =
			node.childCount === 2 ? 'two_equal' : node.childCount === 3 ? 'three_equal' : 'single';

		const fixedColumns = columnWidth(node, schema, getWidthsForPreset(presetLayout));

		return {
			from: pos + 1,
			to: pos + node.nodeSize - 1,
			slice: new Slice(fixedColumns, 0, 0),
		};
	}
}

export const fixColumnSizes = (changedTr: Transaction, state: EditorState) => {
	const { layoutSection } = state.schema.nodes;
	let change;
	const range = getStepRange(changedTr);
	if (!range) {
		return undefined;
	}

	changedTr.doc.nodesBetween(range.from, range.to, (node, pos) => {
		if (node.type !== layoutSection) {
			return true; // Check all internal nodes expect for layout section
		}
		// Node is a section
		if (layoutNeedChanges(node)) {
			change = getLayoutChange(node, pos, state.schema);
		}
		return false; // We dont go deep, We dont accept nested layouts
	});

	// Hack to prevent: https://product-fabric.atlassian.net/browse/ED-7523
	// By default prosemirror try to recreate the node with the default attributes
	// The default attribute is invalid adf though. when this happen the node after
	// current position is a layout section
	const $pos = changedTr.doc.resolve(range.to);
	if ($pos.depth > 0) {
		// 'range.to' position could resolve to doc, in this ResolvedPos.after will throws
		const pos = $pos.after();
		const node = changedTr.doc.nodeAt(pos);
		if (node && node.type === layoutSection && layoutNeedChanges(node)) {
			change = getLayoutChange(node, pos, state.schema);
		}
	}

	return change;
};

export const fixColumnStructure = (state: EditorState) => {
	const { pos, selectedLayout } = pluginKey.getState(state) as LayoutState;
	if (pos !== null && selectedLayout) {
		const node = state.doc.nodeAt(pos);
		if (node && node.childCount !== getWidthsForPreset(selectedLayout).length) {
			return forceSectionToPresetLayout(state, node, pos, selectedLayout);
		}
	}
	return;
};

export const deleteActiveLayoutNode =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const { pos, selectedLayout } = pluginKey.getState(state) as LayoutState;
		if (pos !== null) {
			const node = state.doc.nodeAt(pos) as Node;
			if (dispatch) {
				let tr = state.tr.delete(pos, pos + node.nodeSize);
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.DELETED,
					actionSubject: ACTION_SUBJECT.LAYOUT,
					attributes: {
						layout: formatLayoutName(selectedLayout as PresetLayout),
					},
					eventType: EVENT_TYPE.TRACK,
				})(tr);
				dispatch(tr);
			}
			return true;
		}
		return false;
	};

const formatLayoutName = (layout: PresetLayout): LAYOUT_TYPE | undefined => {
	if (isPreRelease2()) {
		switch (layout) {
			case 'single':
				return LAYOUT_TYPE.SINGLE_COL;
			case 'two_equal':
				return LAYOUT_TYPE.TWO_COLS_EQUAL;
			case 'three_equal':
				return LAYOUT_TYPE.THREE_COLS_EQUAL;
			case 'two_left_sidebar':
				return LAYOUT_TYPE.LEFT_SIDEBAR;
			case 'two_right_sidebar':
				return LAYOUT_TYPE.RIGHT_SIDEBAR;
			case 'three_with_sidebars':
				return LAYOUT_TYPE.THREE_WITH_SIDEBARS;
			case 'four_equal':
				return LAYOUT_TYPE.FOUR_COLS_EQUAL;
			case 'five_equal':
				return LAYOUT_TYPE.FIVE_COLS_EQUAL;
		}
	}

	switch (layout) {
		case 'single':
			return LAYOUT_TYPE.SINGLE_COL;
		case 'two_equal':
			return LAYOUT_TYPE.TWO_COLS_EQUAL;
		case 'three_equal':
			return LAYOUT_TYPE.THREE_COLS_EQUAL;
		case 'two_left_sidebar':
			return LAYOUT_TYPE.LEFT_SIDEBAR;
		case 'two_right_sidebar':
			return LAYOUT_TYPE.RIGHT_SIDEBAR;
		case 'three_with_sidebars':
			return LAYOUT_TYPE.THREE_WITH_SIDEBARS;
	}
};
