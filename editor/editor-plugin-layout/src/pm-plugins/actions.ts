import type { Valign } from '@atlaskit/adf-schema/layout-column';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	LAYOUT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type {
	Command,
	EditorCommand,
	ExtractInjectionAPI,
	TOOLBAR_MENU_TYPE,
} from '@atlaskit/editor-common/types';
import { flatmap, getStepRange, isEmptyDocument, mapChildren } from '@atlaskit/editor-common/utils';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { Mapping, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { LayoutPlugin } from '../layoutPluginType';
import type { Change, PresetLayout } from '../types';

import {
	EVEN_DISTRIBUTED_COL_WIDTHS,
	MAX_LAYOUT_COLUMNS,
	MAX_STANDARD_LAYOUT_COLUMNS,
	MIN_LAYOUT_COLUMN_WIDTH_PERCENT,
} from './consts';
import { pluginKey } from './plugin-key';
import type { LayoutState } from './types';
import {
	calculateDistribution,
	isDistributedUniformly,
	redistributeAfterDeletion,
	redistributeProportionally,
} from './utils/layout-column-distribution';
import {
	getAllLayoutColumnsFromSelection,
	getSelectedLayoutColumnsFromSelection,
} from './utils/layout-column-selection';

export const ONE_COL_LAYOUTS: PresetLayout[] = ['single'];
export const TWO_COL_LAYOUTS: PresetLayout[] = [
	'two_equal',
	'two_left_sidebar',
	'two_right_sidebar',
];
export const THREE_COL_LAYOUTS: PresetLayout[] = ['three_equal', 'three_with_sidebars'];

const getWidthsForPreset = (presetLayout: PresetLayout): number[] => {
	if (editorExperiment('advanced_layouts', true)) {
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
			case 'three_left_sidebars':
				return [25, 25, 50];
			case 'three_right_sidebars':
				return [50, 25, 25];
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

const isValidLayoutWidthDistributions = (layoutSection: Node) => {
	let totalWidth = 0;
	let hasInvalidWidth = false;

	mapChildren(layoutSection, (column) => column.attrs.width).forEach((width) => {
		if (typeof width === 'number' && isFinite(width) && width > 0 && width <= 100) {
			totalWidth += width;
		} else {
			hasInvalidWidth = true;
		}
	});

	return !hasInvalidWidth && Math.round(totalWidth) === 100;
};

/**
 * Finds layout preset based on the width attrs of all the layoutColumn nodes
 * inside the layoutSection node
 */
export const getPresetLayout = (section: Node): PresetLayout | undefined => {
	const widths = mapChildren(section, (column) => column.attrs.width).join(',');

	if (editorExperiment('advanced_layouts', true)) {
		switch (widths) {
			case '100':
				return 'single';
			case '33.33,33.33,33.33':
				return 'three_equal';
			case '25,50,25':
				return 'three_with_sidebars';
			case '50,25,25':
				return 'three_right_sidebars';
			case '25,25,50':
				return 'three_left_sidebars';
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

const isLayoutOutOfSync = (node: Node, presetLayout: PresetLayout) => {
	return node.childCount !== getWidthsForPreset(presetLayout).length;
};

export const getSelectedLayout = (
	maybeLayoutSection: Node | undefined,
	current: PresetLayout,
): PresetLayout => {
	if (
		maybeLayoutSection &&
		isLayoutOutOfSync(maybeLayoutSection, current) &&
		editorExperiment('advanced_layouts', true)
	) {
		return getDefaultPresetLayout(maybeLayoutSection);
	}

	if (maybeLayoutSection && getPresetLayout(maybeLayoutSection)) {
		return getPresetLayout(maybeLayoutSection) || current;
	}
	return current;
};

export const createMultiColumnLayoutSection = (state: EditorState, numberOfColumns: number = 2) => {
	const { layoutSection, layoutColumn } = state.schema.nodes;

	const columns = Fragment.fromArray(
		Array.from(
			{ length: numberOfColumns },
			() =>
				layoutColumn.createAndFill({ width: EVEN_DISTRIBUTED_COL_WIDTHS[numberOfColumns] }) as Node,
		),
	);
	return layoutSection.createAndFill(undefined, columns) as Node;
};

export const createDefaultLayoutSection = (state: EditorState) => {
	const { layoutSection, layoutColumn } = state.schema.nodes;

	// create a 50-50 layout by default
	const columns = Fragment.fromArray([
		layoutColumn.createAndFill({ width: 50 }) as Node,
		layoutColumn.createAndFill({ width: 50 }) as Node,
	]);

	return layoutSection.createAndFill(undefined, columns) as Node;
};

export const insertLayoutColumns: Command = (state, dispatch) => {
	if (dispatch) {
		dispatch(safeInsert(createDefaultLayoutSection(state))(state.tr));
	}
	return true;
};

export type InsertLayoutColumnsInputMethod =
	| TOOLBAR_MENU_TYPE
	| INPUT_METHOD.QUICK_INSERT
	| INPUT_METHOD.ELEMENT_BROWSER;

export const insertLayoutColumnsWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: InsertLayoutColumnsInputMethod): Command =>
		withAnalytics(editorAnalyticsAPI, {
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.LAYOUT,
			attributes: {
				inputMethod: fg('platform_editor_element_browser_analytic')
					? inputMethod
					: INPUT_METHOD.QUICK_INSERT,
				columnCount: fg('platform_editor_column_count_analytics') ? 2 : undefined,
			},
			eventType: EVENT_TYPE.TRACK,
		})((state, dispatch) => {
			if (dispatch) {
				dispatch(safeInsert(createDefaultLayoutSection(state))(state.tr));
			}
			return true;
		});

/**
 * Add a column to the right of existing layout
 */
function addColumn(schema: Schema, pos: number) {
	if (editorExperiment('advanced_layouts', false)) {
		return (tr: Transaction) => {
			tr.replaceWith(
				tr.mapping.map(pos),
				tr.mapping.map(pos),
				schema.nodes.layoutColumn.createAndFill() as Node,
			);
		};
	}

	return (tr: Transaction) => {
		tr.replaceWith(
			tr.mapping.map(pos),
			tr.mapping.map(pos),
			schema.nodes.layoutColumn.createAndFill(undefined) as Node,
		);
	};
}

function removeLastColumnInLayout(column: Node, columnPos: number, insideRightEdgePos: number) {
	return (tr: Transaction) => {
		// check if the column only contains a paragraph with a placeholder text
		// if so, remove the whole column, otherwise just remove the paragraph
		if (isEmptyDocument(column)) {
			const fromPos = editorExperiment('single_column_layouts', true) ? columnPos : columnPos - 1;

			tr.replaceRange(tr.mapping.map(fromPos), tr.mapping.map(insideRightEdgePos), Slice.empty);
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

const increaseColumns = (schema: Schema, pos: number, newColumnsNumber = 1) => {
	return (tr: Transaction) => {
		for (let i = 0; i < newColumnsNumber; i++) {
			addColumn(schema, pos)(tr);
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
		fromTwoColsToThree(state.schema, insideRightEdgeOfLayoutSection)(tr);

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
): Transaction {
	const tr = state.tr;
	const insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
	const numCols = node.childCount;

	const columnChange = getWidthsForPreset(presetLayout).length - numCols;
	if (columnChange > 0) {
		increaseColumns(state.schema, insideRightEdgeOfLayoutSection, columnChange)(tr);
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

/**
 * Forces a layout section node to match the given preset layout by adjusting
 * its column structure and widths, then restoring the original selection.
 */
export function forceSectionToPresetLayout(
	state: EditorState,
	node: Node,
	pos: number,
	presetLayout: PresetLayout,
): Transaction {
	const forceColumnStructureFn = editorExperiment('advanced_layouts', true)
		? forceColumnStructureNew
		: forceColumnStructure;
	let tr = forceColumnStructureFn(state, node, pos, presetLayout);

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
	(layout: PresetLayout): Command =>
	(state, dispatch) => {
		const { pos, selectedLayout } = pluginKey.getState(state) as LayoutState;

		if (pos === null) {
			return false;
		}

		const node = state.doc.nodeAt(pos);
		if (!node) {
			return false;
		}

		if (selectedLayout === layout && node.childCount > 1) {
			return false;
		}

		const tr = forceSectionToPresetLayout(state, node, pos, layout);
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
	if (editorExperiment('advanced_layouts', true)) {
		if (editorExperiment('platform_editor_layout_column_resize_handle', true)) {
			// Custom widths that sum to 100% are valid and should not be forced back to presets
			if (isValidLayoutWidthDistributions(node)) {
				return false;
			}
			return true;
		}
		return !getPresetLayout(node) || !isValidLayoutWidthDistributions(node);
	}

	return !getPresetLayout(node);
}

const getDefaultPresetLayout = (layoutNode: Node): PresetLayout => {
	const layoutColumnCount = layoutNode.childCount;

	if (layoutColumnCount <= 1) {
		return 'single';
	}

	switch (layoutColumnCount) {
		case 1:
			return 'single';
		case 2:
			return 'two_equal';
		case 3:
			return 'three_equal';
		case 4:
			return 'four_equal';
		case 5:
			return 'five_equal';
		default:
			return 'five_equal';
	}
};

function getLayoutChange(node: Node, pos: number, schema: Schema): Change | undefined {
	if (node.type === schema.nodes.layoutSection) {
		if (!layoutNeedChanges(node)) {
			return;
		}

		const presetLayout = editorExperiment('advanced_layouts', true)
			? getDefaultPresetLayout(node)
			: node.childCount === 2
				? 'two_equal'
				: node.childCount === 3
					? 'three_equal'
					: 'single';

		const fixedColumns = columnWidth(node, schema, getWidthsForPreset(presetLayout));

		return {
			from: pos + 1,
			to: pos + node.nodeSize - 1,
			slice: new Slice(fixedColumns, 0, 0),
		};
	}
}

export const fixColumnSizes = (changedTr: Transaction, state: EditorState): Change | undefined => {
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

export const fixColumnStructure = (state: EditorState): Transaction | undefined => {
	const { pos, selectedLayout } = pluginKey.getState(state) as LayoutState;

	if (pos !== null && selectedLayout) {
		const node = state.doc.nodeAt(pos);

		if (node) {
			if (node.childCount !== getWidthsForPreset(selectedLayout).length) {
				// If the resize handle experiment is on and widths are valid, don't force preset
				// (column count mismatch might be from a different preset being selected)
				if (
					editorExperiment('advanced_layouts', true) &&
					editorExperiment('platform_editor_layout_column_resize_handle', true) &&
					isValidLayoutWidthDistributions(node)
				) {
					return;
				}
				return forceSectionToPresetLayout(state, node, pos, selectedLayout);
			}

			if (!isValidLayoutWidthDistributions(node) && editorExperiment('advanced_layouts', true)) {
				return forceSectionToPresetLayout(state, node, pos, selectedLayout);
			}
		}
	}
	return;
};

export const deleteActiveLayoutNode =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
		inputMethod?: INPUT_METHOD.FLOATING_TB,
	): Command =>
	(state, dispatch) => {
		const { pos, selectedLayout } = pluginKey.getState(state) as LayoutState;
		if (pos !== null) {
			const node = state.doc.nodeAt(pos) as Node;
			if (dispatch) {
				const tr = state.tr.delete(pos, pos + node.nodeSize);
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: ACTION.DELETED,
					actionSubject: ACTION_SUBJECT.LAYOUT,
					attributes: {
						layout: formatLayoutName(selectedLayout as PresetLayout),
						inputMethod,
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
	if (editorExperiment('advanced_layouts', true)) {
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

export type InsertLayoutColumnSide = 'left' | 'right';

export const LAYOUT_COLUMN_INSERT_META = 'layoutColumnInsert';
export type LayoutColumnInsertMeta = {
	insertedColumnNodeSize: number;
	insertedColumnPos: number;
	side: InsertLayoutColumnSide;
};

type LayoutPluginAPI = ExtractInjectionAPI<LayoutPlugin> | undefined;

const mapLayoutColumnPreservedSelection = (tr: Transaction, api: LayoutPluginAPI) => {
	const insertMeta = tr.getMeta(LAYOUT_COLUMN_INSERT_META) as LayoutColumnInsertMeta | undefined;
	if (insertMeta) {
		const mapping =
			insertMeta.side === 'left'
				? new Mapping([
						new StepMap([insertMeta.insertedColumnPos, 0, insertMeta.insertedColumnNodeSize]),
					])
				: new Mapping();
		api?.blockControls?.commands.mapPreservedSelection(mapping)({ tr });
		return;
	}

	// Width and alignment updates should keep original layout column selection unchanged.
	if (tr.getMeta('scrollIntoView') === false && tr.docChanged) {
		api?.blockControls?.commands.mapPreservedSelection(new Mapping())({ tr });
	}
};

/**
 * Returns the active maximum layout column count for the current advanced layouts experiment state.
 */
export function getEffectiveMaxLayoutColumns(): number {
	return editorExperiment('advanced_layouts', true)
		? MAX_LAYOUT_COLUMNS
		: MAX_STANDARD_LAYOUT_COLUMNS;
}

const insertLayoutColumnAt =
	(side: InsertLayoutColumnSide, editorAnalyticsAPI?: EditorAnalyticsAPI): EditorCommand =>
	({ tr }) => {
		if (!expValEqualsNoExposure('platform_editor_layout_column_menu', 'isEnabled', true)) {
			return null;
		}

		const selectedLayoutColumnsResult = getSelectedLayoutColumnsFromSelection(tr.selection);
		if (
			!selectedLayoutColumnsResult ||
			selectedLayoutColumnsResult.selectedLayoutColumns.length === 0
		) {
			return null;
		}

		const { layoutSectionNode, layoutSectionPos, startIndex, endIndex, selectedLayoutColumns } =
			selectedLayoutColumnsResult;
		const selectedColumnIndex = side === 'left' ? startIndex : endIndex;
		const selectedColumnCount = selectedLayoutColumns.length;
		if (layoutSectionNode.childCount >= getEffectiveMaxLayoutColumns()) {
			return null;
		}

		const insertIndex = side === 'left' ? selectedColumnIndex : selectedColumnIndex + 1;
		const existingWidths = mapChildren(layoutSectionNode, (column) => column.attrs.width as number);
		const redistributedWidths = redistributeProportionally(
			existingWidths,
			insertIndex,
			getEffectiveMaxLayoutColumns(),
			MIN_LAYOUT_COLUMN_WIDTH_PERCENT,
		);
		if (redistributedWidths === existingWidths) {
			return null;
		}

		const { layoutColumn } = tr.doc.type.schema.nodes;
		const newColumn = layoutColumn.createAndFill({ width: redistributedWidths[insertIndex] });
		if (!newColumn) {
			return null;
		}

		const updatedColumns: Node[] = [];
		layoutSectionNode.forEach((column, _offset, index) => {
			if (index === insertIndex) {
				updatedColumns.push(newColumn);
			}
			updatedColumns.push(column);
		});
		if (insertIndex === layoutSectionNode.childCount) {
			updatedColumns.push(newColumn);
		}

		const updatedLayoutSectionNode = layoutSectionNode.copy(Fragment.fromArray(updatedColumns));
		let insertedColumnOffset = 0;
		layoutSectionNode.forEach((column, _offset, index) => {
			if (index < insertIndex) {
				insertedColumnOffset += column.nodeSize;
			}
		});
		const insertedColumnPos = layoutSectionPos + 1 + insertedColumnOffset;
		tr.setMeta(LAYOUT_COLUMN_INSERT_META, {
			insertedColumnNodeSize: newColumn.nodeSize,
			insertedColumnPos,
			side,
		} satisfies LayoutColumnInsertMeta);

		tr.replaceWith(
			layoutSectionPos + 1,
			layoutSectionPos + layoutSectionNode.nodeSize - 1,
			columnWidth(updatedLayoutSectionNode, tr.doc.type.schema, redistributedWidths),
		);
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.LAYOUT_COLUMN,
			attributes: {
				columnCount: redistributedWidths.length,
				endIndex,
				inputMethod: INPUT_METHOD.LAYOUT_COLUMN_MENU,
				selectedCount: selectedColumnCount,
				side,
				startIndex,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
		tr.setMeta('scrollIntoView', false);

		return tr;
	};

export const insertLayoutColumn = (
	side: InsertLayoutColumnSide,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	api?: LayoutPluginAPI,
): EditorCommand =>
	({ tr }) => {
		const result = insertLayoutColumnAt(side, editorAnalyticsAPI)({ tr });
		if (result) {
			mapLayoutColumnPreservedSelection(tr, api);
		}
		return result;
	};

export const setLayoutColumnValign =
	(valign: Valign, editorAnalyticsAPI?: EditorAnalyticsAPI, api?: LayoutPluginAPI): EditorCommand =>
	({ tr }) => {
		if (!expValEqualsNoExposure('platform_editor_layout_column_menu', 'isEnabled', true)) {
			return null;
		}

		const selectedLayoutColumnsResult = getSelectedLayoutColumnsFromSelection(tr.selection);
		if (!selectedLayoutColumnsResult) {
			return null;
		}

		const { startIndex, endIndex, selectedLayoutColumns } = selectedLayoutColumnsResult;
		const columnsToUpdate = selectedLayoutColumns.filter(
			({ node }) => node.attrs.valign !== valign,
		);
		if (columnsToUpdate.length === 0) {
			return null;
		}
		const updatedColumnCount = columnsToUpdate.length;

		columnsToUpdate.forEach(({ node, pos }) => {
			tr.setNodeMarkup(pos, node.type, {
				...node.attrs,
				valign,
			});
		});
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.UPDATED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.LAYOUT_COLUMN,
			attributes: {
				endIndex,
				inputMethod: INPUT_METHOD.LAYOUT_COLUMN_MENU,
				selectedCount: selectedLayoutColumns.length,
				startIndex,
				updatedCount: updatedColumnCount,
				valign,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
		tr.setMeta('scrollIntoView', false);
		mapLayoutColumnPreservedSelection(tr, api);

		return tr;
	};

export type DistributeLayoutColumnsOptions = {
	inputMethod?: INPUT_METHOD.LAYOUT_COLUMN_MENU | INPUT_METHOD.FLOATING_TB;
	target?: 'selectedColumns' | 'allColumns';
};

export const distributeLayoutColumns =
	(editorAnalyticsAPI?: EditorAnalyticsAPI, api?: LayoutPluginAPI) =>
	({
		inputMethod = INPUT_METHOD.LAYOUT_COLUMN_MENU,
		target = 'selectedColumns',
	}: DistributeLayoutColumnsOptions = {}): EditorCommand =>
	({ tr }) => {
		if (!expValEqualsNoExposure('platform_editor_layout_column_menu', 'isEnabled', true)) {
			return null;
		}

		const selectedLayoutColumnsResult =
			target === 'allColumns'
				? getAllLayoutColumnsFromSelection(tr.selection)
				: getSelectedLayoutColumnsFromSelection(tr.selection);

		if (
			!selectedLayoutColumnsResult ||
			selectedLayoutColumnsResult.selectedLayoutColumns.length < 2
		) {
			return null;
		}

		const { layoutSectionNode, startIndex, endIndex, selectedLayoutColumns } =
			selectedLayoutColumnsResult;

		const existingWidths = mapChildren(layoutSectionNode, (column) => column.attrs.width as number);
		const selectedWidths = selectedLayoutColumns.map(({ node }) => node.attrs.width as number);
		const distribution = calculateDistribution(selectedWidths);
		if (!distribution) {
			return null;
		}
		const { selectedTotal, equalWidth } = distribution;

		if (isDistributedUniformly(selectedWidths, distribution)) {
			return null;
		}

		// Build new widths array: selected columns get equal share, unselected unchanged.
		// Assign rounded (2dp) equal widths to all selected cols except the last, which absorbs
		// the rounding remainder so the sum of selected widths equals selectedTotal exactly.
		let assignedToSelected = 0;
		let selectedAssignedCount = 0;
		const newWidths = existingWidths.map((w, idx) => {
			if (idx < startIndex || idx > endIndex) {
				return w;
			}
			selectedAssignedCount += 1;
			if (selectedAssignedCount < selectedLayoutColumns.length) {
				assignedToSelected += equalWidth;
				return equalWidth;
			}
			// Last selected column: absorb the remainder to avoid drift
			return Number((selectedTotal - assignedToSelected).toFixed(2));
		});

		// Apply widths via setNodeMarkup per selected column — keeps nodes in place (preserves identity, marks, decorations)
		selectedLayoutColumns.forEach(({ node, pos }, i) => {
			const colIdx = startIndex + i;
			tr.setNodeMarkup(pos, node.type, { ...node.attrs, width: newWidths[colIdx] });
		});

		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.UPDATED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.LAYOUT_COLUMN,
			attributes: {
				columnCount: layoutSectionNode.childCount,
				endIndex,
				inputMethod,
				selectedCount: selectedLayoutColumns.length,
				startIndex,
			},
			eventType: EVENT_TYPE.TRACK,
		})(tr);
		tr.setMeta('scrollIntoView', false);
		mapLayoutColumnPreservedSelection(tr, api);

		return tr;
	};

export const toggleLayoutColumnMenu =
	({ anchorPos, isOpen }: { anchorPos?: number; isOpen?: boolean }): EditorCommand =>
	({ tr }) => {
		tr.setMeta('toggleLayoutColumnMenu', { anchorPos, isOpen });
		tr.setMeta('scrollIntoView', false);

		return tr;
	};

export const deleteLayoutColumn =
	(editorAnalyticsAPI?: EditorAnalyticsAPI, api?: LayoutPluginAPI): EditorCommand =>
	({ tr }) => {
		if (!expValEqualsNoExposure('platform_editor_layout_column_menu', 'isEnabled', true)) {
			return null;
		}

		const selectedLayoutColumnsResult = getSelectedLayoutColumnsFromSelection(tr.selection);
		if (
			!selectedLayoutColumnsResult ||
			selectedLayoutColumnsResult.selectedLayoutColumns.length === 0
		) {
			return null;
		}

		const { layoutSectionNode, layoutSectionPos, selectedLayoutColumns, startIndex, endIndex } =
			selectedLayoutColumnsResult;

		const emitDeleteColumnAnalytics = (columnCount: number) => {
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.LAYOUT_COLUMN,
				attributes: {
					columnCount,
					endIndex,
					inputMethod: INPUT_METHOD.LAYOUT_COLUMN_MENU,
					selectedCount: selectedLayoutColumns.length,
					startIndex,
				},
				eventType: EVENT_TYPE.TRACK,
			})(tr);
		};

		// If all columns are selected, remove the entire layoutSection
		if (selectedLayoutColumns.length === layoutSectionNode.childCount) {
			tr.delete(layoutSectionPos, layoutSectionPos + layoutSectionNode.nodeSize);
			emitDeleteColumnAnalytics(0);
			tr.setMeta('scrollIntoView', false);
			api?.blockControls?.commands.stopPreservingSelection()({ tr });
			return tr;
		}

		// Build new column list without the selected columns
		const remainingColumns: Node[] = [];
		layoutSectionNode.forEach((column, _offset, index) => {
			if (index < startIndex || index > endIndex) {
				remainingColumns.push(column);
			}
		});

		// Redistribute widths proportionally among remaining columns using shared utility
		const existingWidths = mapChildren(layoutSectionNode, (column) => column.attrs.width as number);
		const redistributed = selectedLayoutColumns
			.map((_, i) => startIndex + i)
			// Delete highest indices first so lower original indices still point at the same columns
			// as each redistribution step shrinks the widths array.
			.reverse()
			.reduce(
				(widths, selectedIndex) =>
					redistributeAfterDeletion(widths, selectedIndex, MIN_LAYOUT_COLUMN_WIDTH_PERCENT),
				existingWidths,
			);

		const updatedLayoutSectionNode = layoutSectionNode.copy(Fragment.fromArray(remainingColumns));

		tr.replaceWith(
			layoutSectionPos + 1,
			layoutSectionPos + layoutSectionNode.nodeSize - 1,
			columnWidth(updatedLayoutSectionNode, tr.doc.type.schema, redistributed),
		);

		emitDeleteColumnAnalytics(redistributed.length);
		tr.setMeta('scrollIntoView', false);
		api?.blockControls?.commands.stopPreservingSelection()({ tr });

		return tr;
	};
