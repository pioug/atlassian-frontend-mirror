import { useMemo, useRef } from 'react';

import { AnalyticsEventCreator, CreateEventMap } from '../types';

import { useAnalyticsEvents } from './useAnalyticsEvents';

export type PatchedPropsHook = {
  patchedEventProps: CreateEventMap;
};

type CacheEntry = {
  eventCreator: any;
  propValue: any;
  wrappedCallback: any;
};

export function usePatchedProps<Props extends Record<string, any>>(
  createEventMap: CreateEventMap = {},
  wrappedComponentProps: Props,
): PatchedPropsHook {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const handlerCache = useRef<Record<string, CacheEntry>>({});

  const patchedProps = useMemo(() => {
    const cache = handlerCache.current;

    // Clean up no longer used handlers in cache
    Object.keys(cache)
      .filter((key) => !(key in createEventMap))
      .forEach((key) => delete cache[key]);

    return Object.keys(createEventMap).reduce<Props>((p, k) => {
      const eventCreator = createEventMap[k];
      if (!['object', 'function'].includes(typeof eventCreator)) {
        return p;
      }

      const propValue = wrappedComponentProps[k];

      if (
        k in cache &&
        cache[k].eventCreator === eventCreator &&
        cache[k].propValue === propValue
      ) {
        return { ...p, [k]: cache[k].wrappedCallback };
      }

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

      cache[k] = { eventCreator, wrappedCallback, propValue };

      return { ...p, [k]: wrappedCallback };
    }, {} as Props);
  }, [
    createEventMap,
    wrappedComponentProps,
    createAnalyticsEvent,
    handlerCache,
  ]);

  return {
    patchedEventProps: patchedProps,
  };
}
