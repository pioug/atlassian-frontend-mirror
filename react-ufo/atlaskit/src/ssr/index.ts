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

function getPerformanceNavigationTiming() {
	// getEntriesByType doesn't change the returned type based on the given type key
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return performance.getEntriesByType('navigation')?.[0] as PerformanceNavigationTiming;
}

function getServerTimingsByName() {
	const serverTimingsByName: Record<string, PerformanceServerTiming> = Object.fromEntries(
		getPerformanceNavigationTiming()?.serverTiming?.map(
			(timing) => [timing.name, timing] as const,
		) ?? [],
	);
	return serverTimingsByName;
}

/**
 * If we have the edge's view of ttfb and the clients view as well, then we should take the gap between them as
 * the offset to use foe edge start time.
 * This will simulate the network delays between the client and the edge as an edge startTime increase
 */
function getEdgeOffset(edgeTtfb: number | null | undefined): number {
	const clientTtfb = getPerformanceNavigationTiming()?.responseStart;
	if (edgeTtfb == null || clientTtfb == null) {
		return 0;
	}
	return clientTtfb - edgeTtfb;
}

export function getEdgeTimingsIncludingCloudfront(): ReportedTimings | null {
	const serverTimingsByName = getServerTimingsByName();

	const edgeTotalDuration =
		serverTimingsByName['cdn-downstream-fbl']?.duration ??
		serverTimingsByName['atl-edge']?.duration;

	if (!edgeTotalDuration) {
		return null;
	}

	const edgeOffset = getEdgeOffset(edgeTotalDuration);

	const cfInternalDuration =
		(serverTimingsByName['cdn-upstream-dns']?.duration || 0) +
		(serverTimingsByName['cdn-upstream-connect']?.duration || 0);

	const cfUpstreamDuration =
		(serverTimingsByName['cdn-upstream-fbl']?.duration || 0) - cfInternalDuration;

	const cfDownstreamDuration =
		(serverTimingsByName['cdn-downstream-fbl']?.duration || 0) -
		(serverTimingsByName['cdn-upstream-fbl']?.duration || 0);

	const atlEdgeDuration = serverTimingsByName['atl-edge']?.duration;

	const cfToAtlEdgeNetworkDuration = cfUpstreamDuration - atlEdgeDuration;

	const edgeTimings: Record<string, ReportedTiming> = {
		edge: { startTime: edgeOffset, duration: edgeTotalDuration },
	};

	if (typeof serverTimingsByName['cdn-downstream-fbl'] !== 'undefined') {
		edgeTimings['edge/cf'] = {
			startTime: edgeOffset,
			duration: serverTimingsByName['cdn-downstream-fbl']?.duration,
		};
		edgeTimings['edge/cf/internal'] = { startTime: edgeOffset, duration: cfInternalDuration };
		edgeTimings['edge/cf/upstream'] = {
			startTime: edgeOffset + cfInternalDuration,
			duration: cfUpstreamDuration,
		};
		edgeTimings['edge/cf/downstream'] = {
			startTime: edgeOffset + cfInternalDuration + cfUpstreamDuration,
			duration: cfDownstreamDuration,
		};
	}

	if (typeof serverTimingsByName['atl-edge'] !== 'undefined') {
		edgeTimings['edge/atl-edge'] = {
			startTime: edgeOffset + cfInternalDuration + cfToAtlEdgeNetworkDuration,
			duration: atlEdgeDuration,
		};
		edgeTimings['edge/atl-edge/internal'] = {
			startTime: edgeOffset + cfInternalDuration + cfToAtlEdgeNetworkDuration,
			duration: serverTimingsByName['atl-edge-internal']?.duration,
		};
		edgeTimings['edge/atl-edge/ttfb'] = {
			startTime: edgeOffset + cfInternalDuration + cfToAtlEdgeNetworkDuration,
			duration: atlEdgeDuration,
		};
		edgeTimings['edge/cf/upstream/network'] = {
			startTime: edgeOffset + cfInternalDuration,
			duration: cfToAtlEdgeNetworkDuration,
		};
	}

	// we need a timer here to prevent UFO pipeline from shifting SSR timers to start at 0
	edgeTimings?.edge &&
		edgeOffset &&
		Object.assign(edgeTimings, {
			'client-network': {
				startTime: 0,
				duration: edgeOffset,
			},
		});
	return edgeTimings;
}

export function getSSRTimings(): ReportedTimings {
	const defaultSSRTimings = getEdgeTimingsIncludingCloudfront() || {};

	let configTimings: ReportedTimings | null = {};

	if (typeof config?.getTimings === 'function') {
		configTimings = config.getTimings();
	}

	const ssrTimings = Object.entries({ ...configTimings, ...defaultSSRTimings }).reduce(
		(acc: ReportedTimings, entry: Entry) => {
			if (filterEntry(entry[1])) {
				acc[mapKey(entry[0])] = mapEntry(entry[1]);
			}
			return acc;
		},
		{},
	);

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
	} catch {}
	return undefined;
}
