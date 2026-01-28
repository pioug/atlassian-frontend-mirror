import { useMemo } from 'react';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { getProductFromSourceAri } from '../clients/block-service/ari';
import { getPageIdAndTypeFromConfluencePageAri } from '../clients/confluence/ari';
import { fetchConfluencePageInfo } from '../clients/confluence/sourceInfo';
import { fetchJiraWorkItemInfo } from '../clients/jira/sourceInfo';
import {
	SyncBlockError,
	type BlockInstanceId,
	type DeletionReason,
	type ReferenceSyncBlockData,
	type ResourceId,
	type SyncBlockAttrs,
	type SyncBlockData,
	type SyncBlockNode,
	type SyncBlockProduct,
} from '../common/types';

import {
	SyncBlockDataProvider,
	type ADFFetchProvider,
	type ADFWriteProvider,
	type BlockSubscriptionErrorCallback,
	type BlockUpdateCallback,
	type DeleteSyncBlockResult,
	type SyncBlockInstance,
	type SyncBlockParentInfo,
	type SyncBlockSourceInfo,
	type SyncedBlockRendererProviderOptions,
	type Unsubscribe,
	type UpdateReferenceSyncBlockResult,
	type WriteSyncBlockResult,
} from './types';

export class SyncBlockProvider extends SyncBlockDataProvider {
	name = 'syncBlockProvider';
	private fetchProvider: ADFFetchProvider;
	private writeProvider: ADFWriteProvider | undefined;
	private providerOptions: SyncedBlockRendererProviderOptions;

	/**
	 * Constructor for the SyncBlockProvider
	 *
	 * @param fetchProvider
	 * @param writeProvider
	 * @param nestedRendererDataProviders
	 */
	constructor(fetchProvider: ADFFetchProvider, writeProvider: ADFWriteProvider | undefined) {
		super();
		this.fetchProvider = fetchProvider;
		this.writeProvider = writeProvider;
		this.providerOptions = {};
	}

	setProviderOptions(providerOptions: SyncedBlockRendererProviderOptions): void {
		this.providerOptions = providerOptions;
	}

	/**
	 * Check if the node is supported by the provider
	 *
	 * @param node
	 *
	 * @returns True if the node is supported, false otherwise
	 */
	isNodeSupported(node: JSONNode): node is SyncBlockNode {
		return node.type === 'syncBlock' || node.type === 'bodiedSyncBlock';
	}

	/**
	 * Get the data key for the node
	 *
	 * @param node
	 *
	 * @returns The data key
	 */
	nodeDataKey(node: SyncBlockNode): string {
		return node.attrs.resourceId;
	}

	/**
	 * Fetch the data from the fetch provider using batch API
	 *
	 * @param nodes
	 *
	 * @returns Array of {resourceId?: string, error?: string}.
	 */
	async fetchNodesData(nodes: SyncBlockNode[]): Promise<SyncBlockInstance[]> {
		const blockIdentifiers = nodes.map((node) => ({
			resourceId: node.attrs.resourceId,
			blockInstanceId: node.attrs.localId,
		}));
		if (blockIdentifiers.length === 0) {
			return [];
		}

		if (fg('platform_synced_block_dogfooding')) {
			try {
				return await this.fetchProvider.batchFetchData(blockIdentifiers);
			} catch {
				// If batch fetch fails, fall back to individual fetch behavior
				// This allows loading states to be shown before errors, matching non-batch behavior
				return Promise.allSettled(
					blockIdentifiers.map((blockIdentifier) => {
						return this.fetchProvider.fetchData(blockIdentifier.resourceId).then(
							(data) => {
								return data;
							},
							() => {
								return {
									error: { type: SyncBlockError.Errored },
									resourceId: blockIdentifier.resourceId,
								};
							},
						);
					}),
				).then((results) => {
					return results
						.filter((result): result is PromiseFulfilledResult<SyncBlockInstance> => {
							return result.status === 'fulfilled';
						})
						.map((result) => result.value);
				});
			}
		} else {
			return Promise.allSettled(
				blockIdentifiers.map((blockIdentifier) => {
					return this.fetchProvider.fetchData(blockIdentifier.resourceId).then(
						(data) => {
							return data;
						},
						() => {
							return {
								error: { type: SyncBlockError.Errored },
								resourceId: blockIdentifier.resourceId,
							};
						},
					);
				}),
			).then((results) => {
				return results
					.filter((result): result is PromiseFulfilledResult<SyncBlockInstance> => {
						return result.status === 'fulfilled';
					})
					.map((result) => result.value);
			});
		}
	}

