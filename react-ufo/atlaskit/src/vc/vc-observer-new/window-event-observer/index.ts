import { bind, type UnbindFn } from 'bind-event-listener';

export type ObservedWindowEvent = 'wheel' | 'scroll' | 'keydown' | 'resize';
export type ObservedWindowEventExtended = ObservedWindowEvent | 'scroll-container';

export type OnEventCallback = (args: {
	time: DOMHighResTimeStamp;
	type: ObservedWindowEventExtended;
	event: Event;
}) => void;

export type WindowEventObserverOptions = {
	onEvent: OnEventCallback;
};
export default class WindowEventObserver {
	private unbindFns: UnbindFn[] = [];
	private onEvent: OnEventCallback;

	constructor(opts: WindowEventObserverOptions) {
		this.onEvent = opts.onEvent;
	}

	private bindEvent(type: ObservedWindowEvent) {
		const unbindCallback = bind(window, {
			type,
			listener: (event: Event) => {
				if (!event.isTrusted) {
					return;
				}
				this.onEvent({
					time: event.timeStamp,
					type,
					event,
				});
			},
			options: {
				passive: true,
				once: true,
			},
		});
		this.unbindFns.push(unbindCallback);
	}

	/**
	 * Binds a scroll listener on `document` using the capture phase.
	 * The `scroll` event does not bubble, so listening on `window` only catches
	 * document-level scrolls. By using `{ capture: true }` on `document`, we can
	 * detect scroll events from any element in the DOM tree, including inner
	 * scrollable containers (e.g. when the user drags a scrollbar).
	 */
	private bindCaptureScrollEvent() {
		const unbindCallback = bind(document, {
			type: 'scroll',
			listener: (event: Event) => {
				if (!event.isTrusted) {
					return;
				}
				this.onEvent({
					time: event.timeStamp,
					type: 'scroll-container',
					event,
				});
			},
			options: {
				capture: true,
				passive: true,
				once: true,
			},
		});
		this.unbindFns.push(unbindCallback);
	}

	start(): void {
		this.bindEvent('wheel');
		this.bindEvent('scroll');
		this.bindEvent('keydown');
		this.bindEvent('resize');
		this.bindCaptureScrollEvent();
	}

	stop(): void {
		this.unbindFns.forEach((cb) => {
			cb();
		});
		this.unbindFns = [];
	}
}
