import type { ResourceEntry } from '../resource-timing/common/types';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function checkIfTimingsAvailable(entry: ResourceEntry): boolean {
	if (
		entry.decodedSize === 0 &&
		entry.encodedSize === 0 &&
		entry.requestStart === 0 &&
		entry.responseStart === 0
	) {
		return false;
	}

	return true;
}
