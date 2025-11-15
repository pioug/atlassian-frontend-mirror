/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import type { Axis } from './types';

// Because working with row and column-spanning cells is not quite
// trivial, this code builds up a descriptive structure for a given
// table node. The structures are cached with the (persistent) table
// nodes as key, so that they only have to be recomputed when the
// content of the table changes.
//
// This does mean that they have to store table-relative, not
// document-relative positions. So code that uses them will typically
// compute the start position of the table and offset positions passed
// to or gotten from this structure by that amount.

let readFromCache: (key: PMNode) => TableMap | undefined,
	addToCache: (key: PMNode, value: TableMap) => TableMap;
// Prefer using a weak map to cache table maps. Fall back on a
// fixed-size cache if that's not supported.
if (typeof WeakMap !== 'undefined') {
	const cache = new WeakMap<PMNode, TableMap | undefined>();
	readFromCache = (key: PMNode) => cache.get(key);
	addToCache = (key: PMNode, value: TableMap) => {
		cache.set(key, value);
		return value;
	};
} else {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const cache: any[] = [];
	const cacheSize = 10;
	let cachePos = 0;
	readFromCache = (key: PMNode) => {
		for (let i = 0; i < cache.length; i += 2) {
			if (cache[i] === key) {
				return cache[i + 1];
			}
		}
	};
	addToCache = (key: PMNode, value: TableMap) => {
		if (cachePos === cacheSize) {
			cachePos = 0;
		}
		cache[cachePos++] = key;
		return (cache[cachePos++] = value);
	};
}

export class Rect {
	left: number;
	top: number;
	right: number;
	bottom: number;
	constructor(left: number, top: number, right: number, bottom: number) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}
}

export interface TableRect extends Rect {
	map: TableMap;
	table: PMNode;
	tableStart: number;
}

export type TableContext = {
	map: TableMap;
	table: PMNode;
	tableStart: number;
};

export enum TableProblemTypes {
	COLLISION = 'collision',
	OVERLONG_ROWSPAN = 'overlong_rowspan',
	MISSING = 'missing',
	COLWIDTH_MISMATCH = 'colwidth mismatch',
}

export type TableProblemCollision = {
	n: number;
	pos: number;
	row: number;
	type: TableProblemTypes.COLLISION;
};

export type TableProblemLongRowspan = {
	n: number;
	pos: number;
	type: TableProblemTypes.OVERLONG_ROWSPAN;
};

export type TableProblemMissing = {
	n: number;
	row: number;
	type: TableProblemTypes.MISSING;
};

export type TableProblemColWidthMismatch = {
	colwidth: number;
	pos: number;
	type: TableProblemTypes;
};

export type TableProblem =
	| TableProblemCollision
	| TableProblemLongRowspan
	| TableProblemMissing
	| TableProblemColWidthMismatch;

// Ideally tableNewColumnMinWidth should be imported
// from '@atlaskit/editor-common/styles';
// We don't want to introduce a new dependency.
// Thus we define the constant here.
export const tableNewColumnMinWidth = 140;

// ::- A table map describes the structore of a given table. To avoid
// recomputing them all the time, they are cached per table node. To
// be able to do that, positions saved in the map are relative to the
// start of the table, rather than the start of the document.
export class TableMap {
	// The width of the table
	width: number;
	// The table's height
	height: number;
	map: number[];
	problems?: TableProblem[] | null;
	mapByColumn: number[][] = [];
	mapByRow: number[][] = [];

	constructor(
		width: number,
		height: number,
		map: number[],
		problems?: TableProblem[] | null,
		mapByColumn?: number[][],
		mapByRow?: number[][],
	) {
		this.width = width;
		this.height = height;
		this.mapByColumn = mapByColumn || [];
		this.mapByRow = mapByRow || [];
		// :: [number] A width * height array with the start position of
		// the cell covering that part of the table in each slot
		this.map = map;
		// An optional array of problems (cell overlap or non-rectangular
		// shape) for the table, used by the table normalizer.
		this.problems = problems;
	}

