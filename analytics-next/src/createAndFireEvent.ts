import { AnalyticsEventPayload } from './AnalyticsEvent';
import { CreateUIAnalyticsEvent } from './types';

export default (channel?: string) => (payload: AnalyticsEventPayload) => (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
) => {
  const consumerEvent = createAnalyticsEvent(payload);
  const clonedEvent = consumerEvent.clone();

  if (clonedEvent) {
    clonedEvent.fire(channel);
  }

  return consumerEvent;
};
