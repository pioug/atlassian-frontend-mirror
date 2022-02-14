import { Fragment } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import {
  isNodeSelection,
  removeSelectedNode,
  safeInsert,
} from 'prosemirror-utils';
import { Command } from '../../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
} from '../../analytics';
import { removeMediaGroupNode } from './utils';

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
    addAnalytics(state, tr, {
      action: ACTION.CHANGED_TYPE,
      actionSubject: ACTION_SUBJECT.MEDIA,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        newType: ACTION_SUBJECT_ID.MEDIA_GROUP,
        previousType: ACTION_SUBJECT_ID.MEDIA_INLINE,
      },
    });

    dispatch(tr);
  }

  return true;
};

export const changeMediaCardToInline: Command = (state, dispatch) => {
  const { media, mediaInline, paragraph } = state.schema.nodes;
  const selectedNode =
    state.selection instanceof NodeSelection && state.selection.node;

  if (!selectedNode || !selectedNode.type === media) {
    return false;
  }

  const mediaInlineNode = mediaInline.create({
    id: selectedNode.attrs.id,
    collection: selectedNode.attrs.collection,
  });
  const space = state.schema.text(' ');
  let content = Fragment.from([mediaInlineNode, space]);
  const node = paragraph.createChecked({}, content);

  const nodePos = state.tr.doc.resolve(state.selection.from).start() - 1;

  let tr = removeMediaGroupNode(state);
  tr = safeInsert(node, nodePos, true)(tr);

  if (dispatch) {
    addAnalytics(state, tr, {
      action: ACTION.CHANGED_TYPE,
      actionSubject: ACTION_SUBJECT.MEDIA,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        newType: ACTION_SUBJECT_ID.MEDIA_INLINE,
        previousType: ACTION_SUBJECT_ID.MEDIA_GROUP,
      },
    });
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
