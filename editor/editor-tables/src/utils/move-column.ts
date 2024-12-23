import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
import type { MoveOptions } from '../types';

import { determineTableHeaderStateFromTableNode } from './analyse-table';
import { cloneTr } from './clone-tr';
import { findTable } from './find';
import { getSelectionRangeInColumn } from './get-selection-range-in-column';
import { normalizeDirection } from './normalize-direction';
import { isValidReorder } from './reorder-utils';
import type { TableNodeCache } from './table-node-types';
import { tableNodeTypes } from './table-node-types';
// :: (originColumnIndex: number, targetColumnIndex: targetColumnIndex, options?: MovementOptions) → (tr: Transaction) → Transaction
// Returns a new transaction that moves the origin column to the target index;
//
// by default "tryToFit" is false, that means if you try to move a column to a place
// where we will need to split a column with merged cells it'll throw an exception, for example:
//
// ```
//    0      1         2
//  ____________________________
// |      |      |             |
// |  A1  |  B1  |     C1      |
// |______|______|______ ______|
// |      |             |      |
// |  A2  |     B2      |      |
// |______|______ ______|      |
// |      |      |      |  D1  |
// |  A3  |  B3  |  C2  |      |
// |______|______|______|______|
// ```
//
//
// if you try to move the column 0 to the column index 1 with tryToFit false,
// it'll throw an exception since you can't split the column 1;
// but if "tryToFit" is true, it'll move the column using the current direction.
//
// We defined current direction using the target and origin values
// if the origin is greater than the target, that means the course is `right-to-left`,
// so the `tryToFit` logic will use this direction to determine
// if we should move the column to the right or the left.
//
// for example, if you call the function using `moveColumn(0, 1, { tryToFit: true })`
// the result will be:
//
// ```
//    0       1             2
// _____________________ _______
// |      |             |      |
// |  B1  |     C1      |  A1  |
// |______|______ ______|______|
// |             |      |      |
// |     B2      |      |  A2  |
// |______ ______|      |______|
// |      |      |  D1  |      |
// |  B3  |  C2  |      |  A3  |
// |______|______|______|______|
// ```
//
// since we could put the column zero on index one,
// we pushed to the best place to fit the column 0, in this case, column index 2.
//
// -------- HOW TO OVERRIDE DIRECTION --------
//
// If you set "tryToFit" to "true", it will try to figure out the best direction
// place to fit using the origin and target index, for example:
//
//
// ```
//     0      1       2     3      4      5       6
//   _________________________________________________
//  |      |      |             |      |             |
//  |  A1  |  B1  |     C1      |  E1  |     F1      |
//  |______|______|______ ______|______|______ ______|
//  |      |             |      |             |      |
//  |  A2  |     B2      |      |     E2      |      |
//  |______|______ ______|      |______ ______|      |
//  |      |      |      |  D1  |      |      |  G2  |
//  |  A3  |  B3  |  C3  |      |  E3  |  F3  |      |
//  |______|______|______|______|______|______|______|
// ```
//
//
// If you try to move the column 0 to column index 5 with "tryToFit" enabled, by default,
// the code will put it on after the merged columns,
// but you can override it using the "direction" option.
//
// -1: Always put the origin before the target
//
// ```
//     0      1       2     3      4      5       6
//   _________________________________________________
//  |      |             |      |      |             |
//  |  B1  |     C1      |  A1  |  E1  |     F1      |
//  |______|______ ______|______|______|______ ______|
//  |             |      |      |             |      |
//  |     B2      |      |  A2  |     E2      |      |
//  |______ ______|      |______|______ ______|      |
//  |      |      |  D1  |      |      |      |  G2  |
//  |  B3  |  C3  |      |  A3  |  E3  |  F3  |      |
//  |______|______|______|______|______|______|______|
// ```
//
//  0: Automatically decide the best place to fit
//
// ```
//     0      1       2     3      4      5       6
//   _________________________________________________
//  |      |             |      |             |      |
//  |  B1  |     C1      |  E1  |     F1      |  A1  |
//  |______|______ ______|______|______ ______|______|
//  |             |      |             |      |      |
//  |     B2      |      |     E2      |      |  A2  |
//  |______ ______|      |______ ______|      |______|
//  |      |      |  D1  |      |      |  G2  |      |
//  |  B3  |  C3  |      |  E3  |  F3  |      |  A3  |
//  |______|______|______|______|______|______|______|
// ```
//
//  1: Always put the origin after the target
//
// ```
//     0      1       2     3      4      5       6
//   _________________________________________________
//  |      |             |      |             |      |
//  |  B1  |     C1      |  E1  |     F1      |  A1  |
//  |______|______ ______|______|______ ______|______|
//  |             |      |             |      |      |
//  |     B2      |      |     E2      |      |  A2  |
//  |______ ______|      |______ ______|      |______|
//  |      |      |  D1  |      |      |  G2  |      |
//  |  B3  |  C3  |      |  E3  |  F3  |      |  A3  |
//  |______|______|______|______|______|______|______|
// ```
//
// ```javascript
// dispatch(
//   moveColumn(x, y, options)(state.tr)
// );
// ```
export const moveColumn =
	(
		state: EditorState,
		originColumnIndex: number | number[],
		targetColumnIndex: number,
		options: MoveOptions = {
			tryToFit: false,
			direction: 0,
			selectAfterMove: false,
		},
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/max-params
	) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (!table) {
			return tr;
		}

		// normalize the origin index to an array since this supports moving both a single & multiple cols in a single action.
		if (!Array.isArray(originColumnIndex)) {
			originColumnIndex = [originColumnIndex];
		}

		const tableMap = TableMap.get(table.node);
		const originalColumnRanges = getSelectionRangeInColumn(
			Math.min(...originColumnIndex),
			Math.max(...originColumnIndex),
		)(tr);
		const targetColumnRanges = getSelectionRangeInColumn(targetColumnIndex)(tr);
		const indexesOriginColumn = originalColumnRanges?.indexes ?? [];
		const indexesTargetColumn = targetColumnRanges?.indexes ?? [];

		const min = indexesOriginColumn[0];
		const max = indexesOriginColumn[indexesOriginColumn.length - 1];

		if (indexesOriginColumn.includes(targetColumnIndex)) {
			return tr;
		}

		if (!options.tryToFit && indexesTargetColumn.length > 1) {
			isValidReorder(originColumnIndex[0], targetColumnIndex, indexesTargetColumn, 'column');
		}

		const types = tableNodeTypes(state.schema);
		const direction = normalizeDirection(min, targetColumnIndex, options);
		const actualTargetIndex = Math[direction === 'start' ? 'min' : 'max'](...indexesTargetColumn);

		const { rowHeaderEnabled, columnHeaderEnabled } = determineTableHeaderStateFromTableNode(
			table.node,
			tableMap,
			types,
		);

		const createContentNode = createContentNodeFactory(table);

		const newTr = cloneTr(tr);
		const origins: ContentNodeWithPos[][] = [];
		for (let y = 0; y < tableMap.height; y++) {
			origins.push([]);

			for (let x = min; x <= max; x++) {
				if (tableMap.isCellMergedTopLeft(y, x)) {
					continue;
				}
				const nodePos = tableMap.map[y * tableMap.width + x];
				origins[y].push(createContentNode(nodePos));
			}

			if (columnHeaderEnabled && (min === 0 || actualTargetIndex === 0)) {
				// This block is handling the situation where a col is moved in/out of the header position. If the header col option
				// is enabled then;
				// When a col is moved out, the col will be converted to a normal col and the col to the right will become the header.
				// When a col is moved in, the old col header needs to be made normal, and the incoming col needs to be made a header.
				// This section only manages what happens to the other col, not the one being moved.
				const nearHeaderCol = min === 0 ? max + 1 : actualTargetIndex;
				const nodePos = tableMap.map[y * tableMap.width + nearHeaderCol];
				const { pos, node } = createContentNode(nodePos);
				newTr.setNodeMarkup(
					pos,
					actualTargetIndex !== 0 || (rowHeaderEnabled && y === 0) ? types.header_cell : types.cell,
					node.attrs,
				);
			}
		}

		origins.forEach((row, y) => {
			if (!row.length) {
				// If the origin has no cells to be moved then we can skip moving for this row. This can occur when a cell above rowspans
				// into the current row.
				return;
			}

			// The actual target index needs to be translated per row, this is because row/col spans can affect the amount of
			// cells each row contains.
			const rowTargetPosition = translateTargetPosition(y, actualTargetIndex, tableMap);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const node = table.node.nodeAt(rowTargetPosition)!;
			const pos = table.start + rowTargetPosition;

			const insertPos =
				direction === 'end'
					? newTr.mapping.map(pos + node.nodeSize, 1)
					: newTr.mapping.map(pos, -1);

			newTr.insert(
				insertPos,
				row.map(({ node }, x) =>
					normalizeCellNode(
						node,
						rowHeaderEnabled && y === 0,
						columnHeaderEnabled && actualTargetIndex === 0 && x === 0,
						types,
					),
				),
			);

			// NOTE: only consecutive cells can be moved, this means we can simplify the delete op into a single step which
			// deletes the range of cells.
			const first = row[0];
			const last = row[row.length - 1];
			return newTr.delete(
				newTr.mapping.map(first.pos, 1),
				newTr.mapping.map(last.pos + last.node.nodeSize, -1),
			);
		});

		if (options.selectAfterMove) {
			const n = indexesOriginColumn.length - 1;
			const selectionRange = getSelectionRangeInColumn(
				actualTargetIndex - (direction === 'end' ? n : 0),
				actualTargetIndex + (direction === 'start' ? n : 0),
			)(newTr);

			if (selectionRange) {
				newTr.setSelection(new CellSelection(selectionRange.$anchor, selectionRange.$head));
			}
		}

		return newTr;
	};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
