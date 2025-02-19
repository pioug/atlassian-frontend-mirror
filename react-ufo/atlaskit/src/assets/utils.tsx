/* Borrowed from https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/performance/browser-metrics/src/plugins/timings/resource.ts */
export const cacheableTypes = ['script', 'link'];

export const MEMORY_KEY = 'mem';

export const DISK_KEY = 'disk';

export const NETWORK_KEY = 'net';

export const calculateTransferType = (type: string, duration: number, size: number | undefined) => {
	if (!cacheableTypes.includes(type)) {
		return null;
	}

	if ((size === undefined || size === 0) && duration === 0) {
		return MEMORY_KEY;
	}
	if (size === 0 && duration > 0) {
		return DISK_KEY;
	}
	if (size === undefined) {
		return null;
	}

	return NETWORK_KEY;
};

export const round = (n: number) => {
	if (isNaN(n)) {
		return 0;
	}
	return Math.round(n * 10000) / 10000;
};
