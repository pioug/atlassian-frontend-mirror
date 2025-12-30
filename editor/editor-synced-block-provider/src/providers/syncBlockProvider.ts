import { useMemo } from 'react';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

import { getPageIdAndTypeFromConfluencePageAri } from '../clients/confluence/ari';
import { fetchConfluencePageInfo } from '../clients/confluence/sourceInfo';
import {
	SyncBlockError,
	type BlockInstanceId,
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
	type DeleteSyncBlockResult,
	type SyncBlockInstance,
	type SyncBlockParentInfo,
	type SyncBlockSourceInfo,
	type SyncedBlockRendererProviderOptions,
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

	setProviderOptions(providerOptions: SyncedBlockRendererProviderOptions) {
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
	nodeDataKey(node: SyncBlockNode) {
		return node.attrs.resourceId;
	}

	/**
	 * Fetch the data from the fetch provider
	 *
	 * @param nodes
	 *
	 * @returns Array of {resourceId?: string, error?: string}.
	 */
	fetchNodesData(nodes: SyncBlockNode[]): Promise<SyncBlockInstance[]> {
		const resourceIdSet = new Set<string>(nodes.map((node) => node.attrs.resourceId));
		const resourceIds = [...resourceIdSet];

		return Promise.allSettled(
			resourceIds.map((resourceId) => {
				return this.fetchProvider.fetchData(resourceId).then(
					(data) => {
						return data;
					},
					() => {
						return {
							error: SyncBlockError.Errored,
							resourceId,
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
	async deleteNodesData(resourceIds: ResourceId[]): Promise<Array<DeleteSyncBlockResult>> {
		if (!this.writeProvider) {
			return Promise.reject(new Error('Write provider not set'));
		}
		const results = await Promise.allSettled(
			resourceIds.map((resourceId) => {
				if (!this.writeProvider) {
					return Promise.reject('Write provider not set');
				}
				return this.writeProvider.deleteData(resourceId);
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
	fetchSyncBlockSourceInfo(
		localId: BlockInstanceId,
		sourceAri: string,
		sourceProduct: SyncBlockProduct,
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	): Promise<SyncBlockSourceInfo | undefined> {
		if (!sourceAri || !sourceProduct) {
			return Promise.reject(new Error('Source ari or source product is undefined'));
		}

		switch (sourceProduct) {
			case 'confluence-page':
				return fetchConfluencePageInfo(sourceAri, localId, fireAnalyticsEvent);
			case 'jira-work-item':
				return Promise.reject(new Error('Jira work item source product not supported'));
			default:
				return Promise.reject(new Error(`${sourceProduct} source product not supported`));
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

export const createAndInitializeSyncedBlockProvider = ({
	fetchProvider,
	writeProvider,
	providerOptions,
	getSSRData,
}: UseMemoizedSyncedBlockProviderProps) => {
	const syncBlockProvider = createSyncedBlockProvider({ fetchProvider, writeProvider });
	syncBlockProvider.setProviderOptions(providerOptions);
	const ssrData = getSSRData ? getSSRData() : undefined;
	if (ssrData) {
		syncBlockProvider.setSSRData(ssrData);
	}
	return syncBlockProvider;
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
