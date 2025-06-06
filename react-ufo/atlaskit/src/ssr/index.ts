import { fg } from '@atlaskit/platform-feature-flags';

export type FeatureFlagValue = boolean | string | number | Record<any, any>;
export type ReportedTiming = { startTime: number; duration: number; size?: number };

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

function filterEntry(entry: ReportedTiming) {
	return !(!entry || typeof entry !== 'object' || entry.startTime < 0 || entry.duration < 0);
}

function mapEntry(entry: ReportedTiming) {
	return {
		startTime: Math.round(entry.startTime),
		duration: Math.round(entry.duration),
		...(entry.size && fg('platform_ufo_ssr_size_field') ? { size: Math.round(entry.size) } : {}),
	};
}

const SSR_PREFIX = 'ssr';
function mapKey(key: string) {
	if (key === 'total') {
		return SSR_PREFIX;
	}
	return `${SSR_PREFIX}${NESTED_METRIC_SEPARATOR}${key}`;
}

let config: SSRConfig | null;

export function configure(ssrConfig: SSRConfig) {
	config = ssrConfig;
}

export function getSSRTimings(): ReportedTimings {
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
}

export function getSSRSuccess(): boolean {
	return !!config?.getDoneMark();
}

export function getSSRDoneTime(): number | undefined {
	return config?.getDoneMark() ?? undefined;
}

export function getSSRFeatureFlags(): SSRFeatureFlags | undefined {
	if (!config?.getFeatureFlags) {
		return undefined;
	}

	try {
		return config.getFeatureFlags() ?? undefined;
		// eslint-disable-next-line no-empty
	} catch (e) {}
	return undefined;
}
