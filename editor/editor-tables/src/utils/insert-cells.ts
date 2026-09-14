// Utilities used for copy/paste handling.
//
// This module handles pasting cell content into tables, or pasting
// anything into a cell selection, as replacing a block of cells with
// the content of the selection. When pasting cells into a cell, that
// involves placing the block of pasted content so that its top left
// aligns with the selection cell, optionally extending the table to
// the right or bottom to make sure it is large enough. Pasting into a
// cell selection is different, here the cells in the selection are
// clipped to the selection's rectangle, optionally repeating the
// pasted cells when they are smaller than the selection.

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { CellSelection } from '../cell-selection';
import type { Rect } from '../rect';
import { TableMap } from '../table-map';
import type { CellSelectionRect, Dispatch } from '../types';
import { isHeaderEnabledByType } from './is-header-enabled-by-type';
import { removeColSpan } from './remove-col-span';
import { selectedRect } from './selection-rect';
import { tableNodeTypes } from './table-node-types';

// Make sure a table has at least the given width and height. Return
// true if something was changed.
function growTable(
	tr: Transaction,
	map: TableMap,
	table: PMNode,
	start: number,
	width: number,
	height: number,
	mapFrom: number,
): boolean {
	const { schema } = tr.doc.type;
	const types = tableNodeTypes(schema);
	let empty;
	let emptyHead;
	if (width > map.width) {
		for (let row = 0, rowEnd = 0; row < map.height; row++) {
			const rowNode = table.child(row);
			rowEnd += rowNode.nodeSize;
			const cells: PMNode[] = [];
			let add;
			if (rowNode.lastChild == null || rowNode.lastChild.type === types.cell) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				add = empty || (empty = types.cell.createAndFill()!);
			} else {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				add = emptyHead || (emptyHead = types.header_cell.createAndFill()!);
			}
			for (let i = map.width; i < width; i++) {
				cells.push(add);
			}
			tr.insert(tr.mapping.slice(mapFrom).map(rowEnd - 1 + start), cells);
		}
	}
	if (height > map.height) {
		const cells: PMNode[] = [];
		for (let i = 0, k = (map.height - 1) * map.width; i < Math.max(map.width, width); i++) {
			let header: boolean;

			if (i >= map.width) {
				header = false;
			} else {
				const mappedPos = map.map[k + i];
				const node = table.nodeAt(mappedPos);
				if (!node) {
					throw new Error(`growTable: no node found at pos ${mappedPos}`);
				}
				header = node.type === types.header_cell;
			}
			cells.push(
				header
					? // Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						emptyHead || (emptyHead = types.header_cell.createAndFill()!)
					: // Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						empty || (empty = types.cell.createAndFill()!),
			);
		}

		const emptyRow = types.row.create(null, Fragment.from(cells));
		const rows: PMNode[] = [];
		for (let i = map.height; i < height; i++) {
			rows.push(emptyRow);
		}
		tr.insert(tr.mapping.slice(mapFrom).map(start + table.nodeSize - 2), rows);
	}
	return !!(empty || emptyHead);
}

// Make sure the given line (left, top) to (right, top) doesn't cross
// any rowspan cells by splitting cells that cross it. Return true if
// something changed.
function isolateHorizontal(
	tr: Transaction,
	map: TableMap,
	table: PMNode,
	start: number,
	left: number,
	right: number,
	top: number,
	mapFrom: number,
): boolean {
	if (top === 0 || top === map.height) {
		return false;
	}
	let found = false;
	for (let col = left; col < right; col++) {
		const index = top * map.width + col;
		const pos = map.map[index];
		if (map.map[index - map.width] === pos) {
			found = true;
			const cell = table.nodeAt(pos);
			if (!cell) {
				throw new Error(`isolateHorizontal: no cell found at pos ${pos}`);
			}
			const { top: cellTop, left: cellLeft } = map.findCell(pos);
			tr.setNodeMarkup(tr.mapping.slice(mapFrom).map(pos + start), undefined, {
				...cell.attrs,
				rowspan: top - cellTop,
			});
			const newCell = cell.type.createAndFill({
				...cell.attrs,
				rowspan: cellTop + cell.attrs.rowspan - top,
			});

			if (!newCell) {
				throw new Error('isolateHorizontal: failed to create cell');
			}
			tr.insert(tr.mapping.slice(mapFrom).map(map.positionAt(top, cellLeft, table)), newCell);
			col += cell.attrs.colspan - 1;
		}
	}
	return found;
}

