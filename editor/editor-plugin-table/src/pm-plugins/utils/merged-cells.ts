import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findTable, TableMap } from '@atlaskit/editor-tables';

type MergeType = 'row' | 'column';

const getRect = (index: number, type: MergeType, map: TableMap) => {
	if (type === 'column') {
		const x = Math.max(Math.min(index, map.width - 1), 0); // clamped index
		return {
			left: x,
			right: x === index ? x + 1 : x,
			top: 0,
			bottom: map.height,
		};
	} else {
		const y = Math.max(Math.min(index, map.height - 1), 0); // clamped index
		return {
			left: 0,
			right: map.width,
			top: y,
			bottom: y === index ? y + 1 : y,
		};
	}
};

export const hasMergedCellsInBetween =
	(indexes: number[], type: MergeType) =>
	(selection: Selection): boolean => {
		const table = findTable(selection);
		if (!table) {
			return false;
		}

		const map = TableMap.get(table.node);
		const cellPositions = new Set<number>();
		const mergedCells = new Set<number>();

		map.map.forEach((value) => {
			if (cellPositions.has(value)) {
				mergedCells.add(value);
			} else {
				cellPositions.add(value);
			}
		});

		if (!mergedCells.size) {
			return false;
		}

		const getMergedCellsInRect = (index: number, type: MergeType) => {
			const rect = getRect(index, type, map);
			const isValidRectangle = rect.left < rect.right && rect.top < rect.bottom;
			if (!isValidRectangle) {
				return [];
			}

			const cells = map.cellsInRect(rect);

			let allCellsInRect = [];
			if (type === 'column') {
				allCellsInRect = map.map.filter((_, key) => key % map.width === index);
			} else {
				allCellsInRect = map.map.filter((_, key) => Math.floor(key / map.width) === index);
			}
			const mergedCell = allCellsInRect.filter((nodePos) => {
				return !cells.includes(nodePos) // cell exists in Rect but not show in the map.cellsInRect list => merged cell
					? true
					: mergedCells.has(nodePos); // cell includes in mergedCells => merged cell
			});

			return [...new Set(mergedCell)];
		};

		const mergedCellsInRectArr = indexes.map((index) => getMergedCellsInRect(index, type));

		// Currently only support 2 indexes, but we can extend this to support more indexes in the future.
		return mergedCellsInRectArr[0].some((cell) => mergedCellsInRectArr[1].includes(cell));
	};

// Checks if any cell in the column with colIndex is merged with a cell in a column to the left or to the right of it.
// colIndex is a logical index of the column. It starts at 0 and goes up to tableMap.width - 1.
export const hasMergedCellsWithColumnNextToColumnIndex = (
	colIndex: number,
	selection: Selection,
): boolean => {
	const table = findTable(selection);
	if (!table) {
		return false;
	}

	const tableMap = TableMap.get(table.node);
	const { width } = tableMap;
	if (width <= 1) {
		return false;
	}

	if (colIndex < 0 || colIndex > width - 1) {
		return false;
	}

	const { map } = tableMap;
	// j is an index in the tableMap.map array. tableMap.map is a flat array.
	// Each item of this array contains a number.
	// The number represents the position of the corresponding cell in the tableMap. It exists for each cell.
	// If there are merged cells, their positions will be represented by the same number.
	const isFirstColumn = colIndex === 0;
	const isLastColumn = colIndex === width - 1;
	for (let j = colIndex; j < map.length; j += width) {
		if (
			(!isFirstColumn && map[j] === map[j - 1]) || // compare with a cell in the column on the left
			(!isLastColumn && map[j] === map[j + 1]) // compare with a cell in the column on the right
		) {
			return true;
		}
	}

	return false;
};

