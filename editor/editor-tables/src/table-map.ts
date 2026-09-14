/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import { addToCache } from './add-to-cache';
import { computeMap } from './compute-map';
import { readFromCache } from './read-from-cache';
import { Rect } from './rect';
import type { Axis } from './types';

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
	findCell(pos: number): Rect {
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
	colCount(pos: number): number {
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

	isCellMerged(row: number, col: number): boolean {
		return this.isCellMergedTopLeft(row, col) || this.isCellMergedBottomRight(row, col);
	}

	isCellMergedTopLeft(row: number, col: number): boolean {
		const pos = this.map[row * this.width + col];
		return (
			// top
			(row > 0 && pos === this.map[(row - 1) * this.width + col]) ||
			// left
			(col > 0 && pos === this.map[row * this.width + (col - 1)])
		);
	}

	isCellMergedBottomRight(row: number, col: number): boolean {
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
	nextCell(pos: number, axis: Axis, dir: number): number | null {
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
	rectBetween(a: number, b: number): Rect {
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
	cellsInRect(rect: Rect): number[] {
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
	positionAt(row: number, col: number, table: PMNode): number {
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

	getMaxColInRow(pos: ResolvedPos): number | undefined {
		const parentRowNode = pos.parent;
		if (parentRowNode.type.name === 'tableRow') {
			return parentRowNode.childCount;
		}
	}

	hasMergedCells(): boolean {
		const uniquePositions = new Set(this.map);
		return uniquePositions.size !== this.map.length;
	}

	// :: (Node) → TableMap
	// Find the table map for the given table node.
	static get(table: PMNode): TableMap {
		return readFromCache(table) || addToCache(table, computeMap(table));
	}
}

/**
 * @deprecated Use `import { Rect } from '@atlaskit/editor-tables/rect'` instead.
 */
export { Rect } from './rect';

/**
 * @deprecated Use `import { findWidth } from '@atlaskit/editor-tables/find-width'` instead.
 */
export { findWidth } from './find-width';
/**
 * @deprecated Use `import { findBadColWidths } from '@atlaskit/editor-tables/find-bad-col-widths'` instead.
 */
export { findBadColWidths } from './find-bad-col-widths';
