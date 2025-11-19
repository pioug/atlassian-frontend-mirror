//

export type FeatureFlagValue = boolean | string | number | Record<any, any>;
export type ReportedTiming = { startTime: number; duration: number; size?: number };

export type ReportedTimings = {
	[key: string]: ReportedTiming;
};

export type SSRFeatureFlags = { [key: string]: FeatureFlagValue };

export type SSRConfig = {
	/**
	 * Used to represent whether SSR as a whole was considered successful. You can consider this the success of the "render" phase success.
	 * Also may be used as the FMP mark
	 */
	getDoneMark: () => number | null;
	/**
	 * Used to represent whether certain phases within were successful.
	 * It is encouraged to send false even if the phase only partially failed and rely on ssr-side logging/metrics to disambiguate failure severity
	 */
	getSsrPhaseSuccess?: () => {
		/**
		 * The "prefetch" phase in SSR - where SSR fetches remote data necessary for rendering the page.
		 * If any of the fetches fail, this should be false, use server side logging/metrics to dive into more detail into the nature of the failure.
		 * UFO - which is client-side only - may not know the nature of the failure if SSR as a whole failed and a static fallback was given to the client.
		 */
		prefetch?: boolean;
		/**
		 * The "earlyFLush" phase in SSR - where SSR sends the first flush to the client.
		 * This is generally expected to be earlier than / independant of the prefetch data and may even be non-visual (eg: <link rel="preload" href="..."> tags).
		 */
		earlyFlush?: boolean;
		/**
		 * "done" if present can override the presence / absence of the done mark in the overral SSR success status ('ssr:success').
		 */
		done?: boolean;
	};
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
		...(entry.size ? { size: Math.round(entry.size) } : {}),
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

export function configure(ssrConfig: SSRConfig): void {
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

export function getSSRPhaseSuccess():
	| { prefetch?: boolean; earlyFlush?: boolean; done?: boolean }
	| undefined {
	return config?.getSsrPhaseSuccess?.();
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
