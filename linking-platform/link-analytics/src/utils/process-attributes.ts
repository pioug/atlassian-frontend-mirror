import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { normalizeUrl } from '@atlaskit/linking-common/url';

import { LinkDetails } from '../types';

const getSourceEvent = (payload: Record<string, unknown>): string | null => {
  const base = (
    payload.eventName
      ? [payload.eventName]
      : [payload.actionSubject, payload.action]
  ).filter(Boolean);

  if (base.length) {
    const baseStr = base.join(' ');

    return payload.actionSubjectId
      ? `${baseStr} (${payload.actionSubjectId})`
      : baseStr;
  }

  if (payload['data'] && typeof payload['data'] === 'object') {
    return getSourceEvent({ ...payload['data'] });
  }

  return null;
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
    sourceEvent: getSourceEvent(event.payload),
    ...contextAttributes,
    ...event.payload.attributes,
    ...event.payload.data?.attributes,
  };
};

export const mergeAttributes = (
  details: LinkDetails,
  sourceEvent?: UIAnalyticsEvent | null,
  attributes?: Record<string, any>,
): Record<string, unknown> => {
  return {
    ...(sourceEvent ? processAttributesFromBaseEvent(sourceEvent) : {}),
    ...attributes,
    smartLinkId: details.smartLinkId,
  };
};

export const getDomainFromUrl = (url: string): string | null => {
  try {
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      return null;
    }

    return new URL(normalizedUrl).hostname;
  } catch {
    return null;
  }
};
