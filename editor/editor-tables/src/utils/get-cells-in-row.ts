import { Selection } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';

import { TableMap } from '../table-map';

import { findTable } from './find';

// Returns an array of cells in a row(s), where `rowIndex` could be a row index or an array of row indexes.
export const getCellsInRow = (rowIndex: number | number[]) => (
  selection: Selection,
): ContentNodeWithPos[] | undefined => {
  const table = findTable(selection);
  if (!table) {
    return;
  }

  const map = TableMap.get(table.node);
  const indexes = Array.isArray(rowIndex) ? rowIndex : [rowIndex];

  return indexes
    .filter((index) => index >= 0 && index <= map.height - 1)
    .reduce<ContentNodeWithPos[]>((acc, index) => {
      const cells = map.cellsInRect({
        left: 0,
        right: map.width,
        top: index,
        bottom: index + 1,
      });
      return acc.concat(
        cells.map((nodePos) => {
          const node = table.node.nodeAt(nodePos)!;
          const pos = nodePos + table.start;
          return { pos, start: pos + 1, node, depth: table.depth + 2 };
        }),
      );
    }, []);
};
