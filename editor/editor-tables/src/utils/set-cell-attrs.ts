import { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { CellAttributes } from '../types';

import { cloneTr } from './clone-tr';

// Returns a new transaction that sets given `attrs` to a given `cell`.
export const setCellAttrs =
  (cell: NodeWithPos, attrs: CellAttributes) =>
  (tr: Transaction): Transaction => {
    if (cell) {
      tr.setNodeMarkup(
        cell.pos,
        undefined,
        Object.assign({}, cell.node.attrs, attrs),
      );
      return cloneTr(tr);
    }

    return tr;
  };
