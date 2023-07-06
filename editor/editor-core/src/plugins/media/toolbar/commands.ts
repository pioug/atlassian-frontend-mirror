import { Fragment } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import {
  isNodeSelection,
  removeSelectedNode,
  safeInsert,
} from 'prosemirror-utils';
import { BorderMarkAttributes } from '@atlaskit/adf-schema';

import { Command } from '../../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
} from '../../analytics';
import { removeMediaGroupNode } from './utils';
import { currentMediaNodeWithPos } from '../utils/current-media-node';

export const DEFAULT_BORDER_COLOR = '#091e4224';
export const DEFAULT_BORDER_SIZE = 2;

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

  // @ts-ignore - [unblock prosemirror bump] redundant check comparing boolean to media
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

export const toggleBorderMark: Command = (state, dispatch) => {
  const nodeWithPos = currentMediaNodeWithPos(state);
  if (!nodeWithPos) {
    return false;
  }

  const { node, pos } = nodeWithPos;

  const borderMark = node.marks.find((m) => m.type.name === 'border');
  const marks = node.marks
    .filter((m) => m.type.name !== 'border')
    .concat(
      borderMark
        ? []
        : state.schema.marks.border.create({
            color: DEFAULT_BORDER_COLOR,
            size: DEFAULT_BORDER_SIZE,
          }),
    );

  const tr = state.tr.setNodeMarkup(pos, node.type, node.attrs, marks);
  tr.setMeta('scrollIntoView', false);
  if (state.selection instanceof NodeSelection) {
    if (state.selection.$anchor.pos === state.selection.from) {
      tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));
    }
  }

  if (dispatch) {
    if (borderMark?.attrs) {
      addAnalytics(state, tr, {
        action: ACTION.DELETED,
        actionSubject: ACTION_SUBJECT.MEDIA,
        actionSubjectId: ACTION_SUBJECT_ID.BORDER,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          previousColor: borderMark.attrs.color,
          previousSize: borderMark.attrs.size,
        },
      });
    } else {
      addAnalytics(state, tr, {
        action: ACTION.ADDED,
        actionSubject: ACTION_SUBJECT.MEDIA,
        actionSubjectId: ACTION_SUBJECT_ID.BORDER,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          color: DEFAULT_BORDER_COLOR,
          size: DEFAULT_BORDER_SIZE,
        },
      });
    }

    dispatch(tr);
  }

  return true;
};

export const setBorderMark =
  (attrs: Partial<BorderMarkAttributes>): Command =>
  (state, dispatch) => {
    const nodeWithPos = currentMediaNodeWithPos(state);
    if (!nodeWithPos) {
      return false;
    }

    const { node, pos } = nodeWithPos;

    const borderMark = node.marks.find((m) => m.type.name === 'border')
      ?.attrs as BorderMarkAttributes;
    const color = attrs.color ?? borderMark?.color ?? DEFAULT_BORDER_COLOR;
    const size = attrs.size ?? borderMark?.size ?? DEFAULT_BORDER_SIZE;
    const marks = node.marks
      .filter((m) => m.type.name !== 'border')
      .concat(state.schema.marks.border.create({ color, size }));

    const tr = state.tr.setNodeMarkup(pos, node.type, node.attrs, marks);
    tr.setMeta('scrollIntoView', false);
    if (state.selection instanceof NodeSelection) {
      if (state.selection.$anchor.pos === state.selection.from) {
        tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));
      }
    }

    if (dispatch) {
      addAnalytics(state, tr, {
        action: ACTION.UPDATED,
        actionSubject: ACTION_SUBJECT.MEDIA,
        actionSubjectId: ACTION_SUBJECT_ID.BORDER,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          previousColor: borderMark?.color,
          previousSize: borderMark?.size,
          newColor: color,
          newSize: size,
        },
      });
      dispatch(tr);
    }

    return true;
  };
