import { useCallback } from 'react';

import { useAnalyticsEvents } from './useAnalyticsEvents';
import { useTrackedRef } from './useTrackedRef';

export type UseCallbackWithAnalyticsHook = (
  method: (...args: any[]) => void,
  payload: Record<string, any> | ((...args: any[]) => void),
  channel?: string,
) => (...args: any[]) => void;

export const useCallbackWithAnalytics: UseCallbackWithAnalyticsHook = (
  method,
  payload,
  channel,
) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const methodRef = useTrackedRef(method);
  const payloadRef = useTrackedRef(payload);

  return useCallback(
    (...args) => {
      const pload =
        typeof payloadRef.current === 'function'
          ? payloadRef.current(...args)
          : payloadRef.current;
      createAnalyticsEvent(pload).fire(channel);
      methodRef.current(...args);
    },
    [createAnalyticsEvent, methodRef, payloadRef, channel],
  );
};
