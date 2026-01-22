import { fg } from '@atlaskit/platform-feature-flags';

import { SyncBlockError } from '../common/types';
import type { SyncBlockInstance } from '../providers/types';

/**
 * Merges two SyncBlockInstance objects,
 * currently it only preserves the sourceURL from the old result,
 * but this can be extended in the future to preserve other fields and resolve conflicts as needed.
 * e.g. compare timestamps or version numbers to determine which data is more recent.
 *
 * @param oldResult - The existing SyncBlockInstance object.
 * @param newResult - The new SyncBlockInstance object to merge.
 * @returns A merged SyncBlockInstance object.
 */
export const resolveSyncBlockInstance = (
	oldResult: SyncBlockInstance,
	newResult: SyncBlockInstance,
): SyncBlockInstance => {
	// if the old result has no data, we simply return the new result
	if (!oldResult.data) {
		return newResult;
	} else if (!newResult.data) {
		// return the old result if there was an error, e.g. network error, but not if not found or forbidden
		if (
			newResult.error === SyncBlockError.NotFound ||
			newResult.error === SyncBlockError.Forbidden
		) {
			return newResult;
		} else {
			return oldResult;
		}
	}

	// otherwise, we merge the two results, preserving the sourceURL and sourceTitle from the old result if it exists
	return {
		...newResult,
		data: {
			...newResult.data,
			sourceURL: newResult.data?.sourceURL || oldResult.data?.sourceURL || undefined,
			sourceTitle: newResult.data?.sourceTitle || oldResult.data?.sourceTitle || undefined,
			...(fg('platform_synced_block_dogfooding') && {
				sourceSubType: newResult.data?.sourceSubType || oldResult.data?.sourceSubType || undefined,
                onSameDocument: newResult.data?.onSameDocument || oldResult.data?.onSameDocument || undefined,
			}),
		},
	};
};
