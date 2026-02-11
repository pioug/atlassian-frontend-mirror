import { bind } from 'bind-event-listener';

import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionType } from '../common';
import type { PageVisibility } from '../common/react-ufo-payload-schema';

export type HiddenTimingItem = {
	time: number;
	hidden: boolean;
};

const timings: Array<HiddenTimingItem> = [];
let wasHiddenFlag: boolean;
let setupFlag = false;

// Threshold for determining if page was opened in background.
// If setup runs within this time and page is hidden, we assume it was opened in a background tab.
const OPENED_IN_BACKGROUND_THRESHOLD_MS = 100;
let openedInBackground: boolean | null = null;

function isPageHidden() {
	if ('visibilityState' in document) {
		return document.visibilityState === 'hidden';
	} else {
		// @ts-expect-error - Property 'hidden' does not exist on type 'never'.
		return document.hidden;
	}
}

const SIZE = 50;
let insertIndex = 0;

export function getEarliestHiddenTiming(
	startTime: DOMHighResTimeStamp,
	endTime: DOMHighResTimeStamp,
): number | undefined {
	const earliestHiddenTiming = timings.find(
		({ hidden, time }) => hidden && time > 0 && time >= startTime && time <= endTime,
	)?.time;
	if (typeof earliestHiddenTiming === 'number') {
		return Math.round(earliestHiddenTiming - startTime);
	}
}

export function isOpenedInBackground(interactionType: InteractionType): boolean {
	if (interactionType !== 'page_load') {
		return false;
	}

	// Check native visibility-state entries first (most reliable, Chromium only)
	try {
		const entries = performance.getEntriesByType('visibility-state');
		if (entries.length > 0) {
			return entries.some((entry) => entry.name === 'hidden' && entry.startTime <= OPENED_IN_BACKGROUND_THRESHOLD_MS);
		}
	} catch {
		// visibility-state not supported (Firefox/Safari)
	}

	// Fallback to cached value from setup (determined using time threshold)
	return openedInBackground === true;
}

function pushHidden(isPageHiddenFlag: boolean, time?: number) {
	timings[insertIndex] = {
		time: time ?? performance.now(),
		hidden: isPageHiddenFlag,
	};
	insertIndex = (insertIndex + 1) % SIZE;
	wasHiddenFlag = isPageHiddenFlag;
}

function handleChange() {
	const isPageHiddenFlag = isPageHidden();
	if (isPageHiddenFlag) {
		if (!wasHiddenFlag) {
			pushHidden(isPageHiddenFlag);
		}
		wasHiddenFlag = true;
	} else {
		if (wasHiddenFlag) {
			pushHidden(isPageHiddenFlag);
		}
		wasHiddenFlag = false;
	}
}

let hasHiddenTimingBeforeSetup = false;

export function getHasHiddenTimingBeforeSetup(): boolean {
	return hasHiddenTimingBeforeSetup;
}

function setup() {
	try {
		const results = performance.getEntriesByType('visibility-state');

		results?.forEach((result) => {
			if (fg('platform_ufo_use_native_page_visibility_api')) {
				pushHidden(result.name === 'hidden', result.startTime);
			}

			if (result.name === 'hidden') {
				hasHiddenTimingBeforeSetup = true;
			}
		});
	} catch {
		/* do nothing */
		/* note: visibility-state entry types are not available in Firefox/Safari: https://developer.mozilla.org/en-US/docs/Web/API/VisibilityStateEntry#browser_compatibility */
	}

	bind(window, {
		type: 'pageshow',
		listener: handleChange,
	});

	bind(window, {
		type: 'pagehide',
		listener: handleChange,
	});

	bind(document, {
		type: 'visibilitychange',
		listener: handleChange,
	});
}

export function setupHiddenTimingCapture(): void {
	if (!setupFlag) {
		const isPageHiddenFlag = isPageHidden();
		const setupTime = performance.now();

		// Determine if page was opened in background.
		// If we're early in page lifecycle (< threshold) and page is hidden,
		// it's likely the page was opened in a background tab.
		if (openedInBackground === null) {
			openedInBackground = isPageHiddenFlag && setupTime < OPENED_IN_BACKGROUND_THRESHOLD_MS;
		}

		pushHidden(isPageHiddenFlag, 0);
		setup();
		setupFlag = true;
	}
}

export function getPageVisibilityState(start: number, end: number): PageVisibility {
	// Input validation - return default for invalid inputs
	if (!Number.isFinite(start) || !Number.isFinite(end)) {
		return 'visible';
	}

	// Desirable default value is visible
	if (timings.length === 0) {
		return 'visible';
	}

	const currentSize = timings.length;
	let hiddenState: PageVisibility = 'mixed';

	let startIdx = insertIndex;
	let endIdx = insertIndex;

	// currentSize is capped at SIZE.
	for (let i = 0; i < currentSize; i++) {
		const tmpIdx = (insertIndex + i) % currentSize;
		// Add bounds checking before accessing array element
		if (timings[tmpIdx] && timings[tmpIdx].time <= end) {
			endIdx = tmpIdx;
			if (timings[tmpIdx].time <= start) {
				startIdx = tmpIdx;
			}
		}
	}

	// Add bounds checking before accessing timings array
	if (endIdx - startIdx === 0 && timings[startIdx]) {
		hiddenState = timings[startIdx].hidden ? 'hidden' : 'visible';
	}
	return hiddenState;
}

