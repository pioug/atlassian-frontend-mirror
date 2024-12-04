import { isPerformanceAPIAvailable } from './is-performance-api-available';

const measureMap = new Map<string, number>();

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * @deprecated use 'startMeasure' from '@atlaskit/editor-common/performance-measures'
 */
export function startMeasure(measureName: string) {
	if (!isPerformanceAPIAvailable()) {
		return;
	}
	performance.mark(`${measureName}::start`);
	measureMap.set(measureName, performance.now());
}

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * @deprecated use 'stopMeasure' from '@atlaskit/editor-common/performance-measures'
 */
export function stopMeasure(
	measureName: string,
	onMeasureComplete?: (duration: number, startTime: number) => void,
) {
	if (!isPerformanceAPIAvailable()) {
		return;
	}
	performance.mark(`${measureName}::end`);
	const start = onMeasureComplete ? measureMap.get(measureName) : undefined;
	try {
		performance.measure(measureName, `${measureName}::start`, `${measureName}::end`);
	} catch (error) {
	} finally {
		if (onMeasureComplete) {
			const entry = performance.getEntriesByName(measureName).pop();
			if (entry) {
				onMeasureComplete(entry.duration, entry.startTime);
			} else if (start) {
				onMeasureComplete(performance.now() - start, start);
			}
		}
		clearMeasure(measureName);
	}
}

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * @deprecated use 'clearMeasure' from '@atlaskit/editor-common/performance-measures'
 */
export function clearMeasure(measureName: string) {
	if (!isPerformanceAPIAvailable()) {
		return;
	}

	measureMap.delete(measureName);
	performance.clearMarks(`${measureName}::start`);
	performance.clearMarks(`${measureName}::end`);
	performance.clearMeasures(measureName);
}
