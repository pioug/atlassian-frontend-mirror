import { useCallback, useEffect, useRef } from 'react';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';

export default function useAnalyticsEventHandler<T>({
  fn,
  action,
  componentName,
  packageName,
  packageVersion,
  analyticsData,
}: {
  fn: (payload: T, analyticsEvent: UIAnalyticsEvent) => void;
  action: string;
  componentName: string;
  packageName: string;
  packageVersion: string;
  analyticsData?: Record<string, any>;
}): (payload: T) => void {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  // We put analyticsData in a ref so that we don't need to break
  // memoization.
  // Generally this object is defined by consumers inline
  // and so we do this to avoid breaking memoization of useCallback
  const lastData = useRef(analyticsData);
  useEffect(() => {
    lastData.current = analyticsData;
  }, [analyticsData]);

  const handler = useCallback(
    function handler(payload: T) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action,
        actionSubject: componentName,
        attributes: {
          componentName,
          packageName,
          packageVersion,
        },
      });

      // To avoid wrapping this component in AnalyticsContext we manually
      // push the parent context's meta data into the context.
      // Note: this new 'context'
      const context: Record<string, any> = {
        componentName,
        packageName,
        packageVersion,
        ...lastData.current,
      };

      analyticsEvent.context.push(context);

      // fire an event on the atlaskit channel
      const clone: UIAnalyticsEvent | null = analyticsEvent.clone();
      if (clone) {
        clone.fire('atlaskit');
      }

      fn(payload, analyticsEvent);
    },
    [
      // This function might change, but hopefully not! That's up to the consumer though
      fn,
      // These are strings and won't change
      action,
      componentName,
      packageName,
      packageVersion,
      // This function is memoized in the context
      createAnalyticsEvent,
    ],
  );

  return handler;
}
