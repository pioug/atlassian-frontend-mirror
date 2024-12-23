/* eslint-disable compat/compat */

export const TaskAborted = Symbol('BackgroundTaskAborted');
export type TaskAbortedSymbol = typeof TaskAborted;
type BackgroundTask<T> = (maybeYield: () => Promise<void>) => void | Promise<T | TaskAbortedSymbol>;

// See https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/
type Scheduler = {
	postTask: (
		cb: () => void,
		options: {
			priority: 'background';
			delay: number;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			signal: any;
		},
	) => Promise<void>;
};

export type AbortableTask<T> = {
	abort: () => void;
	result: Promise<T | TaskAbortedSymbol>;
};

export const isTaskAborted = (
	maybeTaskAbortedResult: unknown,
): maybeTaskAbortedResult is TaskAbortedSymbol => {
	return maybeTaskAbortedResult === TaskAborted;
};
const taskYield = async () => {
	if (
		'scheduler' in window &&
		// @ts-ignore
		'yield' in window.scheduler
	) {
		// @ts-ignore
		await scheduler.yield();

		return;
	}
	let resolve = () => {};
	const p = new Promise<void>((a) => {
		resolve = a;
	});

	const later = window.requestIdleCallback || window.requestAnimationFrame;

	later(() => {
		resolve();
	});

	await p;
};

export const backgroundTask = <T>(originalTask: BackgroundTask<T>): AbortableTask<T> => {
	const taskRef = new WeakRef(originalTask);
	let resolvePromiseResultTask = (arg: T | TaskAbortedSymbol) => {};
	let rejectPromiseResultTask = (e: unknown) => {};
	const promiseResult = new Promise<T | TaskAbortedSymbol>((resolve, reject) => {
		resolvePromiseResultTask = resolve;
		rejectPromiseResultTask = reject;
	});

	const executeTask = async () => {
		const ref = taskRef.deref();
		if (!ref) {
			return;
		}

		try {
			const result = await ref(taskYield);
			resolvePromiseResultTask(
				// @ts-expect-error
				result,
			);
		} catch (e) {
			rejectPromiseResultTask(e);
		}
	};

	if ('scheduler' in window) {
		const controller = new AbortController();
		(window.scheduler as unknown as Scheduler)
			.postTask(executeTask, {
				priority: 'background',
				delay: 60,
				signal: controller.signal,
			})
			.catch((e) => {
				if (e !== 'stop-requested') {
					throw e;
				}
			});

		return {
			abort: () => {
				controller.abort('stop-requested');
				resolvePromiseResultTask(TaskAborted);
			},
			result: promiseResult,
		};
	}

	if (window.requestIdleCallback) {
		const idleId = window.requestIdleCallback(executeTask, { timeout: 10000 });

		return {
			abort: () => {
				cancelIdleCallback(idleId);
				resolvePromiseResultTask(TaskAborted);
			},
			result: promiseResult,
		};
	}

	const rafId = window.requestAnimationFrame(executeTask);

	return {
		abort: () => {
			cancelAnimationFrame(rafId);
			resolvePromiseResultTask(TaskAborted);
		},
		result: promiseResult,
	};
};
