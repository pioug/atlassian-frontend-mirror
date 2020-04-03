import { findParentNode } from 'prosemirror-utils';
import { Command } from '../../../types';
import { isSupportedNodeForBreakout } from '../utils/is-supported-node';

export type BreakoutMode = 'wide' | 'full-width' | 'center';

export function setBreakoutMode(mode: BreakoutMode): Command {
  return (state, dispatch) => {
    const node = findParentNode(isSupportedNodeForBreakout)(state.selection);

    if (!node) {
      return false;
    }
    const tr = state.tr.setNodeMarkup(
      node.pos,
      node.node.type,
      node.node.attrs,
      [state.schema.marks.breakout.create({ mode })],
    );
    tr.setMeta('scrollIntoView', false);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
