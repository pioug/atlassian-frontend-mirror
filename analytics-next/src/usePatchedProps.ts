/**
 * Internal hook used for the `withAnalyticsHook` HOC and eventually
 * will be used to replace `AnalyticsContextConsumer`.
 */

import { useState } from 'react';
import { useAnalyticsEvents } from './useAnalyticsEvents';
import { CreateEventMap, AnalyticsEventCreator } from './types';

export type PatchedPropsHook = {
  patchedEventProps: CreateEventMap;
};

export function usePatchedProps<Props extends Record<string, any>>(
  createEventMap: CreateEventMap = {},
  wrappedComponentProps: Props,
): PatchedPropsHook {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const mapCreateEventsToProps = (changedPropNames: string[], props: Props) =>
    changedPropNames.reduce((modified, propCallbackName) => {
      const eventCreator = createEventMap[propCallbackName];
      const providedCallback = props[propCallbackName];

      if (!['object', 'function'].includes(typeof eventCreator)) {
        return modified;
      }

      const modifiedCallback = (...args: any[]) => {
        const analyticsEvent =
          typeof eventCreator === 'function'
            ? (eventCreator as AnalyticsEventCreator)(
                createAnalyticsEvent,
                props,
              )
            : createAnalyticsEvent(eventCreator);

        if (providedCallback) {
          providedCallback(...args, analyticsEvent);
        }
      };

      return {
        ...modified,
        [propCallbackName]: modifiedCallback,
      };
    }, {});

  const [originalProps, setOriginalProps] = useState<CreateEventMap>(
    Object.keys(createEventMap).reduce(
      (a, c) => ({ ...a, [c]: wrappedComponentProps[c] }),
      {},
    ),
  );
  const [patchedProps, setPatchedProps] = useState<CreateEventMap>(
    mapCreateEventsToProps(Object.keys(createEventMap), wrappedComponentProps),
  );

  const updatePatchedEventProps = (props: Props): CreateEventMap => {
    const changedPropCallbacks = Object.keys(createEventMap).filter(
      p => originalProps[p] !== props[p],
    );
    if (changedPropCallbacks.length > 0) {
      setPatchedProps({
        ...patchedProps,
        ...mapCreateEventsToProps(changedPropCallbacks, props),
      });
      const updatedProps = changedPropCallbacks.reduce(
        (a, c) => ({ ...a, [c]: props[c] }),
        {},
      );
      setOriginalProps({
        ...originalProps,
        ...updatedProps,
      });
    }

    return patchedProps;
  };

  return {
    patchedEventProps: updatePatchedEventProps(wrappedComponentProps),
  };
}
