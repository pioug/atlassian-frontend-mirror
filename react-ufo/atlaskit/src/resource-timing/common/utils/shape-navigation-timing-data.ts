import type { NavigationMetrics } from '../../../create-payload/utils/get-navigation-metrics';
import { num } from './shape-resource-timing';

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
