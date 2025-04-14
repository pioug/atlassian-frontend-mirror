import { withProfiling } from '../self-measurements';

export type FeatureFlagValue = boolean | string | number | Record<any, any>;
export type ReportedTiming = { startTime: number; duration: number };

export type ReportedTimings = {
	[key: string]: ReportedTiming;
};

export type SSRFeatureFlags = { [key: string]: FeatureFlagValue };

export type SSRConfig = {
	getDoneMark: () => number | null;
	getFeatureFlags: () => SSRFeatureFlags | null;
	getTimings?: () => ReportedTimings | null;
};

const NESTED_METRIC_SEPARATOR = '/';

type Entry = [string, ReportedTiming];

const filterEntry = withProfiling(function filterEntry(entry: ReportedTiming) {
	return !(!entry || typeof entry !== 'object' || entry.startTime < 0 || entry.duration < 0);
});

const mapEntry = withProfiling(function mapEntry(entry: ReportedTiming) {
	return {
		startTime: Math.round(entry.startTime),
		duration: Math.round(entry.duration),
	};
});

const SSR_PREFIX = 'ssr';
const mapKey = withProfiling(function mapKey(key: string) {
	if (key === 'total') {
		return SSR_PREFIX;
	}
	return `${SSR_PREFIX}${NESTED_METRIC_SEPARATOR}${key}`;
});

let config: SSRConfig | null;

export const configure = withProfiling(function configure(ssrConfig: SSRConfig) {
	config = ssrConfig;
});

export const getSSRTimings = withProfiling(function getSSRTimings(): ReportedTimings {
	if (!config?.getTimings) {
		return {};
	}
	const timings = config.getTimings();
	if (!timings) {
		return {};
	}

	const ssrTimings = Object.entries(timings).reduce((acc: ReportedTimings, entry: Entry) => {
		if (filterEntry(entry[1])) {
			acc[mapKey(entry[0])] = mapEntry(entry[1]);
		}
		return acc;
	}, {});

	return ssrTimings;
});

export const getSSRSuccess = withProfiling(function getSSRSuccess(): boolean {
	return !!config?.getDoneMark();
});

export const getSSRDoneTime = withProfiling(function getSSRDoneTime(): number | undefined {
	return config?.getDoneMark() ?? undefined;
});

export const getSSRFeatureFlags = withProfiling(function getSSRFeatureFlags():
	| SSRFeatureFlags
	| undefined {
	if (!config?.getFeatureFlags) {
		return undefined;
	}

	try {
		return config.getFeatureFlags() ?? undefined;
		// eslint-disable-next-line no-empty
	} catch (e) {}
	return undefined;
});
