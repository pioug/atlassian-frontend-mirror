import type { CellAttributes } from '@atlaskit/adf-schema';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { pluginKey } from '../plugin-key';

import { mergeEmptyColumns } from './merge';

export const deleteRows =
	(rect: Rect, isHeaderRowRequired: boolean = false) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (!table) {
			return tr;
		}

		const rowsToDelete: number[] = [];

		const map = TableMap.get(table.node);

		for (let i = rect.top; i < rect.bottom; i++) {
			// skip header row if its required
			if (isHeaderRowRequired) {
				const cell = table.node.nodeAt(map.map[i * map.width]);
				if (cell && cell.type !== cell.type.schema.nodes.tableHeader) {
					rowsToDelete.push(i);
				}
			} else {
				rowsToDelete.push(i);
			}
		}

		if (!rowsToDelete.length) {
			return tr;
		}

		const rows: PMNode[] = [];
		const seen: { [key: string]: boolean } = {};
		const deletedCells: { [key: string]: boolean } = {};

		for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
			const rowCells: PMNode[] = [];
			const row = table.node.child(rowIndex);

			for (let colIndex = 0; colIndex < map.width; colIndex++) {
				const cellPos = map.map[rowIndex * map.width + colIndex];
				const cell = table.node.nodeAt(cellPos);
				if (!cell) {
					continue;
				}
				const cellsInRow = map.cellsInRect({
					left: 0,
					top: rowIndex,
					right: map.width,
					bottom: rowIndex + 1,
				});
				if (rowsToDelete.indexOf(rowIndex) === -1 && !seen[cellPos]) {
					// decrement rowspans for row-spanning cells that overlap deleted rows
					if (cellsInRow.indexOf(cellPos) > -1) {
						let overlappingRows = 0;
						rowsToDelete.forEach((rowIndexToDelete) => {
							if (
								rowIndex < rowIndexToDelete &&
								cell.attrs.rowspan + rowIndex - 1 >= rowIndexToDelete
							) {
								overlappingRows += 1;
							}
						});
						if (overlappingRows > 0) {
							const newCell = cell.type.createChecked(
								{
									...cell.attrs,
									rowspan: cell.attrs.rowspan - overlappingRows,
								},
								cell.content,
								cell.marks,
							);
							rowCells.push(newCell);
							seen[cellPos] = true;
							continue;
						}
					} else if (deletedCells[cellPos]) {
						// if we're removing a row-spanning cell, we need to add missing cells to rows below
						const attrs: CellAttributes = {
							...cell.attrs,
							colspan: 1,
							rowspan: 1,
						};
						if (cell.attrs.colwidth) {
							const pos = colIndex > 0 ? colIndex - map.colCount(cellPos) : 0;
							attrs.colwidth = cell.attrs.colwidth.slice().splice(pos, 1);
						}
						const newCell = cell.type.createChecked(
							attrs,
							cell.type.schema.nodes.paragraph.createChecked(),
							cell.marks,
						);
						rowCells.push(newCell);
						continue;
					}

					// normal cells that we want to keep
					if (!seen[cellPos]) {
						seen[cellPos] = true;
						rowCells.push(cell);
					}
				} else if (cellsInRow.indexOf(cellPos) > -1) {
					deletedCells[cellPos] = true;
				}
			}

			if (rowCells.length) {
				rows.push(row.type.createChecked(row.attrs, rowCells, row.marks));
			}
		}

		if (!rows.length) {
			return tr;
		}

		const newTable = table.node.type.createChecked(table.node.attrs, rows, table.node.marks);
		const fixedTable = mergeEmptyColumns(newTable);
		if (fixedTable === null) {
			return tr;
		}
		const cursorPos = getNextCursorPos(newTable, rowsToDelete);

		// If we delete a row we should also clean up the hover selection
		if (fg('platform_editor_remove_slow_table_transactions')) {
			tr.setMeta(pluginKey, {
				type: 'CLEAR_HOVER_SELECTION',
				data: {
					isInDanger: false,
					isWholeTableInDanger: false,
				},
			});
		}

		return (
			tr
				.replaceWith(table.pos, table.pos + table.node.nodeSize, fixedTable)
				// move cursor before the deleted rows if possible, otherwise - to the first row
				.setSelection(Selection.near(tr.doc.resolve(table.pos + cursorPos)))
		);
	};

function getNextCursorPos(table: PMNode, deletedRows: number[]): number {
	const minRow = Math.min(...deletedRows);
	const nextRowWithCursor = minRow > 0 ? minRow - 1 : 0;
	const map = TableMap.get(table);
	return map.map[nextRowWithCursor * map.width];
}
