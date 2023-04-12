/**
 * Inspired by analytics-web-react
 */

import {
  UI_EVENT_TYPE,
  SCREEN_EVENT_TYPE,
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import last from 'lodash/last';
import Logger from '../helpers/logger';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { getSources } from '../atlaskit/extract-data-from-event';

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
