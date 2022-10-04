import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';

export function mapActionSubjectIdToAttributes(
  payload: AnalyticsEventPayload,
): AnalyticsEventPayload {
  const documentInserted =
    payload.action === ACTION.INSERTED &&
    payload.actionSubject === ACTION_SUBJECT.DOCUMENT;
  const textFormatted =
    payload.action === ACTION.FORMATTED &&
    payload.actionSubject === ACTION_SUBJECT.TEXT;
  const hasActionSubjectId = !!payload.actionSubjectId;

  if (hasActionSubjectId && (documentInserted || textFormatted)) {
    payload.attributes = {
      ...payload.attributes,
      // @ts-expect-error
      actionSubjectId: payload.actionSubjectId,
    };
  }
  return payload;
}
