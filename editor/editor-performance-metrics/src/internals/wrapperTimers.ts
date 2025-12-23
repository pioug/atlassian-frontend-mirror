import type { TimelineHoldable } from './timelineInterfaces';

const MAX_TIMEOUT_DELAY_ALLOWED_TO_BE_WRAPPED = 2000; // 2 seconds
const MAX_NESTED_TIMERS_ALLOWED_TO_BE_WRAPPED = 1;

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
 *   timeouts with delays up to 2000ms (2 seconds). Timeouts with larger delays are not wrapped. The `maxTimeoutAllowed` allows you to override the default timeout.
 * - Zero-delay timeouts (used for deferring to the next event loop) are also not wrapped.
 *
 * @param {object} options - Configuration options for the wrapper.
 * @param {object} options.globalContext - The global context containing setTimeout and clearTimeout functions.
 *                                         This is typically the global `window` object in browser environments.
 * @param {object} options.maxTimeoutAllowed - Override the default timeout delay allowed (useful for testing enviroments);
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
	maxTimeoutAllowed,
	maxNestedTimers,
}: {
	globalContext: unknown & { clearTimeout: typeof clearTimeout; setTimeout: typeof setTimeout };
	maxNestedTimers?: number;
	maxTimeoutAllowed?: number;
	timelineHoldable: TimelineHoldable;
}) => {
	const timeoutsUnholdMap = new Map<NodeJS.Timeout | number, WeakRef<() => void>>();
	const timeoutAllowed =
		typeof maxTimeoutAllowed === 'number'
			? maxTimeoutAllowed
			: MAX_TIMEOUT_DELAY_ALLOWED_TO_BE_WRAPPED;

	const nestedTimersAllowed =
		typeof maxNestedTimers === 'number' ? maxNestedTimers : MAX_NESTED_TIMERS_ALLOWED_TO_BE_WRAPPED;

	const originalSetTimeout = globalContext.setTimeout;
	const originalClearTimeout = globalContext.clearTimeout;

	/**
	 * This counter is used to prevent recursive wrapping of setTimeout calls.
	 *
	 * Due to JavaScript's lexical scoping, this variable will be shared across
	 * all invocations of the setTimeoutProxy within the same wrapperTimers call.
	 * This allows us to track whether we're currently inside a wrapped callback
	 * and how deeep.
	 *
	 * This prevents excessive hold/unhold calls and potential issues with
	 * nested timeouts, while still allowing the outer timeout to be tracked.
	 *
	 */
	let nestedCallsTimerCount = 0;

	const setTimeoutProxy = new Proxy(globalContext.setTimeout, {
		apply(
			target,
			thisArg,
			args: [callback: (...args: unknown[]) => void, ms?: number | undefined],
		) {
			const delayTime = args.length > 1 && typeof args[1] === 'number' ? args[1] : null;
			const isValidDelayTime =
				typeof delayTime !== 'number' || delayTime === 0 || delayTime > timeoutAllowed;

			if (isValidDelayTime || nestedCallsTimerCount >= nestedTimersAllowed) {
				return target.apply(thisArg, args);
			}

			const localNestedCounter = nestedCallsTimerCount;

			const unhold = timelineHoldable.hold({
				source: 'setTimeout',
			});

			let timerId: NodeJS.Timeout | null = null;

			const callbackProxy = new Proxy(args[0], {
				apply(callbackTarget, cbThisArg, cbArgs) {
					nestedCallsTimerCount = localNestedCounter + 1;
					try {
						const result = callbackTarget.apply(cbThisArg, cbArgs);

						return result;
					} finally {
						unhold();
						if (timerId !== null) {
							timeoutsUnholdMap.delete(timerId);
						}
					}
				},
			});

			timerId = target.apply(thisArg, [
				callbackProxy,
				// Mistach between the NodeJS type and the Browser implementation
				// @ts-expect-error
				...args.slice(1),
			]);

			timeoutsUnholdMap.set(timerId, new WeakRef(unhold));
			return timerId;
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

	return function cleanup(): void {
		globalContext.setTimeout = originalSetTimeout;
		globalContext.clearTimeout = originalClearTimeout;
	};
};
