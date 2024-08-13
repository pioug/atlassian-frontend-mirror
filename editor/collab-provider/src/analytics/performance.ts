import type AnalyticsHelper from './analytics-helper';

// Initialize the random sampling rate
const TELEPOINTER_SAMPLE_RATE = 0.0001;

export enum MEASURE_NAME {
	SOCKET_CONNECT = 'socketConnect',
	DOCUMENT_INIT = 'documentInit',
	COMMIT_UNCONFIRMED_STEPS = 'commitUnconfirmedSteps',
	PUBLISH_PAGE = 'publishPage',
	GET_CURRENT_STATE = 'getCurrentState',
}

export const isPerformanceAPIAvailable = (): boolean => {
	return (
		typeof window !== 'undefined' &&
		'performance' in window &&
		['measure', 'clearMeasures', 'clearMarks', 'getEntriesByName', 'getEntriesByType'].every(
			(api) => !!(performance as any)[api],
		)
	);
};

export const measureMap = new Map<string, number>();

export function startMeasure(
	measureName: MEASURE_NAME,
	analyticsHelper: AnalyticsHelper | undefined,
) {
	try {
		if (!isPerformanceAPIAvailable()) {
			return;
		}

		performance.mark(`${measureName}::start`);
		measureMap.set(measureName, performance.now());
	} catch (error) {
		analyticsHelper?.sendErrorEvent(
			error,
			'Error while measuring performance when marking the start',
		);
	}
}

export function stopMeasure(
	measureName: MEASURE_NAME,
	analyticsHelper: AnalyticsHelper | undefined,
	onMeasureComplete?: (duration: number, startTime: number) => void,
): { duration: number; startTime: number } | undefined {
	let start: number | undefined;
	try {
		if (!isPerformanceAPIAvailable()) {
			return;
		}

		// `startMeasure` is not called with `measureName` before.
		if (!measureMap.get(measureName)) {
			return;
		}

		performance.mark(`${measureName}::end`);
		start = onMeasureComplete ? measureMap.get(measureName) : undefined;

		performance.measure(measureName, `${measureName}::start`, `${measureName}::end`);
	} catch (error) {
		analyticsHelper?.sendErrorEvent(
			error,
			'Error while measuring performance when marking the end',
		);
	}

	try {
		const entry = performance.getEntriesByName(measureName).pop();

		clearMeasure(measureName);
		let measure;
		if (entry) {
			measure = { duration: entry.duration, startTime: entry.startTime };
		} else if (start) {
			measure = { duration: performance.now() - start, startTime: start };
		}
		if (measure && onMeasureComplete) {
			onMeasureComplete(measure.duration, measure.startTime);
		}
		return measure;
	} catch (error) {
		analyticsHelper?.sendErrorEvent(
			error,
			'Error while measuring performance when completing the measurement',
		);
	}
}

function clearMeasure(measureName: string) {
	if (!isPerformanceAPIAvailable()) {
		return;
	}

	measureMap.delete(measureName);
	performance.clearMarks(`${measureName}::start`);
	performance.clearMarks(`${measureName}::end`);
	performance.clearMeasures(measureName);
}

export const shouldTelepointerBeSampled = () =>
	// At peak usage, telepointer we had 200M events per day. The goal is to sample 1:10000 of the events. (20k per day)
	// Math.random() generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
	// The condition Math.random() < TELEPOINTER_SAMPLE_RATE (0.0001) will be true approximately 0.01% of the time.
	// This means that approximately 1 in 10,000 events will be sampled.
	Math.random() < TELEPOINTER_SAMPLE_RATE;
