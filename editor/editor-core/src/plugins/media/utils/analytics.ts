import type {
  MediaEventPayload,
  MediaResizeTrackAction,
  MediaInputResizeTrackAction,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

export const getMediaResizeAnalyticsEvent = <T extends MediaResizeTrackAction>(
  type: string,
  attributes: T['attributes'],
): MediaEventPayload | void => {
  if (!attributes) {
    return;
  }

  const { width, widthType, layout, snapType, parentNode } = attributes;
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

  const { width, layout, validation, parentNode } = attributes;
  const actionSubject =
    type === 'embed' ? ACTION_SUBJECT.EMBEDS : ACTION_SUBJECT.MEDIA_SINGLE;

  return {
    action: ACTION.EDITED,
    actionSubject,
    actionSubjectId: ACTION_SUBJECT_ID.INPUT_RESIZED,
    attributes: {
      width,
      layout,
      validation,
      parentNode,
    },
    eventType: EVENT_TYPE.UI,
  };
};
