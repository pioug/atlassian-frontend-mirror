import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { GasPurePayload } from '@atlaskit/analytics-gas-types';
import {
  ATTRIBUTES_PACKAGE,
  CATCHUP_FAILURE,
  CATCHUP_SUCCESS,
  STEPS_ADDED,
  STEPS_REJECTED,
} from '../helpers/const';
import { ErrorPayload } from '../channel';

export const buildAnalyticsPayload = (
  subject: string,
  payload?: any,
): GasPurePayload => {
  return {
    action: 'collab',
    actionSubject: subject,
    source: 'unknown',
    attributes: {
      packageName: ATTRIBUTES_PACKAGE,
      payload,
    },
  };
};

export const fireAnalyticsEvent = (
  analyticsClient?: AnalyticsWebClient,
  analyticsEvent?: GasPurePayload,
) => {
  if (!analyticsClient || !analyticsEvent) {
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
      ...analyticsEvent,
      source: analyticsEvent.source || 'unknown',
    });
  });
};

export const triggerAnalyticsForStepsAddedSuccessfully = (
  analyticsClient?: AnalyticsWebClient,
) => {
  const stepAddedEvent: GasPurePayload = buildAnalyticsPayload(STEPS_ADDED);
  fireAnalyticsEvent(analyticsClient, stepAddedEvent);
};

export const triggerAnalyticsForStepsRejected = (
  analyticsClient?: AnalyticsWebClient,
  error?: ErrorPayload,
) => {
  const stepRejectedEvent: GasPurePayload = buildAnalyticsPayload(
    STEPS_REJECTED,
    error,
  );
  fireAnalyticsEvent(analyticsClient, stepRejectedEvent);
};

export const triggerAnalyticsForCatchupFailed = (
  analyticsClient?: AnalyticsWebClient,
  error?: ErrorPayload,
) => {
  const catchupFailedEvent: GasPurePayload = buildAnalyticsPayload(
    CATCHUP_FAILURE,
    error,
  );
  fireAnalyticsEvent(analyticsClient, catchupFailedEvent);
};

export const triggerAnalyticsForCatchupSuccessfulWithLatency = (
  analyticsClient?: AnalyticsWebClient,
  latency?: number,
) => {
  const callCatchupLatency: GasPurePayload = buildAnalyticsPayload(
    CATCHUP_SUCCESS,
    latency,
  );
  fireAnalyticsEvent(analyticsClient, callCatchupLatency);
};
