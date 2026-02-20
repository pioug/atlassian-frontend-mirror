import { Fragment, type Slice, type Node } from '@atlaskit/editor-prosemirror/model';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { CellSelection } from '../cell-selection';
import { type Rect, TableMap } from '../table-map';
import type { CellSelectionRect } from '../types';
import { selectionCell } from '../utils/selection-cell';
import { tableNodeTypes } from '../utils/table-node-types';
import { isInTable } from '../utils/tables';

import { clipCells, fitSlice, insertCells, pastedCells } from './copy-paste';

type PasteOptions = {
	pasteSource: string;
};

const SKIP_NESTED_TABLE_PASTE_SOURCES = ['microsoft-excel', 'google-spreadsheets'];

export function handlePaste(
	view: EditorView,
	_event: ClipboardEvent,
	slice: Slice,
	options?: PasteOptions,
): boolean {
	if (!isInTable(view.state)) {
		return false;
	}

	const { schema } = view.state;
	const isPasteFullTableInsideEmptyCellEnabled = fg(
		'platform_editor_paste_full_table_inside_empty_cell',
	);

	const isPartialTablePaste =
		slice.content.childCount === 1 &&
		slice.content.firstChild?.type === schema.nodes.table &&
		slice.openStart !== 0 &&
		slice.openEnd !== 0;

	const sel = view.state.selection;
	const isCellSelection = sel instanceof CellSelection;

	if (
		isPasteFullTableInsideEmptyCellEnabled &&
		!isPartialTablePaste &&
		// If the selection is not a cell selection, and the selection is empty then we can insert a nested table
		!isCellSelection &&
		sel.empty &&
		!(options && SKIP_NESTED_TABLE_PASTE_SOURCES.includes(options.pasteSource))
	) {
		const cellRes = findParentNode(
			(node) => node.type === schema.nodes.tableCell || node.type === schema.nodes.tableHeader,
		)(sel);

		if (cellRes) {
			const canInsertNestedTable = cellRes.node
				.contentMatchAt(0)
				.matchType(schema.nodes.table)?.validEnd;

			if (canInsertNestedTable) {
				return false;
			}
		}
	}

	let cells = pastedCells(slice);
	if (isCellSelection) {
		if (!cells) {
			cells = {
				width: 1,
				height: 1,
				rows: [Fragment.from(fitSlice(tableNodeTypes(view.state.schema).cell, slice))],
			};
		}

		const table = sel.$anchorCell.node(-1);
		const start = sel.$anchorCell.start(-1);
		const tableMap = TableMap.get(table);
		const rect = tableMap.rectBetween(sel.$anchorCell.pos - start, sel.$headCell.pos - start);
		cells = clipCells(cells, rect.right - rect.left, rect.bottom - rect.top);
		insertCells(
			view.state,
			view.dispatch,
			start,
			rect,
			clearColumnWidthOfCells(cells, rect, tableMap),
		);
		return true;
	}
	if (cells) {
		const $cell = selectionCell(sel);
		if (!$cell) {
			throw new Error(`handlePaste: no cell found`);
		}
		const start = $cell.start(-1);
		const rect = TableMap.get($cell.node(-1)).findCell($cell.pos - start);
		const tableMap = TableMap.get($cell.node(-1));

		insertCells(
			view.state,
			view.dispatch,
			start,
			rect,
			clearColumnWidthOfCells(cells, rect, tableMap),
		);
		return true;
	}
	return false;
}

// Clear the pasted cells column widths so that it maintains
// the column widths of the destination table only if the pasted
// cells overlap with existing cells in the destination table.
// If the table grows on paste, keep the column widhts of the
// original table.
const clearColumnWidthOfCells = (cells: CellSelectionRect, rect: Rect, table: TableMap) => {
	const overlappingCells: Node[] = [];

	for (const row of cells.rows) {
		let colNum = rect.left;

		for (let index = 0; index < row.childCount; index++) {
			const cell = row.child(index);

			if (colNum + cell.attrs.colspan <= table.width) {
				overlappingCells.push(cell);
				colNum += cell.attrs.colspan;
			} else {
				break;
			}
		}
	}

	for (const cell of overlappingCells) {
		// TODO: ED-13910 - unblock Prosemirror bump
		// @ts-ignore
		cell.attrs.colwidth = null;
	}

	return cells;
};
