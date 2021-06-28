import { Command } from '../../../types';
import { findSupportedNodeForBreakout } from '../utils/find-breakout-node';
import { NodeSelection } from 'prosemirror-state';

export function removeBreakout(): Command {
  return (state, dispatch) => {
    const node = findSupportedNodeForBreakout(state.selection);

    if (!node) {
      return false;
    }

    const marks = node.node.marks.filter((m) => m.type.name !== 'breakout');
    const tr = state.tr.setNodeMarkup(
      node.pos,
      node.node.type,
      node.node.attrs,
      marks,
    );
    tr.setMeta('scrollIntoView', false);
    if (state.selection instanceof NodeSelection) {
      if (state.selection.$anchor.pos === node.pos) {
        tr.setSelection(NodeSelection.create(tr.doc, node.pos));
      }
    }

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}
