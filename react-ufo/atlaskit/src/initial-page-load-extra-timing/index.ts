/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export type ReportedTiming = { startTime: number; duration: number };

export type ReportedTimings = {
	[key: string]: ReportedTiming;
};

export type TimingsFromPerformanceMark = {
	name: string;
	startMark: string;
	stopMark: string;
	cleanStart?: boolean;
	cleanStop?: boolean;
};

/**
 * @deprecated Use `import { addTimingFromPerformanceMark } from '@atlaskit/react-ufo/add-timing-from-performance-mark'` instead.
 */
export { addTimingFromPerformanceMark } from './addTimingFromPerformanceMark';
/**
 * @deprecated Use `import { getTimings } from '@atlaskit/react-ufo/get-timings'` instead.
 */
export { getTimings } from './getTimings';
/**
 * @deprecated Use `import { timings } from '@atlaskit/react-ufo/timings'` instead.
 */
export { timings } from './timings';