// Throttle detection configuration
// Expected interval for timer checks (in milliseconds)
const THROTTLE_CHECK_INTERVAL_MS = 1000;
// Threshold for considering a timer as throttled (50% drift tolerance)
const THROTTLE_DRIFT_THRESHOLD = 1.5;
// Maximum number of throttle measurements to store (circular buffer)
const THROTTLE_BUFFER_SIZE = 120;

export type ThrottleMeasurement = {
	// Timestamp when this measurement was taken
	time: number;
	// Expected elapsed time since last check
	expectedElapsed: number;
	// Actual elapsed time since last check
	actualElapsed: number;
	// Whether this measurement indicates throttling
	isThrottled: boolean;
};

// Circular buffer to store throttle measurements
const throttleMeasurements: ThrottleMeasurement[] = [];
let throttleInsertIndex = 0;
let throttleIntervalId: ReturnType<typeof setInterval> | null = null;
let lastThrottleCheckTime: number | null = null;
let throttleSetupDone = false;

function recordThrottleMeasurement(expectedElapsed: number, actualElapsed: number): void {
	const isThrottled = actualElapsed > expectedElapsed * THROTTLE_DRIFT_THRESHOLD;

	throttleMeasurements[throttleInsertIndex] = {
		time: performance.now(),
		expectedElapsed,
		actualElapsed,
		isThrottled,
	};
	throttleInsertIndex = (throttleInsertIndex + 1) % THROTTLE_BUFFER_SIZE;
}

function throttleCheckCallback(): void {
	const currentTime = performance.now();
	if (lastThrottleCheckTime !== null) {
		const actualElapsed = currentTime - lastThrottleCheckTime;
		recordThrottleMeasurement(THROTTLE_CHECK_INTERVAL_MS, actualElapsed);
	}
	lastThrottleCheckTime = currentTime;
}

/**
 * Sets up the throttle detection mechanism.
 * This should be called early in the page lifecycle.
 * Uses a periodic timer to detect browser throttling by measuring timer drift.
 */
export function setupThrottleDetection(): void {
	if (throttleSetupDone) {
		return;
	}
	throttleSetupDone = true;

	// Record the initial timestamp
	lastThrottleCheckTime = performance.now();

	// Start the periodic timer for throttle detection
	throttleIntervalId = setInterval(throttleCheckCallback, THROTTLE_CHECK_INTERVAL_MS);
}

/**
 * Stops the throttle detection mechanism.
 * Useful for cleanup in tests or when the feature is no longer needed.
 */
export function stopThrottleDetection(): void {
	if (throttleIntervalId !== null) {
		clearInterval(throttleIntervalId);
		throttleIntervalId = null;
	}
	lastThrottleCheckTime = null;
	throttleSetupDone = false;
	throttleMeasurements.length = 0;
	throttleInsertIndex = 0;
}

/**
 * Checks if the tab was throttled at any point during the specified time window.
 * Returns true if any timer measurement showed significant drift (throttling).
 *
 * @param startTime - The start timestamp of the window to check (DOMHighResTimeStamp)
 * @param endTime - The end timestamp of the window to check (DOMHighResTimeStamp)
 * @returns boolean - true if throttling was detected during the time window, false otherwise
 */
export function isTabThrottled(startTime: number, endTime: number): boolean {
	// Input validation
	if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime >= endTime) {
		return false;
	}

	// No measurements available
	if (throttleMeasurements.length === 0) {
		return false;
	}

	// Check if any measurement within the time window indicates throttling
	for (let i = 0; i < throttleMeasurements.length; i++) {
		const measurement = throttleMeasurements[i];
		if (measurement && measurement.time >= startTime && measurement.time <= endTime && measurement.isThrottled) {
			return true;
		}
	}

	return false;
}

/**
 * Gets detailed throttle information for debugging purposes.
 * Returns all throttle measurements within the specified time window.
 *
 * @param startTime - The start timestamp of the window to check
 * @param endTime - The end timestamp of the window to check
 * @returns Array of throttle measurements within the time window
 */
export function getThrottleMeasurements(startTime: number, endTime: number): ThrottleMeasurement[] {
	// Input validation
	if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime >= endTime) {
		return [];
	}

	return throttleMeasurements.filter(
		(measurement) => measurement && measurement.time >= startTime && measurement.time <= endTime
	);
}

/**
 * Injects a fake throttle measurement for testing purposes.
 * This allows integration tests to simulate throttling scenarios.
 *
 * @param measurement - The throttle measurement to inject
 */
export function __injectThrottleMeasurementForTesting(measurement: ThrottleMeasurement): void {
	throttleMeasurements[throttleInsertIndex] = measurement;
	throttleInsertIndex = (throttleInsertIndex + 1) % THROTTLE_BUFFER_SIZE;
}

// Expose testing API on window for integration tests
if (typeof window !== 'undefined') {
	(window as any).__reactUfoHiddenTiming = {
		__injectThrottleMeasurementForTesting,
	};
}
