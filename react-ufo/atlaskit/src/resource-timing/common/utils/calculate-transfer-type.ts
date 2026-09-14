import { isCacheableType } from './is-cacheable-type';
import { CACHE_DISK, CACHE_MEMORY, CACHE_NETWORK } from './transfer-type';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type, @atlaskit/volt-strict-mode/no-multiple-exports
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
