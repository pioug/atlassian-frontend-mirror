import { mapChildren } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';

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
		} catch (e) {
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

export const getTableWidth = (node: PmNode) => {
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

const anyChildCellMergedAcrossRow = (node: PmNode): boolean =>
	mapChildren(node, (child) => child.attrs.rowspan || 0).some((rowspan) => rowspan > 1);

/**
 * Check if a given node is a header row with this definition:
 *  - all children are tableHeader cells
 *  - no table cells have been have merged with other table row cells
 *
 * @param node ProseMirror node
 * @returns boolean if it meets definition
 */
export const supportedHeaderRow = (node: PmNode): boolean => {
	const allHeaders = mapChildren(node, (child) => child.type.name === 'tableHeader').every(Boolean);

	const someMerged = anyChildCellMergedAcrossRow(node);

	return allHeaders && !someMerged;
};
