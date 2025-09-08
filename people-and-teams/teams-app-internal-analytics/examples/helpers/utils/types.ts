import type { GasPurePayload, GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';

export type AnalyticsEventPayload = Omit<GasPurePayload, 'nonPrivacySafeAttributes' | 'tags'> & {
	action: string;
	actionSubject: string;
	actionSubjectId: string;
};

export type AnalyticsScreenEventPayload = Omit<GasPureScreenEventPayload, 'tags'>;

export type EventType = 'ui' | 'operational' | 'track' | 'screen';
