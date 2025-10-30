import type { FetchSyncBlockDataResult } from '../providers/types';

/**
 * Merges two FetchSyncBlockDataResult objects,
 * currently it only preserves the sourceURL from the old result,
 * but this can be extended in the future to preserve other fields and resolve conflicts as needed.
 * e.g. compare timestamps or version numbers to determine which data is more recent.
 *
 * @param oldResult - The existing FetchSyncBlockDataResult object.
 * @param newResult - The new FetchSyncBlockDataResult object to merge.
 * @returns A merged FetchSyncBlockDataResult object.
 */
export const resolveFetchSyncBlockDataResult = (
	oldResult: FetchSyncBlockDataResult,
	newResult: FetchSyncBlockDataResult,
): FetchSyncBlockDataResult => {
	// if the old result has no data, we simple return the new result
	if (!oldResult.data) {
		return newResult;
	} else if (!newResult.data) {
		// if the new result has no data, we simply return the old result
		// TODO: EDITOR-2533 - handle this case based on the error type and whether we should keep old data or not
		return oldResult;
	}

	// otherwise, we merge the two results, preserving the sourceURL from the old result if it exists
	return {
		...newResult,
		data: {
			...newResult.data,
			sourceURL: newResult.data?.sourceURL || oldResult.data?.sourceURL || undefined,
		},
	};
};
