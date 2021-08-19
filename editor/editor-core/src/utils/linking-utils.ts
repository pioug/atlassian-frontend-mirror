import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  AnalyticsEventPayload,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
} from '../plugins/analytics';

export const buildEditLinkPayload = (type: LinkType): AnalyticsEventPayload => {
  return {
    action: ACTION.CLICKED,
    actionSubject:
      type === ACTION_SUBJECT_ID.HYPERLINK
        ? ACTION_SUBJECT.HYPERLINK
        : ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: ACTION_SUBJECT_ID.EDIT_LINK,
    attributes:
      type !== ACTION_SUBJECT_ID.HYPERLINK
        ? {
            display: type,
          }
        : {},
    eventType: EVENT_TYPE.UI,
  };
};

export type LinkType =
  | ACTION_SUBJECT_ID.CARD_INLINE
  | ACTION_SUBJECT_ID.CARD_BLOCK
  | ACTION_SUBJECT_ID.EMBEDS
  | ACTION_SUBJECT_ID.HYPERLINK;

export const buildVisitedLinkPayload = (
  type: LinkType,
): AnalyticsEventPayload => {
  return type === ACTION_SUBJECT_ID.HYPERLINK
    ? {
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.HYPERLINK,
        actionSubjectId: undefined,
        attributes: {
          inputMethod: INPUT_METHOD.TOOLBAR,
        },
        eventType: EVENT_TYPE.TRACK,
      }
    : {
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        actionSubjectId: type as
          | ACTION_SUBJECT_ID.CARD_INLINE
          | ACTION_SUBJECT_ID.CARD_BLOCK,
        attributes: {
          inputMethod: INPUT_METHOD.TOOLBAR,
        },
        eventType: EVENT_TYPE.TRACK,
      };
};

export const unlinkPayload = (type: LinkType) => {
  return {
    action: ACTION.UNLINK,
    actionSubject:
      type === ACTION_SUBJECT_ID.HYPERLINK
        ? ACTION_SUBJECT.HYPERLINK
        : ACTION_SUBJECT.SMART_LINK,
    actionSubjectId:
      type === ACTION_SUBJECT_ID.HYPERLINK
        ? undefined
        : (type as ACTION_SUBJECT_ID.CARD_INLINE),
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR,
    },
    eventType: EVENT_TYPE.TRACK,
  };
};
