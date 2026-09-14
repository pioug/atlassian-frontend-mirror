import type { InteractionMetrics } from '../common';

export function getReactProfilerTimingsForWindow(
	reactProfilerTimings: InteractionMetrics['reactProfilerTimings'],
	window: { start: number; end: number } | undefined,
): InteractionMetrics['reactProfilerTimings'] {
	if (!window) {
		return reactProfilerTimings;
	}

	return reactProfilerTimings.filter((timing) => {
		return timing.startTime <= window.end && timing.commitTime >= window.start;
	});
}
