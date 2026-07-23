import { mapChildren } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const isIsolating = (node: PmNode): boolean => {
	return !!node.type.spec.isolating;
};

export const containsHeaderColumn = (table: PmNode): boolean => {
	const map = TableMap.get(table);
	// Get cell positions for first column.
	const cellPositions = map.cellsInRect({
		left: 0,
		top: 0,
		right: 1,
		bottom: map.height,
	});

	for (let i = 0; i < cellPositions.length; i++) {
		try {
			const cell = table.nodeAt(cellPositions[i]);
			if (cell && cell.type !== table.type.schema.nodes.tableHeader) {
				return false;
			}
		} catch {
			return false;
		}
	}

	return true;
};

export const containsHeaderRow = (table: PmNode): boolean => {
	const map = TableMap.get(table);
	for (let i = 0; i < map.width; i++) {
		const cell = table.nodeAt(map.map[i]);
		if (cell && cell.type !== table.type.schema.nodes.tableHeader) {
			return false;
		}
	}
	return true;
};

export const checkIfHeaderColumnEnabled = (selection: Selection): boolean =>
	filterNearSelection(selection, findTable, containsHeaderColumn, false);

export const checkIfHeaderRowEnabled = (selection: Selection): boolean =>
	filterNearSelection(selection, findTable, containsHeaderRow, false);

export const checkIfNumberColumnEnabled = (selection: Selection): boolean =>
	filterNearSelection(selection, findTable, (table) => !!table.attrs.isNumberColumnEnabled, false);

export const getTableWidth = (node: PmNode): number => {
	return getTableWidths(node).reduce((acc, current) => acc + current, 0);
};

export const tablesHaveDifferentColumnWidths = (
	currentTable: PmNode,
	previousTable: PmNode,
): boolean => {
	const currentTableWidths = getTableWidths(currentTable);
	const previousTableWidths = getTableWidths(previousTable);

	if (currentTableWidths.length !== previousTableWidths.length) {
		return true;
	}

	const sameWidths = currentTableWidths.every((value: number, index: number) => {
		return value === previousTableWidths[index];
	});

	return sameWidths === false;
};

export const tablesHaveDifferentNoOfColumns = (
	currentTable: PmNode,
	previousTable: PmNode,
): boolean => {
	const prevMap = TableMap.get(previousTable);
	const currentMap = TableMap.get(currentTable);

	return prevMap.width !== currentMap.width;
};

export const tablesHaveDifferentNoOfRows = (
	currentTable: PmNode,
	previousTable: PmNode,
): boolean => {
	const prevMap = TableMap.get(previousTable);
	const currentMap = TableMap.get(currentTable);

	return prevMap.height !== currentMap.height;
};

function filterNearSelection<T, U>(
	selection: Selection,
	findNode: (selection: Selection) => { node: PmNode; pos: number } | undefined,
	predicate: (node: PmNode, pos?: number) => T,
	defaultValue: U,
): T | U {
	const found = findNode(selection);
	if (!found) {
		return defaultValue;
	}

	return predicate(found.node, found.pos);
}

function getTableWidths(node: PmNode): number[] {
	if (!node.content.firstChild) {
		return [];
	}

	const tableWidths: Array<number> = [];
	node.content.firstChild.content.forEach((cell) => {
		if (Array.isArray(cell.attrs.colwidth)) {
			const colspan = cell.attrs.colspan || 1;
			tableWidths.push(...cell.attrs.colwidth.slice(0, colspan));
		}
	});

	return tableWidths;
}

export const isTableNested = (state: EditorState, tablePos = 0): boolean => {
	const $tablePos = state.doc.resolve(tablePos);
	return $tablePos.depth > 0;
};

export const isTableNestedInMoreThanOneNode = (state: EditorState, tablePos = 0): boolean => {
	return state.doc.resolve(tablePos).depth > 2;
};

/**
 * True when the table sits under a bodiedSyncBlock ancestor.
 * Used to prefer DOM-measured wrapper width over getParentNodeWidth() for stable scaling.
 */
export const isTableNestedUnderBodiedSyncBlock = (
	state: EditorState,
	tablePos: number,
): boolean => {
	const bodiedSyncBlock = state.schema.nodes.bodiedSyncBlock;
	if (!bodiedSyncBlock) {
		return false;
	}
	const $pos = state.doc.resolve(tablePos);
	for (let d = $pos.depth; d > 0; d--) {
		if ($pos.node(d).type === bodiedSyncBlock) {
			return true;
		}
	}
	return false;
};

const anyChildCellMergedAcrossRow = (node: PmNode): boolean =>
	mapChildren(node, (child) => child.attrs.rowspan || 0).some((rowspan) => rowspan > 1);

const anyChildCellMergedAcrossColumn = (node: PmNode): boolean =>
	mapChildren(node, (child) => child.attrs.colspan || 0).some((colspan) => colspan > 1);

/**
 * Check if a given node is a header row with this definition:
 *  - all children are tableHeader cells
 *  - no table cells have been merged with other table row cells (rowspan > 1)
 *  - no table cells have been merged with other table column cells (colspan > 1),
 *    (colspan check gated behind platform_editor_fix_sticky_header_malfunction,
 *     and only applied to non-first rows — the first/sticky header row is allowed
 *     to have merged columns within itself, gated behind platform_editor_fix_sticky_header_row)
 *
 * @param node ProseMirror node
 * @param rowIndex index of this row within its parent (default 0 = first/sticky row)
 * @returns boolean if it meets definition
 */
export const supportedHeaderRow = (node: PmNode, rowIndex: number = 0): boolean => {
	const allHeaders = mapChildren(node, (child) => child.type.name === 'tableHeader').every(Boolean);

	if (expValEquals('platform_editor_fix_sticky_header_malfunction', 'isEnabled', true)) {
		const someMergedAcrossRow = anyChildCellMergedAcrossRow(node);
		// Only apply the colspan check to non-first rows (rowIndex > 0) when the fix is enabled.
		const isFirstStickyRowExempt =
			expValEquals('platform_editor_fix_sticky_header_row', 'isEnabled', true) && rowIndex === 0;
		const someMergedAcrossColumn = isFirstStickyRowExempt
			? false
			: anyChildCellMergedAcrossColumn(node);
		return allHeaders && !someMergedAcrossRow && !someMergedAcrossColumn;
	}

	const someMerged = anyChildCellMergedAcrossRow(node);
	return allHeaders && !someMerged;
};
