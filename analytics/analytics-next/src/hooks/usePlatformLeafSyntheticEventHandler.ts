import { useCallback } from 'react';

import UIAnalyticsEvent from '../events/UIAnalyticsEvent';

import { useAnalyticsEvents } from './useAnalyticsEvents';
import { useTrackedRef } from './useTrackedRef';

export type UsePlatformLeafSyntheticEventHandlerHookArgs = {
  fn: (analyticsEvent: UIAnalyticsEvent) => void;
  action: string;
  componentName: string;
  packageName: string;
  packageVersion: string;
  analyticsData?: Record<string, any>;
};

export type UsePlatformLeafSyntheticEventHandlerHook = () => void;

// WARNING: This hook will only function correctly for leaf node components - as in
// no children inside the component will require analytics themselves.
// Ignoring this warning will mean the analytics context of child components will not
// include the context of this component, .e.g, lost data.
// If you are going to have child components that require analytics use withAnalytics
// or AnalyticsContext component instead.
export function usePlatformLeafSyntheticEventHandler({
  fn,
  action,
  componentName,
  packageName,
  packageVersion,
  analyticsData,
}: UsePlatformLeafSyntheticEventHandlerHookArgs) {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  // We put analyticsData and fn in a ref so that we don't need to break
  // memoization.
  // Generally these could be defined by consumers inline
  // and so we do this to avoid breaking memoization of useCallback
  const dataRef = useTrackedRef(analyticsData);
  const fnRef = useTrackedRef(fn);

  const handler = useCallback<() => void>(() => {
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
      ...dataRef.current,
    };

    analyticsEvent.context.push(context);

    // fire an event on the atlaskit channel
    const clone: UIAnalyticsEvent | null = analyticsEvent.clone();
    if (clone) {
      clone.fire('atlaskit');
    }

    fnRef.current(analyticsEvent);
  }, [
    // These are strings and won't change
    action,
    componentName,
    packageName,
    packageVersion,
    // This function is memoized in the context
    createAnalyticsEvent,
    // these are a stable ref because of the useTrackedRef hook
    dataRef,
    fnRef,
  ]);

  return handler;
}
