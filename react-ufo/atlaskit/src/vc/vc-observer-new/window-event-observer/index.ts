import { bind, type UnbindFn } from 'bind-event-listener';

export type ObservedWindowEvent = 'wheel' | 'scroll' | 'keydown' | 'resize';

export type OnEventCallback = (args: {
	time: DOMHighResTimeStamp;
	type: ObservedWindowEvent;
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

	start(): void {
		this.bindEvent('wheel');
		this.bindEvent('scroll');
		this.bindEvent('keydown');
		this.bindEvent('resize');
	}

	stop(): void {
		this.unbindFns.forEach((cb) => {
			cb();
		});
		this.unbindFns = [];
	}
}
