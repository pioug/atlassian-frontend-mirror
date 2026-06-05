export function isPerformanceObserverAvailable(): boolean {
	return !!(typeof window !== 'undefined' && 'PerformanceObserver' in window);
}