	/**
	 * Write the data to the write provider
	 *
	 * @param nodes
	 * @param data
	 *
	 * @returns Array of {resourceId?: string, error?: string}.
	 * resourceId: resource id of the node if write successfully , error: reason for when write failed
	 */
	async writeNodesData(
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	): Promise<Array<WriteSyncBlockResult>> {
		if (!this.writeProvider) {
			return Promise.reject(new Error('Write provider not set'));
		}
		const results = await Promise.allSettled(
			nodes.map((_node, index) => {
				if (!this.writeProvider) {
					return Promise.reject('Write provider not set');
				}
				if (!data[index].content) {
					return Promise.reject('No Synced Block content to write');
				}
				return this.writeProvider?.writeData(data[index]);
			}),
		);
		return results.map((result) => {
			if (result.status === 'fulfilled') {
				return result.value;
			} else {
				return { error: result.reason };
			}
		});
	}

	createNodeData(data: SyncBlockData): Promise<WriteSyncBlockResult> {
		if (!this.writeProvider) {
			return Promise.reject(new Error('Write provider not set'));
		}
		return this.writeProvider.createData(data).then(
			(result) => result,
			(error) => ({ error }),
		);
	}

	/**
	 * Delete the data from the write provider
	 *
	 * @param resourceIds
	 *
	 * @returns Array of {resourceId?: string, error?: string}.
	 */
	async deleteNodesData(
		resourceIds: ResourceId[],
		deletionReason: DeletionReason | undefined,
	): Promise<Array<DeleteSyncBlockResult>> {
		if (!this.writeProvider) {
			return Promise.reject(new Error('Write provider not set'));
		}
		const results = await Promise.allSettled(
			resourceIds.map((resourceId) => {
				if (!this.writeProvider) {
					return Promise.reject('Write provider not set');
				}
				return this.writeProvider.deleteData(resourceId, deletionReason);
			}),
		);
		return results.map((result, index) => {
			if (result.status === 'fulfilled') {
				return result.value;
			} else {
				return { resourceId: resourceIds[index], success: false, error: result.reason };
			}
		});
	}

	/**
	 * Fetch the source info from the source id
	 *
	 * @param params
	 * @param params.sourceAri - The source ARI
	 * @param params.sourceProduct - The source product. e.g. 'confluence-page', 'jira-work-item'
	 *
	 * @returns The source info
	 */
	async fetchSyncBlockSourceInfo(
		localId?: BlockInstanceId,
		sourceAri?: string,
		sourceProduct?: SyncBlockProduct,
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
		hasAccess: boolean = true,
		urlType: 'view' | 'edit' = 'edit',
	): Promise<SyncBlockSourceInfo | undefined> {
		let ari = sourceAri,
			product = sourceProduct;

		if (fg('platform_synced_block_dogfooding')) {
			ari = sourceAri ?? this.writeProvider?.parentAri;
			product = sourceProduct ?? getProductFromSourceAri(ari);
		}

		if (!ari || !product) {
			return Promise.reject(new Error('Source ari or source product is undefined'));
		}

		switch (product) {
			case 'confluence-page': {
				const sourceInfo = await fetchConfluencePageInfo(
					ari,
					hasAccess,
					urlType,
					localId,
					fireAnalyticsEvent,
				);

				if (fg('platform_synced_block_dogfooding')) {
					if (!sourceInfo) {
						return Promise.resolve(undefined);
					}
					return {
						...sourceInfo,
						onSameDocument: this.writeProvider?.parentAri === ari,
						productType: product,
					};
				} else {
					return sourceInfo;
				}
			}
			case 'jira-work-item':
				if (fg('platform_synced_block_dogfooding')) {
					const sourceInfo: SyncBlockSourceInfo | undefined = await fetchJiraWorkItemInfo(
						ari,
						hasAccess,
					);
					if (!sourceInfo) {
						return Promise.resolve(undefined);
					}
					return {
						...sourceInfo,
						onSameDocument: this.writeProvider?.parentAri === ari,
						productType: product,
					};
				}
				return Promise.reject(new Error('Jira work item source product not supported'));
			default:
				return Promise.reject(new Error(`${product} source product not supported`));
		}
	}

