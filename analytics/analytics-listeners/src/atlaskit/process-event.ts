/**
 * Inspired by analytics-web-react
 */

import last from 'lodash/last';
import merge from 'lodash/merge';

import {
  DEFAULT_SOURCE,
  UI_EVENT_TYPE,
  SCREEN_EVENT_TYPE,
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  GasPayload,
} from '@atlaskit/analytics-gas-types';

import {
  getSources,
  getActionSubject,
  getExtraAttributes,
  getPackageInfo,
  getPackageHierarchy,
  getComponents,
} from './extract-data-from-event';
import Logger from '../helpers/logger';
import { version as listenerVersion } from '../version.json';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

const ATLASKIT_TAG = 'atlaskit';

/**
 * This util exists to convert the Atlaskit event format into the analytics platform format.
 *
 * Atlaskit event format:
 * event {
 *      payload: {
 *          ...attributesFromLowestPointInTheTree
 *      },
 *      context: [{
 *          ...attributesFromHighestPointInTheTree
 *      }, {
 *          ...attributesFromSecondHighestPointInTheTree
 *      }]
 * }
 *
 * Analytics platform event format:
 *  event {
 *      type: @atlaskit/analytics-gas-types.EventType
 *      payload {
 *          ...mandatoryAttributesBasedOnEventType
 *          attributes: {
 *              ...arbitraryAttributes
 *          }
 *      }
 *  }
 */

export default (event: UIAnalyticsEvent, logger: Logger): GasPayload | null => {
  const sources = getSources(event);
  const source = last(sources) || DEFAULT_SOURCE;
  const extraAttributes = getExtraAttributes(event);
  const components = getComponents(event);

  const { packageName, packageVersion } =
    last(getPackageInfo(event)) || ({} as any);

  const {
    eventType = UI_EVENT_TYPE,
    action,
    actionSubjectId,
    attributes: payloadAttributes,
    containerId,
  } = event.payload;
  const attributes = {
    listenerVersion,
    sourceHierarchy: sources.join('.') || undefined,
    componentHierarchy: components.join('.') || undefined,
    packageHierarchy: getPackageHierarchy(event) || undefined,
    ...{ packageName, packageVersion },
    ...merge(extraAttributes, payloadAttributes),
  };
  // Ensure atlaskit tag is not duplicated by using Set
  const tags: Set<string> = new Set(event.payload.tags || []);
  tags.add(ATLASKIT_TAG);

  if (event.payload) {
    if (eventType === UI_EVENT_TYPE) {
      return {
        eventType,
        source,
        actionSubject: getActionSubject(event),
        action,
        actionSubjectId,
        attributes,
        containerId,
        tags: Array.from(tags),
      } as any;
    }

    if (
      eventType === TRACK_EVENT_TYPE ||
      eventType === OPERATIONAL_EVENT_TYPE ||
      eventType === SCREEN_EVENT_TYPE
    ) {
      logger.error(
        'Track, screen and operational events are currently not supported for atlaskit events',
      );
    } else {
      logger.error('Invalid event type', eventType);
    }
  }

  return null;
};
