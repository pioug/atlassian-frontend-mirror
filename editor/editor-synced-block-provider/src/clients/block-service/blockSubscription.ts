import { type Client, createClient } from 'graphql-ws';

import { isSSR } from '@atlaskit/editor-common/core-utils';

import {
	BLOCK_SERVICE_SUBSCRIPTION_QUERY,
	parseSubscriptionPayload,
	type BlockSubscriptionPayload,
	type ParsedBlockSubscriptionData,
} from './sharedSubscriptionUtils';

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

type SubscriptionCallback = (data: ParsedBlockSubscriptionData) => void;
type ErrorCallback = (error: Error) => void;
type Unsubscribe = () => void;


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
			query: BLOCK_SERVICE_SUBSCRIPTION_QUERY,
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
