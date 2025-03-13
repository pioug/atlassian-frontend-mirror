import { PerformanceObserverEntryTypes } from '../../const';
import { EntriesBuffer } from '../buffer';

let pe: PerformanceObserver | null = null;

const getObserver = (): PerformanceObserver | null => {
	if (typeof PerformanceObserver !== 'function') {
		// Only instantiate the IntersectionObserver if it's supported
		return null;
	}
	if (pe !== null) {
		return pe;
	}
	pe = new PerformanceObserver((list) => {
		list.getEntries().forEach((entry) => {
			if (entry.entryType === PerformanceObserverEntryTypes.LayoutShift) {
				EntriesBuffer[PerformanceObserverEntryTypes.LayoutShift].push(entry);
			}
			if (entry.entryType === PerformanceObserverEntryTypes.LongTask) {
				EntriesBuffer[PerformanceObserverEntryTypes.LongTask].push(entry);
			}
		});
	});

	return pe;
};

export const startLSObserver = () => {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LayoutShift,
		buffered: true,
	});
};

export const startLTObserver = () => {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LongTask,
		buffered: true,
	});
};