	// :: (number) → Rect
	// Find the dimensions of the cell at the given position.
	findCell(pos: number) {
		for (let i = 0; i < this.map.length; i++) {
			const curPos = this.map[i];
			if (curPos !== pos) {
				continue;
			}
			const left = i % this.width;
			const top = (i / this.width) | 0;
			let right = left + 1;
			let bottom = top + 1;
			for (let j = 1; right < this.width && this.map[i + j] === curPos; j++) {
				right++;
			}
			for (let j = 1; bottom < this.height && this.map[i + this.width * j] === curPos; j++) {
				bottom++;
			}
			return new Rect(left, top, right, bottom);
		}
		throw new RangeError('No cell with offset ' + pos + ' found');
	}

	// Find the left side of the cell at the given position.
	colCount(pos: number) {
		for (let i = 0; i < this.map.length; i++) {
			if (this.map[i] === pos) {
				return i % this.width;
			}
		}
		throw new RangeError('No cell with offset ' + pos + ' found');
	}

	// Find the top side of the cell at the given position.
	rowCount(pos: number): number {
		if (this.width <= 0) {
			throw new RangeError('Wrong table width found');
		}

		for (let i = 0; i < this.map.length; i++) {
			if (this.map[i] === pos) {
				return Math.floor(i / this.width);
			}
		}
		throw new RangeError('No cell with offset ' + pos + ' found');
	}

	isPosMerged(pos: number): boolean {
		return this.map.includes(pos, this.map.indexOf(pos) + 1);
	}

	isCellMerged(row: number, col: number) {
		return this.isCellMergedTopLeft(row, col) || this.isCellMergedBottomRight(row, col);
	}

	isCellMergedTopLeft(row: number, col: number) {
		const pos = this.map[row * this.width + col];
		return (
			// top
			(row > 0 && pos === this.map[(row - 1) * this.width + col]) ||
			// left
			(col > 0 && pos === this.map[row * this.width + (col - 1)])
		);
	}

	isCellMergedBottomRight(row: number, col: number) {
		const pos = this.map[row * this.width + col];
		return (
			// bottom
			(row < this.height - 1 && pos === this.map[(row + 1) * this.width + col]) ||
			// right
			(col < this.width - 1 && pos === this.map[row * this.width + (col + 1)])
		);
	}

	// :: (number, string, number) → ?number
	// Find the next cell in the given direction, starting from the cell
	// at `pos`, if any.
	nextCell(pos: number, axis: Axis, dir: number) {
		const { left, right, top, bottom } = this.findCell(pos);
		if (axis === 'horiz') {
			if (dir < 0 ? left === 0 : right === this.width) {
				return null;
			}
			return this.map[top * this.width + (dir < 0 ? left - 1 : right)];
		} else {
			if (dir < 0 ? top === 0 : bottom === this.height) {
				return null;
			}
			return this.map[left + this.width * (dir < 0 ? top - 1 : bottom)];
		}
	}

	// :: (number, number) → Rect
	// Get the rectangle spanning the two given cells.
	rectBetween(a: number, b: number) {
		const { left: leftA, right: rightA, top: topA, bottom: bottomA } = this.findCell(a);
		const { left: leftB, right: rightB, top: topB, bottom: bottomB } = this.findCell(b);
		return new Rect(
			Math.min(leftA, leftB),
			Math.min(topA, topB),
			Math.max(rightA, rightB),
			Math.max(bottomA, bottomB),
		);
	}

