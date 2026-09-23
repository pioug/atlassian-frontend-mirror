import { parsePx } from '@atlaskit/editor-common/utils';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable, getSelectionRect, isRowSelected } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { TableCssClassName as ClassName } from '../../types';
import { tableDeleteButtonSize } from '../../ui/consts';

export interface RowParams {
	endIndex: number;
	height: number;
	startIndex: number;
}

export const getRowHeights = (tableRef: HTMLTableElement): number[] => {
	const heights: number[] = [];
	const tableBody = tableRef.querySelector('tbody');
	if (tableBody) {
		// filter out widget children (e.g. anchor widgets) of table body
		const rows = fg('platform_editor_ai_show_diff_patch_2')
			? Array.from(tableBody.childNodes).filter(
					(node): node is HTMLTableRowElement => node instanceof HTMLTableRowElement,
				)
			: tableBody.childNodes;
		for (let i = 0, count = rows.length; i < count; i++) {
			// remove as cast when cleaning up platform_editor_ai_show_diff_patch_2
			const row = rows[i] as HTMLTableRowElement;
			heights[i] = row.getBoundingClientRect().height + 1;

			// padding only gets applied when the container has sticky
			if (row.classList.contains('sticky') && i === 0) {
				const styles = window.getComputedStyle(row);
				const paddingTop = parsePx(styles.paddingTop || '');
				heights[i] -= paddingTop ? paddingTop + 1 : +1;
			}
		}
	}

	return heights;
};

const getRowNumberLabel = (rowIndex: number, hasHeaderRow?: boolean): number | null => {
	if (!hasHeaderRow) {
		return rowIndex + 1;
	}

	return rowIndex > 0 ? rowIndex : null;
};

/**
 * Replacement diff widgets are inserted immediately before their document-row counterpart. Give
 * the widget the next row number without consuming it, so the counterpart receives the same
 * label. Other rows consume a number normally.
 */
export const getRenderedRowNumberLabels = (
	tableRef: HTMLTableElement,
	hasHeaderRow?: boolean,
): Array<number | null> => {
	const rowNumberLabels: Array<number | null> = [];
	const tableBody = tableRef.querySelector('tbody');
	if (tableBody) {
		let nextRowIndex = 0;
		const rows = Array.from(tableBody.childNodes).filter(
			(node): node is HTMLTableRowElement => node instanceof HTMLTableRowElement,
		);
		for (let i = 0, count = rows.length; i < count; i++) {
			const row = rows[i];
			if (row.hasAttribute('data-show-diff-table-row-replacement')) {
				rowNumberLabels.push(getRowNumberLabel(nextRowIndex, hasHeaderRow));
				continue;
			}

			const rowIndex = nextRowIndex++;
			rowNumberLabels.push(getRowNumberLabel(rowIndex, hasHeaderRow));
		}
	}

	return rowNumberLabels;
};

export const getRowDeleteButtonParams = (
	rowsHeights: Array<number | undefined>,
	selection: Selection,
	offsetTop = 0,
): { indexes: number[]; top: number } | null => {
	const rect = getSelectionRect(selection);
	if (!rect) {
		return null;
	}
	let height = 0;
	let offset = offsetTop;
	// find the rows before the selection
	for (let i = 0; i < rect.top; i++) {
		const rowHeight = rowsHeights[i];
		if (rowHeight) {
			offset += rowHeight - 1;
		}
	}
	// these are the selected rows widths
	const indexes: number[] = [];
	for (let i = rect.top; i < rect.bottom; i++) {
		const rowHeight = rowsHeights[i];
		if (rowHeight) {
			height += rowHeight - 1;
			indexes.push(i);
		}
	}

	const top = offset + height / 2 - tableDeleteButtonSize / 2;
	return { top, indexes };
};

export const getRowsParams = (rowsHeights: Array<number | undefined>): RowParams[] => {
	const rows: RowParams[] = [];
	for (let i = 0, count = rowsHeights.length; i < count; i++) {
		const height = rowsHeights[i];
		if (!height) {
			continue;
		}
		let endIndex = rowsHeights.length;
		for (let k = i + 1, count = rowsHeights.length; k < count; k++) {
			if (rowsHeights[k]) {
				endIndex = k;
				break;
			}
		}
		rows.push({ startIndex: i, endIndex, height });
	}
	return rows;
};

/**
 * Returns the visual row index that the mouse pointer is over, by walking the row heights
 * inside `tbody` and finding the row whose vertical range contains `mouseEvent.clientY`.
 *
 * When `rowIndexRange` is provided, the search is restricted to rows in that range (the
 * `endIndex` is exclusive). This is the hot path used on `mousemove` when hovering over a
 * row-spanned cell — restricting the range to `[startIndex, endIndex)` keeps the number
 * of forced layout reads bounded by the row-span size, not the table size.
 *
 * Returns `undefined` when the mouse is above the search range or below it (so callers can
 * fall back to the HTML row index).
 */
