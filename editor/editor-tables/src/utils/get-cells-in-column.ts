import { Selection } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';

import { TableMap } from '../table-map';

import { findTable } from './find';

// Returns an array of cells in a column(s), where `columnIndex` could be a column index or an array of column indexes.
export const getCellsInColumn = (columnIndexes: number | number[]) => (
  selection: Selection,
): ContentNodeWithPos[] | undefined => {
  const table = findTable(selection);
  if (!table) {
    return;
  }

  const map = TableMap.get(table.node);
  const indexes = Array.isArray(columnIndexes)
    ? columnIndexes
    : [columnIndexes];

  return indexes
    .filter((index) => index >= 0 && index <= map.width - 1)
    .reduce<ContentNodeWithPos[]>((acc, index) => {
      const cells = map.cellsInRect({
        left: index,
        right: index + 1,
        top: 0,
        bottom: map.height,
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
