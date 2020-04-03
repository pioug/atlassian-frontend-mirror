import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnalyticsPayload } from './types';

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
  definitionId?: string,
  cached = false,
): AnalyticsPayload => ({
  action: 'resolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
    cached,
  },
});

export const unresolvedEvent = (
  status: string,
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'unresolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
    reason: status,
  },
});

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
  display: 'inline' | 'block',
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
  display: 'inline' | 'block',
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
  display: 'inline' | 'block',
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

export const uiClosedAuthEvent = (
  display: 'inline' | 'block',
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
