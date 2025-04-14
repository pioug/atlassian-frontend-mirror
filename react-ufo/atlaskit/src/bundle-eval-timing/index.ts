import { roundEpsilon } from '../round-number';
import { withProfiling } from '../self-measurements';

type MappedPerformanceMark = { type: 'start' | 'end'; name: string };

export type BundleEvalTimingsConfig = {
	mapPerformanceMark: (mark: string) => MappedPerformanceMark | null;
};

type ReportedTimings = {
	[key: string]: { startTime: number; duration: number };
};

let config: BundleEvalTimingsConfig | null = null;

export const configure = withProfiling(function configure(
	bundleEvalTimingConfiguration: BundleEvalTimingsConfig,
) {
	config = bundleEvalTimingConfiguration;
});

const getPerformanceObject = withProfiling(function getPerformanceObject() {
	return (window ?? {}).performance;
});

export const getBundleEvalTimings = withProfiling(function getBundleEvalTimings(
	interactionStartTime: number,
): ReportedTimings {
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
});
