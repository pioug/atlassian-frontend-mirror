/**
 * Adapted from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/analytics/analytics-listeners/src/fabric/process-event-payload.tsx
 * In future if this package is migrated into the Atlassian Frontend repo, then this code and related logic should be
 * moved into @atlaskit/analytics-listeners.
 */

import merge from 'lodash/merge';

import {
  DEFAULT_SOURCE,
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

const extractFieldsFromContext =
  (fieldsToPick: string[]) => (contexts: Record<string, any>[]) =>
    contexts
      .map(ctx =>
        fieldsToPick.reduce(
          (result, key) =>
            ctx[key] ? merge(result, { [key]: ctx[key] }) : result,
          {},
        ),
      )
      .reduce((result, item) => merge(result, item), {});

const fieldExtractor = () =>
  extractFieldsFromContext([
    'source',
    'objectType',
    'objectId',
    'containerType',
    'containerId',
  ]);

const updatePayloadWithContext = (
  event: UIAnalyticsEvent,
): GasPayload | GasScreenEventPayload => {
  if (event.context.length === 0) {
    return { source: DEFAULT_SOURCE, ...event.payload } as
      | GasPayload
      | GasScreenEventPayload;
  }

  const fields: Record<string, any> = fieldExtractor()(event.context);

  return { source: DEFAULT_SOURCE, ...fields, ...event.payload } as
    | GasPayload
    | GasScreenEventPayload;
};

export const processEventPayload = (
  event: UIAnalyticsEvent,
): GasPayload | GasScreenEventPayload => {
  return updatePayloadWithContext(event);
};
