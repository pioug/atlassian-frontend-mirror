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

// See https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API
export const taskYield = async () => {
	// This is using globalThis to allow the yield task to be used outside of a browser env
	if (
		'scheduler' in globalThis &&
		// @ts-ignore
		'yield' in globalThis.scheduler
	) {
		// @ts-ignore
		await scheduler.yield();

		return;
	}
	let resolve = () => {};
	const p = new Promise<void>((a) => {
		resolve = a;
	});

	if ('requestIdleCallback' in globalThis || 'requestAnimationFrame' in globalThis) {
		const later = globalThis.requestIdleCallback || globalThis.requestAnimationFrame;
		later(() => {
			resolve();
		});
	} else {
		setTimeout(resolve, 0);
	}

	await p;
};

const defaultOptions = {
	delay: 60,
};
export const backgroundTask = <T>(
	originalTask: BackgroundTask<T>,
	givenOptions?: {
		delay: number;
	},
): AbortableTask<T> => {
	const options = Object.assign(defaultOptions, givenOptions || {});
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
				delay: options.delay,
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
