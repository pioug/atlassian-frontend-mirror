import { fg } from '@atlaskit/platform-feature-flags';

interface RuntimeSelfMeasurement {
	__internalState: {
		/**
		 * Stack to maintain whether there is already an existing timing that has started
		 * This is so we don't "double-count" the timing of functions, e.g.
		 *
		 * const foo = withProfiling(function foo() {
		 *   // do some work...
		 * })
		 * const bar = withProfiling(function bar() {
		 *   foo();
		 *   // do some more additional work...
		 * });
		 *
		 * Here since bar invokes foo, and bar already has profiling, then we don't need to profile foo.
		 * However, if foo is invoked somewhere else by a function that doesn't have profiling,
		 * then we should profile foo's timings
		 */
		functionStack: string[];
	};
	runtime: {
		total: number;
		async: number;
		error: number;
		byFunction: Record<string, number>;
		custom: Record<string, number>;
	};
}
declare global {
	var __ufo_self_measurements: RuntimeSelfMeasurement;
}

globalThis.__ufo_self_measurements = globalThis.__ufo_self_measurements || {
	__internalState: {
		functionStack: [],
	},
	runtime: {
		total: 0,
		async: 0,
		error: 0,
		byFunction: {},
		custom: {},
	},
};

export function resetProfilerMeasurements() {
	globalThis.__ufo_self_measurements = {
		__internalState: {
			functionStack: [],
		},
		runtime: {
			total: 0,
			async: 0,
			error: 0,
			byFunction: {},
			custom: {},
		},
	};
}

function trackFunctionTimingStart(fnName: string) {
	if (!globalThis?.__ufo_self_measurements) {
		resetProfilerMeasurements();
	}

	globalThis?.__ufo_self_measurements?.__internalState?.functionStack?.push(fnName);
}

function trackFunctionTimingEnd() {
	if (!globalThis?.__ufo_self_measurements) {
		resetProfilerMeasurements();
	}

	globalThis?.__ufo_self_measurements?.__internalState?.functionStack?.pop();
}

function shouldRecordProfilerMeasurement() {
	if (!globalThis?.__ufo_self_measurements) {
		resetProfilerMeasurements();
	}

	return globalThis?.__ufo_self_measurements?.__internalState?.functionStack?.length === 0;
}

function recordProfilerMeasurement(
	functionName: string,
	duration: number,
	isAsync?: boolean,
	isError?: boolean,
	tags: string[] = [],
) {
	// discard measurements that are not significant
	if (duration <= 0) {
		return;
	}

	if (!globalThis?.__ufo_self_measurements) {
		resetProfilerMeasurements();
	}

	globalThis.__ufo_self_measurements.runtime.total += duration;

	if (isAsync) {
		globalThis.__ufo_self_measurements.runtime.async += duration;
	}

	if (isError) {
		globalThis.__ufo_self_measurements.runtime.error += duration;
	}

	if (functionName in globalThis.__ufo_self_measurements.runtime.byFunction) {
		globalThis.__ufo_self_measurements.runtime.byFunction[functionName] += duration;
	} else {
		globalThis.__ufo_self_measurements.runtime.byFunction[functionName] = duration;
	}

	for (const tag of tags) {
		if (tag in globalThis.__ufo_self_measurements.runtime.custom) {
			globalThis.__ufo_self_measurements.runtime.custom[tag] += duration;
		} else {
			globalThis.__ufo_self_measurements.runtime.custom[tag] = duration;
		}
	}
}

type AsyncFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;
type SyncFunction<T, Args extends any[]> = (...args: Args) => T;

function isPromise<T>(value: any): value is Promise<T> {
	return value && typeof value.then === 'function';
}

export function withProfiling<ReturnType, Args extends any[]>(
	fn: AsyncFunction<ReturnType, Args>,
	tags?: string[],
): (...args: Args) => Promise<ReturnType>;
export function withProfiling<ReturnType, Args extends any[]>(
	fn: SyncFunction<ReturnType, Args>,
	tags?: string[],
): (...args: Args) => ReturnType;

