import type { FlatSegment3pTimingEntry, InteractionMetrics } from '../../common';

const PERF_TIMING_LABELS = ['resource-timing', 'navigation-timing'];
const DOM_TIMING_LABELS = ['frame-mark', 'frame-measure', 'paint-timing', 'layout-shift', 'dom-mutations', 'react-profiler-timing'];

/**
 * Flattens `Record<segmentId, entries[]>` into `FlatSegment3pTimingEntry[]` and removes
 * duplicate entries (multiple Forge iframes can report identical perf timeline data).
 */
export function flattenAndDeduplicateSegment3pTimings(
	segment3pTimings: InteractionMetrics['segment3pTimings'],
): FlatSegment3pTimingEntry[] | undefined {
	if (!segment3pTimings) {
		return undefined;
	}
	const seen = new Set<string>();
	const result: FlatSegment3pTimingEntry[] = [];
	for (const [segmentId, entries] of Object.entries(segment3pTimings)) {
		for (const entry of entries) {
			const key = `${segmentId}:${entry.label}:${JSON.stringify(entry.data)}`;
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);
			result.push({ segmentId, label: entry.label, data: entry.data });
		}
	}
	return result;
}

/**
 * Returns serialized sizes (in KB) of perf timings (resource/navigation) and
 * DOM timings (frame-mark, frame-measure, paint-timing, layout-shift, dom-mutations).
 */
export function getSegment3pTimingsSizes(flat: FlatSegment3pTimingEntry[]): {
	segment3pPerfTimingsSizeInKb: number;
	segment3pDomTimingsSizeInKb: number;
} {
	const perfTimings = flat.filter((e) => PERF_TIMING_LABELS.includes(e.label));
	const domTimings = flat.filter((e) => DOM_TIMING_LABELS.includes(e.label));
	return {
		segment3pPerfTimingsSizeInKb: JSON.stringify(perfTimings).length / 1024,
		segment3pDomTimingsSizeInKb: JSON.stringify(domTimings).length / 1024,
	};
}
