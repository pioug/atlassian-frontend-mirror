import { roundEpsilon } from '../round-number';

import type { BundleEvalTimingsConfig, ReportedTimings } from './types';

export type { BundleEvalTimingsConfig } from './types';

let config: BundleEvalTimingsConfig | null = null;

export function configure(bundleEvalTimingConfiguration: BundleEvalTimingsConfig): void {
	config = bundleEvalTimingConfiguration;
}

function getPerformanceObject() {
	return (window ?? {}).performance;
}

export function getBundleEvalTimings(interactionStartTime: number): ReportedTimings {
	if (config == null) {
		return {};
	}

	const started: { [key: string]: PerformanceEntry } = {};
	const timings: {
		[key: string]: { startTime: number; duration: number };
	} = {};

	const cachedConfig = config;
	const performance = getPerformanceObject();
	performance?.getEntriesByType('mark').forEach((mark) => {
		const result = cachedConfig.mapPerformanceMark(mark.name);
		if (!result) {
			return;
		}
		const { type, name } = result;

		if (type === 'start' && mark.startTime >= interactionStartTime) {
			started[name] = mark;
			return;
		}

		if (type === 'end' && started[name]) {
			timings[name] = {
				startTime: roundEpsilon(started[name].startTime - interactionStartTime),
				duration: roundEpsilon(mark.startTime - started[name].startTime),
			};
			delete started[name];
		}
	});

	if (Object.keys(timings).length === 0) {
		return {};
	}

	return timings;
}
