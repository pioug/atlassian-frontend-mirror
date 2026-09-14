import { DISK_KEY, MEMORY_KEY, NETWORK_KEY, cacheableTypes } from './utils';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function calculateTransferType(
	name: string,
	type: string,
	duration: number,
	size: number | undefined,
): 'mem' | 'disk' | 'net' | null {
	if (!cacheableTypes.includes(type) && !(type === 'other' && name.includes('.js'))) {
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
}
