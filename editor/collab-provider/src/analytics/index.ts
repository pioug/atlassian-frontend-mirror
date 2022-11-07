import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { GasPurePayload } from '@atlaskit/analytics-gas-types';
import {
  AnalyticsEvent,
  EVENT_SUBJECT,
  COLLAB_SERVICE,
} from '../helpers/const';

import {
  name as packageName,
  version as packageVersion,
} from '../version-wrapper';

export const fireAnalyticsEvent = (
  analyticsClient?: AnalyticsWebClient,
  payload?: GasPurePayload,
) => {
  if (!analyticsClient || !payload) {
    return;
  }

  const client = analyticsClient;
  const requestIdleCallbackFunction = (window as any).requestIdleCallback;
  const runItLater =
    typeof requestIdleCallbackFunction === 'function'
      ? requestIdleCallbackFunction
      : window.requestAnimationFrame;

  // Let the browser figure out
  // when it should send those events
  runItLater(() => {
    client.sendOperationalEvent({
      action: 'collab',
      ...payload,
      source: payload.source || 'unknown',
      tags: ['editor'],
    });
  });
};

export const triggerCollabAnalyticsEvent = (
  analyticsEvent: AnalyticsEvent,
  analyticsClient?: AnalyticsWebClient,
) => {
  const payload: GasPurePayload = {
    action: analyticsEvent.eventAction,
    actionSubject: EVENT_SUBJECT,
    source: 'unknown',
    attributes: {
      packageName,
      packageVersion,
      collabService: COLLAB_SERVICE.NCS,
      ...analyticsEvent.attributes,
    },
  };
  fireAnalyticsEvent(analyticsClient, payload);
};
