import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

const getSourceEvent = (event: UIAnalyticsEvent) => {
  const base =
    event.payload.eventName ??
    `${event.payload.actionSubject} ${event.payload.action}`;

  if (event.payload.actionSubjectId) {
    return `${base} (${event.payload.actionSubjectId})`;
  }
  return base;
};

/**
 * Given an event, derive a set of attributes
 */
export const processAttributesFromBaseEvent = (event: UIAnalyticsEvent) => {
  const contextAttributes = event.context.reduce((acc, cur) => {
    if (!cur.attributes) {
      return acc;
    }

    return {
      ...acc.attributes,
      ...cur.attributes,
    };
  }, {});

  return {
    sourceEvent: getSourceEvent(event),
    ...contextAttributes,
    ...event.payload.attributes,
  };
};
