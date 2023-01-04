import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { GasPurePayload } from '@atlaskit/analytics-gas-types';
import {
  AnalyticsEvent,
  EVENT_SUBJECT,
  COLLAB_SERVICE,
} from '../helpers/const';

import {
  name as packageName,
  version as packageVersion,
} from '../version-wrapper';

export const triggerAnalyticsEvent = (
  analyticsEvent: AnalyticsEvent,
  analyticsClient?: AnalyticsWebClient,
) => {
  if (!analyticsClient) {
    return;
  }

  const payload: GasPurePayload = {
    actionSubject: EVENT_SUBJECT,
    attributes: {
      packageName,
      packageVersion,
      collabService: COLLAB_SERVICE.NCS,
      ...analyticsEvent.attributes,
    },
    tags: ['editor'],
    action: analyticsEvent.eventAction,
    source: 'unknown', // Adds zero analytics value, but event validation throws an error if you don't add it :-(
  };

  // Let the browser figure out
  // when it should send those events
  const requestIdleCallbackFunction = (window as any).requestIdleCallback;
  const runItLater =
    typeof requestIdleCallbackFunction === 'function'
      ? requestIdleCallbackFunction
      : window.requestAnimationFrame;
  runItLater(() => {
    analyticsClient.sendOperationalEvent(payload);
  });
};
