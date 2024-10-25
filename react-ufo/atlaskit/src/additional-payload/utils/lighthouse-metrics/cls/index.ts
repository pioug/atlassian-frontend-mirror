import type { PerformanceEntryBuffer } from '../utils/buffer';

import type { LayoutShiftPerformanceEntry } from './types';

export const getCLS = (start: number, stop: number, buffer: PerformanceEntryBuffer) => {
	const layoutShifts = buffer
		.getAll()
		.filter((entry) => entry.startTime >= start && entry.startTime <= stop);

	const sessionWindows = [];
	let currentWindow = null;

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
};
