/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
import { cloneTr } from './clone-tr';
import { findCellClosestToPos } from './find-cell-closest-to-pos';
import { findTable } from './find-table';

const select =
	(type: 'row' | 'column') =>
	(index: number, expand?: boolean) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		const isRowSelection = type === 'row';

		const prevSelection = tr.selection as CellSelection;

		const isPrevRowSelection = !!prevSelection.$anchorCell && !!prevSelection.$headCell;

		if (table) {
			const map = TableMap.get(table.node);

			// Check if the index is valid
			if (index >= 0 && index < (isRowSelection ? map.height : map.width)) {
				let left = isRowSelection ? 0 : index;
				let top = isRowSelection ? index : 0;
				let right = isRowSelection ? map.width : index + 1;
				let bottom = isRowSelection ? index + 1 : map.height;

				let cellsInFirstRow: number[] = [];

				if (expand) {
					const cell = findCellClosestToPos(tr.selection.$from);
					if (!cell) {
						return tr;
					}

					const selRect = map.findCell(cell.pos - table.start);
					if (isRowSelection) {
						top = Math.min(top, selRect.top);
						bottom = Math.max(bottom, selRect.bottom);

						cellsInFirstRow = map.cellsInRect({
							left,
							top,
							right,
							bottom: top + 1,
						});

						const targetRowCells = map.cellsInRect({
							left,
							top: index,
							right,
							bottom: index + 1,
						});

						const isBackwardSelection = targetRowCells[0] < prevSelection.$head.pos - table.start;

						if (isBackwardSelection && isPrevRowSelection) {
							const head = table.start + cellsInFirstRow[0];
							const anchor = prevSelection.$anchorCell.pos;

							const $head = tr.doc.resolve(head);
							const $anchor = tr.doc.resolve(anchor);
							return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
						}
					} else {
						left = Math.min(left, selRect.left);
						right = Math.max(right, selRect.right);

						cellsInFirstRow = map.cellsInRect({
							left,
							top,
							right: left + 1,
							bottom,
						});

						const targetRowCells = map.cellsInRect({
							left: index,
							top,
							right: index + 1,
							bottom,
						});

						const isBackwardSelection = targetRowCells[0] < prevSelection.$head.pos - table.start;

						if (isBackwardSelection && isPrevRowSelection) {
							const head = table.start + cellsInFirstRow[0];
							const anchor = prevSelection.$anchorCell.pos;

							const $head = tr.doc.resolve(head);
							const $anchor = tr.doc.resolve(anchor);
							return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
						}
					}
				}

				cellsInFirstRow = map.cellsInRect({
					left,
					top,
					right: isRowSelection ? right : left + 1,
					bottom: isRowSelection ? top + 1 : bottom,
				});

				const cellsInLastRow =
					bottom - top === 1
						? cellsInFirstRow
						: map.cellsInRect({
								left: isRowSelection ? left : right - 1,
								top: isRowSelection ? bottom - 1 : top,
								right,
								bottom,
							});

				const head = table.start + cellsInFirstRow[0];
				const anchor = table.start + cellsInLastRow[cellsInLastRow.length - 1];
				const $head = tr.doc.resolve(head);
				const $anchor = tr.doc.resolve(anchor);

				return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
			}
		}

		return tr;
	};

// Returns a new transaction that selects a column at index `columnIndex`.
// Use the optional `expand` param to extend from current selection.
export const selectColumn: (index: number, expand?: boolean) => (tr: Transaction) => Transaction =
	select('column');

// Returns a new transaction that selects a row at index `rowIndex`.
// Use the optional `expand` param to extend from current selection.
export const selectRow: (index: number, expand?: boolean) => (tr: Transaction) => Transaction =
	select('row');

const selectRowsOrColumns =
	(type: 'rows' | 'columns') =>
	(indexes: number[]) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (!table) {
			return tr;
		}
		const map = TableMap.get(table.node);
		if (
			!indexes ||
			indexes.length <= 0 ||
			(type === 'rows' && Math.max(...indexes) > map.height) ||
			(type === 'columns' && Math.max(...indexes) > map.width) ||
			Math.min(...indexes) < 0
		) {
			return tr;
		}
		const startCellRect = map.cellsInRect({
			left: type === 'rows' ? 0 : Math.min(...indexes),
			top: type === 'rows' ? Math.min(...indexes) : 0,
			right: type === 'rows' ? map.width : Math.min(...indexes) + 1,
			bottom: type === 'rows' ? Math.min(...indexes) + 1 : 1,
		});
		const endCellRect = map.cellsInRect({
			left: type === 'rows' ? map.width - 1 : Math.max(...indexes),
			top: type === 'rows' ? Math.max(...indexes) : map.height - 1,
			right: type === 'rows' ? map.width : Math.max(...indexes) + 1,
			bottom: type === 'rows' ? Math.max(...indexes) + 1 : map.height,
		});
		const head = table.start + startCellRect[0];
		const anchor = table.start + endCellRect[endCellRect.length - 1];
		const $head = tr.doc.resolve(head);
		const $anchor = tr.doc.resolve(anchor);

		return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
	};

// Returns a new transaction that selects all rows at `indexes`.
export const selectRows: (indexes: number[]) => (tr: Transaction) => Transaction =
	selectRowsOrColumns('rows');

// Returns a new transaction that selects all columns at `indexes`.
export const selectColumns: (indexes: number[]) => (tr: Transaction) => Transaction =
	selectRowsOrColumns('columns');

/**
 * @deprecated Use `import { selectTable } from '@atlaskit/editor-tables/select-table'` instead.
 */
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Compatibility shim for deprecated API
export { selectTable } from './select-table';
/**
 * @deprecated Use `import { getTableSelectionClosesToPos } from '@atlaskit/editor-tables/get-table-selection-closes-to-pos'` instead.
 */
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Compatibility shim for deprecated API
export { getTableSelectionClosesToPos } from './get-table-selection-closes-to-pos';
/**
 * @deprecated Use `import { selectTableClosestToPos } from '@atlaskit/editor-tables/select-table-closest-to-pos'` instead.
 */
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Compatibility shim for deprecated API
export { selectTableClosestToPos } from './select-table-closest-to-pos';
