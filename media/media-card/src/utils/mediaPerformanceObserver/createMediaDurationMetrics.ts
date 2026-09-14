import type { CommonMetrics } from './CommonMetrics';
import { getCommonMetrics } from './getCommonMetrics';
import { type ExperimentalPerformanceResourceTiming } from './types';

const getStartedAt = (entry: ExperimentalPerformanceResourceTiming, interactionStartTime: number) =>
	entry.startTime - interactionStartTime;

type CommonDurations = Record<string, number | undefined>;

const calculateCommonDurations = (metrics: CommonMetrics): CommonDurations =>
	Object.fromEntries(
		Object.entries(metrics).map(([key, marks]) => {
			if (!marks) {
				return [key, undefined];
			}
			const { start, end } = marks;
			return [key, end - start];
		}),
	);

export const createMediaDurationMetrics = (
	entry: ExperimentalPerformanceResourceTiming,
	interactionStartTime: number,
): {
	/**
	 * The user agent string for the current browser
	 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
	 */
	userAgent: string;
	/**
	 * Performance resource timing data sent by the server. This includes:
	 *
	 * `cdnCacheHit` is a boolean determining whether the CDN cache was hit or missed.
	 *
	 * `cdnDownstreamFBL` is the 'CDN Downstream First Byte Latency'. It represents
	 * how long the it took the CDN to respond to the frontend.
	 *
	 * `cdnUpstreamFBL` is the 'CDN Upstream First Byte Latency'. It represents the
	 * time the Media backend took to respond to the CDN, in the case that the CDN
	 * cache was a miss. Notably, this timing is a subset of the `cdnDownstreamFBL` timing.
	 */
	cdnCacheHit: boolean;
	cdnDownstreamFBL: number | undefined;
	cdnUpstreamFBL: number | undefined;
	startedAt: number;
	/**
	 * Performance resource timing data regarding the loading of an
	 * application's resources as described in
	 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
	 */
	transferSize: number;
	decodedBodySize: number;
	totalDuration: number;
	initiatorType: string; // value can be 'fetch' or 'img'
	endedAt: number;
	responseEnd: number;
	browserCacheHit: boolean;
	nextHopProtocol: string;
} => {
	return {
		startedAt: getStartedAt(entry, interactionStartTime),
		/**
		 * Performance resource timing data regarding the loading of an
		 * application's resources as described in
		 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming
		 */
		transferSize: entry.transferSize,
		decodedBodySize: entry.decodedBodySize,
		totalDuration: entry.duration,
		initiatorType: entry.initiatorType, // value can be 'fetch' or 'img'
		endedAt: entry.responseEnd - interactionStartTime,
		responseEnd: entry.responseEnd,
		browserCacheHit: entry.transferSize === 0,
		nextHopProtocol: entry.nextHopProtocol,
		...calculateCommonDurations(getCommonMetrics(entry)),

		/**
		 * The user agent string for the current browser
		 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
		 */
		userAgent: window.navigator.userAgent,

		/**
		 * Performance resource timing data sent by the server. This includes:
		 *
		 * `cdnCacheHit` is a boolean determining whether the CDN cache was hit or missed.
		 *
		 * `cdnDownstreamFBL` is the 'CDN Downstream First Byte Latency'. It represents
		 * how long the it took the CDN to respond to the frontend.
		 *
		 * `cdnUpstreamFBL` is the 'CDN Upstream First Byte Latency'. It represents the
		 * time the Media backend took to respond to the CDN, in the case that the CDN
		 * cache was a miss. Notably, this timing is a subset of the `cdnDownstreamFBL` timing.
		 */
		cdnCacheHit: entry.serverTiming.find(({ name }) => {
			return name === 'cdn-cache-hit';
		})
			? true
			: false,
		cdnDownstreamFBL: entry.serverTiming.find(({ name }) => {
			return name === 'cdn-downstream-fbl';
		})?.duration,
		cdnUpstreamFBL: entry.serverTiming.find(({ name }) => {
			return name === 'cdn-upstream-fbl';
		})?.duration,
	};
};
