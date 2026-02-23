import { parseSubscriptionPayload, type BlockSubscriptionPayload, type ParsedBlockSubscriptionData } from '../clients/block-service/sharedSubscriptionUtils';
import type { ResourceId } from '../common/types';
import type { SyncBlockInstance } from '../providers/types';

import { normaliseSyncBlockStatus } from './validValue';

export type RelayBlockUpdateResponse = {
	blockAri: string;
	blockInstanceId: string;
	content: string;
	contentUpdatedAt?: number | null;
	createdAt: number;
	createdBy: string;
	deletionReason?: string | null;
	product: string;
	sourceAri: string;
	status: string;
};

/**
 * Converts parsed subscription data to SyncBlockInstance format.
 *
 * @param parsed - The parsed subscription data
 * @param resourceId - The resource ID for the block
 * @returns A SyncBlockInstance
 */
export function convertParsedDataToSyncBlockInstance(
	parsed: ParsedBlockSubscriptionData,
	resourceId: ResourceId,
): SyncBlockInstance {
	return {
		data: {
			content: parsed.content,
			contentUpdatedAt: parsed.contentUpdatedAt,
			resourceId: parsed.blockAri,
			blockInstanceId: parsed.blockInstanceId,
			sourceAri: parsed.sourceAri,
			product: parsed.product,
			createdAt: parsed.createdAt,
			createdBy: parsed.createdBy,
			status: normaliseSyncBlockStatus(parsed.status),
		},
		resourceId,
	};
}

/**
 * Converts a Relay subscription response to SyncBlockInstance format using shared parsing logic.

 * @param response - The Relay subscription response containing block update data
 * @param resourceId - The resource ID for the block
 * @returns A SyncBlockInstance or null if parsing fails
 * 
 * @example
 * ```typescript
 * // In a Relay subscription handler
 * onNext: (response) => {
 *   if (response?.blockService_onBlockUpdated) {
 *     const syncBlockInstance = convertRelayResponseToSyncBlockInstance(
 *       response.blockService_onBlockUpdated,
 *       resourceId,
 *     );
 *     if (syncBlockInstance) {
 *       onUpdate(syncBlockInstance);
 *     }
 *   }
 * }
 * ```
 */
export function convertRelayResponseToSyncBlockInstance(
	response: RelayBlockUpdateResponse,
	resourceId: ResourceId,
): SyncBlockInstance | null {
	const payload: BlockSubscriptionPayload = {
		blockAri: response.blockAri,
		blockInstanceId: response.blockInstanceId,
		content: response.content,
		contentUpdatedAt: response.contentUpdatedAt ?? undefined,
		createdAt: response.createdAt,
		createdBy: response.createdBy,
		deletionReason: response.deletionReason ?? undefined,
		product: response.product,
		sourceAri: response.sourceAri,
		status: response.status,
	};

	const parsed = parseSubscriptionPayload(payload);
	if (!parsed) {
		return null;
	}

	return convertParsedDataToSyncBlockInstance(parsed, resourceId);
}