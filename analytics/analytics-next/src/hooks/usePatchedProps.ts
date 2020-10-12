import { useMemo } from 'react';

import { AnalyticsEventCreator, CreateEventMap } from '../types';

import { useAnalyticsEvents } from './useAnalyticsEvents';

export type PatchedPropsHook = {
  patchedEventProps: CreateEventMap;
};

export function usePatchedProps<Props extends Record<string, any>>(
  createEventMap: CreateEventMap = {},
  wrappedComponentProps: Props,
): PatchedPropsHook {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const patchedProps = useMemo(() => {
    return Object.keys(createEventMap).reduce<Props>((p, k) => {
      const eventCreator = createEventMap[k];
      if (!['object', 'function'].includes(typeof eventCreator)) {
        return p;
      }

      const propValue = wrappedComponentProps[k];

      const wrappedCallback = (...args: any[]) => {
        const analyticsEvent =
          typeof eventCreator === 'function'
            ? (eventCreator as AnalyticsEventCreator)(
                createAnalyticsEvent,
                wrappedComponentProps,
              )
            : createAnalyticsEvent(eventCreator);

        if (propValue && typeof propValue === 'function') {
          propValue(...args, analyticsEvent);
        }
      };
      return wrappedCallback ? { ...p, [k]: wrappedCallback } : p;
    }, {} as Props);
  }, [createEventMap, wrappedComponentProps, createAnalyticsEvent]);

  return {
    patchedEventProps: patchedProps,
  };
}
