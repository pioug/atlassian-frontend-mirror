import { NodeSelection } from 'prosemirror-state';
import {
  isNodeSelection,
  removeSelectedNode,
  safeInsert,
} from 'prosemirror-utils';
import { Command } from '../../../types';

export const changeInlineToMediaCard: Command = (state, dispatch) => {
  const { media, mediaInline, mediaGroup } = state.schema.nodes;
  const selectedNode =
    state.selection instanceof NodeSelection &&
    state.selection.node.type === mediaInline &&
    state.selection.node;

  if (!selectedNode) {
    return false;
  }

  const { id, type, collection } = selectedNode.attrs;
  const mediaNode = media.createChecked({
    id,
    type,
    collection,
  });
  const group = mediaGroup.createChecked({}, mediaNode);

  const nodePos = state.tr.doc.resolve(state.selection.from).end();

  let tr = state.tr;
  tr = removeSelectedNode(tr);
  tr = safeInsert(group, nodePos, true)(tr);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

export const removeInlineCard: Command = (state, dispatch) => {
  if (isNodeSelection(state.selection)) {
    if (dispatch) {
      dispatch(removeSelectedNode(state.tr));
    }
    return true;
  }
  return false;
};