	generateResourceId(): { localId: BlockInstanceId; resourceId: ResourceId } {
		const localId = crypto.randomUUID();
		const resourceId = crypto.randomUUID();
		return { localId, resourceId };
	}

	generateResourceIdForReference(sourceId: ResourceId): ResourceId {
		if (!this.writeProvider) {
			throw new Error('Write provider not set');
		}
		return this.writeProvider.generateResourceIdForReference(sourceId);
	}

	/**
	 * Get the synced block renderer provider options
	 *
	 * @returns The synced block renderer provider options
	 */
	getSyncedBlockRendererProviderOptions(): SyncedBlockRendererProviderOptions {
		return this.providerOptions;
	}

	/**
	 * Retrieve the parent info for the sync block
	 *
	 * @param sourceAri - The source ARI
	 * @param sourceProduct - The source product. e.g. 'confluence-page', 'jira-work-item'
	 *
	 * @returns The parent info for the sync block
	 */
	retrieveSyncBlockParentInfo(
		sourceAri: string,
		sourceProduct: SyncBlockProduct,
	): SyncBlockParentInfo | undefined {
		if (!sourceAri || !sourceProduct) {
			return undefined;
		}

		switch (sourceProduct) {
			case 'confluence-page':
				return {
					contentId: getPageIdAndTypeFromConfluencePageAri({ ari: sourceAri }).id,
					contentProduct: sourceProduct,
				};
			case 'jira-work-item':
				throw new Error('Jira work item source product not supported');
			default:
				throw new Error(`${sourceProduct} source product not supported`);
		}
	}

	updateReferenceData(
		blocks: SyncBlockAttrs[],
		noContent?: boolean,
	): Promise<UpdateReferenceSyncBlockResult> {
		if (!this.writeProvider) {
			throw new Error('Write provider not set');
		}
		return this.writeProvider.updateReferenceData(blocks, noContent);
	}

	fetchReferences(resourceId: string, isSource: boolean): Promise<ReferenceSyncBlockData> {
		if (!this.fetchProvider) {
			throw new Error('Fetch provider not set');
		}
		return this.fetchProvider.fetchReferences(
			isSource ? this.generateResourceIdForReference(resourceId) : resourceId,
		);
	}

	/**
	 * Subscribes to real-time updates for a specific block.
	 * @param resourceId - The resource ID of the block to subscribe to
	 * @param onUpdate - Callback function invoked when the block is updated
	 * @param onError - Optional callback function invoked on subscription errors
	 * @returns Unsubscribe function to stop receiving updates, or undefined if not supported
	 */
	subscribeToBlockUpdates(
		resourceId: string,
		onUpdate: BlockUpdateCallback,
		onError?: BlockSubscriptionErrorCallback,
	): Unsubscribe | undefined {
		if (this.fetchProvider.subscribeToBlockUpdates) {
			return this.fetchProvider.subscribeToBlockUpdates(resourceId, onUpdate, onError);
		}
		return undefined;
	}
}

type UseMemoizedSyncedBlockProviderProps = {
	fetchProvider: ADFFetchProvider;
	getSSRData?: () => Record<string, SyncBlockInstance> | undefined;
	providerOptions: SyncedBlockRendererProviderOptions;
	writeProvider: ADFWriteProvider | undefined;
};

const createSyncedBlockProvider = ({
	fetchProvider,
	writeProvider,
}: {
	fetchProvider: ADFFetchProvider;
	writeProvider: ADFWriteProvider | undefined;
}) => {
	return new SyncBlockProvider(fetchProvider, writeProvider);
};

export const useMemoizedSyncedBlockProvider = ({
	fetchProvider,
	writeProvider,
	providerOptions,
	getSSRData,
}: UseMemoizedSyncedBlockProviderProps) => {
	const syncBlockProvider = useMemo(
		() => createSyncedBlockProvider({ fetchProvider, writeProvider }),
		[fetchProvider, writeProvider],
	);

	syncBlockProvider.setProviderOptions(providerOptions);

	const ssrData = getSSRData ? getSSRData() : undefined;
	if (ssrData) {
		syncBlockProvider.setSSRData(ssrData);
	}

	return syncBlockProvider;
};
