import type {
  EditorAnalyticsAPI,
  MediaAltTextActionType,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import {
  getMediaNodeFromSelection,
  isSelectionMediaSingleNode,
} from '../../utils/media-common';

import type {
  CloseMediaAltTextMenu,
  OpenMediaAltTextMenu,
  UpdateAltText,
} from './actions';

import { createCommand } from './index';

const createCommandWithAnalytics = (
  actionType: MediaAltTextActionType,
  action: (
    state: Readonly<EditorState>,
  ) => false | OpenMediaAltTextMenu | CloseMediaAltTextMenu | UpdateAltText,
  transform?: (tr: Transaction, state: EditorState) => Transaction,
) => {
  return (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
    withAnalytics(editorAnalyticsAPI, {
      action: actionType,
      actionSubject: ACTION_SUBJECT.MEDIA,
      actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
      eventType: EVENT_TYPE.TRACK,
    })(createCommand(action, transform));
};

export const closeMediaAltTextMenu = createCommand(state => {
  if (isSelectionMediaSingleNode(state)) {
    return { type: 'closeMediaAltTextMenu' };
  }
  return false;
});

export const openMediaAltTextMenu = createCommandWithAnalytics(
  ACTION.OPENED,
  state => {
    if (isSelectionMediaSingleNode(state)) {
      return { type: 'openMediaAltTextMenu' };
    }
    return false;
  },
  (tr: Transaction) => tr.setMeta('scrollIntoView', false),
);

export const updateAltText = (newAltText: string) =>
  createCommand(
    state =>
      isSelectionMediaSingleNode(state) ? { type: 'updateAltText' } : false,
    (tr, state) => {
      const mediaNode = getMediaNodeFromSelection(state);
      const pos = tr.selection.from + 1;
      if (mediaNode) {
        tr.setMeta('scrollIntoView', false);
        tr.setNodeMarkup(pos, undefined, {
          ...mediaNode.attrs,
          alt: newAltText,
        });
      }

      return tr;
    },
  );
