import { createClient } from 'graphql-ws';
import type { Client } from 'graphql-ws';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SyncBlockProduct } from '../../common/types';
import { convertContentUpdatedAt } from '../../utils/utils';

const GRAPHQL_WS_ENDPOINT = '/gateway/api/graphql/subscriptions';

let blockServiceClient: Client | null = null;

/**
 * Tracks the last known WebSocket connection context for diagnostics.
 * Since browser WebSocket errors are intentionally opaque ({isTrusted: true}),
 * we capture lifecycle events to provide meaningful context when errors occur.
 */
const connectionDiagnostics = {
	/** Whether the last connection attempt was a retry */
	wasRetry: false,
	/** Timestamp of the last successful connection */
	lastConnectedAt: 0,
	/** The close code from the most recent WebSocket CloseEvent, see (https://websocket.org/reference/close-codes/)*/
	lastCloseCode: 0,
	/** The close reason from the most recent WebSocket CloseEvent */
	lastCloseReason: '',
	/** Whether the last close was clean */
	lastCloseWasClean: true,
	/** Current connection state */
	state: 'idle' as 'idle' | 'connecting' | 'connected' | 'closed' | 'error',
	/** Number of consecutive connection failures */
	consecutiveFailures: 0,
};

/**
 * Returns a diagnostic summary string from the last known connection state.
 * This provides context that the opaque WebSocket error events cannot.
 */
export const getConnectionDiagnosticsSummary = (): string => {
	const parts: string[] = [];

	if (connectionDiagnostics.lastCloseCode !== 0) {
		parts.push(`lastCloseCode=${connectionDiagnostics.lastCloseCode}`);
		parts.push(`lastCloseReason="${connectionDiagnostics.lastCloseReason || 'none'}"`);
		parts.push(`wasClean=${connectionDiagnostics.lastCloseWasClean}`);
	}

	parts.push(`state=${connectionDiagnostics.state}`);
	parts.push(`wasRetry=${connectionDiagnostics.wasRetry}`);
	parts.push(`consecutiveFailures=${connectionDiagnostics.consecutiveFailures}`);

	if (connectionDiagnostics.lastConnectedAt > 0) {
		const elapsed = Date.now() - connectionDiagnostics.lastConnectedAt;
		parts.push(`timeSinceLastConnection=${elapsed}ms`);
	}

	return parts.join(', ');
};

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
			on: fg('platform_synced_block_add_info_web_socket_error')
				? {
						connecting: (isRetry) => {
							connectionDiagnostics.wasRetry = isRetry;
							connectionDiagnostics.state = 'connecting';
						},
						connected: (_socket, _payload, wasRetry) => {
							connectionDiagnostics.state = 'connected';
							connectionDiagnostics.lastConnectedAt = Date.now();
							connectionDiagnostics.wasRetry = wasRetry;
							connectionDiagnostics.consecutiveFailures = 0;
						},
						closed: (event) => {
							connectionDiagnostics.state = 'closed';
							const closeEvent = event as {
								code?: number;
								reason?: string;
								wasClean?: boolean;
							};
							connectionDiagnostics.lastCloseCode = closeEvent.code ?? 0;
							connectionDiagnostics.lastCloseReason = closeEvent.reason ?? '';
							connectionDiagnostics.lastCloseWasClean = closeEvent.wasClean ?? false;
						},
						error: () => {
							connectionDiagnostics.state = 'error';
							connectionDiagnostics.consecutiveFailures += 1;
						},
					}
				: undefined,
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
 * Extracts a meaningful error message from the error: GraphQL WebSocket Error: {"isTrusted":true}
 *
 * @param error - The error passed to the sink's error callback
 * @returns A descriptive error message string
 */
export const extractGraphQLWSErrorMessage = (error: unknown): string => {
	const diagnostics = getConnectionDiagnosticsSummary();

	// Raw Event from WebSocket.onerror — browsers don't expose error details
	// for security reasons, so {isTrusted: true} is all we get.
	if (typeof error === 'object' && error !== null && 'isTrusted' in error) {
		return `GraphQL WebSocket connection error (browser restricted error details). Diagnostics: ${diagnostics}`;
	}

	if (error instanceof Error) {
		return error.message;
	}

	// Fallback: try to stringify whatever we got
	try {
		const serialized = JSON.stringify(error);
		return `GraphQL subscription error: ${serialized}`;
	} catch {
		return 'GraphQL subscription error: unknown error';
	}
};

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
			createdAt = new Date(payload.createdAt).toISOString();
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
				if (fg('platform_synced_block_add_info_web_socket_error')) {
					onError?.(new Error(extractGraphQLWSErrorMessage(error)));
				} else {
					const errorMessage =
						error instanceof Error ? error.message : 'GraphQL subscription error';
					onError?.(new Error(errorMessage));
				}
			},
			complete: () => {
				// Subscription completed
			},
		},
	);

	return unsubscribe;
};
