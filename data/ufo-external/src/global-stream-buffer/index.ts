import { type UFOGlobalEventStreamEvent } from '../types';

export type GlobalEventStream = {
	__buffer_only__: boolean;
	push(event: UFOGlobalEventStreamEvent): void;
};

export const MAX_EARLY_QUEUE_LENGTH = 250;

declare global {
	var __UFO_GLOBAL_EVENT_STREAM__: any;
}
export { getGlobalEventStream } from './getGlobalEventStream';
export { setGlobalEventStream } from './setGlobalEventStream';
export { subscribeEvent } from './subscribeEvent';
export { unsubscribeEvent } from './unsubscribeEvent';
export { experiencePayloadEvent } from './experiencePayloadEvent';
