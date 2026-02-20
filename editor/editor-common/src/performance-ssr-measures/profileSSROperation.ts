import { isSSR } from '../core-utils/is-ssr';

const profileSSROperationImpl = <T>(
	segmentName: string,
	fn: () => T,
	onSSRMeasure?: (measure: {
		endTimestamp: number;
		segmentName: string;
		startTimestamp: number;
	}) => void,
): T => {
	if (!onSSRMeasure) {
		return fn();
	}

	const startTimestamp = performance.now();
	try {
		return fn();
	} finally {
		onSSRMeasure({
			segmentName,
			startTimestamp,
			endTimestamp: performance.now(),
		});
	}
};

const profileSSROperationNoOp = <T>(
	_segmentName: string,
	fn: () => T,
	_onSSRMeasure?: (measure: {
		endTimestamp: number;
		segmentName: string;
		startTimestamp: number;
	}) => void,
): T => {
	return fn();
};

/**
 * Profiles a synchronous operation during Server-Side Rendering (SSR).
 *
 * This function wraps an operation to measure its execution time in SSR mode.
 * On client builds, the profiling is optimized away and the function executes normally.
 * On SSR builds, it captures timing data using `performance.now()` and reports it via the callback.
 *
 * **Important notes:**
 * - Profiling only occurs in SSR mode when `onSSRMeasure` is provided
 * - Both `startTimestamp` and `endTimestamp` are absolute values from `performance.now()`, not relative times
 * - Calculate duration as: `endTimestamp - startTimestamp`
 * - The measurement is guaranteed to be reported even if the function throws an error (via `finally` block)
 * - On client builds, this function has zero performance overhead
 *
 * @param segmentName - Identifier for the operation being measured (e.g., 'ssr-app/render/editor/createSchema')
 * @param fn - The synchronous function to execute and profile
 * @param onSSRMeasure - Optional callback to receive performance measurements
 * @param onSSRMeasure.segmentName - Name of the measured segment
 * @param onSSRMeasure.startTimestamp - Absolute timestamp when the operation started (from `performance.now()`)
 * @param onSSRMeasure.endTimestamp - Absolute timestamp when the operation completed (from `performance.now()`)
 *
 * @returns The result of the executed function
 *
 * @example
 * // Profile schema creation during SSR
 * const schema = profileSSROperation(
 *   'ssr-app/render/editor/createSchema',
 *   () => createSchema(config),
 *   (measure) => {
 *     const duration = measure.endTimestamp - measure.startTimestamp;
 *     console.log(`${measure.segmentName}: ${duration}ms`);
 *   }
 * );
 *
 * @example
 * // Without callback, executes normally
 * const result = profileSSROperation('operation', () => expensiveCalculation());
 */
export const profileSSROperation = isSSR() ? profileSSROperationImpl : profileSSROperationNoOp;
