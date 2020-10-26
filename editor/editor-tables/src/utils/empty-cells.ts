import { Schema } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { NodeWithPos } from 'prosemirror-utils';

import { cloneTr } from './clone-tr';
import { tableNodeTypes } from './table-node-types';

// Returns a new transaction that clears the content of a given `cell`.
export const emptyCell = (cell: NodeWithPos, schema: Schema) => (
  tr: Transaction,
): Transaction => {
  if (cell) {
    const node = tableNodeTypes(schema).cell.createAndFill();
    if (node && !cell.node.content.eq(node.content)) {
      tr.replaceWith(cell.pos + 1, cell.pos + cell.node.nodeSize, node.content);

      return cloneTr(tr);
    }
  }

  return tr;
};
