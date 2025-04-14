import { withProfiling } from '../../../../../self-measurements';
import { PerformanceObserverEntryTypes } from '../../const';
import { EntriesBuffer } from '../buffer';

let pe: PerformanceObserver | null = null;

const getObserver = withProfiling(function getObserver(): PerformanceObserver | null {
	if (typeof PerformanceObserver !== 'function') {
		// Only instantiate the IntersectionObserver if it's supported
		return null;
	}
	if (pe !== null) {
		return pe;
	}

	const performanceObserverCallback: PerformanceObserverCallback = withProfiling(
		function performanceObserverCallback(list) {
			list.getEntries().forEach((entry) => {
				if (entry.entryType === PerformanceObserverEntryTypes.LayoutShift) {
					EntriesBuffer[PerformanceObserverEntryTypes.LayoutShift].push(entry);
				}
				if (entry.entryType === PerformanceObserverEntryTypes.LongTask) {
					EntriesBuffer[PerformanceObserverEntryTypes.LongTask].push(entry);
				}
			});
		},
	);

	pe = new PerformanceObserver(performanceObserverCallback);

	return pe;
});

export const startLSObserver = withProfiling(function startLSObserver() {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LayoutShift,
		buffered: true,
	});
});

export const startLTObserver = withProfiling(function startLTObserver() {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LongTask,
		buffered: true,
	});
});