	// :: (Rect) → [number]
	// Return the position of all cells that have the top left corner in
	// the given rectangle.
	cellsInRect(rect: Rect) {
		const result: number[] = [];
		const seen: { [key: number]: boolean } = {};
		for (let row = rect.top; row < rect.bottom; row++) {
			for (let col = rect.left; col < rect.right; col++) {
				const index = row * this.width + col;
				const pos = this.map[index];
				if (seen[pos]) {
					continue;
				}
				seen[pos] = true;
				if (
					(col !== rect.left || !col || this.map[index - 1] !== pos) &&
					(row !== rect.top || !row || this.map[index - this.width] !== pos)
				) {
					result.push(pos);
				}
			}
		}
		return result;
	}

	// :: (number, number, Node) → number
	// Return the position at which the cell at the given row and column
	// starts, or would start, if a cell started there.
	positionAt(row: number, col: number, table: PMNode) {
		for (let i = 0, rowStart = 0; ; i++) {
			const rowEnd = rowStart + table.child(i).nodeSize;
			if (i === row) {
				let index = col + row * this.width;
				const rowEndIndex = (row + 1) * this.width;
				// Skip past cells from previous rows (via rowspan)
				while (index < rowEndIndex && this.map[index] < rowStart) {
					index++;
				}
				return index === rowEndIndex ? rowEnd - 1 : this.map[index];
			}
			rowStart = rowEnd;
		}
	}

	getMaxColInRow(pos: ResolvedPos) {
		const parentRowNode = pos.parent;
		if (parentRowNode.type.name === 'tableRow') {
			return parentRowNode.childCount;
		}
	}

	hasMergedCells() {
		const uniquePositions = new Set(this.map);
		return uniquePositions.size !== this.map.length;
	}

	// :: (Node) → TableMap
	// Find the table map for the given table node.
	static get(table: PMNode) {
		return readFromCache(table) || addToCache(table, computeMap(table));
	}
}

// Compute a table map.
function computeMap(table: PMNode) {
	if (table.type.spec.tableRole !== 'table') {
		throw new RangeError('Not a table node: ' + table.type.name);
	}
	const width = findWidth(table);
	const height = table.childCount;
	const map: number[] = [];
	const colWidths: number[] = [];
	let mapPos = 0,
		problems: TableProblem[] | null = null;
	for (let i = 0, e = width * height; i < e; i++) {
		map[i] = 0;
	}

	for (let row = 0, pos = 0; row < height; row++) {
		const rowNode = table.child(row);
		pos++;
		for (let i = 0; ; i++) {
			while (mapPos < map.length && map[mapPos] !== 0) {
				mapPos++;
			}
			if (i === rowNode.childCount) {
				break;
			}
			const cellNode = rowNode.child(i),
				{ colspan, rowspan, colwidth } = cellNode.attrs;
			for (let h = 0; h < rowspan; h++) {
				if (h + row >= height) {
					(problems || (problems = [])).push({
						type: TableProblemTypes.OVERLONG_ROWSPAN,
						pos,
						n: rowspan - h,
					});
					break;
				}
				const start = mapPos + h * width;
				for (let w = 0; w < colspan; w++) {
					if (map[start + w] === 0) {
						map[start + w] = pos;
					} else {
						(problems || (problems = [])).push({
							type: TableProblemTypes.COLLISION,
							row,
							pos,
							n: colspan - w,
						});
					}
					const colW = colwidth && colwidth[w];
					if (colW) {
						const widthIndex = ((start + w) % width) * 2,
							prev = colWidths[widthIndex];
						if (prev == null || (prev !== colW && colWidths[widthIndex + 1] === 1)) {
							colWidths[widthIndex] = colW;
							colWidths[widthIndex + 1] = 1;
						} else if (prev === colW) {
							colWidths[widthIndex + 1]++;
						}
					}
				}
			}
			mapPos += colspan;
			pos += cellNode.nodeSize;
		}

		const expectedPos = (row + 1) * width;
		let missing = 0;
		while (mapPos < expectedPos) {
			if (map[mapPos++] === 0) {
				missing++;
			}
		}
		if (missing) {
			(problems || (problems = [])).push({
				type: TableProblemTypes.MISSING,
				row,
				n: missing,
			});
		}
		pos++;
	}

	const mapByRow: number[][] = Array(height);
	const mapByColumn: number[][] = Array(width);

	for (let i = 0; i < map.length; i++) {
		const columnIndex = i % width;

		mapByColumn[columnIndex] = mapByColumn[columnIndex] ?? [];
		mapByColumn[columnIndex].push(map[i]);

		const rowIndex = Math.trunc(i / width);

		mapByRow[rowIndex] = mapByRow[rowIndex] ?? [];
		mapByRow[rowIndex].push(map[i]);
	}

	const tableMap = new TableMap(width, height, map, problems, mapByColumn, mapByRow);
	let badWidths = false;

	// For columns that have defined widths, but whose widths disagree
	// between rows, fix up the cells whose width doesn't match the
	// computed one.
	for (let i = 0; !badWidths && i < colWidths.length; i += 2) {
		if (colWidths[i] != null && colWidths[i + 1] < height) {
			badWidths = true;
		}
	}

	// colWidths is an array of numbers, it can look like this
	// const colWidths = [255, 3, 125, 3, 150, 2, 130, 1];
	// 255 is a colWidth and 3 is a number of cells with this colwidth.
	// This check exists to make sure that the table has been resized,
	// which means there will be elements in the colWidths array.
	if (colWidths.length > 0 && colWidths.length !== width * 2) {
		for (let i = 0; i < width * 2 - colWidths.length; i++) {
			colWidths.push(tableNewColumnMinWidth, 0);
		}

		badWidths = true;
	}

	if (badWidths) {
		findBadColWidths(tableMap, colWidths, table);
	}

	return tableMap;
}

