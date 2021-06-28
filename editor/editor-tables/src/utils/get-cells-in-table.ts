import { Selection } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';

import { TableMap } from '../table-map';

import { findTable } from './find';

// Returns an array of all cells in a table.
export const getCellsInTable = (
  selection: Selection,
): ContentNodeWithPos[] | undefined => {
  const table = findTable(selection);
  if (!table) {
    return;
  }

  const map = TableMap.get(table.node);
  const positions = map.cellsInRect({
    left: 0,
    right: map.width,
    top: 0,
    bottom: map.height,
  });

  return positions
    .map((cellPos) => {
      const node = table.node.nodeAt(cellPos);
      if (node) {
        const pos = cellPos + table.start;
        return { pos, start: pos + 1, node, depth: table.depth + 2 };
      }
    })
    .filter((cell): cell is ContentNodeWithPos => typeof cell !== 'undefined');
};
