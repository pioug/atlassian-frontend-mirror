import { ResolvedPos } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';

type RangePos = {
  $from: ResolvedPos;
  $to: ResolvedPos;
};

export function normalizeSelection(
  state: EditorState,
  transaction?: Transaction,
  allowTableNodeSelection?: boolean,
): Transaction | undefined {
  let tr = transaction;
  const sel = (tr || state).selection;
  const { doc } = tr || state;
  let normalize;
  let role: string | undefined;
  if (sel instanceof NodeSelection) {
    role = sel.node.type.spec.tableRole;
  }
  if (sel instanceof NodeSelection && role) {
    if (role === 'cell' || role === 'header_cell') {
      normalize = CellSelection.create(doc, sel.from);
    } else if (role === 'row') {
      const $cell = doc.resolve(sel.from + 1);
      normalize = CellSelection.rowSelection($cell, $cell);
    } else if (!allowTableNodeSelection) {
      const map = TableMap.get(sel.node);
      const start = sel.from + 1;
      const lastCell = start + map.map[map.width * map.height - 1];
      normalize = CellSelection.create(doc, start + 1, lastCell);
    }
  } else if (sel instanceof TextSelection && isCellBoundarySelection(sel)) {
    normalize = TextSelection.create(doc, sel.from);
  } else if (sel instanceof TextSelection && isTextSelectionAcrossCells(sel)) {
    normalize = TextSelection.create(doc, sel.$from.start(), sel.$from.end());
  }
  if (normalize) {
    (tr || (tr = state.tr)).setSelection(normalize);
  }
  return tr;
}

function isCellBoundarySelection({ $from, $to }: RangePos): boolean {
  if ($from.pos === $to.pos || $from.pos < $from.pos - 6) {
    return false;
  } // Cheap elimination
  let afterFrom = $from.pos;
  let beforeTo = $to.pos;
  let { depth } = $from;
  for (; depth >= 0; depth--, afterFrom++) {
    if ($from.after(depth + 1) < $from.end(depth)) {
      break;
    }
  }
  for (let d = $to.depth; d >= 0; d--, beforeTo--) {
    if ($to.before(d + 1) > $to.start(d)) {
      break;
    }
  }
  return (
    afterFrom === beforeTo &&
    /row|table/.test($from.node(depth).type.spec.tableRole)
  );
}

function isTextSelectionAcrossCells({ $from, $to }: RangePos): boolean {
  let fromCellBoundaryNode;
  let toCellBoundaryNode;
  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (
      node.type.spec.tableRole === 'cell' ||
      node.type.spec.tableRole === 'header_cell'
    ) {
      fromCellBoundaryNode = node;
      break;
    }
  }
  for (let i = $to.depth; i > 0; i--) {
    const node = $to.node(i);
    if (
      node.type.spec.tableRole === 'cell' ||
      node.type.spec.tableRole === 'header_cell'
    ) {
      toCellBoundaryNode = node;
      break;
    }
  }
  return fromCellBoundaryNode !== toCellBoundaryNode && $to.parentOffset === 0;
}
