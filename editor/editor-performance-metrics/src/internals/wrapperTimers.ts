import type { TimelineHoldable } from './timelineInterfaces';

const wrapperCallbackTimer = ({
	callbackFunction,
	onFinished,
}: {
	callbackFunction: (...args: unknown[]) => unknown;
	onFinished: () => void;
}) => {
	const callbackProxy = new Proxy(callbackFunction, {
		apply(callbackTarget, cbThisArg, cbArgs) {
			const result = callbackTarget.apply(cbThisArg, cbArgs);
			onFinished();

			return result;
		},
	});

	return callbackProxy;
};

const MAX_TIMEOUT_DELAY_ALLOWED_TO_BE_WRAPPED = 2000; // 2 seconds

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Wraps the global setTimeout and clearTimeout functions to integrate with a TimelineHoldable instance.
 * This wrapper allows tracking of timer operations within the timeline, providing insights into
 * asynchronous operations that might affect the application's idle state.
 *
 * Key Features:
 * - Integrates setTimeout calls with the TimelineHoldable's hold mechanism.
 * - Automatically releases holds when the timer callback is executed or cleared.
 * - Preserves the original behavior of setTimeout and clearTimeout for non-tracked cases.
 *
 * ⚠️ Important Notes:
 * - To prevent excessive holds and potential performance issues, this wrapper only monitors
 *   timeouts with delays up to 2000ms (2 seconds). Timeouts with larger delays are not wrapped.
 * - Zero-delay timeouts (used for deferring to the next event loop) are also not wrapped.
 *
 * @param {Object} options - Configuration options for the wrapper.
 * @param {Object} options.globalContext - The global context containing setTimeout and clearTimeout functions.
 *                                         This is typically the global `window` object in browser environments.
 * @param {typeof setTimeout} options.globalContext.setTimeout - The original setTimeout function to be wrapped.
 * @param {typeof clearTimeout} options.globalContext.clearTimeout - The original clearTimeout function to be wrapped.
 * @param {TimelineHoldable} options.timelineHoldable - An instance implementing the TimelineHoldable interface.
 *                                                      This is used to create and release holds for each tracked timeout.
 *
 * @returns {Function} A cleanup function that, when called, restores the original setTimeout and clearTimeout
 *                     implementations. This should be called when the wrapper is no longer needed to prevent
 *                     memory leaks and ensure proper functionality of the global timer functions.
 *
 * @example
 * const cleanup = wrapperTimers({
 *   globalContext: window,
 *   timelineHoldable: myTimelineInstance
 * });
 *
 * // Later, when the wrapper is no longer needed:
 * cleanup();
 */
export const wrapperTimers = ({
	globalContext,
	timelineHoldable,
}: {
	globalContext: unknown & { setTimeout: typeof setTimeout; clearTimeout: typeof clearTimeout };
	timelineHoldable: TimelineHoldable;
}) => {
	const timeoutsUnholdMap = new Map<NodeJS.Timeout | number, WeakRef<() => void>>();

	const originalSetTimeout = globalContext.setTimeout;
	const originalClearTimeout = globalContext.clearTimeout;

	const setTimeoutProxy = new Proxy(globalContext.setTimeout, {
		apply(target, thisArg, args: [callback: (args: unknown) => void, ms?: number | undefined]) {
			const delayTime = args.length > 1 && typeof args[1] === 'number' ? args[1] : null;
			if (
				typeof delayTime !== 'number' ||
				delayTime === 0 ||
				delayTime > MAX_TIMEOUT_DELAY_ALLOWED_TO_BE_WRAPPED
			) {
				return target.apply(thisArg, args);
			}

			const unhold = timelineHoldable.hold({
				source: 'setTimeout',
			});

			const callbackProxy = wrapperCallbackTimer({
				callbackFunction: args[0],
				onFinished: unhold,
			});

			const id = target.apply(thisArg, [
				callbackProxy,
				// Mistach between the NodeJS type and the Browser implementation
				// @ts-expect-error
				...args.slice(1),
			]);

			timeoutsUnholdMap.set(id, new WeakRef(unhold));
			return id;
		},
	});

	const clearTimeoutProxy = new Proxy(globalContext.clearTimeout, {
		apply(target, thisArg, args: [id: NodeJS.Timeout | string | number | undefined]) {
			const tm = args[0];
			if (typeof tm !== 'number') {
				return target.apply(thisArg, args);
			}

			const unholdRef = timeoutsUnholdMap.get(tm);
			if (unholdRef) {
				const unhold = unholdRef.deref();

				if (unhold) {
					unhold();
				}

				timeoutsUnholdMap.delete(tm);
			}

			return target.apply(thisArg, args);
		},
	});

	globalContext.setTimeout = setTimeoutProxy;
	globalContext.clearTimeout = clearTimeoutProxy;

	return function cleanup() {
		globalContext.setTimeout = originalSetTimeout;
		globalContext.clearTimeout = originalClearTimeout;
	};
};
