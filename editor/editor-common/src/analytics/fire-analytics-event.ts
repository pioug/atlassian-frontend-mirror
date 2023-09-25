import { FabricChannel } from '@atlaskit/analytics-listeners';

import { AnalyticsQueue } from './analytics-queue';
import { FireAnalyticsEvent } from './types';

export const editorAnalyticsChannel = FabricChannel.editor;

export const fireAnalyticsEvent: FireAnalyticsEvent =
  (createAnalyticsEvent) =>
  ({ payload, channel = editorAnalyticsChannel }) => {
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
