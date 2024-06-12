/* eslint-disable @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop */
/**
 * We are listening directly to drag events instead of using a monitor from
 * `@atlaskit/pragmatic-drag-and-drop` to avoid the bundle size cost, as it
 * would affect almost every view in every product.
 *
 * We can reconsider this choice in the future.
 */
import { bindAll } from 'bind-event-listener';

type Registration = {
	onRegister: (args: { isDragging: boolean }) => void;
	onDragStart: () => void;
	onDragEnd: () => void;
};

type CleanupFn = () => void;

const registrations: Set<Registration> = new Set();

let cleanupEndEventListeners: CleanupFn | null = null;

function onDragStart() {
	if (cleanupEndEventListeners) {
		// If the cleanup function exists then we've already run this
		return;
	}

	cleanupEndEventListeners = bindAll(window, [
		{ type: 'dragend', listener: onDragEnd },
		{ type: 'pointerdown', listener: onDragEnd },
		{
			type: 'pointermove',
			listener: (() => {
				let callCount: number = 0;
				return function listener() {
					// Using 20 as it is far bigger than the most observed (3)
					if (callCount < 20) {
						callCount++;
						return;
					}
					onDragEnd();
				};
			})(),
		},
	]);

	const clone = Array.from(registrations);
	clone.forEach((subscriber) => {
		subscriber.onDragStart();
	});
}

function onDragEnd() {
	cleanupEndEventListeners?.();
	cleanupEndEventListeners = null;

	const clone = Array.from(registrations);
	clone.forEach((subscriber) => {
		subscriber.onDragEnd();
	});
}

function bindStartEvents(): CleanupFn {
	return bindAll(window, [
		{ type: 'dragstart', listener: onDragStart },
		{ type: 'dragenter', listener: onDragStart },
	]);
}

let cleanupStartEventListeners: CleanupFn | null = null;

export function register(registration: Registration): CleanupFn {
	// if first registration, bind event listeners
	if (!cleanupStartEventListeners) {
		// note: currently never unbinding these event listeners
		cleanupStartEventListeners = bindStartEvents();
	}

	registrations.add(registration);

	/**
	 * The reasoning for this behavior is so that if a tooltip mounts during
	 * a drag it can still be suppressed.
	 *
	 * We use a separate callback instead of onDragStart to avoid infinite loops.
	 */
	registration.onRegister({ isDragging: cleanupEndEventListeners !== null });

	return function unregister() {
		registrations.delete(registration);

		if (registrations.size === 0) {
			cleanupStartEventListeners?.();
			cleanupStartEventListeners = null;
		}
	};
}
