// same types defined in analytics-web-client but avoid creating dependency with that
import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
export const UI_EVENT_TYPE = 'ui';
export const TRACK_EVENT_TYPE = 'track';
export const SCREEN_EVENT_TYPE = 'screen';
export const OPERATIONAL_EVENT_TYPE = 'operational';

export const DEFAULT_SOURCE = 'unknown';

export type EventType = 'ui' | 'track' | 'screen' | 'operational';

export type GasPureScreenEventPayload = {
	attributes?: {
		[key: string]: any;
	};
	name: string;
	tags?: Array<string>;
};

export type GasPurePayload = {
	action?: string;
	actionSubject: string;
	actionSubjectId?: string;
	attributes?: {
		[key: string]: any;
		componentName?: string;
		packageName?: string;
		packageVersion?: string;
	};
	nonPrivacySafeAttributes?: {
		[key: string]: any;
	};
	source?: string;
	tags?: Array<string>;
};

export type WithEventType = {
	eventType: EventType;
};
export type GasCorePayload = GasPurePayload & WithEventType;
export type GasScreenEventPayload = GasPureScreenEventPayload & WithEventType;

export type GasPayload = AnalyticsEventPayload & GasCorePayload;
