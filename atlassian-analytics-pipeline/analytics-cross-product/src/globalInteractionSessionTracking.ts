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
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(
				`Error fetching InteractionSessionTracking from window - ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		return interactionSessionTracking;
	}
}
