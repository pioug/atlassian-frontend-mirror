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
export const MESSAGE_WINDOW_CLOSED = 'The auth window was closed';
export const KEY_WINDOW_CLOSED = 'authWindowClosed';
export const KEY_SENSITIVE_DATA = 'potentialSensitiveData';

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
): AnalyticsPayload => ({
  action: 'resolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    id,
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const unresolvedEvent = (
  id: string,
  status: string,
  definitionId?: string,
  error?: APIError,
): AnalyticsPayload => ({
  action: 'unresolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    id,
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
    reason: status,
    error: error
      ? {
          message: error.message,
          kind: error.kind,
          type: error.type,
          stack: error.stack,
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
): AnalyticsPayload => ({
  action: 'connectSucceeded',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const connectFailedEvent = (
  definitionId?: string,
  reason?: string,
): AnalyticsPayload => ({
  action: 'connectFailed',
  actionSubject: 'smartLink',
  actionSubjectId: reason,
  eventType: 'operational',
  attributes: {
    ...context,
    ...(reason ? { reason: reason } : {}),
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const trackAppAccountConnected = (
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'connected',
  actionSubject: 'applicationAccount',
  eventType: 'track',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const uiAuthEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'connectAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    display,
  },
});

export const uiAuthAlternateAccountEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  actionSubjectId: 'tryAnotherAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    display,
  },
});

export const uiCardClickedEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
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
): AnalyticsPayload => ({
  action: 'closed',
  actionSubject: 'consentModal',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
    display,
  },
});

export const screenAuthPopupEvent = (
  definitionId?: string,
): AnalyticsPayload => ({
  actionSubject: 'consentModal',
  eventType: 'screen',
  attributes: {
    ...context,
    definitionId: definitionId || '',
  },
});

export const uiRenderSuccessEvent = (
  display: CardInnerAppearance,
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'renderSuccess',
  actionSubject: 'smartLink',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId: definitionId || '',
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
  error?: APIError,
): AnalyticsPayload => {
  const measure = getMeasure(id, status) || { duration: undefined };
  if (status === 'resolved') {
    const event = resolvedEvent(id, definitionId);
    return {
      ...event,
      attributes: {
        ...event.attributes,
        duration: measure.duration,
      },
    };
  } else {
    const event = unresolvedEvent(id, status, definitionId, error);
    return {
      ...event,
      attributes: {
        ...event.attributes,
        duration: measure.duration,
      },
    };
  }
};
