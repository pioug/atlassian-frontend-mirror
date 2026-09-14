export const isPerformanceAPIAvailable = (): boolean => {
	return (
		typeof window !== 'undefined' &&
		'performance' in window &&
		['measure', 'clearMeasures', 'clearMarks', 'getEntriesByName', 'getEntriesByType'].every(
			(api) => !!(performance as any)[api],
		)
	);
};
