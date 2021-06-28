import { Node as PMNode, ResolvedPos } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import {
  ContentNodeWithPos,
  findParentNode,
  findParentNodeClosestToPos,
} from 'prosemirror-utils';

import { Rect, TableMap } from '../table-map';

// Iterates over parent nodes, returning the closest table node.
export const findTable = (
  selection: Selection,
): ContentNodeWithPos | undefined =>
  findParentNode(
    (node) => node.type.spec.tableRole && node.type.spec.tableRole === 'table',
  )(selection);

// Iterates over parent nodes, returning a table node closest to a given `$pos`.
export const findTableClosestToPos = (
  $pos: ResolvedPos,
): ContentNodeWithPos | undefined => {
  const predicate = (node: PMNode) =>
    node.type.spec.tableRole && node.type.spec.tableRole === 'table';

  return findParentNodeClosestToPos($pos, predicate);
};

// Iterates over parent nodes, returning a table cell or a table header node closest to a given `$pos`.
export const findCellClosestToPos = (
  $pos: ResolvedPos,
): ContentNodeWithPos | undefined => {
  const predicate = (node: PMNode) =>
    node.type.spec.tableRole && /cell/i.test(node.type.spec.tableRole);

  return findParentNodeClosestToPos($pos, predicate);
};

// Returns the rectangle spanning a cell closest to a given `$pos`.
export const findCellRectClosestToPos = (
  $pos: ResolvedPos,
): Rect | undefined => {
  const cell = findCellClosestToPos($pos);
  if (cell) {
    const table = findTableClosestToPos($pos);
    if (table) {
      const map = TableMap.get(table.node);
      const cellPos = cell.pos - table.start;

      return map.rectBetween(cellPos, cellPos);
    }
  }
};
