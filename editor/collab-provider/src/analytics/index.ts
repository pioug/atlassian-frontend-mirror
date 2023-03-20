import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { GasPurePayload } from '@atlaskit/analytics-gas-types';
import type {
  ActionAnalyticsEvent,
  ErrorAnalyticsEvent,
  EVENT_STATUS,
} from '../helpers/const';
import { EVENT_ACTION } from '../helpers/const';
import {
  name as packageName,
  version as packageVersion,
} from '../version-wrapper';
import { network } from '../connectivity/singleton';

const EVENT_SUBJECT = 'collab';

enum COLLAB_SERVICE {
  NCS = 'ncs',
  SYNCHRONY = 'synchrony',
}

const triggerAnalyticsEvent = (
  analyticsEvent: ActionAnalyticsEvent | ErrorAnalyticsEvent,
  analyticsClient: AnalyticsWebClient | undefined,
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
      network: {
        status: network.getStatus(),
      },
      ...analyticsEvent.attributes,
    },
    tags: ['editor'],
    action: analyticsEvent.eventAction,
    source: 'unknown', // Adds zero analytics value, but event validation throws an error if you don't add it :-(
  };

  if (analyticsEvent.eventAction === EVENT_ACTION.ERROR) {
    payload.nonPrivacySafeAttributes = analyticsEvent.nonPrivacySafeAttributes;
  }

  // Let the browser figure out
  // when it should send those events
  try {
    const requestIdleCallbackFunction = (window as any).requestIdleCallback;
    const runItLater =
      typeof requestIdleCallbackFunction === 'function'
        ? requestIdleCallbackFunction
        : window.requestAnimationFrame;
    runItLater(() => {
      analyticsClient.sendOperationalEvent(payload);
    });
  } catch (error) {
    // silently fail for now https://product-fabric.atlassian.net/browse/ESS-3112
  }
};

export default class AnalyticsHelper {
  analyticsClient: AnalyticsWebClient | undefined;
  documentAri: string;

  constructor(documentAri: string, analyticsClient?: AnalyticsWebClient) {
    this.analyticsClient = analyticsClient;
    this.documentAri = documentAri;
  }

  sendErrorEvent(error: unknown, errorMessage: string) {
    const errorAnalyticsEvent = {
      eventAction: EVENT_ACTION.ERROR,
      attributes: {
        documentAri: this.documentAri,
        errorMessage,
      },
      nonPrivacySafeAttributes: {
        error,
      },
    } as ErrorAnalyticsEvent;
    triggerAnalyticsEvent(errorAnalyticsEvent, this.analyticsClient);
  }

  sendActionEvent(
    action: ActionAnalyticsEvent['eventAction'],
    status: EVENT_STATUS,
    attributes?: Omit<
      ActionAnalyticsEvent['attributes'],
      'documentAri' | 'eventStatus'
    >, // This breaks discriminated unions, because there is no obvious field to discriminate against any more
  ) {
    const analyticsEvent = {
      eventAction: action,
      attributes: {
        documentAri: this.documentAri,
        eventStatus: status,
        ...attributes,
      },
    } as ActionAnalyticsEvent;
    triggerAnalyticsEvent(analyticsEvent, this.analyticsClient);
  }
}
