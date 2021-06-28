import { Node as PMNode } from 'prosemirror-model';
import { NodeWithPos } from 'prosemirror-utils';

import { TableMap } from '../table-map';

// array = [
//   [A1, B1, C1, null],
//   [A2, B2, null, D1],
//   [A3. B3, C2, null],
// ]
type ArrayOfRows = Array<PMNode | null>[];

// This function transposes an array of array flipping the columns for rows,
// transposition is a familiar algebra concept;
// you can get more details here:
// https://en.wikipedia.org/wiki/Transpose
//
// ```javascript
//
//  const arr = [
//    ['a1', 'a2', 'a3'],
//    ['b1', 'b2', 'b3'],
//    ['c1', 'c2', 'c3'],
//    ['d1', 'd2', 'd3'],
//  ];
//
//  const result = transpose(arr);
//
//  result === [
//    ['a1', 'b1', 'c1', 'd1'],
//    ['a2', 'b2', 'c2', 'd2'],
//    ['a3', 'b3', 'c3', 'd3'],
//  ]
// ```
export const transpose = (array: Array<any>): Array<any> => {
  return array[0].map((_: any, i: number) => {
    return array.map((column) => column[i]);
  });
};

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
  const rowsPM = [];
  const map = TableMap.get(tableNode);
  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const row = tableNode.child(rowIndex);
    const rowCells = [];

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

  const newTable = tableNode.type.createChecked(
    tableNode.attrs,
    rowsPM,
    tableNode.marks,
  );

  return newTable;
};

const moveRowInArrayOfRows = (
  arrayOfNodes: ArrayOfRows,
  indexesOrigin: number[],
  indexesTarget: number[],
  directionOverride: number,
): ArrayOfRows => {
  let direction = indexesOrigin[0] > indexesTarget[0] ? -1 : 1;

  const rowsExtracted = arrayOfNodes.splice(
    indexesOrigin[0],
    indexesOrigin.length,
  );
  const positionOffset = rowsExtracted.length % 2 === 0 ? 1 : 0;
  let target;

  if (directionOverride === -1 && direction === 1) {
    target = indexesTarget[0] - 1;
  } else if (directionOverride === 1 && direction === -1) {
    target = indexesTarget[indexesTarget.length - 1] - positionOffset + 1;
  } else {
    target =
      direction === -1
        ? indexesTarget[0]
        : indexesTarget[indexesTarget.length - 1] - positionOffset;
  }

  // @ts-ignore no idea what this line does
  arrayOfNodes.splice.apply(arrayOfNodes, [target, 0].concat(rowsExtracted));

  return arrayOfNodes;
};

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
export const convertTableNodeToArrayOfRows = (
  tableNode: PMNode,
): ArrayOfRows => {
  const map = TableMap.get(tableNode);
  const rows = [];
  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const rowCells = [];
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

export const moveTableRow = (
  table: NodeWithPos,
  indexesOrigin: number[],
  indexesTarget: number[],
  direction: number,
): PMNode => {
  let rows = convertTableNodeToArrayOfRows(table.node);

  rows = moveRowInArrayOfRows(rows, indexesOrigin, indexesTarget, direction);

  return convertArrayOfRowsToTableNode(table.node, rows);
};

export const moveTableColumn = (
  table: NodeWithPos,
  indexesOrigin: number[],
  indexesTarget: number[],
  direction: number,
): PMNode => {
  let rows = transpose(convertTableNodeToArrayOfRows(table.node));

  rows = moveRowInArrayOfRows(rows, indexesOrigin, indexesTarget, direction);
  rows = transpose(rows);

  return convertArrayOfRowsToTableNode(table.node, rows);
};

export const isValidReorder = (
  originIndex: number,
  targetIndex: number,
  targets: number[],
  type: 'row' | 'column',
): boolean => {
  const direction = originIndex > targetIndex ? -1 : 1;
  const errorMessage = `Target position is invalid, you can't move the ${type} ${originIndex} to ${targetIndex}, the target can't be split. You could use tryToFit option.`;

  if (direction === 1) {
    if (targets.slice(0, targets.length - 1).indexOf(targetIndex) !== -1) {
      throw new Error(errorMessage);
    }
  } else {
    if (targets.slice(1).indexOf(targetIndex) !== -1) {
      throw new Error(errorMessage);
    }
  }

  return true;
};
