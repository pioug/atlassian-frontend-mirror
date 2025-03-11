export type ResourceEntry = {
	name: string;
	initiatorType: string;
	// Safari returns undefined https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/transferSize
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	transferSize: number | undefined;
	startTime: number;
	duration: number;
	responseStart: number;
	requestStart: number;
	fetchStart: number;
	workerStart: number;
	serverTime?: number;
	networkTime?: number;
	encodedSize?: number | null;
	decodedSize?: number | null;
};

export type ResourceTimingsConfig = {
	sanitiseEndpoints: (url: string) => string | null;
	mapResources: (url: string) => string | null;
	xhrFilter?: (url: string) => boolean;
	hasTimingHeaders?: (url: string) => boolean;
};

interface BasicResourceTiming {
	startTime: number;
	duration: number;
	type: string;
	workerStart: number;
	fetchStart: number;
	count?: number;
}

interface CacheableResourceTiming extends BasicResourceTiming {
	transferType: string;
	ttfb?: number;
}

interface NonCacheableResourceTiming extends BasicResourceTiming {
	size: number;
	ttfb: number;
}

export type ResourceTiming =
	| BasicResourceTiming
	| NonCacheableResourceTiming
	| CacheableResourceTiming;

export type ResourceTimings = {
	[key: string]: ResourceTiming;
};
