import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
export interface Listeners {
	[name: string]: Set<Listener>;
}
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener<T = any> = (data: T) => void;
type EventName = PluginKey | string;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dispatch<T = any> = (eventName: EventName, data: T) => void;

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventDispatcher<T = any> {
	private listeners: Listeners = {};

	on(event: string, cb: Listener<T>): void {
		if (!this.listeners[event]) {
			this.listeners[event] = new Set();
		}

		this.listeners[event].add(cb);
	}

	has(event: string, cb: Listener<T>): boolean {
		if (!this.listeners[event]) {
			return false;
		}

		return this.listeners[event].has(cb);
	}

	off(event: string, cb: Listener<T>): void {
		if (!this.listeners[event]) {
			return;
		}

		if (this.listeners[event].has(cb)) {
			this.listeners[event].delete(cb);
		}
	}

	emit(event: string, data: T): void {
		if (!this.listeners[event]) {
			return;
		}

		this.listeners[event].forEach((cb) => cb(data));
	}

	destroy(): void {
		this.listeners = {};
	}
}

function getEventFromEventName(eventName: EventName): string {
	return typeof eventName === 'string' ? eventName : (eventName as PluginKey & { key: string }).key;
}

/**
 * Creates a dispatch function that can be called inside ProseMirror Plugin
 * to notify listeners about that plugin's state change.
 */
export function createDispatch<T>(eventDispatcher: EventDispatcher<T>): Dispatch<T> {
	return (eventName: PluginKey | string, data: T) => {
		if (!eventName) {
			throw new Error('event name is required!');
		}

		eventDispatcher.emit(getEventFromEventName(eventName), data);
	};
}
