import { PerformanceObserverEntryTypes } from '../../const';
import { getObserver } from './get-observer';

export function startLTObserver(): void {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LongTask,
		buffered: true,
	});
}
