import type { IEnvironment } from 'relay-runtime';
import { requestSubscription } from 'relay-runtime';

import { generateBlockAriFromReference } from '../clients/block-service/ari';
import { subscribeToBlockUpdates as subscribeToBlockUpdatesWS } from '../clients/block-service/blockSubscription';
import type { ParsedBlockSubscriptionData } from '../clients/block-service/sharedSubscriptionUtils';
import type { ResourceId } from '../common/types';
import type { 
	BlockSubscriptionErrorCallback,
	BlockUpdateCallback,
	Unsubscribe,
} from '../providers/types';

import relaySubscriptionUtilsSubscriptionDocument, { type relaySubscriptionUtilsSubscription as relaySubscriptionUtilsSubscriptionType } from './__generated__/relaySubscriptionUtilsSubscription.graphql';
import { convertRelayResponseToSyncBlockInstance, convertParsedDataToSyncBlockInstance } from './relayResponseConverter';

/**
 * Configuration for creating a Relay block subscription.
 */
export interface RelayBlockSubscriptionConfig {
	/** Cloud ID for generating block ARIs */
	cloudId: string;
	/** Optional callback when subscription errors occur */
	onError?: BlockSubscriptionErrorCallback;
	/** Callback when block updates are received */
	onUpdate: BlockUpdateCallback;
	/** Relay environment to use for the subscription */
	relayEnvironment: IEnvironment;
	/** The resource ID to subscribe to */
	resourceId: ResourceId;
}

/**
 * Creates a Relay-based block subscription without needing to wrap providers.
 * This is a clean utility function that can be used directly in components or hooks.
 * 
 * @param config - Configuration for the subscription
 * @returns An unsubscribe function to dispose the subscription
 * 
 * @example
 * ```typescript
 * const unsubscribe = createRelayBlockSubscription({
 *   relayEnvironment: environment,
 *   cloudId: 'my-cloud-id',
 *   resourceId: 'my-resource-id',
 *   onUpdate: (blockInstance) => {
 *     console.log('Block updated:', blockInstance);
 *   },
 *   onError: (error) => {
 *     console.error('Subscription error:', error);
 *   }
 * });
 * 
 * // Later, when component unmounts or subscription is no longer needed
 * unsubscribe();
 * ```
 */
export function createRelayBlockSubscription(config: RelayBlockSubscriptionConfig): Unsubscribe {
	const { relayEnvironment, cloudId, resourceId, onUpdate, onError } = config;

	// Convert resourceId to blockAri for the subscription
	const blockAri = generateBlockAriFromReference({ cloudId, resourceId });

	const subscriptionQuery = relaySubscriptionUtilsSubscriptionDocument;

	// Try to use Relay subscription first
	try {
		const disposable = requestSubscription<relaySubscriptionUtilsSubscriptionType>(
			relayEnvironment,
			{
				subscription: subscriptionQuery,
				variables: { resourceId: blockAri },
				onNext: (response) => {
					if (response?.blockService_onBlockUpdated) {
						const syncBlockInstance = convertRelayResponseToSyncBlockInstance(
							response.blockService_onBlockUpdated,
							resourceId,
						);
						if (syncBlockInstance) {
							onUpdate(syncBlockInstance);
						} else {
							onError?.(new Error('Failed to parse Relay block subscription payload'));
						}
					}
				},
				onError: (error) => {
					onError?.(error);
				},
			},
		);

		// If subscription was successfully created, return the unsubscribe function
		if (disposable) {
			return () => {
				disposable.dispose();
			};
		}
	} catch (error) {
		// If requestSubscription throws, fall back to WebSocket
		onError?.(error instanceof Error ? error : new Error('Relay subscription failed'));
	}

	// Fallback to WebSocket subscription when Relay subscriptions aren't available
	return subscribeToBlockUpdatesWS(
		blockAri,
		(parsedData: ParsedBlockSubscriptionData) => {
			const syncBlockInstance = convertParsedDataToSyncBlockInstance(parsedData, parsedData.resourceId);
			onUpdate(syncBlockInstance);
		},
		(error) => {
			onError?.(error);
		},
	);

}

/**
 * Hook-like function to create a subscription function that can be passed to providers.
 * This creates a function with the same signature as subscribeToBlockUpdates that uses Relay.
 * 
 * @param cloudId - Cloud ID for generating block ARIs  
 * @param relayEnvironment - Optional Relay environment. If not provided, will attempt to use global environment
 * @returns A function that can be used as subscribeToBlockUpdates in provider configurations
 * 
 * @example
 * ```typescript
 * const relaySubscribeToBlockUpdates = createRelaySubscriptionFunction(cloudId, environment);
 * 
 * // Can be used directly as a subscribeToBlockUpdates replacement
 * const unsubscribe = relaySubscribeToBlockUpdates(resourceId, onUpdate, onError);
 * ```
 */
export function createRelaySubscriptionFunction(
	cloudId: string,
	relayEnvironment?: IEnvironment,
): (resourceId: ResourceId, onUpdate: BlockUpdateCallback, onError?: BlockSubscriptionErrorCallback) => Unsubscribe {
	return (resourceId: ResourceId, onUpdate: BlockUpdateCallback, onError?: BlockSubscriptionErrorCallback): Unsubscribe => {
		const environment = relayEnvironment;
		if (!environment) {
			onError?.(new Error('Relay environment not available'));
			return () => {};
		}
		
		return createRelayBlockSubscription({
			relayEnvironment: environment,
			cloudId,
			resourceId,
			onUpdate,
			onError,
		});
	};
}