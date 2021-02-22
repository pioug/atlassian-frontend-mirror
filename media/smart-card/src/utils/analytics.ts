import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { AnalyticsPayload } from './types';
import { ErrorInfo } from 'react';
import { CardInnerAppearance } from '../view/Card/types';
import { CardType } from '../state/store/types';
import { getMeasure } from './performance';
import { APIError } from '../client/errors';

export const ANALYTICS_CHANNEL = 'media';

export const context = {
  componentName: 'smart-cards',
  packageName,
  packageVersion,
};

export const fireSmartLinkEvent = (
  payload: AnalyticsPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => {
  if (createAnalyticsEvent) {
    createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
  }
};

export const resolvedEvent = (
  id: string,
  definitionId?: string,
  extensionKey?: string,
  resourceType?: string,
): AnalyticsPayload => ({
  action: 'resolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    id,
    ...context,
    ...(definitionId ? { definitionId } : {}),
    ...(extensionKey ? { extensionKey } : {}),
    ...(resourceType ? { resourceType } : {}),
  },
});

export const unresolvedEvent = (
  id: string,
  status: string,
  definitionId?: string,
  extensionKey?: string,
  resourceType?: string,
  error?: APIError,
): AnalyticsPayload => ({
  action: 'unresolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    id,
    ...context,
    ...(definitionId ? { definitionId } : {}),
    ...(extensionKey ? { extensionKey } : {}),
    ...(resourceType ? { resourceType } : {}),
    reason: status,
    error: error
      ? {
          message: error.message,
          kind: error.kind,
          type: error.type,
        }
      : undefined,
  },
});

export const invokeSucceededEvent = (
  id: string,
  providerKey: string,
  actionType: string,
  display: CardInnerAppearance,
): AnalyticsPayload => {
  const measure = getMeasure(id, 'resolved') || { duration: undefined };
  return {
    action: 'resolved',
    actionSubject: 'smartLinkAction',
    eventType: 'operational',
    attributes: {
      ...context,
      id,
      actionType,
      display,
      definitionId: providerKey,
      duration: measure.duration,
    },
  };
};

export const invokeFailedEvent = (
  id: string,
  providerKey: string,
  actionType: string,
  display: CardInnerAppearance,
  reason: string,
): AnalyticsPayload => {
  const measure = getMeasure(id, 'errored') || { duration: undefined };
  return {
    action: 'unresolved',
    actionSubject: 'smartLinkAction',
    eventType: 'operational',
    attributes: {
      ...context,
      id,
      actionType,
      display,
      definitionId: providerKey,
      duration: measure.duration,
      reason,
    },
  };
};

export const connectSucceededEvent = (
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  action: 'connectSucceeded',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId } : {}),
    ...(extensionKey ? { extensionKey } : {}),
  },
});

export const connectFailedEvent = (
  definitionId?: string,
  extensionKey?: string,
  reason?: string,
): AnalyticsPayload => ({
  action: 'connectFailed',
  actionSubject: 'smartLink',
  actionSubjectId: reason,
  eventType: 'operational',
  attributes: {
    ...context,
    ...(reason ? { reason: reason } : {}),
    ...(definitionId ? { definitionId } : {}),
    ...(extensionKey ? { extensionKey } : {}),
  },
});

export const trackAppAccountConnected = (
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  action: 'connected',
  actionSubject: 'applicationAccount',
  eventType: 'track',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId } : {}),
    ...(extensionKey ? { extensionKey } : {}),
  },
});

export const uiAuthEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'connectAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    extensionKey: extensionKey || '',
    display,
  },
});

export const uiAuthAlternateAccountEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  actionSubjectId: 'tryAnotherAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    extensionKey: extensionKey || '',
    display,
  },
});

export const uiCardClickedEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    extensionKey: extensionKey || '',
    display,
  },
});

export const uiActionClickedEvent = (
  providerKey: string,
  actionType: string,
  display?: CardInnerAppearance,
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLinkAction',
  eventType: 'ui',
  attributes: {
    ...context,
    display,
    definitionId: providerKey,
    actionType: actionType,
  },
});

export const uiClosedAuthEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  action: 'closed',
  actionSubject: 'consentModal',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    extensionKey: extensionKey || '',
    display,
  },
});

export const screenAuthPopupEvent = (
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  actionSubject: 'consentModal',
  eventType: 'screen',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    extensionKey: extensionKey || '',
  },
});

export const uiRenderSuccessEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
  extensionKey?: string,
): AnalyticsPayload => ({
  action: 'renderSuccess',
  actionSubject: 'smartLink',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    extensionKey: extensionKey || '',
    display,
  },
});

export const uiRenderFailedEvent = (
  display: CardInnerAppearance,
  error: Error,
  errorInfo: ErrorInfo,
): AnalyticsPayload => ({
  actionSubject: 'smartLink',
  action: 'renderFailed',
  eventType: 'ui',
  attributes: {
    error,
    errorInfo,
    display,
  },
});

export const instrumentEvent = (
  id: string,
  status: CardType,
  definitionId?: string,
  extensionKey?: string,
  resourceType?: string,
  error?: APIError,
): AnalyticsPayload | undefined => {
  const measure = getMeasure(id, status) || { duration: undefined };
  if (status === 'resolved') {
    const event = resolvedEvent(id, definitionId, extensionKey, resourceType);
    return {
      ...event,
      attributes: {
        ...event.attributes,
        duration: measure.duration,
      },
    };
  } else {
    if (error?.type !== 'ResolveUnsupportedError') {
      const event = unresolvedEvent(
        id,
        status,
        definitionId,
        extensionKey,
        resourceType,
        error,
      );
      return {
        ...event,
        attributes: {
          ...event.attributes,
          duration: measure.duration,
        },
      };
    }
  }
};
