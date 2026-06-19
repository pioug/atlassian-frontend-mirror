import { maphElem } from '@atlaskit/editor-common/utils';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable, getSelectionRect } from '@atlaskit/editor-tables/utils';

import { tableDeleteButtonSize } from '../../ui/consts';

interface CellWidthInfo {
	colspan: number;
	colwidth: string | undefined;
	width: number;
}

export const getColumnsWidths = (view: EditorView): Array<number | undefined> => {
	const { selection } = view.state;
	let widths: Array<number | undefined> = [];
	const table = findTable(selection);
	if (table) {
		const map = TableMap.get(table.node);
		const domAtPos = view.domAtPos.bind(view);

		// When there is no cell we need to fill it with undefined
		widths = Array.from({ length: map.width });
		for (let i = 0; i < map.width; i++) {
			if (!map.isCellMergedTopLeft(0, i)) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const node = table.node.nodeAt(map.map[i])!;
				const pos = map.map[i] + table.start;
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const cellRef = findDomRefAtPos(pos, domAtPos) as HTMLElement;
				const rect = cellRef.getBoundingClientRect();
				widths[i] = (rect ? rect.width : cellRef.offsetWidth) + 1;
				i += node.attrs.colspan - 1;
			}
		}
	}
	return widths;
};

/**
 * Splits a merged cell's rendered width by `colwidth` ratios, falling back to an even split when
 * usable ratios are unavailable.
 */
export const getProportionalColumnWidths = (
	totalWidth: number,
	columnCount: number,
	ratios: number[] | undefined,
): number[] => {
	const evenSplit = () => new Array(columnCount).fill(totalWidth / columnCount);

	if (!ratios || ratios.length !== columnCount) {
		return evenSplit();
	}

	const total = ratios.reduce((sum, ratio) => sum + (ratio > 0 ? ratio : 0), 0);
	if (total <= 0) {
		return evenSplit();
	}

	return ratios.map((ratio) => totalWidth * ((ratio > 0 ? ratio : 0) / total));
};

/**
 * Like `getColumnsWidths`, but fills every visual column under a first-row `colspan` so column
 * controls can render one grid track per column.
 */
