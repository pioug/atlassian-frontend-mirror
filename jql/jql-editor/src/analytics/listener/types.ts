import { type GasPurePayload, type GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';

export type AnalyticsWebClient = {
	sendOperationalEvent: (event: GasPurePayload) => void;
	sendScreenEvent: (event: GasPureScreenEventPayload) => void;
	sendTrackEvent: (event: GasPurePayload) => void;
	sendUIEvent: (event: GasPurePayload) => void;
};
