import { editorAnalyticsChannel } from './consts';
import { AnalyticsEventPayload } from './types';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnalyticsQueue } from './analytics-queue';

export type FireAnalyticsCallback = <T>(
  payload: FireAnalyticsEventPayload<T>,
) => void | undefined;

export type FireAnalyticsEvent = (
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => FireAnalyticsCallback;

export type FireAnalyticsEventPayload<T = void> = {
  payload: AnalyticsEventPayload<T>;
  channel?: string;
};

export const fireAnalyticsEvent: FireAnalyticsEvent = (
  createAnalyticsEvent,
) => ({ payload, channel = editorAnalyticsChannel }) => {
  if (!createAnalyticsEvent) {
    return;
  }

  // START TEMPORARY CODE ED-10584
  // __queueAnalytics property set in ReactEditorView based on featureFlags.queueAnalytics
  const queueAnalytics = Boolean(
    (createAnalyticsEvent as any).__queueAnalytics,
  );
  // END TEMPORARY CODE ED-10584

  if (queueAnalytics) {
    const queue = AnalyticsQueue.get();
    queue.schedule(() => createAnalyticsEvent(payload)?.fire(channel));
  } else {
    createAnalyticsEvent(payload)?.fire(channel);
  }
};
