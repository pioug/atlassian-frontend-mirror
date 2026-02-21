import { type Client, createClient } from 'graphql-ws';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { isSSR } from '@atlaskit/editor-common/core-utils';

import type { SyncBlockProduct } from '../../common/types';
import { convertContentUpdatedAt } from '../../utils/utils';

const GRAPHQL_WS_ENDPOINT = '/gateway/api/graphql/subscriptions';

let blockServiceClient: Client | null = null;

const getBlockServiceClient = (): Client | null => {
	// Don't create client during SSR
	if (isSSR()) {
		return null;
	}

	if (!blockServiceClient) {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const wsUrl = `${protocol}//${window.location.host}${GRAPHQL_WS_ENDPOINT}`;

		blockServiceClient = createClient({
			url: wsUrl,
			lazy: true,
			retryAttempts: 3,
		});
	}

	return blockServiceClient;
};

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

const SUBSCRIPTION_QUERY = `
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

type SubscriptionCallback = (data: ParsedBlockSubscriptionData) => void;
type ErrorCallback = (error: Error) => void;
type Unsubscribe = () => void;

/**
 * Extracts the resourceId from a block ARI.
 * Block ARI format: ari:cloud:blocks:<cloudId>:synced-block/<resourceId>
 * @param blockAri - The block ARI string
 * @returns The resourceId portion of the ARI
 */
const extractResourceIdFromBlockAri = (blockAri: string): string | null => {
	// eslint-disable-next-line require-unicode-regexp
	const match = blockAri.match(/ari:cloud:blocks:[^:]+:synced-block\/(.+)$/);
	return match?.[1] || null;
};

/**
 * Parses the subscription payload into a standardized format.
 * @param payload - The raw subscription payload
 * @returns Parsed block data or null if parsing fails
 */
const parseSubscriptionPayload = (
	payload: BlockSubscriptionPayload,
): ParsedBlockSubscriptionData | null => {
	try {
		const resourceId = extractResourceIdFromBlockAri(payload.blockAri);
		if (!resourceId) {
			return null;
		}

		let createdAt: string | undefined;
		if (payload.createdAt !== undefined && payload.createdAt !== null) {
			try {
				// BE returns microseconds, convert to milliseconds
				createdAt = new Date(payload.createdAt / 1000).toISOString();
			} catch {
				createdAt = undefined;
			}
		}

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

/**
 * Creates a GraphQL subscription to block updates using the shared graphql-ws client.
 *
 * @param blockAri - The full block ARI to subscribe to (ari:cloud:blocks:{cloudId}:synced-block/{resourceId})
 * @param onData - Callback function invoked when block data is updated
 * @param onError - Optional callback function invoked on subscription errors
 * @returns Unsubscribe function to close the subscription
 */
export const subscribeToBlockUpdates = (
	blockAri: string,
	onData: SubscriptionCallback,
	onError?: ErrorCallback,
): Unsubscribe => {
	const client = getBlockServiceClient();

	if (!client) {
		// Return a no-op unsubscribe if client is not available (e.g., SSR)
		return () => {};
	}

	const unsubscribe = client.subscribe<{
		blockService_onBlockUpdated: BlockSubscriptionPayload | null;
	}>(
		{
			query: SUBSCRIPTION_QUERY,
			variables: { resourceId: blockAri },
			operationName: 'EDITOR_SYNCED_BLOCK_ON_BLOCK_UPDATED',
		},
		{
			next: (value) => {
				if (value.data?.blockService_onBlockUpdated) {
					const parsed = parseSubscriptionPayload(value.data.blockService_onBlockUpdated);
					if (parsed !== null) {
						onData(parsed);
					} else {
						onError?.(new Error('Failed to parse block subscription payload'));
					}
				}
			},
			error: (error) => {
				const errorMessage = error instanceof Error ? error.message : 'GraphQL subscription error';
				onError?.(new Error(errorMessage));
			},
			complete: () => {
				// Subscription completed
			},
		},
	);

	return unsubscribe;
};
