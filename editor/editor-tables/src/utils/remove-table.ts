import { Transaction } from 'prosemirror-state';

import { cloneTr } from './clone-tr';

// Returns a new transaction that removes a table node if the cursor is inside of it.
export const removeTable = (tr: Transaction): Transaction => {
  const { $from } = tr.selection;
  for (let depth = $from.depth; depth > 0; depth--) {
    let node = $from.node(depth);
    if (node.type.spec.tableRole === 'table') {
      return cloneTr(tr.delete($from.before(depth), $from.after(depth)));
    }
  }

  return tr;
};
