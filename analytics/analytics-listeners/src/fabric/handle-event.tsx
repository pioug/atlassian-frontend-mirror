import { sendEvent } from '../analytics-web-client-wrapper';
import { AnalyticsWebClient } from '../types';
import Logger from '../helpers/logger';
import { processEventPayload } from './process-event-payload';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export const handleEvent = (
  event: UIAnalyticsEvent,
  // If passing through multiple tags, the primary tag should be first in the array.
  // The primary tag is used for matching context.
  tags: string | string[],
  logger: Logger,
  client?: AnalyticsWebClient | Promise<AnalyticsWebClient>,
) => {
  if (!event.payload) {
    return;
  }
  const payload = processEventPayload(event, tags);
  sendEvent(logger, client)(payload);
};
