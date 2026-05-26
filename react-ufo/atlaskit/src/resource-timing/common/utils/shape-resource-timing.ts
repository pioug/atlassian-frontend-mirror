import type { NavigationMetrics } from '../../../create-payload/utils/get-navigation-metrics';

import { calculateTransferType, isCacheableType } from './transfer-type';

const num = (v: unknown): number => (typeof v === 'number' ? Math.round(v) : 0);

/**
 * Shapes a raw iframe navigation-timing event data object into the same field set
 * produced by getNavigationMetrics() in create-payload/utils/get-navigation-metrics.ts,
 * so that iframe navigation timings are consistent with host-page navigation timings.
 *
 * Deliberately omitted fields (same rationale as host-page):
 *   domComplete, domContentLoadedEventStart/End, domInteractive, loadEventStart/End
 * Also dropped: iframe-specific pre-computed `metrics` object, top-level `startTime`/`duration`
 *
 * The iframe event structure is: { name, elapsed, payload: { name, startTime, duration, type,
 *   redirectCount, timing: { ... }, metrics: { ... } } }
 */
export function shapeNavigationTimingData(
	data: Record<string, unknown>,
): Partial<NavigationMetrics> & { label: string } {
	const payload =
		data.payload !== null && typeof data.payload === 'object'
			? (data.payload as Record<string, unknown>)
			: {};
	const timing =
		payload.timing !== null && typeof payload.timing === 'object'
			? (payload.timing as Record<string, unknown>)
			: {};

	// Trim long URLs to just the last path segment to keep payload size manageable.
	const rawName = typeof payload.name === 'string' ? payload.name : '';
	const label = rawName.includes('/')
		? (rawName.split('/').filter(Boolean).pop() ?? rawName)
		: rawName;

	return {
		label,
		// From Resource Timing spec
		redirectStart: num(timing.redirectStart),
		redirectEnd: num(timing.redirectEnd),
		fetchStart: num(timing.fetchStart),
		domainLookupStart: num(timing.domainLookupStart),
		domainLookupEnd: num(timing.domainLookupEnd),
		connectStart: num(timing.connectStart),
		connectEnd: num(timing.connectEnd),
		secureConnectionStart: num(timing.secureConnectionStart),
		requestStart: num(timing.requestStart),
		responseStart: num(timing.responseStart),
		responseEnd: num(timing.responseEnd),
		// encodedBodySize, decodedBodySize, transferSize not present in iframe navigation timing
		// From Navigation Timing 2 spec
		redirectCount: num(payload.redirectCount),
		type: typeof payload.type === 'string' ? payload.type : undefined,
		unloadEventStart: num(timing.unloadEventStart),
		unloadEventEnd: num(timing.unloadEventEnd),
		workerStart: num(timing.workerStart),
		// nextHopProtocol not present in iframe navigation timing
	};
}

/**
 * Shapes a raw iframe resource-timing event data object into the same field set
 * produced by getResourceTimings() / getNetworkData() in resource-timing/main.ts,
 * so that iframe resource timings are consistent with host-page resource timings.
 *
 * The iframe event structure is: { name, elapsed, payload: { name, startTime, ... timing: { ... } } }
 * All timing fields live inside `payload`, with sub-timing fields inside `payload.timing`.
 */
export function shapeResourceTimingData(data: Record<string, unknown>): Record<string, unknown> {
	const payload =
		data.payload !== null && typeof data.payload === 'object'
			? (data.payload as Record<string, unknown>)
			: {};
	const timing =
		payload.timing !== null && typeof payload.timing === 'object'
			? (payload.timing as Record<string, unknown>)
			: {};

	const rawName = typeof payload.name === 'string' ? payload.name : '';
	const name = rawName.includes('/')
		? (rawName.split('/').filter(Boolean).pop() ?? rawName)
		: rawName;
	const initiatorType = typeof payload.initiatorType === 'string' ? payload.initiatorType : 'other';
	const startTime = num(payload.startTime);
	const duration = num(payload.duration);
	const fetchStart = num(timing.fetchStart);
	const workerStart = num(timing.workerStart);
	const responseStart = num(timing.responseStart);
	const requestStart = num(timing.requestStart);
	const transferSize = typeof payload.transferSize === 'number' ? payload.transferSize : undefined;
	const encodedSize =
		typeof payload.encodedBodySize === 'number' ? payload.encodedBodySize : undefined;
	const decodedSize =
		typeof payload.decodedBodySize === 'number' ? payload.decodedBodySize : undefined;
	// serverTime / networkTime are not in the current iframe payload but kept for forward-compat
	const serverTime = typeof payload.serverTime === 'number' ? payload.serverTime : undefined;
	const networkTime = typeof payload.networkTime === 'number' ? payload.networkTime : undefined;

	// Base fields — always present (times are relative to interaction start from the iframe)
	const shaped: Record<string, unknown> = {
		label: name,
		startTime,
		duration,
		workerStart: Math.max(workerStart, 0),
		fetchStart: Math.max(fetchStart, 0),
		type: initiatorType,
	};

	const cacheable = isCacheableType(rawName, initiatorType);

	shaped.ttfb = responseStart;
	if (serverTime !== undefined) {
		shaped.serverTime = serverTime;
	}
	if (networkTime !== undefined) {
		shaped.networkTime = networkTime;
	}
	if (transferSize !== undefined) {
		shaped.size = transferSize;
	}

	if (cacheable) {
		// CacheableResourceTiming — calculateTransferType is only meaningful for cacheable resources
		const transferType = calculateTransferType(rawName, initiatorType, duration, transferSize);
		if (transferType !== null) {
			shaped.transferType = transferType;
		}
		if (encodedSize !== undefined) {
			shaped.encodedSize = encodedSize;
		}
		if (decodedSize !== undefined) {
			shaped.decodedSize = decodedSize;
		}
	} else {
		// NonCacheableResourceTiming (fetch, xmlhttprequest, etc.)
		shaped.requestStart = requestStart;
	}

	return shaped;
}
