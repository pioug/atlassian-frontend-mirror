import React from 'react';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorSharedConfig } from '../../../internal/context/shared-config';
import {
  AnalyticsEventPayload,
  fireAnalyticsEvent,
} from '../../../../../plugins/analytics';
import { analyticsEventKey } from '../../../../../plugins/analytics/consts';

/**
 * Subscribes to analytics events fired from editor components
 * and passes them through to `fireAnalyticsEvent`.
 */
export function useAnalyticsHandler(
  editorSharedConfig: EditorSharedConfig | null,
) {
  // handleAnalyticsEvent – must always be the same so we can unsubscribe from events properly.
  const handleAnalyticsEvent = React.useCallback<
    (payloadChannel: {
      payload: AnalyticsEventPayload;
      channel?: string;
    }) => void
  >(
    (payload) => {
      const handleAnalyticsEvent =
        editorSharedConfig && editorSharedConfig.dispatchAnalyticsEvent;

      if (!handleAnalyticsEvent) {
        return;
      }

      handleAnalyticsEvent(payload);
    },
    [editorSharedConfig],
  );

  if (editorSharedConfig) {
    editorSharedConfig.eventDispatcher.on(
      analyticsEventKey,
      handleAnalyticsEvent,
    );
  }

  React.useEffect(
    () => () => {
      if (!editorSharedConfig || !editorSharedConfig.eventDispatcher) {
        return;
      }

      editorSharedConfig.eventDispatcher.off(
        analyticsEventKey,
        handleAnalyticsEvent,
      );
    },
    [editorSharedConfig, handleAnalyticsEvent],
  );
}

export function useCreateAnalyticsHandler(
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(fireAnalyticsEvent(createAnalyticsEvent), [
    createAnalyticsEvent,
  ]);
}