// Make sure the given line (left, top) to (left, bottom) doesn't
// cross any colspan cells by splitting cells that cross it. Return
// true if something changed.
function isolateVertical(
	tr: Transaction,
	map: TableMap,
	table: PMNode,
	start: number,
	top: number,
	bottom: number,
	left: number,
	mapFrom: number,
): boolean {
	if (left === 0 || left === map.width) {
		return false;
	}
	let found = false;
	for (let row = top; row < bottom; row++) {
		const index = row * map.width + left;
		const pos = map.map[index];
		if (map.map[index - 1] === pos) {
			found = true;
			const cell = table.nodeAt(pos);
			if (!cell) {
				throw new Error(`isolateVertical: could not find cell at pos ${pos}`);
			}
			const cellLeft = map.colCount(pos);
			const updatePos = tr.mapping.slice(mapFrom).map(pos + start);
			tr.setNodeMarkup(
				updatePos,
				undefined,
				removeColSpan(cell.attrs, left - cellLeft, cell.attrs.colspan - (left - cellLeft)),
			);
			const newCell = cell.type.createAndFill(removeColSpan(cell.attrs, 0, left - cellLeft));
			if (!newCell) {
				throw new Error('isolateVertical: failed to create cell');
			}
			tr.insert(updatePos + cell.nodeSize, newCell);
			row += cell.attrs.rowspan - 1;
		}
	}
	return found;
}

function applyHeaderCells(
	tr: Transaction,
	tableMap: TableMap,
	state: EditorState,
	tableStart: number,
	table: PMNode,
	headerRowEnabled: boolean,
	headerColumnEnabled: boolean,
) {
	const { schema } = state;

	const setMarkup = (tr: Transaction, row: number, col: number, headerEnabled: boolean) => {
		const cellPos = tableStart + tableMap.positionAt(row, col, table);
		const cell = tr.doc.nodeAt(cellPos);

		const newType = headerEnabled ? schema.nodes.tableHeader : schema.nodes.tableCell;

		const isCellTypeChanged = newType !== cell?.type;
		const isCellTypeValid =
			!!cell && [schema.nodes.tableCell, schema.nodes.tableHeader].includes(cell.type);

		if (isCellTypeChanged && isCellTypeValid) {
			tr.setNodeMarkup(cellPos, newType, cell?.attrs, cell?.marks);
		}
	};

	// For row === 0 && col === 0 it is enabled if either are enabled
	setMarkup(tr, 0, 0, headerColumnEnabled || headerRowEnabled);

	// Header Column
	for (let col = 1; col < tableMap.width; col++) {
		setMarkup(tr, 0, col, headerRowEnabled);
	}
	// Header Row
	for (let row = 1; row < tableMap.height; row++) {
		setMarkup(tr, row, 0, headerColumnEnabled);
	}
}

// Insert the given set of cells (as returned by `pastedCells`) into a
// table, at the position pointed at by rect.
export function insertCells(
	state: EditorState,
	dispatch: Dispatch,
	tableStart: number,
	rect: Rect,
	cells: CellSelectionRect,
): void {
	let table: PMNode | null | undefined = state.doc;

	const newRect = selectedRect(state);
	const types = tableNodeTypes(state.schema);

	// Get if the header row and column are enabled on the original table
	const headerRowEnabled = isHeaderEnabledByType('row', newRect, types);
	const headerColumnEnabled = isHeaderEnabledByType('column', newRect, types);

	if (tableStart) {
		table = state.doc.nodeAt(tableStart - 1);
		if (!table) {
			throw new Error(`insertCells: could not find table at pos ${tableStart - 1}`);
		}
	}

	let map = TableMap.get(table);
	const { top, left } = rect;
	const right = left + cells.width;
	const bottom = top + cells.height;
	const { tr } = state;
	let mapFrom = 0;
	function recomp() {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		table = tableStart ? tr.doc.nodeAt(tableStart - 1)! : tr.doc;
		map = TableMap.get(table);
		mapFrom = tr.mapping.maps.length;
	}
	// Prepare the table to be large enough and not have any cells
	// crossing the boundaries of the rectangle that we want to
	// insert into. If anything about it changes, recompute the table
	// map so that subsequent operations can see the current shape.
	if (growTable(tr, map, table, tableStart, right, bottom, mapFrom)) {
		recomp();
	}
	if (isolateHorizontal(tr, map, table, tableStart, left, right, top, mapFrom)) {
		recomp();
	}
	if (isolateHorizontal(tr, map, table, tableStart, left, right, bottom, mapFrom)) {
		recomp();
	}
	if (isolateVertical(tr, map, table, tableStart, top, bottom, left, mapFrom)) {
		recomp();
	}
	if (isolateVertical(tr, map, table, tableStart, top, bottom, right, mapFrom)) {
		recomp();
	}

	for (let row = top; row < bottom; row++) {
		const from = map.positionAt(row, left, table);
		const to = map.positionAt(row, right, table);
		// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
		tr.replace(
			tr.mapping.slice(mapFrom).map(from + tableStart),
			tr.mapping.slice(mapFrom).map(to + tableStart),
			new Slice(cells.rows[row - top], 0, 0),
		);
	}
	recomp();
	applyHeaderCells(tr, map, state, tableStart, table, headerRowEnabled, headerColumnEnabled);

	tr.setSelection(
		new CellSelection(
			tr.doc.resolve(tableStart + map.map[top * map.width + left]),
			tr.doc.resolve(tableStart + map.map[(bottom - 1) * map.width + right - 1]),
		),
	);

	dispatch(tr);
}
