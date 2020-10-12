import { useCallbackOne } from 'use-memo-one';

import { AnalyticsEventPayload } from '../events/AnalyticsEvent';
import UIAnalyticsEvent from '../events/UIAnalyticsEvent';
import { CreateUIAnalyticsEvent } from '../types';

import { useAnalyticsContext } from './useAnalyticsContext';

export type UseAnalyticsEventsHook = {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
};

export function useAnalyticsEvents(): UseAnalyticsEventsHook {
  const analyticsContext = useAnalyticsContext();

  const createAnalyticsEvent = useCallbackOne(
    (payload: AnalyticsEventPayload): UIAnalyticsEvent => {
      return new UIAnalyticsEvent({
        context: analyticsContext.getAtlaskitAnalyticsContext(),
        handlers: analyticsContext.getAtlaskitAnalyticsEventHandlers(),
        payload,
      });
    },
    [analyticsContext],
  );

  return {
    createAnalyticsEvent,
  };
}
