/**
 * Inspired by analytics-web-react
 */

import {
  GasPayload,
  GasScreenEventPayload,
  OPERATIONAL_EVENT_TYPE,
  SCREEN_EVENT_TYPE,
  TRACK_EVENT_TYPE,
  UI_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import last from 'lodash/last';
import Logger from '../helpers/logger';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { NAVIGATION_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import {
  getExtraAttributes,
  getSources,
} from '../atlaskit/extract-data-from-event';
import { getExtraAttributes as getExtraAttributesFromContextName } from '../helpers/extract-data-from-event';

const CROSS_FLOW_TAG = 'crossFlow';

export default (
  event: UIAnalyticsEvent,
  logger: Logger,
): GasPayload | GasScreenEventPayload | null => {
  const {
    eventType = UI_EVENT_TYPE,
    action,
    actionSubject,
    actionSubjectId,
    name,
  } = event.payload;
  let sources = getSources(event);
  const lastSourceFromContext = last(sources);

  const source = event.payload.source ?? lastSourceFromContext;
  if (lastSourceFromContext !== source) {
    sources.push(source);
  }
  const attributes = {
    // To get extra attributes from AnalyticsContext from other products/platforms, e.g. Jira-frontend
    ...getExtraAttributes(event),
    // To inherit the extra attributes from the navigation (Atlassian Switcher) context into the crossFlow events,
    // because the events current crossFlow touchpionts already inherit these attributes in the payload.
    ...getExtraAttributesFromContextName(event, NAVIGATION_CONTEXT),
    ...event.payload.attributes,
    namespaces: sources.join('.'),
  };

  // Ensure navigation tag is not duplicated by using Set
  const tags: Set<string> = new Set(event.payload.tags || []);
  tags.add(CROSS_FLOW_TAG);

  if (event.payload) {
    switch (eventType) {
      case UI_EVENT_TYPE:
      case OPERATIONAL_EVENT_TYPE:
      case TRACK_EVENT_TYPE:
        return {
          eventType,
          source,
          actionSubject,
          action,
          actionSubjectId,
          attributes,
          tags: Array.from(tags),
        } as any;
      case SCREEN_EVENT_TYPE:
        return {
          eventType,
          name,
          attributes,
          tags: Array.from(tags),
        };
      default:
        logger.error('Invalid event type', eventType);
        break;
    }
  }

  return null;
};