function findWidth(table: PMNode) {
	let width = -1;
	let hasRowSpan = false;
	for (let row = 0; row < table.childCount; row++) {
		const rowNode = table.child(row);
		let rowWidth = 0;
		if (hasRowSpan) {
			for (let j = 0; j < row; j++) {
				const prevRow = table.child(j);
				for (let i = 0; i < prevRow.childCount; i++) {
					const cell = prevRow.child(i);
					if (j + cell.attrs.rowspan > row) {
						rowWidth += cell.attrs.colspan;
					}
				}
			}
		}
		for (let i = 0; i < rowNode.childCount; i++) {
			const cell = rowNode.child(i);
			rowWidth += cell.attrs.colspan;
			if (cell.attrs.rowspan > 1) {
				hasRowSpan = true;
			}
		}
		if (width === -1) {
			width = rowWidth;
		} else if (width !== rowWidth) {
			width = Math.max(width, rowWidth);
		}
	}
	return width;
}

function findBadColWidths(map: TableMap, colWidths: number[], table: PMNode) {
	if (!map.problems) {
		map.problems = [];
	}
	const seen: { [key: number]: boolean } = {};
	for (let i = 0; i < map.map.length; i++) {
		const pos = map.map[i];
		if (seen[pos]) {
			continue;
		}
		seen[pos] = true;
		const node = table.nodeAt(pos) as PMNode;
		let updated = null;
		for (let j = 0; j < node.attrs.colspan; j++) {
			const col = (i + j) % map.width,
				colWidth = colWidths[col * 2];
			if (colWidth != null && (!node.attrs.colwidth || node.attrs.colwidth[j] !== colWidth)) {
				(updated || (updated = freshColWidth(node.attrs)))[j] = colWidth;
			}
		}
		if (updated) {
			map.problems.unshift({
				type: TableProblemTypes.COLWIDTH_MISMATCH,
				pos,
				colwidth: updated,
			});
		}
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function freshColWidth(attrs: { [key: string]: any }) {
	if (attrs.colwidth) {
		return attrs.colwidth.slice();
	}
	const result: number[] = [];
	for (let i = 0; i < attrs.colspan; i++) {
		result.push(0);
	}
	return result;
}
