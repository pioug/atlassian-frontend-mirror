import { type UFOGlobalEventStreamEvent } from '../types';

export type GlobalEventStream = {
	__buffer_only__: boolean;
	push(event: UFOGlobalEventStreamEvent): void;
};

export const MAX_EARLY_QUEUE_LENGTH = 250;

declare global {
	var __UFO_GLOBAL_EVENT_STREAM__: any;
}
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead.
 * Retained only while consumers migrate off the barrel.
 */
export { getGlobalEventStream } from './getGlobalEventStream';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead.
 * Retained only while consumers migrate off the barrel.
 */
export { setGlobalEventStream } from './setGlobalEventStream';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead.
 * Retained only while consumers migrate off the barrel.
 */
export { subscribeEvent } from './subscribeEvent';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead.
 * Retained only while consumers migrate off the barrel.
 */
export { unsubscribeEvent } from './unsubscribeEvent';
/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead.
 * Retained only while consumers migrate off the barrel.
 */
export { experiencePayloadEvent } from './experiencePayloadEvent';
