import { PerformanceObserverEntryTypes } from '../../const';
import { EntriesBuffer } from '../buffer';

let pe: PerformanceObserver | null = null;

function getObserver(): PerformanceObserver | null {
	if (typeof PerformanceObserver !== 'function') {
		// Only instantiate the IntersectionObserver if it's supported
		return null;
	}
	if (pe !== null) {
		return pe;
	}

	const performanceObserverCallback: PerformanceObserverCallback = (list) => {
		list.getEntries().forEach((entry) => {
			if (entry.entryType === PerformanceObserverEntryTypes.LayoutShift) {
				EntriesBuffer[PerformanceObserverEntryTypes.LayoutShift].push(entry);
			}
			if (entry.entryType === PerformanceObserverEntryTypes.LongTask) {
				EntriesBuffer[PerformanceObserverEntryTypes.LongTask].push(entry);
			}
		});
	};

	pe = new PerformanceObserver(performanceObserverCallback);

	return pe;
}

export function startLSObserver(): void {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LayoutShift,
		buffered: true,
	});
}

export function startLTObserver(): void {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LongTask,
		buffered: true,
	});
}
