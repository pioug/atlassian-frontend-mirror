import { bind } from 'bind-event-listener';

import { fg } from '@atlaskit/platform-feature-flags';

import type { PageVisibility } from '../common/react-ufo-payload-schema';

export type HiddenTimingItem = {
	time: number;
	hidden: boolean;
};

const timings: Array<HiddenTimingItem> = [];
let wasHiddenFlag: boolean;
let setupFlag = false;

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

function setup() {
	try {
		if (fg('platform_ufo_use_native_page_visibility_api')) {
			const results = performance.getEntriesByType('visibility-state');
			results?.forEach((result) => {
				pushHidden(result.name === 'hidden', result.startTime)
			});
		}
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
