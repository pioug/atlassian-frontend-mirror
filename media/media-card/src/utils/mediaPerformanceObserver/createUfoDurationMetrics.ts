import type { CommonMetrics } from './CommonMetrics';
import type { UfoDurationMetrics } from './durationMetrics';
import { getCommonMetrics } from './getCommonMetrics';
import type { Marks } from './Marks';
import { type ExperimentalPerformanceResourceTiming } from './types';

type RequiredCommonMetrics = Record<string, Marks>;

const filterCommonMetrics = (metrics: CommonMetrics): RequiredCommonMetrics =>
	Object.fromEntries(Object.entries(metrics).filter(([, marks]) => !!marks) as [string, Marks][]);

export const createUfoDurationMetrics = (
	entry: ExperimentalPerformanceResourceTiming,
	interactionStartTime: number,
): UfoDurationMetrics => {
	// Calculate timing relative to UFO interaction start time
	// For page_load: interactionStartTime = 0 (relative to page navigation)
	// For transitions: interactionStartTime = performance.now() when transition started
	// This ensures metrics work correctly for both initial loads and SPA soft redirects
	const relativeStartTime = entry.startTime - interactionStartTime;

	return {
		resourceTiming: { start: relativeStartTime, end: entry.responseEnd, size: entry.transferSize },
		...filterCommonMetrics(getCommonMetrics(entry)),
	};
};
