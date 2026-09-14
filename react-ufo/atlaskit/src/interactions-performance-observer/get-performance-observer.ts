import { setInteractionPerformanceEvent } from './set-interaction-performance-event';

let performanceEventObserver: PerformanceObserver | undefined;

export const getPerformanceObserver = (): PerformanceObserver => {
	performanceEventObserver =
		performanceEventObserver ||
		new PerformanceObserver((entries: PerformanceObserverEntryList) => {
			const list = entries.getEntries();
			for (const entry of list) {
				if (entry.name === 'click') {
					setInteractionPerformanceEvent(entry as PerformanceEventTiming);
				}
			}
		});
	return performanceEventObserver;
};
