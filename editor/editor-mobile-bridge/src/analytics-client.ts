import { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
  EventType,
  GasPayload,
} from '@atlaskit/analytics-gas-types';

export const analyticsBridgeClient = (
  handleAnalyticsEvent: (
    event: GasPurePayload | GasPureScreenEventPayload,
  ) => void,
): AnalyticsWebClient => {
  // Add the eventType to all events before sending them through
  const handleEvent = (
    eventType: EventType,
    event: GasPurePayload | GasPureScreenEventPayload,
  ) => {
    (event as GasPayload).eventType = eventType;
    handleAnalyticsEvent(event);
  };

  return {
    sendUIEvent: event => handleEvent('ui', event),
    sendOperationalEvent: event => handleEvent('operational', event),
    sendTrackEvent: event => handleEvent('track', event),
    sendScreenEvent: event => handleEvent('screen', event),
  };
};
