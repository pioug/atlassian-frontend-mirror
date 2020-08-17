import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  AnalyticsEventPayload,
  InputMethodInsertLink,
} from '../analytics';
import { getLinkDomain, isFromCurrentDomain } from './utils';

export function getLinkCreationAnalyticsEvent(
  inputMethod: InputMethodInsertLink,
  url: string,
): AnalyticsEventPayload {
  return {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.LINK,
    attributes: { inputMethod, fromCurrentDomain: isFromCurrentDomain(url) },
    eventType: EVENT_TYPE.TRACK,
    nonPrivacySafeAttributes: {
      linkDomain: getLinkDomain(url),
    },
  };
}
