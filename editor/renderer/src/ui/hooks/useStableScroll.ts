import { useRef, useCallback } from 'react';

export interface UseStableScrollOptions {
	/**
	 * Maximum time (in ms) to wait for stability before scrolling anyway
	 * @default 10000
	 */
	maxStabilityWaitTime?: number;
	/**
	 * Time to wait (in ms) after the last resize event before considering the layout stable
	 * @default 200
	 */
	stabilityWaitTime?: number;
}

export interface UseStableScrollReturn {
	/**
	 * Cleans up all timers and observers
	 */
	cleanup: () => void;
	/**
	 * Starts monitoring the container for stability and calls the callback when stable
	 */
	waitForStability: (container: HTMLElement, onStable: () => void) => void;
}

/**
 * Hook that provides functionality to wait for layout stability before performing an action.
 * Uses ResizeObserver to detect when a container has stopped resizing (e.g., images finished loading).
 */
export const useStableScroll = (options: UseStableScrollOptions = {}): UseStableScrollReturn => {
	const { stabilityWaitTime = 200, maxStabilityWaitTime = 10_000 } = options;

	const stabilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);
	const lastStableTimeRef = useRef<number>(0);
	const onStableCallbackRef = useRef<(() => void) | null>(null);

	const cleanup = useCallback(() => {
		if (stabilityTimeoutRef.current) {
			clearTimeout(stabilityTimeoutRef.current);
			stabilityTimeoutRef.current = null;
		}
		if (resizeObserverRef.current) {
			resizeObserverRef.current.disconnect();
			resizeObserverRef.current = null;
		}
		onStableCallbackRef.current = null;
		lastStableTimeRef.current = 0;
	}, []);

	const scheduleStabilityCheck = useCallback(() => {
		// Clear any existing stability timeout.
		if (stabilityTimeoutRef.current) {
			clearTimeout(stabilityTimeoutRef.current);
			stabilityTimeoutRef.current = null;
		}

		// Check if we've exceeded the maximum stability wait time.
		const now = Date.now();
		if (lastStableTimeRef.current === 0) {
			lastStableTimeRef.current = now;
		} else if (now - lastStableTimeRef.current > maxStabilityWaitTime) {
			// We've waited too long for stability, call the callback now.
			if (onStableCallbackRef.current) {
				onStableCallbackRef.current();
				cleanup();
			}
			return;
		}

		// Set a timeout to call the callback after the stability wait time.
		stabilityTimeoutRef.current = setTimeout(() => {
			if (onStableCallbackRef.current) {
				onStableCallbackRef.current();
				cleanup();
			}
		}, stabilityWaitTime);
	}, [stabilityWaitTime, maxStabilityWaitTime, cleanup]);

	const waitForStability = useCallback(
		(container: HTMLElement, onStable: () => void) => {
			// Clean up any existing observer
			cleanup();

			// Store the callback
			onStableCallbackRef.current = onStable;

			// Check if ResizeObserver is available
			if (typeof ResizeObserver === 'undefined') {
				// Fallback: just call the callback after the stability wait time
				stabilityTimeoutRef.current = setTimeout(() => {
					if (onStableCallbackRef.current) {
						onStableCallbackRef.current();
						cleanup();
					}
				}, stabilityWaitTime);
				return;
			}

			// Create a ResizeObserver to monitor the container for size changes.
			resizeObserverRef.current = new ResizeObserver(() => {
				// Container size changed, reset stability timer.
				scheduleStabilityCheck();
			});

			resizeObserverRef.current.observe(container);

			// Start the initial stability check
			scheduleStabilityCheck();
		},
		[stabilityWaitTime, scheduleStabilityCheck, cleanup],
	);

	return {
		waitForStability,
		cleanup,
	};
};
