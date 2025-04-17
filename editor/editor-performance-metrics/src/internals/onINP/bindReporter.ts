// Adapted from https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/bindReporter.ts
import { type Metric } from './index';

export const bindReporter = (callback: (metric: Metric) => void) => {
	let prevValue: number;
	let delta: number;
	return (metric: Metric) => {
		if (metric.value >= 0) {
			delta = metric.value - (prevValue || 0);

			// Report the metric if there's a non-zero delta or if no previous
			// value exists (which can happen in the case of the document becoming
			// hidden when the metric value is 0).
			// See: https://github.com/GoogleChrome/web-vitals/issues/14
			if (delta || prevValue === undefined) {
				prevValue = metric.value;
				metric.delta = delta;
				callback(metric);
			}
		}
	};
};
