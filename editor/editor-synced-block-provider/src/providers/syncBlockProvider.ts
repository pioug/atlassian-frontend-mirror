import { useMemo } from 'react';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

import { getPageIdAndTypeFromConfluencePageAri } from '../clients/confluence/ari';
import { fetchConfluencePageInfo } from '../clients/confluence/sourceInfo';
import {
	SyncBlockError,
	type BlockInstanceId,
	type ResourceId,
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
	type WriteSyncBlockResult,
} from '../providers/types';

export class SyncBlockProvider extends SyncBlockDataProvider {
	name = 'syncBlockProvider';
	private fetchProvider: ADFFetchProvider;
	private writeProvider: ADFWriteProvider;
	// the source document ARI; that the source sync block is on.
	private sourceId: string;
	private providerOptions: SyncedBlockRendererProviderOptions;

	/**
	 * Constructor for the SyncBlockProvider
	 *
	 * @param fetchProvider
	 * @param writeProvider
	 * @param sourceId
	 * @param nestedRendererDataProviders
	 */
	constructor(
		fetchProvider: ADFFetchProvider,
		writeProvider: ADFWriteProvider,
		sourceId: string,
		providerOptions: SyncedBlockRendererProviderOptions,
	) {
		super();
		this.fetchProvider = fetchProvider;
		this.writeProvider = writeProvider;
		this.sourceId = sourceId;
		this.providerOptions = providerOptions;
	}

	getProduct(): SyncBlockProduct | undefined {
		return this.writeProvider.product;
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
		const results = await Promise.allSettled(
			nodes.map((_node, index) => {
				if (!data[index].content) {
					return Promise.reject('No Synced Block content to write');
				}
				return this.writeProvider.writeData(data[index]);
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
		const results = await Promise.allSettled(
			resourceIds.map((resourceId) => this.writeProvider.deleteData(resourceId)),
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
	 * Get the source id
	 *
	 * @returns The source id
	 */
	getSourceId() {
		return this.sourceId;
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

	generateResourceId(sourceId: string, localId: BlockInstanceId): string {
		return this.writeProvider.generateResourceId(sourceId, localId);
	}

	generateResourceIdForReference(sourceId: ResourceId): ResourceId {
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
					contentId: getPageIdAndTypeFromConfluencePageAri(sourceAri).id,
					contentProduct: sourceProduct,
				};
			case 'jira-work-item':
				throw new Error('Jira work item source product not supported');
			default:
				throw new Error(`${sourceProduct} source product not supported`);
		}
	}
}

export const useMemoizedSyncedBlockProvider = (
	fetchProvider: ADFFetchProvider,
	writeProvider: ADFWriteProvider,
	sourceId: string,
	providerOptions: SyncedBlockRendererProviderOptions,
	getSSRData?: () => Record<string, SyncBlockInstance> | undefined,
) => {
	return useMemo(() => {
		const syncBlockProvider = new SyncBlockProvider(
			fetchProvider,
			writeProvider,
			sourceId,
			providerOptions,
		);

		const ssrData = getSSRData ? getSSRData() : undefined;
		if (ssrData) {
			syncBlockProvider.setSSRData(ssrData);
		}

		return syncBlockProvider;
	}, [fetchProvider, writeProvider, sourceId, providerOptions, getSSRData]);
};
