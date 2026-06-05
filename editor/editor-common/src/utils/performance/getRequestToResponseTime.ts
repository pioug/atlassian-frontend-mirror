import { isPerformanceAPIAvailable } from './is-performance-api-available';

export function getRequestToResponseTime(): number | undefined {
	if (!isPerformanceAPIAvailable()) {
		return;
	}

	const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

	if (nav) {
		return nav.responseEnd - nav.requestStart;
	}

	return;
}
