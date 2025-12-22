import { type ExperimentalPerformanceResourceTiming } from './types';

export type MediaDurationMetrics = ReturnType<typeof createMediaDurationMetrics>;
export type UfoDurationMetrics = Record<string, { start: number; end?: number; size?: number }>;

const getStartedAt = (entry: ExperimentalPerformanceResourceTiming, interactionStartTime: number) =>
	entry.startTime - interactionStartTime;

type CommonDurations = Record<string, number | undefined>;
type Marks = { start: number; end: number };
type CommonMetrics = Record<string, Marks | undefined>;
type RequiredCommonMetrics = Record<string, Marks>;

const getCommonMetrics = (entry: ExperimentalPerformanceResourceTiming): CommonMetrics => ({
	tcpHandshakeTime: { end: entry.connectEnd, start: entry.connectStart },
	dnsLookupTime: { end: entry.domainLookupEnd, start: entry.domainLookupStart },
	redirectTimeTaken: { end: entry.redirectEnd, start: entry.redirectStart },
	tlsConnectNegotiationTime: { end: entry.requestStart, start: entry.secureConnectionStart },
	timeTakenToFetchWithoutRedirect: { end: entry.responseEnd, start: entry.fetchStart },
	/**
	 * `interimRequestTime` represents the entire time the browser took to
	 * request the resource from the server. This includes the interim response time
	 * (for example, 100 Continue or 103 Early Hints).
	 *
	 * i.e. It is the time taken for the request to be sent
	 * + the waiting time for the server to send a response
	 *
	 * Please, note that this value
	 * is distinctly different from the aforementioned document.
	 */
	interimRequestTime: { end: entry.responseStart, start: entry.requestStart },
	/**
	 * `requestInvocationTime` represents the actual time the browser took to request
	 * the resource from the server (i.e. it does not include the interim reponse
	 * time).
	 * NOTE: it relies on an experimental feature (`firstInterimResponseStart`) that is
	 * available in Chrome, but not in FireFox or Safari. This value will be undefined
	 * when `firstInterimResponseStart` is unavailable.
	 */
	requestInvocationTime: entry.firstInterimResponseStart
		? { end: entry.firstInterimResponseStart, start: entry.requestStart }
		: undefined,
	/**
	 * `contentDownloadTime` represents the time taken for the browser to receive
	 * the resource from the server. This may be cut short if the transport
	 * connection is closed.
	 */
	contentDownloadTime: { end: entry.responseEnd, start: entry.responseStart },
});

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
) => {
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
