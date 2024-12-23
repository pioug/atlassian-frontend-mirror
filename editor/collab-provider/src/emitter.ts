import { EventEmitter2 } from 'eventemitter2';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Emitter<T = any> {
	private eventEmitter: EventEmitter2 = new EventEmitter2();

	/**
	 * Emit events to subscribers
	 */
	protected emit<K extends keyof T>(evt: K, data: T[K]) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.eventEmitter.emit(evt as any, data);
		return this;
	}

	/**
	 * Subscribe to events emitted by this provider
	 */
	on<K extends keyof T>(evt: K, handler: (args: T[K]) => void) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.eventEmitter.on(evt as any, handler);
		return this;
	}

	/**
	 * Unsubscribe from events emitted by this provider
	 */
	off<K extends keyof T>(evt: K, handler: (args: T[K]) => void) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.eventEmitter.off(evt as any, handler);
		return this;
	}

	/**
	 * Unsubscribe from all events emitted by this provider.
	 */
	unsubscribeAll<K extends keyof T>(evt?: K) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.eventEmitter.removeAllListeners(evt as any);
		return this;
	}
}
