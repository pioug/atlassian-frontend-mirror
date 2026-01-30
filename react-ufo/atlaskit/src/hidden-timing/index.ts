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
) {
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

export function getHasHiddenTimingBeforeSetup() {
	return hasHiddenTimingBeforeSetup;
}

function setup() {
	try {
		const results = performance.getEntriesByType('visibility-state');

		results?.forEach((result) => {
			if (fg('platform_ufo_use_native_page_visibility_api')) {
				pushHidden(result.name === 'hidden', result.startTime);
			}

			if (fg('platform_ufo_native_pagevisibility_monitoring')) {
				if (result.name === 'hidden') {
					hasHiddenTimingBeforeSetup = true;
				}
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
