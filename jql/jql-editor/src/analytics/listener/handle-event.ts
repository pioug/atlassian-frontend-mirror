/**
 * Adapted from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/analytics/analytics-listeners/src/fabric/handle-event.tsx
 * In future if this package is migrated into the Atlassian Frontend repo, then this code and related logic should be
 * moved into @atlaskit/analytics-listeners.
 */

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { sendEvent } from './analytics-web-client-wrapper';
import Logger from './helpers/logger';
import { processEventPayload } from './process-event-payload';
import { AnalyticsWebClient } from './types';

export const handleEvent = (
  event: UIAnalyticsEvent,
  logger: Logger,
  client?: AnalyticsWebClient | Promise<AnalyticsWebClient>,
) => {
  if (!event.payload) {
    return;
  }
  const payload = processEventPayload(event);
  sendEvent(logger, client)(payload);
};
