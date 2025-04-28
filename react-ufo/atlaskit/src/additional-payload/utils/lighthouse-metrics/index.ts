import { getCLS } from './cls';
import { PerformanceObserverEntryTypes } from './const';
import { getTBT } from './tbt';
import { EntriesBuffer } from './utils/buffer';
import { startLSObserver, startLTObserver } from './utils/observer';

export function startLighthouseObserver() {
	startLSObserver();
	startLTObserver();
}

export function getLighthouseMetrics({ start, stop }: { start: number; stop: number }): {
	[key: string]: number;
} {
	const tbt = getTBT(start, stop, EntriesBuffer[PerformanceObserverEntryTypes.LongTask]);

	// no round as CLS is usually 0-1
	const cls = getCLS(start, stop, EntriesBuffer[PerformanceObserverEntryTypes.LayoutShift]);
	return {
		'metric:tbt': Math.round(tbt.total),
		'metric:tbt:observed': Math.round(tbt.observed),
		'metric:cls': cls,
	};
}
