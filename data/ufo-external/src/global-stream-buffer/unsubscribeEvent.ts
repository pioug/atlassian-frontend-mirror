import {
	type SubscribeCallback,
	UFOGlobalEventStreamEventType,
	type UFOGlobalEventStreamUnsubscribe,
} from '../types';

export const unsubscribeEvent = (
	experienceId: string,
	callback: SubscribeCallback,
): UFOGlobalEventStreamUnsubscribe => {
	return {
		type: UFOGlobalEventStreamEventType.UNSUBSCRIBE,
		payload: {
			experienceId,
			callback,
		},
	};
};
