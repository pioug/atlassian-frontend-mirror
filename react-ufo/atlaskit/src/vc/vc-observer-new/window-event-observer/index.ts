import { bind, type UnbindFn } from 'bind-event-listener';

import { markProfilingEnd, markProfilingStart, withProfiling } from '../../../self-measurements';

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
		const operationTimer = markProfilingStart('WindowEventObserver constructor');
		this.onEvent = withProfiling(opts.onEvent, ['vc']);
		this.bindEvent = withProfiling(this.bindEvent.bind(this), ['vc']);
		this.start = withProfiling(this.start.bind(this), ['vc']);
		this.stop = withProfiling(this.stop.bind(this), ['vc']);
		markProfilingEnd(operationTimer);
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

	start() {
		this.bindEvent('wheel');
		this.bindEvent('scroll');
		this.bindEvent('keydown');
		this.bindEvent('resize');
	}

	stop() {
		this.unbindFns.forEach((cb) => {
			cb();
		});
		this.unbindFns = [];
	}
}
