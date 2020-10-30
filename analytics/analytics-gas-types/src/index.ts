// same types defined in analytics-web-client but avoid creating dependency with that
import { AnalyticsEventPayload } from '@atlaskit/analytics-next';
export const UI_EVENT_TYPE = 'ui';
export const TRACK_EVENT_TYPE = 'track';
export const SCREEN_EVENT_TYPE = 'screen';
export const OPERATIONAL_EVENT_TYPE = 'operational';

export const DEFAULT_SOURCE = 'unknown';

export type EventType = 'ui' | 'track' | 'screen' | 'operational';

export type GasPureScreenEventPayload = {
  name: string;
  attributes?: {
    [key: string]: any;
  };
  tags?: Array<string>;
};

export type GasPurePayload = {
  actionSubject: string;
  actionSubjectId?: string;
  attributes?: {
    packageName?: string;
    packageVersion?: string;
    componentName?: string;
    [key: string]: any;
  };
  nonPrivacySafeAttributes?: {
    [key: string]: any;
  };
  tags?: Array<string>;
  source?: string;
  action?: string;
};

export type WithEventType = {
  eventType: EventType;
};
export type GasCorePayload = GasPurePayload & WithEventType;
export type GasScreenEventPayload = GasPureScreenEventPayload & WithEventType;

export type GasPayload = AnalyticsEventPayload & GasCorePayload;