// Checks if any cell in the row with rowIndex is merged with a cell in a row above or below it.
export const hasMergedCellsWithRowNextToRowIndex = (
	rowIndex: number, // logical row index in the table. It starts at 0 and goes up to tableMap.height - 1.
	selection: Selection,
): boolean => {
	const table = findTable(selection);
	if (!table) {
		return false;
	}

	const tableMap = TableMap.get(table.node);
	const { height } = tableMap;
	if (height <= 1) {
		return false;
	}

	if (rowIndex < 0 || rowIndex > height - 1) {
		return false;
	}

	const { map, width } = tableMap; // map is a flat array representing position of each cell in the table.
	const indexOfFirstCellInTheRow = rowIndex * width;
	const indexOfLastCellInTheRow = indexOfFirstCellInTheRow + width - 1;
	const isFirstRow = rowIndex === 0;
	const isLastRow = rowIndex === height - 1;
	// j is an index of a cell in a row
	for (let j = indexOfFirstCellInTheRow; j <= indexOfLastCellInTheRow; j++) {
		if (
			(!isFirstRow && map[j] === map[j - width]) || // compare with a cell in the row above
			(!isLastRow && map[j] === map[j + width]) // compare with a cell in the row below
		) {
			return true;
		}
	}

	return false;
};

export const hasMergedCellsInSelection =
	(indexes: number[], type: MergeType) =>
	(selection: Selection): boolean => {
		const table = findTable(selection);
		if (!table) {
			return false;
		}

		const map = TableMap.get(table.node);

		if (!map.hasMergedCells()) {
			return false;
		}

		return checkEdgeHasMergedCells(indexes, map, type);
	};

/**
 * this check the selection has merged cells with previous/next col or row.
 *
 * @param indexes - this get the indexes of the selection,e.g. [0,1] for selecting first two rows or columns.
 * @param tableMap  - this return a TableMap object.
 * @param direction - check selection is selected by row or column
 * @returns boolean
 */
export const checkEdgeHasMergedCells = (
	indexes: number[],
	tableMap: TableMap,
	direction: 'row' | 'column',
): boolean => {
	const { mapByRow, mapByColumn } = tableMap;
	const map = 'row' === direction ? mapByRow : mapByColumn;
	const lengthLimiter = direction === 'row' ? tableMap.width : tableMap.height;
	const minIndex = Math.min(...indexes);
	const maxIndex = Math.max(...indexes);
	let isTopSideHaveMergedCells = false;
	let isBottomSideHaveMergedCells = false;

	/**
   * this is to check if the cell position from last focused table is overflow. since if you selection from a cell in 6th row and 7th column cell in a 7x8 table to 3x3 table, the cell position will be overflow because new table dont have this cell at all.
   TODO: ED-22335 this should better called only when hover over the drag handle.
  */
	const isOldMinIndex = !map[minIndex - 1] || !map[minIndex];
	const isOldMaxIndex = !map[maxIndex + 1] || !map[maxIndex];

	if (minIndex > 0 && !isOldMinIndex) {
		const prevSelectionSet = map[minIndex - 1];
		const minSelectionSet = map[minIndex];
		for (let i = 0; i < lengthLimiter; i++) {
			if (prevSelectionSet[i] === minSelectionSet[i]) {
				isTopSideHaveMergedCells = true;
				break;
			}
		}
	}

	if (maxIndex < map.length - 1 && !isOldMaxIndex) {
		const afterSelectionSet = map[maxIndex + 1];
		const maxSelectionSet = map[maxIndex];

		for (let i = 0; i < lengthLimiter; i++) {
			if (afterSelectionSet[i] === maxSelectionSet[i]) {
				isBottomSideHaveMergedCells = true;
				break;
			}
		}
	}
	return isTopSideHaveMergedCells || isBottomSideHaveMergedCells;
};

/**
 * this function will find the duplicate position in the array(table map position array).
 *
 * @param array this usually be the array including positions of the table map.
 * @returns []
 */
export const findDuplicatePosition = (array: number[]): number[] => {
	if (!array) {
		return [];
	}
	return array.filter((item, index) => array.indexOf(item) !== index);
};
