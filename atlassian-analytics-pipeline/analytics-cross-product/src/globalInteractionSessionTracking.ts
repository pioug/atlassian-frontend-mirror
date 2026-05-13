// WARNING: This value is shared between @atlaskit/analytics-cross-product and
// @atlassiansox/analytics-cross-product-interaction-client. Take care when updating.
export const INTERNAL_CLIENT_WINDOW_KEY = 'analyticsInteractionSesssionTrackingClient';

export interface InteractionSessionTracking {
	getCurrentInteractionSessionId(): string | null;
}

export default class GlobalInteractionSessionTracking {
	static getInstance(): InteractionSessionTracking | undefined {
		let interactionSessionTracking: InteractionSessionTracking | undefined;

		try {
			// Check if InteractionSessionTracking in global window object
			if (INTERNAL_CLIENT_WINDOW_KEY in window) {
				interactionSessionTracking = window[
					INTERNAL_CLIENT_WINDOW_KEY
				] as InteractionSessionTracking;
			}
		} catch (err) {
			// Silently swallow exception
		}

		return interactionSessionTracking;
	}
}
