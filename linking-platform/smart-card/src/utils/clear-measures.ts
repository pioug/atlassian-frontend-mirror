import { hasPerformanceAPIAvailable } from './has-performance-api-available';

export const clearMeasures = (id: string): void => {
	if (hasPerformanceAPIAvailable) {
		const measures = performance
			.getEntriesByType('measure')
			.filter((measure) => measure.name.includes(id));
		measures.forEach((measure) => performance.clearMeasures(measure.name));
	}
};
