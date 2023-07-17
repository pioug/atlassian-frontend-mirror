import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  MediaEventPayload,
  MediaResizeTrackAction,
} from '@atlaskit/editor-common/analytics';

export const getMediaResizeAnalyticsEvent = <T extends MediaResizeTrackAction>(
  type: string,
  attributes: T['attributes'],
): MediaEventPayload | void => {
  if (!attributes) {
    return;
  }

  const { size, widthType, layout, snapType, parentNode } = attributes;
  const actionSubject =
    type === 'embed' ? ACTION_SUBJECT.EMBEDS : ACTION_SUBJECT.MEDIA_SINGLE;

  return {
    action: ACTION.EDITED,
    actionSubject,
    actionSubjectId: ACTION_SUBJECT_ID.RESIZED,
    attributes: {
      size,
      layout,
      widthType,
      snapType,
      parentNode,
    },
    eventType: EVENT_TYPE.UI,
  };
};
