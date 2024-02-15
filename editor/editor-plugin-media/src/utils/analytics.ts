import type {
  MediaEventPayload,
  MediaInputResizeTrackAction,
  MediaResizeTrackAction,
  MediaSwitchType,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';

export const getMediaResizeAnalyticsEvent = <T extends MediaResizeTrackAction>(
  type: string,
  attributes: T['attributes'],
): MediaEventPayload | void => {
  if (!attributes) {
    return;
  }

  const { width, widthType, layout, snapType, parentNode, inputMethod } =
    attributes;
  const actionSubject =
    type === 'embed' ? ACTION_SUBJECT.EMBEDS : ACTION_SUBJECT.MEDIA_SINGLE;

  return {
    action: ACTION.EDITED,
    actionSubject,
    actionSubjectId: ACTION_SUBJECT_ID.RESIZED,
    attributes: {
      width,
      layout,
      widthType,
      snapType,
      parentNode,
      inputMethod,
    },
    eventType: EVENT_TYPE.UI,
  };
};

export const getMediaInputResizeAnalyticsEvent = <
  T extends MediaInputResizeTrackAction,
>(
  type: string,
  attributes: T['attributes'],
): MediaEventPayload | void => {
  if (!attributes) {
    return;
  }

  const { width, layout, validation, parentNode, inputMethod } = attributes;
  const actionSubject =
    type === 'embed' ? ACTION_SUBJECT.EMBEDS : ACTION_SUBJECT.MEDIA_SINGLE;

  return {
    action: ACTION.EDITED,
    actionSubject,
    actionSubjectId: ACTION_SUBJECT_ID.RESIZED,
    attributes: {
      width,
      layout,
      validation,
      parentNode,
      inputMethod,
    },
    eventType: EVENT_TYPE.UI,
  };
};

export const getChangeMediaAnalytics = (
  previousType: MediaSwitchType,
  newType: MediaSwitchType,
  changeFromLocation?: string,
): MediaEventPayload => ({
  action: ACTION.CHANGED_TYPE,
  actionSubject: ACTION_SUBJECT.MEDIA,
  eventType: EVENT_TYPE.TRACK,
  attributes: {
    newType,
    previousType,
    changeFromLocation,
  },
});

export function findChangeFromLocation(selection: Selection): string {
  const { schema, name } = selection.$from.doc.type;
  const parentNodeInfo = findParentNode(
    node => node.type !== schema.nodes.paragraph,
  )(selection);

  return parentNodeInfo ? parentNodeInfo.node.type.name : name;
}
