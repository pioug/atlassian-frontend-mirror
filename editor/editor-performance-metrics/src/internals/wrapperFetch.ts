import type { TimelineHoldable } from './timelineInterfaces';

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * Wraps the global fetch function to integrate with a TimelineHoldable instance.
 * This wrapper allows tracking of fetch calls within the timeline.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.globalContext - The global context containing the fetch function.
 * @param {typeof fetch} options.globalContext.fetch - The original fetch function.
 * @param {TimelineHoldable} options.timelineHoldable - The TimelineHoldable instance to integrate with.
 * @returns {Function} A cleanup function that restores the original fetch implementation.
 */
export const wrapperFetch = ({
	globalContext,
	timelineHoldable,
}: {
	globalContext: { fetch: typeof fetch };
	timelineHoldable: TimelineHoldable;
}) => {
	const originalFetch = globalContext.fetch;

	const fetchProxy = new Proxy(globalContext.fetch, {
		apply(target, thisArg, args: Parameters<typeof fetch>) {
			const unhold = timelineHoldable.hold({
				source: 'fetch',
			});

			try {
				const promise = target.apply(thisArg, args);

				return promise.finally(() => {
					unhold();
				});
			} catch (e) {
				unhold();
				throw e;
			}
		},
	});

	globalContext.fetch = fetchProxy as typeof fetch;

	return function cleanup(): void {
		globalContext.fetch = originalFetch;
	};
};
