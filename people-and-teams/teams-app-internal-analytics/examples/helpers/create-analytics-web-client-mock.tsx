import type { GasPurePayload, GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';

export const createAnalyticsWebClientMock = () => ({
	sendUIEvent: (event: GasPurePayload): void => {
		console.log('sendUIEvent: ', event);
	},
	sendOperationalEvent: (event: GasPurePayload): void => {
		console.log('sendOperationalEvent: ', event);
	},
	sendTrackEvent: (event: GasPurePayload): void => {
		console.log('sendTrackEvent: ', event);
	},
	sendScreenEvent: (event: GasPureScreenEventPayload): void => {
		console.log('sendScreenEvent: ', event);
	},
});
