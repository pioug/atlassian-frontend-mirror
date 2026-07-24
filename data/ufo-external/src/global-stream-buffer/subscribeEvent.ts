import {
	type SubscribeCallback,
	UFOGlobalEventStreamEventType,
	type UFOGlobalEventStreamSubscribe,
} from '../types';

export const subscribeEvent = (
	experienceId: string,
	callback: SubscribeCallback,
): UFOGlobalEventStreamSubscribe => {
	return {
		type: UFOGlobalEventStreamEventType.SUBSCRIBE,
		payload: {
			experienceId,
			callback,
		},
	};
};
