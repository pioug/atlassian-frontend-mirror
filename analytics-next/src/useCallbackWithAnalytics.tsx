import { useCallback, useRef, useEffect } from 'react';
import { useAnalyticsEvents } from './useAnalyticsEvents';

export type UseCallbackWithAnalyticsHook = (
  method: any,
  payload: any,
  channel?: string,
) => (...args: any[]) => void;

export const useCallbackWithAnalytics: UseCallbackWithAnalyticsHook = (
  method,
  payload,
  channel,
) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  // given input might be new function/object each render
  // we optimise and store in refs so we can memoize the callback
  // and at the same time avoid stale values
  const methodRef = useRef(method);
  const payloadRef = useRef(payload);

  useEffect(() => {
    methodRef.current = method;
    payloadRef.current = payload;
  }, [method, payload]);

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
