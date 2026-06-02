import type { NavigationMetrics } from '../../../create-payload/utils/get-navigation-metrics';

import { calculateTransferType, isCacheableType } from './transfer-type';

const num = (v: unknown): number => (typeof v === 'number' ? Math.round(v) : 0);

// Accepted source values from forge-cdn bridge:
//   - 'forge-framework' (PR #775+) — Forge runtime assets (bridge.js, iframeResizer*, etc.)
//   - 'forge-app'       (PR #775+) — app-author assets on installation-scoped subdomain
//   - 'external'        (both schemes) — anything outside Atlassian-controlled domains
//   - 'internal'        (PR #769 only, LEGACY) — bridges still emit this until PR #775
//                       rolls out everywhere; safe to remove from this allowlist after
//                       the rollout has been stable for a release cycle. Do NOT remove
//                       'external' during that cleanup — it's a first-class value in
//                       both the old and new schemes.
const ACCEPTED_SOURCES: ReadonlyArray<unknown> = [
	'forge-framework',
	'forge-app',
	'external',
	'internal',
];

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
	const payload = (data?.payload || {}) as Record<string, unknown>;
	// payload.timing.* to payload.* directly. Support both shapes during rollout.
	const timing = (payload?.timing || payload) as Record<string, unknown>;

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
		// Added in PR #769 — present in new flat shape, absent in old nested shape (defaults to 0)
		encodedBodySize: num(timing.encodedBodySize),
		decodedBodySize: num(timing.decodedBodySize),
		transferSize: num(timing.transferSize),
		// From Navigation Timing 2 spec
		redirectCount: num(payload.redirectCount),
		type: typeof payload.type === 'string' ? payload.type : undefined,
		unloadEventStart: num(timing.unloadEventStart),
		unloadEventEnd: num(timing.unloadEventEnd),
		workerStart: num(timing.workerStart),
		nextHopProtocol:
			typeof timing.nextHopProtocol === 'string' ? timing.nextHopProtocol : undefined,
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
	const payload = (data?.payload || {}) as Record<string, unknown>;
	// payload.timing.* to payload.* directly. Support both shapes during rollout.
	const timing = (payload?.timing || payload) as Record<string, unknown>;

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
	const source = ACCEPTED_SOURCES.includes(payload.source) ? (payload.source as string) : undefined;

	// Base fields — always present (times are relative to interaction start from the iframe)
	const shaped: Record<string, unknown> = {
		label: name,
		startTime,
		duration,
		workerStart: Math.max(workerStart, 0),
		fetchStart: Math.max(fetchStart, 0),
		type: initiatorType,
		...(source !== undefined ? { source } : {}),
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

	// Flag entries where timing-allow-origin headers are missing:
	// duration > 0 but all size fields are 0 means the browser withheld size data.
	if (duration > 0 && transferSize === 0 && encodedSize === 0) {
		shaped.noTA = true;
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