export const getRowIndexByMousePosition = (
	tableRef: HTMLTableElement,
	mouseEvent: MouseEvent,
	rowIndexRange?: { endIndex: number; startIndex: number },
): number | undefined => {
	const tableBody = tableRef.querySelector('tbody');
	if (!tableBody) {
		return undefined;
	}

	const rows = tableBody.children;
	const startIndex = rowIndexRange?.startIndex ?? 0;
	const endIndex = Math.min(rowIndexRange?.endIndex ?? rows.length, rows.length);
	if (startIndex >= endIndex) {
		return undefined;
	}

	const firstRowRect = (rows[startIndex] as HTMLTableRowElement).getBoundingClientRect();
	if (mouseEvent.clientY < firstRowRect.top) {
		return undefined;
	}

	let rowBottom = firstRowRect.bottom;
	if (mouseEvent.clientY < rowBottom) {
		return startIndex;
	}

	for (let rowIndex = startIndex + 1; rowIndex < endIndex; rowIndex++) {
		const rowRect = (rows[rowIndex] as HTMLTableRowElement).getBoundingClientRect();
		rowBottom = rowRect.bottom;
		if (mouseEvent.clientY < rowBottom) {
			return rowIndex;
		}
	}

	return undefined;
};

export const getRowClassNames = (
	index: number,
	selection: Selection,
	hoveredRows: number[] = [],
	isInDanger?: boolean,
	isResizing?: boolean,
): string => {
	const classNames: string[] = [];
	if (isRowSelected(index)(selection) || (hoveredRows.indexOf(index) > -1 && !isResizing)) {
		classNames.push(ClassName.HOVERED_CELL_ACTIVE);
		if (isInDanger) {
			classNames.push(ClassName.HOVERED_CELL_IN_DANGER);
		}
	}
	return classNames.join(' ');
};

export const copyPreviousRow =
	(schema: Schema) =>
	(insertNewRowIndex: number) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (!table) {
			return tr;
		}

		const map = TableMap.get(table.node);
		const copyPreviousRowIndex = insertNewRowIndex - 1;

		if (insertNewRowIndex <= 0) {
			throw Error(
				`Row Index less or equal 0 isn't not allowed since there is not a previous to copy`,
			);
		}

		if (insertNewRowIndex > map.height) {
			return tr;
		}

		const tableNode = table.node;
		const {
			nodes: { tableRow },
		} = schema;

		const cellsInRow = map.cellsInRect({
			left: 0,
			right: map.width,
			top: copyPreviousRowIndex,
			bottom: copyPreviousRowIndex + 1,
		});
		const offsetIndexPosition = copyPreviousRowIndex * map.width;
		const offsetNextLineIndexPosition = insertNewRowIndex * map.width;
		const cellsPositionsInOriginalRow = map.map.slice(
			offsetIndexPosition,
			offsetIndexPosition + map.width,
		);

		const cellsPositionsInNextRow = map.map.slice(
			offsetNextLineIndexPosition,
			offsetNextLineIndexPosition + map.width,
		);

		const cells = [] as PMNode[];
		const fixRowspans: { node: PMNode; pos: number }[] = [];
		for (let i = 0; i < cellsPositionsInOriginalRow.length; ) {
			const pos = cellsPositionsInOriginalRow[i];
			const documentCellPos = pos + table.start;
			const node = tr.doc.nodeAt(documentCellPos);
			if (!node) {
				continue;
			}

			const attributes = {
				...node.attrs,
				colspan: 1,
				rowspan: 1,
			};

			const newCell = node.type.createAndFill(attributes);

			if (!newCell) {
				return tr;
			}

			if (cellsPositionsInNextRow.indexOf(pos) > -1) {
				fixRowspans.push({ pos: documentCellPos, node });
			} else if (cellsInRow.indexOf(pos) > -1) {
				if (node.attrs.colspan > 1) {
					const newCellWithColspanFixed = node.type.createAndFill({
						...attributes,
						colspan: node.attrs.colspan,
					});

					if (!newCellWithColspanFixed) {
						return tr;
					}

					cells.push(newCellWithColspanFixed);
					i = i + node.attrs.colspan;

					continue;
				}
				cells.push(newCell);
			} else {
				cells.push(newCell);
			}

			i++;
		}

		fixRowspans.forEach((cell) => {
			tr.setNodeMarkup(cell.pos, undefined, {
				...cell.node.attrs,
				rowspan: cell.node.attrs.rowspan + 1,
			});
		});

		const cloneRow = tableNode.child(copyPreviousRowIndex);
		let rowPos = table.start;
		for (let i = 0; i < insertNewRowIndex; i++) {
			rowPos += tableNode.child(i).nodeSize;
		}

		return safeInsert(tableRow.createChecked(cloneRow.attrs, cells, cloneRow.marks), rowPos)(tr);
	};
