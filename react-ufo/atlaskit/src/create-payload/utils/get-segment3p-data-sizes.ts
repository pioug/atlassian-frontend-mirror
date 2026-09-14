import type { Segment3pData } from '../../common';

const PERF_TIMING_LABELS = ['resource-timing', 'navigation-timing'];

const DOM_TIMING_LABELS = [
	'frame-mark',
	'frame-measure',
	'paint-timing',
	'layout-shift',
	'dom-mutations',
	'react-profiler-timing',
];

/**
 * Returns serialized sizes (in KB) of perf timings and DOM timings within a `Segment3pData`
 * grouped structure. Used when the ecosystem data feature flag is off.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getSegment3pDataSizes(data: Segment3pData): {
	segment3pPerfTimingsSizeInKb: number;
	segment3pDomTimingsSizeInKb: number;
	segment3pExtraDataSizeInKb: number;
} {
	const allTimings = Object.values(data).flatMap((s) => s.timings);
	const allMetas = Object.values(data).map((s) => s.meta);
	const perfTimings = allTimings.filter((e) => PERF_TIMING_LABELS.includes(e.label));
	const domTimings = allTimings.filter((e) => DOM_TIMING_LABELS.includes(e.label));
	return {
		segment3pPerfTimingsSizeInKb:
			Math.round((JSON.stringify(perfTimings).length / 1024) * 100) / 100,
		segment3pDomTimingsSizeInKb: Math.round((JSON.stringify(domTimings).length / 1024) * 100) / 100,
		segment3pExtraDataSizeInKb: Math.round((JSON.stringify(allMetas).length / 1024) * 100) / 100,
	};
}
