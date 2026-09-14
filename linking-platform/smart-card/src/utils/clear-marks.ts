import { hasPerformanceAPIAvailable } from './has-performance-api-available';

export const clearMarks = (id: string): void => {
	if (hasPerformanceAPIAvailable) {
		const marks = performance.getEntriesByType('mark').filter((mark) => mark.name.includes(id));
		marks.forEach((mark) => performance.clearMarks(mark.name));
	}
};
