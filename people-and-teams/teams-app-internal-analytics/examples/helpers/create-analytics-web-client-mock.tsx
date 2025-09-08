import type { GasPurePayload, GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';

export const createAnalyticsWebClientMock = () => ({
	sendUIEvent: (event: GasPurePayload) => {
		console.log('sendUIEvent: ', event);
	},
	sendOperationalEvent: (event: GasPurePayload) => {
		console.log('sendOperationalEvent: ', event);
	},
	sendTrackEvent: (event: GasPurePayload) => {
		console.log('sendTrackEvent: ', event);
	},
	sendScreenEvent: (event: GasPureScreenEventPayload) => {
		console.log('sendScreenEvent: ', event);
	},
});
