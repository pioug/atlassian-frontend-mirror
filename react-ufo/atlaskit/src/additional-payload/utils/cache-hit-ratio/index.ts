type CacheHitRatio = {
	cacheHitRatio?: number;
	preloadCacheHitRatio?: number;
};

/* Borrowed from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/performance/browser-metrics/src/plugins/timings/resource.ts */
const cacheableTypes = ['script', 'link'];

const CACHE_NETWORK = 'network';
const CACHE_MEMORY = 'memory';
const CACHE_DISK = 'disk';

const calculateTransferType = (type: string, duration: number, size: number | undefined) => {
	if (!cacheableTypes.includes(type)) {
		return CACHE_NETWORK;
	}

	if ((size === undefined || size === 0) && duration === 0) {
		return CACHE_MEMORY;
	}
	if (size === 0 && duration > 0) {
		return CACHE_DISK;
	}
	if (size === undefined) {
		return null;
	}

	return CACHE_NETWORK;
};

export const getCacheHitRatio = ({ start }: { start: number }): CacheHitRatio => {
	let fromCache = 0;
	let preloadFromCache = 0;
	let total = 0;
	let totalPreload = 0;

	// initial load only
	if (start !== 0) {
		return {};
	}

	try {
		for (const entry of performance.getEntriesByType('resource') as PerformanceResourceTiming[]) {
			// The BM3 resource timing collector checks for whether the timing information is available,
			// but we can make the assumption that it is for this Jira specific collector.
			const transferType = calculateTransferType(
				entry.initiatorType,
				entry.duration,
				entry.transferSize,
			);
			const isPreload = entry.initiatorType === 'link';
			if (transferType === 'disk' || transferType === 'memory') {
				fromCache += 1;
				if (isPreload) {
					preloadFromCache += 1;
				}
			}
			if (transferType !== null) {
				total += 1;
				if (isPreload) {
					totalPreload += 1;
				}
			}
		}
		const result: CacheHitRatio = {};
		if (total > 0) {
			result.cacheHitRatio = fromCache / total;
		}
		if (totalPreload > 0) {
			result.preloadCacheHitRatio = preloadFromCache / totalPreload;
		}
		return result;
	} catch (e: unknown) {
		return {};
	}
};
