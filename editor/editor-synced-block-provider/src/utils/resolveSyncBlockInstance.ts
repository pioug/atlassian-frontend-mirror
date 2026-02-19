import { fg } from '@atlaskit/platform-feature-flags';

import { getPageIdAndTypeFromConfluencePageAri } from '../clients/confluence/ari';
import { SyncBlockError } from '../common/types';
import type { SyncBlockInstance } from '../providers/types';

/**
 * Merges two SyncBlockInstance objects,
 * preserving sourceURL, sourceTitle, sourceSubType, and onSameDocument from the old result
 * when the new result does not have them.
 * This can be extended in the future to resolve other conflicts as needed,
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
			newResult.error?.type === SyncBlockError.NotFound ||
			newResult.error?.type === SyncBlockError.Forbidden
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
			sourceSubType: fg('platform_synced_block_patch_3')
				? mergeSubType(oldResult, newResult)
				: newResult.data?.sourceSubType || oldResult.data?.sourceSubType || undefined,
			onSameDocument: newResult.data?.onSameDocument || oldResult.data?.onSameDocument || undefined,
		},
	};
};

const mergeSubType = (
	oldResult: SyncBlockInstance,
	newResult: SyncBlockInstance,
): string | null | undefined => {
	// for classic pages, subType is 'null'
	if (newResult.data?.sourceSubType !== undefined) {
		return newResult.data.sourceSubType;
	}

	if (newResult.data?.sourceAri) {
		// for blogposts, subType is always undefined
		try {
			const { type: pageType } = getPageIdAndTypeFromConfluencePageAri({
				ari: newResult.data?.sourceAri,
			});
			if (pageType === 'blogpost') {
				return newResult.data?.sourceSubType;
			}
		} catch {}
	}

	return oldResult.data?.sourceSubType;
};
