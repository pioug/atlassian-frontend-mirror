import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { SyncBlockProduct } from '../../common/types';
import { convertContentUpdatedAt } from '../../utils/utils';
/**
 * Shared GraphQL subscription query for block updates.
 * This is the canonical subscription query used across all implementations.
 */
export const BLOCK_SERVICE_SUBSCRIPTION_QUERY = `
subscription EDITOR_SYNCED_BLOCK_ON_BLOCK_UPDATED($resourceId: ID!) {
	blockService_onBlockUpdated(resourceId: $resourceId) {
		blockAri
		blockInstanceId
		content
		contentUpdatedAt
		createdAt
		createdBy
		deletionReason
		product
		sourceAri
		status
	}
}
`;

/**
 * Raw subscription payload from the GraphQL subscription.
 * This represents the exact shape returned by the blockService_onBlockUpdated subscription.
 */
export type BlockSubscriptionPayload = {
	blockAri: string;
	blockInstanceId: string;
	content: string;
	contentUpdatedAt?: number;
	createdAt: number;
	createdBy: string;
	deletionReason?: string;
	product: string;
	sourceAri: string;
	status: string;
};

/**
 * Parsed and normalized block subscription data.
 * This is the standardized format used across different subscription implementations.
 */
export type ParsedBlockSubscriptionData = {
	blockAri: string;
	blockInstanceId: string;
	content: ADFEntity[];
	contentUpdatedAt?: string;
	createdAt?: string;
	createdBy: string;
	product: SyncBlockProduct;
	resourceId: string;
	sourceAri: string;
	status: string;
};

/**
 * Extracts the resourceId from a block ARI.
 * Block ARI format: ari:cloud:blocks:<cloudId>:synced-block/<resourceId>
 * @param blockAri - The block ARI string
 * @returns The resourceId portion of the ARI
 */
export const extractResourceIdFromBlockAri = (blockAri: string): string | null => {
	// eslint-disable-next-line require-unicode-regexp
	const match = blockAri.match(/ari:cloud:blocks:[^:]+:synced-block\/(.+)$/);
	return match?.[1] || null;
};

/**
 * Converts a timestamp to ISO string.
 * @param timestamp - Timestamp in milliseconds
 * @returns ISO string or undefined if conversion fails
 */
export const convertTimestampToISOString = (timestamp?: number): string | undefined => {
	if (timestamp === undefined || timestamp === null) {
		return undefined;
	}
	
	try {
		return new Date(timestamp).toISOString();
	} catch {
		return undefined;
	}
};

/**
 * Parses the raw subscription payload into a standardized format.
 * This function handles all the data transformation and error handling consistently
 * across different subscription implementations.
 * 
 * @param payload - The raw subscription payload
 * @returns Parsed block data or null if parsing fails
 */
export const parseSubscriptionPayload = (
	payload: BlockSubscriptionPayload,
): ParsedBlockSubscriptionData | null => {
	try {
		const resourceId = extractResourceIdFromBlockAri(payload.blockAri);
		if (!resourceId) {
			return null;
		}

		const createdAt = convertTimestampToISOString(payload.createdAt);

		return {
			blockAri: payload.blockAri,
			blockInstanceId: payload.blockInstanceId,
			content: JSON.parse(payload.content) as ADFEntity[],
			contentUpdatedAt: convertContentUpdatedAt(payload.contentUpdatedAt),
			createdAt,
			createdBy: payload.createdBy,
			product: payload.product as SyncBlockProduct,
			resourceId,
			sourceAri: payload.sourceAri,
			status: payload.status,
		};
	} catch {
		return null;
	}
};