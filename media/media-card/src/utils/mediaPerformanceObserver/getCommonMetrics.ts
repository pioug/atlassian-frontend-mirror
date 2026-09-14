import type { CommonMetrics } from './CommonMetrics';
import { type ExperimentalPerformanceResourceTiming } from './types';

export const getCommonMetrics = (entry: ExperimentalPerformanceResourceTiming): CommonMetrics => ({
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