export const getColumnsWidthsWithMergedCells = (view: EditorView): Array<number | undefined> => {
	const { selection } = view.state;
	const table = findTable(selection);
	if (!table) {
		return [];
	}

	const map = TableMap.get(table.node);
	const domAtPos = view.domAtPos.bind(view);
	const widths: Array<number | undefined> = Array.from({ length: map.width });

	for (let i = 0; i < map.width; i++) {
		if (map.isCellMergedTopLeft(0, i)) {
			continue;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const node = table.node.nodeAt(map.map[i])!;
		const pos = map.map[i] + table.start;
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const cellRef = findDomRefAtPos(pos, domAtPos) as HTMLElement;
		const rect = cellRef.getBoundingClientRect();
		const measuredWidth = (rect ? rect.width : cellRef.offsetWidth) + 1;

		const colspan = node.attrs.colspan ?? 1;
		if (colspan <= 1) {
			widths[i] = measuredWidth;
			continue;
		}

		const colwidth = Array.isArray(node.attrs.colwidth) ? node.attrs.colwidth : undefined;
		const perColumnWidths = getProportionalColumnWidths(measuredWidth, colspan, colwidth);
		for (let span = 0; span < colspan && i + span < map.width; span++) {
			widths[i + span] = perColumnWidths[span];
		}
		i += colspan - 1;
	}

	return widths;
};

export const getColumnDeleteButtonParams = (
	columnsWidths: Array<number | undefined>,
	selection: Selection,
): { indexes: number[]; left: number } | null => {
	const rect = getSelectionRect(selection);
	if (!rect) {
		return null;
	}
	let width = 0;
	let offset = 0;
	// find the columns before the selection
	for (let i = 0; i < rect.left; i++) {
		const colWidth = columnsWidths[i];
		if (colWidth) {
			offset += colWidth - 1;
		}
	}
	// these are the selected columns widths
	const indexes: number[] = [];
	for (let i = rect.left; i < rect.right; i++) {
		const colWidth = columnsWidths[i];
		if (colWidth) {
			width += colWidth;
			indexes.push(i);
		}
	}

	const left = offset + width / 2 - tableDeleteButtonSize / 2;
	return { left, indexes };
};

// give a row colspan and a colwidths
// and map to a row's colwidths
const mapTableColwidthsToRow = (rowColSpans: number[], tableColWidths: number[]) => {
	let curColIdx = 0;
	const colWidths: number[] = [];

	rowColSpans.forEach((cellColSpan) => {
		const colWidth = tableColWidths
			.slice(curColIdx, curColIdx + cellColSpan)
			.reduce((acc, val) => acc + val, 0);

		curColIdx += cellColSpan;
		colWidths.push(colWidth);
	});

	return colWidths;
};

const getRelativeDomCellWidths = ({ width, colspan, colwidth }: CellWidthInfo) => {
	// For cells with colSpan 1
	// or
	// for cells in a table with unchanged column widths,
	// these are identified by the lack of colwidth data attribute,
	// return equally partitioned total cell width in DOM for each cell.
	if (colspan === 1 || !colwidth) {
		return new Array(colspan).fill(width / colspan);
	}

	// For cells that have colSpan > 1 and
	// are part of a table with resized columns
	// return the current total DOM width of the cell multiplied
	// by the percentage of the each individual cell's size.
	// The cell size percentage is calculated using individual colwidth of the cell,
	// from data-colwidth attribute on the cell,
	// divided by the total width of the cells from colwidths for merged cells.

	// Ex:
	// colwidth = ‘201,102’
	// Total colWidth = 303
	// returned cellWidths = [303 * (201/303), 303 * (102/303)]

	// For merged cells we get back colwidth as `201,102`
	const cellColWidths = colwidth.split(',').map((colwidth) => Number(colwidth));
	const totalCalculatedCellWidth = cellColWidths.reduce(
		(acc, cellColWidth) => acc + cellColWidth,
		0,
	);

	return cellColWidths.map((cellColWidth) => width * (cellColWidth / totalCalculatedCellWidth));
};

export const colWidthsForRow = (
	tr: HTMLTableRowElement,
	{ useColwidthRatios = false }: { useColwidthRatios?: boolean } = {},
): string => {
	// get the colspans
	const rowColSpans = maphElem(tr, (cell) =>
		Number(cell.getAttribute('colspan') || 1 /* default to span of 1 */),
	);

	// Chrome has trouble aligning borders with auto tables
	// and the rest of the page grid. tables with defined
	// column widths align fine.
	//
	// eg a 4x25% table might end up as 189px 190px 190px 190px
	//
	// prefer copying the widths via the DOM
	// or inferring from the next row if one exists
	const copyTarget = (tr.nextElementSibling as HTMLTableRowElement | null) || tr;

	if (copyTarget) {
		// either from the first row while it's still in the table
		const cellInfos = maphElem(copyTarget, (cell) => ({
			width: cell.getBoundingClientRect().width,
			colspan: Number(cell.getAttribute('colspan') || 1),
			colwidth: cell.dataset.colwidth,
		}));

		// reverse engineer cell widths from table widths
		const domBasedCellWidths: number[] = [];
		cellInfos.map((cell) => {
			domBasedCellWidths.push(
				...(useColwidthRatios
					? getRelativeDomCellWidths(cell)
					: new Array(cell.colspan).fill(cell.width / cell.colspan)),
			);
		});

		if (cellInfos.reduce((acc, cell) => acc + cell.width, 0) !== 0) {
			const newWidths = mapTableColwidthsToRow(rowColSpans, domBasedCellWidths);
			return newWidths.map((px) => `${px}px`).join(' ');
		}
	}

	// as a fallback, just calculate a %, and hope that
	// it aligns perfectly in the user's browser
	const visualColCount = rowColSpans.reduce((acc, val) => acc + val, 0);

	const pctWidths = rowColSpans.map((cellColSpan) => (cellColSpan / visualColCount) * 100);

	return pctWidths.map((pct) => `${pct}%`).join(' ');
};

/**
 * Returns the visual column index that the mouse pointer is over within a column-spanned
 * cell, by walking the per-column boundaries of the spanned cell and finding the column whose
 * horizontal range contains `mouseEvent.clientX`.
 *
 * `<td>.cellIndex` for a cell with `colspan > 1` only resolves to the first column the cell
 * occupies, so hovering anywhere inside a colspanned first-row cell pins the column drag handle
 * to that first column. This resolver disambiguates which visual column the pointer is actually
 * over so the handle/menu can target a single column.
 *
 * The search is restricted to columns in `[startIndex, endIndex)` (the cell's own span). The
 * spanned cell's bounding rect is read once and split into per-column boundaries using the cell's
 * `data-colwidth` ratios (falling back to an even split for unresized columns) — this keeps the
 * work bounded by the colspan size and avoids measuring the whole table.
 *
 * Returns `undefined` when the mouse is outside the spanned range (so callers can fall back to
 * the converted HTML column index).
 */
export const getColumnIndexByMousePosition = (
	cellElement: HTMLTableCellElement,
	mouseEvent: MouseEvent,
	columnIndexRange: { endIndex: number; startIndex: number },
): number | undefined => {
	const { startIndex, endIndex } = columnIndexRange;
	const columnCount = endIndex - startIndex;
	if (columnCount <= 0) {
		return undefined;
	}

	const cellRect = cellElement.getBoundingClientRect();
	if (mouseEvent.clientX < cellRect.left || mouseEvent.clientX >= cellRect.right) {
		return undefined;
	}

	// Read DOM ratios here to avoid resolving the ProseMirror node on this mouse-move path.
	const ratios = cellElement.dataset.colwidth
		?.split(',')
		.map(Number)
		.filter((value) => !Number.isNaN(value));
	const perColumnWidths = getProportionalColumnWidths(cellRect.width, columnCount, ratios);

	const offsetFromLeft = mouseEvent.clientX - cellRect.left;
	let cumulativeWidth = 0;
	for (let column = 0; column < columnCount; column++) {
		cumulativeWidth += perColumnWidths[column];
		if (offsetFromLeft < cumulativeWidth) {
			return startIndex + column;
		}
	}

	return endIndex - 1;
};

export const convertHTMLCellIndexToColumnIndex = (
	htmlColIndex: number,
	htmlRowIndex: number,
	tableMap: TableMap,
): number => {
	// Same numbers (positions) in tableMap.map array mean that there are merged cells.
	// Cells can be merged across columns. So we need to check if the cell on the left and current cell have the same value.
	// Cells can be merged acroll rows. So we need to check if the cell above has the same value as current cell.
	// When cell has the same value as the cell above it or the cell to the left of it, html cellIndex won't count it a separete column.
	const width = tableMap.width;
	const map = tableMap.map;
	let htmlColCount = 0;

	if (htmlRowIndex === 0) {
		for (let colIndex = 0; colIndex < width; colIndex++) {
			if (colIndex === 0 || map[colIndex] !== map[colIndex - 1]) {
				htmlColCount++;
			}

			if (htmlColCount - 1 === htmlColIndex) {
				return colIndex;
			}
		}
	} else {
		for (let colIndex = 0; colIndex < width; colIndex++) {
			const currentCellMapIndex = htmlRowIndex * width + colIndex;
			const cellAboveMapIndex = (htmlRowIndex - 1) * width + colIndex;
			if (colIndex > 0) {
				if (
					map[currentCellMapIndex] !== map[currentCellMapIndex - 1] &&
					map[currentCellMapIndex] !== map[cellAboveMapIndex]
				) {
					htmlColCount++;
				}
			} else {
				if (map[currentCellMapIndex] !== map[cellAboveMapIndex]) {
					htmlColCount++;
				}
			}

			if (htmlColCount - 1 === htmlColIndex) {
				return colIndex;
			}
		}
	}

	return 0;
};

// When first row has merged cells, our converted column index needs to be mapped.
export const getColumnIndexMappedToColumnIndexInFirstRow = (
	convertedColIndex: number,
	htmlRowIndex: number,
	tableMap: TableMap,
): number => {
	const width = tableMap.width;
	const map = tableMap.map;
	const mapColIndexToFistRowColIndex = [];
	let htmlColCounFirstRow = 0;
	let colSpan = 0;

	if (htmlRowIndex === 0) {
		return convertedColIndex;
	}

	for (let colIndex = 0; colIndex < width; colIndex++) {
		if (colIndex === 0 || map[colIndex] !== map[colIndex - 1]) {
			if (colSpan > 0) {
				htmlColCounFirstRow += colSpan;
				colSpan = 0;
			}
			htmlColCounFirstRow++;
		} else if (map[colIndex] === map[colIndex - 1]) {
			colSpan++;
		}
		mapColIndexToFistRowColIndex[colIndex] = htmlColCounFirstRow - 1;
	}

	return mapColIndexToFistRowColIndex[convertedColIndex];
};
