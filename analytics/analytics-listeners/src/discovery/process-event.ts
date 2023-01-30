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

import Logger from '../helpers/logger';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

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
    attributes,
    name,
    source,
    containers,
  } = event.payload;

  // Ensure navigation tag is not duplicated by using Set
  const tags: Set<string> = new Set(event.payload.tags || []);
  tags.add(CROSS_FLOW_TAG);

  if (event.payload) {
    switch (eventType) {
      case UI_EVENT_TYPE:
      case OPERATIONAL_EVENT_TYPE:
      case TRACK_EVENT_TYPE:
        return {
          containers,
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
          containers,
          eventType,
          name,
          source,
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
