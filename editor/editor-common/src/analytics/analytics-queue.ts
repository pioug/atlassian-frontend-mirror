import memoizeOne from 'memoize-one';

type Deadline = {
	didTimeout: boolean;
	timeRemaining: () => number;
};

export class AnalyticsQueue {
	private readonly tasks: Function[] = [];
	private running = false;

	public static get = memoizeOne(() => new AnalyticsQueue());

	private constructor() {}

	private request(fn: (deadline: Deadline) => void): void {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((window as any).requestIdleCallback) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).requestIdleCallback(fn);
		} else {
			const start = performance.now();
			setTimeout(() => {
				fn({
					didTimeout: false,
					timeRemaining: () => Math.max(0, 50 - (performance.now() - start)),
				});
			}, 0);
		}
	}

	private pending() {
		// Defensive coding as navigator.scheduling.isInputPending is an experimental API
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (typeof (window.navigator as any)?.scheduling?.isInputPending === 'function') {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (window.navigator as any)?.scheduling?.isInputPending() === true;
		}

		return false;
	}

	private process() {
		if (this.running) {
			return;
		}

		this.running = true;

		this.request((deadline) => {
			while (deadline.timeRemaining() > 0 && this.tasks.length > 0 && !this.pending()) {
				const task = this.tasks.shift();
				if (task) {
					task();
				}
			}

			this.running = false;

			if (this.tasks.length > 0) {
				this.process();
			}
		});
	}

	public schedule(task: Function) {
		this.tasks.push(task);
		this.process();
	}
}
