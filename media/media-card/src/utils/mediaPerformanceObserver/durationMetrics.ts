import { type ExperimentalPerformanceResourceTiming } from './types';

export type MediaDurationMetrics = ReturnType<typeof createMediaDurationMetrics>;
export type UfoDurationMetrics = Record<string, { start: number; end?: number; size?: number }>;

const getStartedAt = (
	entry: ExperimentalPerformanceResourceTiming,
	navigationTime: PerformanceNavigationTiming | undefined,
) => entry.startTime - (navigationTime?.domContentLoadedEventEnd || 0);

export const createMediaDurationMetrics = (
	entry: ExperimentalPerformanceResourceTiming,
	navigationTime: PerformanceNavigationTiming | undefined,
) => {
	return {
		startedAt: getStartedAt(entry, navigationTime),
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
		tcpHandshakeTime: entry.connectEnd - entry.connectStart,
		dnsLookupTime: entry.domainLookupEnd - entry.domainLookupStart,
		redirectTimeTaken: entry.redirectEnd - entry.redirectStart,
		tlsConnectNegotiationTime: entry.requestStart - entry.secureConnectionStart,
		timeTakenToFetchWithoutRedirect: entry.responseEnd - entry.fetchStart,
		browserCacheHit: entry.transferSize === 0,
		nextHopProtocol: entry.nextHopProtocol,

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
		interimRequestTime: entry.responseStart - entry.requestStart,
		/**
		 * `requestInvocationTime` represents the actual time the browser took to request
		 * the resource from the server (i.e. it does not include the interim reponse
		 * time).
		 * NOTE: it relies on an experimental feature (`firstInterimResponseStart`) that is
		 * available in Chrome, but not in FireFox or Safari. This value will be undefined
		 * when `firstInterimResponseStart` is unavailable.
		 */
		requestInvocationTime: entry.firstInterimResponseStart
			? entry.firstInterimResponseStart - entry.requestStart
			: undefined,
		/**
		 * `contentDownloadTime` represents the time taken for the browser to receive
		 * the resource from the server. This may be cut short if the transport
		 * connection is closed.
		 */
		contentDownloadTime: entry.responseEnd - entry.responseStart,
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

export const createUfoDurationMetrics = (
	entry: ExperimentalPerformanceResourceTiming,
	navigationTime: PerformanceNavigationTiming | undefined,
): UfoDurationMetrics => {
	return {
		resourceTiming: { start: getStartedAt(entry, navigationTime), end: entry.responseEnd },
		/* More metrics to add here */
	};
};
