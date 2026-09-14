/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { findBadColWidths } from './find-bad-col-widths';
import { findWidth } from './find-width';
import { TableMap, TableProblemTypes, tableNewColumnMinWidth } from './table-map';
import type { TableProblem } from './table-map';

// Compute a table map.
export function computeMap(table: PMNode): TableMap {
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
