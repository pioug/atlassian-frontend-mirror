import { NodeType, Node as PMNode, ResolvedPos } from 'prosemirror-model';

import { CellSelection } from '../cell-selection';
import { CellAttributes, Command } from '../types';

import { cellAround } from './cells';
import { selectedRect } from './selection-rect';

export function cellWrapping($pos: ResolvedPos): PMNode | null {
  for (let d = $pos.depth; d > 0; d--) {
    // Sometimes the cell can be in the same depth.
    const role = $pos.node(d).type.spec.tableRole;
    if (role === 'cell' || role === 'header_cell') {
      return $pos.node(d);
    }
  }
  return null;
}

export type GetCellTypeArgs = {
  row: number;
  col: number;
  node: PMNode;
};

type GetCellTypeCallback = (option: GetCellTypeArgs) => NodeType;

// Split a selected cell, whose rowpan or colspan is greater than one,
// into smaller cells with the cell type (th, td) returned by getType function.
export function splitCellWithType(getCellType: GetCellTypeCallback): Command {
  return (state, dispatch) => {
    let sel = state.selection;
    let cellNode: PMNode | null | undefined, cellPos: number | null;
    if (!(sel instanceof CellSelection)) {
      cellNode = cellWrapping(sel.$from);
      if (!cellNode) {
        return false;
      }

      const cellNodeAround = cellAround(sel.$from);
      cellPos = cellNodeAround && cellNodeAround.pos;
    } else {
      if (sel.$anchorCell.pos !== sel.$headCell.pos) {
        return false;
      }
      cellNode = sel.$anchorCell.nodeAfter;
      cellPos = sel.$anchorCell.pos;
    }
    if (
      cellNode &&
      cellNode.attrs.colspan === 1 &&
      cellNode.attrs.rowspan === 1
    ) {
      return false;
    }
    if (cellNode && dispatch) {
      let cellAttrs = cellNode.attrs as CellAttributes,
        attrs = [],
        colwidth = cellAttrs.colwidth;
      if (cellAttrs.rowspan && cellAttrs.rowspan > 1) {
        cellAttrs = { ...cellAttrs, rowspan: 1 };
      }
      if (cellAttrs.colspan && cellAttrs.colspan > 1) {
        cellAttrs = { ...cellAttrs, colspan: 1 };
      }
      let rect = selectedRect(state);
      let tr = state.tr;
      for (let i = 0; i < rect.right - rect.left; i++) {
        attrs.push(
          colwidth
            ? {
                ...cellAttrs,
                colwidth: colwidth && colwidth[i] ? [colwidth[i]] : null,
              }
            : cellAttrs,
        );
      }
      let lastCell: number | null = null;
      for (let row = rect.top; row < rect.bottom; row++) {
        let pos = rect.map.positionAt(row, rect.left, rect.table);
        if (row === rect.top) {
          pos += cellNode.nodeSize;
        }
        for (let col = rect.left, i = 0; col < rect.right; col++, i++) {
          if (col === rect.left && row === rect.top) {
            continue;
          }

          const cellType = getCellType({
            node: cellNode,
            row,
            col,
          }).createAndFill(attrs[i]);

          if (cellType) {
            tr.insert(
              (lastCell = tr.mapping.map(pos + rect.tableStart, 1)),
              cellType,
            );
          }
        }
      }
      if (typeof cellPos === 'number') {
        tr.setNodeMarkup(
          cellPos,
          getCellType({ node: cellNode, row: rect.top, col: rect.left }),
          attrs[0],
        );
      }

      const $lastCellPosition = lastCell && tr.doc.resolve(lastCell);
      if (
        sel instanceof CellSelection &&
        $lastCellPosition instanceof ResolvedPos
      ) {
        tr.setSelection(
          new CellSelection(
            tr.doc.resolve(sel.$anchorCell.pos),
            $lastCellPosition,
          ),
        );
      }

      dispatch(tr);
    }
    return true;
  };
}
