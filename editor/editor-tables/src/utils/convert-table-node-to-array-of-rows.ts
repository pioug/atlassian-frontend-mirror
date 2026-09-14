import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { TableMap } from '../table-map';
import type { ArrayOfRows } from './array-of-rows';

// :: (tableNode: Node) -> Array<Node>
// This function will transform the table node
// into a matrix of rows and columns respecting merged cells,
// for example this table will be convert to the below:
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
//
// ```javascript
// array = [
//   [A1, B1, C1, null],
//   [A2, B2, null, D1],
//   [A3. B3, C2, null],
// ]
// ```
export const convertTableNodeToArrayOfRows = (tableNode: PMNode): ArrayOfRows => {
	const map = TableMap.get(tableNode);
	const rows: ArrayOfRows = [];
	for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
		const rowCells: Array<PMNode | null> = [];
		const seen: { [key: number]: boolean } = {};

		for (let colIndex = 0; colIndex < map.width; colIndex++) {
			const cellPos = map.map[rowIndex * map.width + colIndex];
			const cell = tableNode.nodeAt(cellPos);
			const rect = map.findCell(cellPos);
			if (!cell || seen[cellPos] || rect.top !== rowIndex) {
				rowCells.push(null);
				continue;
			}
			seen[cellPos] = true;

			rowCells.push(cell);
		}

		rows.push(rowCells);
	}

	return rows;
};