function normalizeCellNode(
	cellNode: PMNode,
	rowHeaderEnabled: boolean,
	columnHeaderEnabled: boolean,
	types: TableNodeCache,
): PMNode {
	const newTargetType: NodeType =
		rowHeaderEnabled || columnHeaderEnabled ? types.header_cell : types.cell;
	return cellNode.type !== newTargetType
		? newTargetType.create(cellNode.attrs, cellNode.content, cellNode.marks)
		: cellNode;
}

function createContentNodeFactory(table: ContentNodeWithPos) {
	return (nodePos: number): ContentNodeWithPos => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const node = table.node.nodeAt(nodePos)!;
		const pos = nodePos + table.start;
		return { pos, start: pos + 1, node, depth: table.depth + 2 };
	};
}

function translateTargetPosition(row: number, startIndex: number, tableMap: TableMap) {
	if (tableMap.isCellMergedTopLeft(row, startIndex)) {
		// find the closet unmerged position to the left of the target. We scan left first because merged cells will actually
		// reduce the amount of cells in a row.
		for (let x = startIndex - 1; x >= 0; x--) {
			if (!tableMap.isCellMergedTopLeft(row, x)) {
				return tableMap.map[row * tableMap.width + x];
			}
		}

		// If no index found then we need to look to the right, this can occur when the first cell in the row is merged.
		for (let x = startIndex + 1; x < tableMap.width; x++) {
			if (!tableMap.isCellMergedTopLeft(row, x)) {
				return tableMap.map[row * tableMap.width + x];
			}
		}
	}

	return tableMap.map[row * tableMap.width + startIndex];
}
