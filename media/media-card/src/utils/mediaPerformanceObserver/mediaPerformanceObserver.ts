import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common/analytics';
import { fg } from '@atlaskit/platform-feature-flags';

const MEDIA_CARD_PERF_STATE_KEY = '__mediaCardPerfState_asflkajsdflja';

declare global {
	interface Window {
		[MEDIA_CARD_PERF_STATE_KEY]?: {
			mediaCardPerfObserver?: PerformanceObserver;
			mediaCardCreateAnalyticsEvent?: CreateUIAnalyticsEvent;
		};
	}
}

const urlRegex =
	/https:\/\/(?:media\.(?:dev|staging|prod)\.atl-paas\.net|api\.media\.atlassian\.com|media-cdn(?:\.stg\.|\.)atlassian\.com)\/file\/([^/]+)\/image.*[?&]source=mediaCard/;

const clientIdParamRegex = /[?&]clientId=([^&]+)/;
const ssrParamRegex = /[?&]token=([^&]+)/;

/**
 * `ExperimentalPerformanceResourceTiming` type accounts for the experimental value `firstInterimResponseStart`
 * which is present in Chrome, but not present in FireFox or Safari.
 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/firstInterimResponseStart
 */
interface ExperimentalPerformanceResourceTiming extends PerformanceResourceTiming {
	firstInterimResponseStart?: number;
}

const createAndGetResourceObserver = (): PerformanceObserver => {
	return new PerformanceObserver((list) => {
		list.getEntries().forEach((baseEntry) => {
			const entry = baseEntry as ExperimentalPerformanceResourceTiming;
			const matchFileId = entry.name.match(urlRegex);
			const matchClientId = entry.name.match(clientIdParamRegex);
			const matchSSR = entry.name.match(ssrParamRegex);

			if (matchFileId && window[MEDIA_CARD_PERF_STATE_KEY]?.mediaCardCreateAnalyticsEvent) {
				const fileId = matchFileId[1];
				const clientId = matchClientId?.[1];
				const ssr = matchSSR ? 'server' : undefined;
				const navigationTime = performance.getEntriesByType('navigation')[0] as
					| PerformanceNavigationTiming
					| undefined;
				const event = window[MEDIA_CARD_PERF_STATE_KEY].mediaCardCreateAnalyticsEvent({
					eventType: 'operational',
					action: 'succeeded',
					actionSubject: 'mediaCardPerfObserver',
					attributes: {
						ssr,
						fileId: fileId,
						mediaClientId: clientId,
						startedAt: entry.startTime - (navigationTime?.domContentLoadedEventEnd || 0),
						featureFlags: {
							'media-cdn-single-host': fg('platform.media-cdn-single-host'),
						},

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
					},
				});
				event.fire(ANALYTICS_MEDIA_CHANNEL);
			}
		});
	});
};

export const setAnalyticsContext = (newAnalyticsContext: CreateUIAnalyticsEvent) => {
	if (!window[MEDIA_CARD_PERF_STATE_KEY]) {
		window[MEDIA_CARD_PERF_STATE_KEY] = {};
	}
	window[MEDIA_CARD_PERF_STATE_KEY].mediaCardCreateAnalyticsEvent = newAnalyticsContext;
};

export const startResourceObserver = () => {
	if (window[MEDIA_CARD_PERF_STATE_KEY]?.mediaCardPerfObserver) {
		return;
	}
	if (!window[MEDIA_CARD_PERF_STATE_KEY]) {
		window[MEDIA_CARD_PERF_STATE_KEY] = {};
	}
	window[MEDIA_CARD_PERF_STATE_KEY].mediaCardPerfObserver = createAndGetResourceObserver();
	window[MEDIA_CARD_PERF_STATE_KEY].mediaCardPerfObserver.observe({
		type: 'resource',
		buffered: true,
	});
};
