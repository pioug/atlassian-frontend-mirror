import { PerformanceObserverEntryTypes } from '../../const';

import { getObserver } from './get-observer';

export function startLSObserver(): void {
	getObserver()?.observe({
		type: PerformanceObserverEntryTypes.LayoutShift,
		buffered: true,
	});
}
