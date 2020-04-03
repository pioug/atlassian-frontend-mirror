import { findParentNode } from 'prosemirror-utils';
import { Command } from '../../../types';
import { isSupportedNodeForBreakout } from '../utils/is-supported-node';

export function removeBreakout(): Command {
  return (state, dispatch) => {
    const node = findParentNode(isSupportedNodeForBreakout)(state.selection);

    if (!node) {
      return false;
    }

    const marks = node.node.marks.filter(m => m.type.name !== 'breakout');
    const tr = state.tr.setNodeMarkup(
      node.pos,
      node.node.type,
      node.node.attrs,
      marks,
    );
    tr.setMeta('scrollIntoView', false);

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}
