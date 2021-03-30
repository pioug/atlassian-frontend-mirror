import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';
import { Command } from '../../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
} from '../../analytics';

export const setSelectCaptionFromMediaSinglePos = (
  mediaSingleNodePos: number,
  mediaSingleNode: PMNode,
  tr: Transaction,
) => {
  // node should have two children, media and caption
  if (mediaSingleNode.childCount !== 2) {
    return false;
  }

  const media = mediaSingleNode.child(0);
  const caption = mediaSingleNode.child(1);

  setSelectionAtEndOfCaption(
    tr,
    mediaSingleNodePos,
    media.nodeSize,
    caption.nodeSize,
  );
  tr.setMeta('scrollIntoView', false);

  return true;
};

export const selectCaptionFromMediaSinglePos = (
  mediaSingleNodePos: number,
  mediaSingleNode: PMNode,
): Command => (state, dispatch) => {
  const { tr } = state;
  const result = setSelectCaptionFromMediaSinglePos(
    mediaSingleNodePos,
    mediaSingleNode,
    tr,
  );

  if (result && dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
};

export const setInsertAndSelectCaptionFromMediaSinglePos = (
  mediaSingleNodePos: number,
  mediaSingleNode: PMNode,
  tr: Transaction,
) => {
  // node should have one child, media
  if (mediaSingleNode.childCount !== 1) {
    return;
  }

  const {
    doc: {
      type: { schema },
    },
  } = tr;

  const media = mediaSingleNode.child(0);
  const caption = schema.nodes.caption.create();
  tr.insert(mediaSingleNodePos + media.nodeSize + 1, caption);
  setSelectionAtEndOfCaption(
    tr,
    mediaSingleNodePos,
    media.nodeSize,
    caption.nodeSize,
  );
  tr.setMeta('scrollIntoView', false);
};

export const insertAndSelectCaptionFromMediaSinglePos = (
  mediaSingleNodePos: number,
  mediaSingleNode: PMNode,
): Command => (state, dispatch) => {
  let tr = state.tr;
  setInsertAndSelectCaptionFromMediaSinglePos(
    mediaSingleNodePos,
    mediaSingleNode,
    tr,
  );

  if (tr.docChanged && dispatch) {
    addAnalytics(state, tr, {
      action: ACTION.ADDED,
      eventType: EVENT_TYPE.TRACK,
      actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
      actionSubjectId: ACTION_SUBJECT_ID.CAPTION,
    });
    dispatch(tr);
    return true;
  }

  return false;
};

const setSelectionAtEndOfCaption = (
  tr: Transaction,
  mediaSingleNodePos: number,
  mediaNodeSize: number,
  captionNodeSize: number,
): Transaction => {
  return setTextSelection(mediaSingleNodePos + mediaNodeSize + captionNodeSize)(
    tr,
  );
};
