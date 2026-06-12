import { isPerformanceObserverAvailable } from './isPerformanceObserverAvailable';
let hasRequiredPerformanceAPIs: boolean | undefined;

export function isPerformanceAPIAvailable(): boolean {
	if (hasRequiredPerformanceAPIs === undefined) {
		hasRequiredPerformanceAPIs =
			typeof window !== 'undefined' &&
			'performance' in window &&
			[
				'measure',
				'clearMeasures',
				'clearMarks',
				'getEntriesByName',
				'getEntriesByType',
				'now',
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			].every((api) => !!(performance as any)[api]);
	}

	return hasRequiredPerformanceAPIs;
}


// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function isPerformanceObserverLongTaskAvailable(): boolean {
	return (
		isPerformanceObserverAvailable() &&
		PerformanceObserver.supportedEntryTypes &&
		PerformanceObserver.supportedEntryTypes.includes('longtask')
	);
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isPerformanceObserverAvailable } from './isPerformanceObserverAvailable';
