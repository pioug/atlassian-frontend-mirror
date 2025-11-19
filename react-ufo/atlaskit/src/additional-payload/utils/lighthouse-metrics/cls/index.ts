import { fg } from '@atlaskit/platform-feature-flags';

import type { PerformanceEntryBuffer } from '../utils/buffer';

import type { LayoutShiftPerformanceEntry } from './types';

function isSameRects(rect1: DOMRectReadOnly, rect2: DOMRectReadOnly) {
	return (
		rect1.x === rect2.x &&
		rect1.y === rect2.y &&
		rect1.width === rect2.width &&
		rect1.height === rect2.height &&
		rect1.top === rect2.top &&
		rect1.right === rect2.right &&
		rect1.bottom === rect2.bottom &&
		rect1.left === rect2.left
	);
}

export function getCLS(start: number, stop: number, buffer: PerformanceEntryBuffer): number {
	const layoutShifts = buffer.getAll().filter((_entry) => {
		const entry = _entry as LayoutShiftPerformanceEntry;
		const isWithinObservationWindow = entry.startTime >= start && entry.startTime <= stop;

		if (fg('platform_ufo_filter_cls_logs_same_rects_positions')) {
			const allSourcesHaveSameRects = entry?.sources?.every(({ previousRect, currentRect }) =>
				isSameRects(previousRect, currentRect),
			);
			return isWithinObservationWindow && !allSourcesHaveSameRects;
		}

		return isWithinObservationWindow;
	});

	const sessionWindows: Array<{ startTime: number; endTime: number; score: number }> = [];
	let currentWindow: any = null;

	// Group layout shifts into session windows
	for (const shift of layoutShifts) {
		const { startTime } = shift;
		const endTime = shift.startTime + shift.duration;
		const score = (shift as LayoutShiftPerformanceEntry).value;

		if (
			currentWindow === null ||
			startTime - currentWindow.endTime > 1000 ||
			endTime - currentWindow.startTime > 5000
		) {
			// Start a new session window
			currentWindow = {
				startTime,
				endTime,
				score,
			};
			sessionWindows.push(currentWindow);
		} else {
			// Add layout shift to current session window
			currentWindow.endTime = endTime;
			currentWindow.score += score;
		}
	}

	// Find session window with highest cumulative score
	const maxScore = sessionWindows.reduce(
		(max, sessionWindow) => (sessionWindow.score > max ? sessionWindow.score : max),
		0,
	);

	// Return score of largest burst as CLS metric
	return Math.round(maxScore * 10000) / 10000;
}