export function withProfiling<ReturnType, Args extends any[]>(
	fn: SyncFunction<ReturnType, Args> | AsyncFunction<ReturnType, Args>,
	tags: string[] = [],
) {
	try {
		if (!fg('platform_ufo_self_timings')) {
			return fn; // this is a NOOP wrapper if feature gate is disabled
		}
	} catch {
		return fn;
	}

	if (!globalThis?.performance) {
		return fn;
	}

	if (fn.constructor.name === 'AsyncFunction') {
		return async function (...args: Args): Promise<ReturnType> {
			const startTime = performance.now();
			trackFunctionTimingStart(fn.name ?? 'anonymous');
			try {
				const result = await fn(...args);
				const endTime = performance.now();
				trackFunctionTimingEnd();
				if (shouldRecordProfilerMeasurement()) {
					recordProfilerMeasurement(fn.name, endTime - startTime, true, false, tags);
				}
				return result;
			} catch (error: unknown) {
				const endTime = performance.now();
				trackFunctionTimingEnd();
				if (shouldRecordProfilerMeasurement()) {
					recordProfilerMeasurement(fn.name, endTime - startTime, true, true, tags);
				}
				throw error;
			}
		};
	}

	return function (...args: Args): ReturnType | Promise<ReturnType> {
		const startTime = performance.now();
		trackFunctionTimingStart(fn.name ?? 'anonymous');
		try {
			const result = fn(...args);

			if (isPromise(result)) {
				result
					.then((value) => {
						const endTime = performance.now();
						trackFunctionTimingEnd();
						if (shouldRecordProfilerMeasurement()) {
							recordProfilerMeasurement(fn.name, endTime - startTime, true, false, tags);
						}
						return value;
					})
					.catch((value) => {
						const endTime = performance.now();
						trackFunctionTimingEnd();
						if (shouldRecordProfilerMeasurement()) {
							recordProfilerMeasurement(fn.name, endTime - startTime, true, true, tags);
						}
						return value;
					});
			} else {
				const endTime = performance.now();
				trackFunctionTimingEnd();
				if (shouldRecordProfilerMeasurement()) {
					recordProfilerMeasurement(fn.name, endTime - startTime, false, false, tags);
				}
			}

			return result;
		} catch (error: unknown) {
			const endTime = performance.now();
			trackFunctionTimingEnd();
			if (shouldRecordProfilerMeasurement()) {
				recordProfilerMeasurement(fn.name, endTime - startTime, false, true, tags);
			}
			throw error;
		}
	};
}

export function markProfilingStart(name: string) {
	if (!globalThis?.performance) {
		return {
			name,
			startTime: -1,
		};
	}

	trackFunctionTimingStart(name);

	return {
		name,
		startTime: performance.now(),
	};
}

export function markProfilingEnd(
	{ name, startTime }: ReturnType<typeof markProfilingStart>,
	{ isAsync, isError, tags }: { isAsync?: boolean; isError?: boolean; tags?: string[] } = {},
) {
	if (!globalThis?.performance) {
		return;
	}

	trackFunctionTimingEnd();

	if (!fg('platform_ufo_self_timings')) {
		return;
	}

	const endTime = performance.now();

	recordProfilerMeasurement(name, endTime - startTime, isAsync, isError, tags);
}

export function getProfilerData() {
	return { ...globalThis?.__ufo_self_measurements.runtime };
}

export function getProfilerTotalRuntime() {
	if (typeof globalThis?.__ufo_self_measurements.runtime.total === 'number') {
		return Math.round(globalThis?.__ufo_self_measurements.runtime.total);
	}

	return null;
}

export function getProfilerAsyncRuntime() {
	if (typeof globalThis?.__ufo_self_measurements.runtime.async === 'number') {
		return Math.round(globalThis?.__ufo_self_measurements.runtime.async);
	}

	return null;
}

export function getProfilerRuntimeByFunction(functionName: string) {
	if (typeof globalThis?.__ufo_self_measurements.runtime.byFunction[functionName] === 'number') {
		return Math.round(globalThis?.__ufo_self_measurements.runtime.byFunction[functionName]);
	}

	return null;
}

export function getProfilerRuntimeByTag(tag: string) {
	if (typeof globalThis?.__ufo_self_measurements.runtime.custom[tag] === 'number') {
		return Math.round(globalThis?.__ufo_self_measurements.runtime.custom[tag]);
	}

	return null;
}
