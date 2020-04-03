import { editorAnalyticsChannel } from './consts';
import { AnalyticsEventPayload } from './types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

export type FireAnalyticsCallback = ({
  payload,
  channel,
}: {
  payload: AnalyticsEventPayload;
  channel?: string | undefined;
}) => void | undefined;

export type FireAnalyticsEvent = (
  createAnalyticsEvent?: CreateUIAnalyticsEvent | undefined,
) => FireAnalyticsCallback;

export const fireAnalyticsEvent: FireAnalyticsEvent = createAnalyticsEvent => ({
  payload,
  channel = editorAnalyticsChannel,
}) => {
  return createAnalyticsEvent && createAnalyticsEvent(payload).fire(channel);
};
