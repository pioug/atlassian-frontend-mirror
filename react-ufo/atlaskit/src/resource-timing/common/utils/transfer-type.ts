const alwaysCacheableTypes = ['script', 'link'];
const CACHE_NETWORK = 'network';
const CACHE_MEMORY = 'memory';
const CACHE_DISK = 'disk';

export function isCacheableType(url: string, type: string): boolean {
	if (alwaysCacheableTypes.includes(type)) {
		return true;
	}

	if (type === 'other' && url.includes('.js')) {
		return true;
	}

	return false;
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function calculateTransferType(
	name: string,
	type: string,
	duration: number,
	size: number | void,
): string | null {
	if (!isCacheableType(name, type)) {
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
}
