import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { TableMap } from '../table-map';
import type { ArrayOfRows } from './array-of-rows';

// :: (tableNode: Node, tableArray: Array<Node>) -> Node
// This function will transform a matrix of nodes
// into table node respecting merged cells and rows configurations,
// for example this array will be convert to the table below:
//
// ```javascript
// array = [
//   [A1, B1, C1, null],
//   [A2, B2, null, D1],
//   [A3. B3, C2, null],
// ]
// ```
//
// ```
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
export const convertArrayOfRowsToTableNode = (
	tableNode: PMNode,
	arrayOfNodes: ArrayOfRows,
): PMNode => {
	const rowsPM: PMNode[] = [];
	const map = TableMap.get(tableNode);
	for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
		const row = tableNode.child(rowIndex);
		const rowCells: PMNode[] = [];

		for (let colIndex = 0; colIndex < map.width; colIndex++) {
			if (!arrayOfNodes[rowIndex][colIndex]) {
				continue;
			}
			const cellPos = map.map[rowIndex * map.width + colIndex];

			const cell = arrayOfNodes[rowIndex][colIndex];
			const oldCell = tableNode.nodeAt(cellPos);
			if (!cell || !oldCell) {
				continue;
			}
			const newCell = oldCell.type.createChecked(
				Object.assign({}, cell.attrs),
				cell.content,
				cell.marks,
			);
			rowCells.push(newCell);
		}

		rowsPM.push(row.type.createChecked(row.attrs, rowCells, row.marks));
	}

	const newTable = tableNode.type.createChecked(tableNode.attrs, rowsPM, tableNode.marks);

	return newTable;
};
