/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
function bind(
	target: typeof window,
	event: AbortEvent,
	controller: AbortController,
	listener: () => void,
) {
	// Safe check for rare cases where window doesn't exist
	if (!target || typeof target.addEventListener !== 'function') {
		return () => {};
	}

	const options = {
		capture: true,
		passive: true,
		once: true,
		signal: controller.signal,
	};

	target.addEventListener(event, listener, options);

	return function unbind() {
		target.removeEventListener(event, listener, options);
	};
}

enum AbortEvent {
	wheel = 'wheel',
	keydown = 'keydown',
	mousedown = 'mousedown',
	pointerdown = 'pointerdown',
	pointer = 'pointerup',
	touchend = 'touchend',
	resize = 'resize',
	unknown = 'unknown',
	scroll = 'scroll',
}

export type OnFirstInteraction = (props: {
	event: keyof typeof AbortEvent;
	time: DOMHighResTimeStamp;
}) => void;

export class FirstInteractionObserver {
	private controller: AbortController;
	private unbindCallbacks: Set<() => void>;

	constructor(onFirstInteraction: OnFirstInteraction) {
		this.controller = new AbortController();

		this.unbindCallbacks = new Set();
		this.unbindCallbacks.add(
			bind(window, AbortEvent.keydown, this.controller, () => {
				this.unbindFirstInteractionEvents();
				onFirstInteraction({
					event: AbortEvent.keydown,
					time: performance.now(),
				});
			}),
		);

		this.unbindCallbacks.add(
			bind(window, AbortEvent.wheel, this.controller, () => {
				this.unbindFirstInteractionEvents();
				onFirstInteraction({
					event: AbortEvent.wheel,
					time: performance.now(),
				});
			}),
		);

		this.unbindCallbacks.add(
			bind(window, AbortEvent.scroll, this.controller, () => {
				this.unbindFirstInteractionEvents();
				onFirstInteraction({
					event: AbortEvent.scroll,
					time: performance.now(),
				});
			}),
		);

		this.unbindCallbacks.add(
			bind(window, AbortEvent.touchend, this.controller, () => {
				this.unbindFirstInteractionEvents();
				onFirstInteraction({
					event: AbortEvent.touchend,
					time: performance.now(),
				});
			}),
		);
		this.unbindCallbacks.add(
			bind(window, AbortEvent.pointerdown, this.controller, () => {
				this.unbindFirstInteractionEvents();
				onFirstInteraction({
					event: AbortEvent.pointerdown,
					time: performance.now(),
				});
			}),
		);
		this.unbindCallbacks.add(
			bind(window, AbortEvent.mousedown, this.controller, () => {
				this.unbindFirstInteractionEvents();
				onFirstInteraction({
					event: AbortEvent.mousedown,
					time: performance.now(),
				});
			}),
		);
		this.unbindCallbacks.add(
			bind(window, AbortEvent.resize, this.controller, () => {
				this.unbindFirstInteractionEvents();
				onFirstInteraction({
					event: AbortEvent.resize,
					time: performance.now(),
				});
			}),
		);
	}

	private unbindFirstInteractionEvents() {
		const { controller, unbindCallbacks } = this;

		if (controller) {
			controller.abort();
		}

		unbindCallbacks.forEach((cb) => {
			cb();
		});

		unbindCallbacks.clear();
	}

	public disconnect() {
		this.unbindFirstInteractionEvents();
	}
}
