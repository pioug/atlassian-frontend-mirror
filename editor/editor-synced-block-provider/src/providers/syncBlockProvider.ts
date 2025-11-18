import { useMemo } from 'react';

import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

import { SyncBlockError, type SyncBlockData, type SyncBlockNode } from '../common/types';
import {
	SyncBlockDataProvider,
	type ADFFetchProvider,
	type ADFWriteProvider,
	type DeleteSyncBlockResult,
	type SyncBlockInstance,
	type SyncBlockSourceInfo,
	type SyncedBlockRendererProviderOptions,
	type WriteSyncBlockResult,
} from '../providers/types';
import { fetchSourceInfo } from '../utils/sourceInfo';

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
		return node.attrs.localId;
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
							status: SyncBlockError.Errored,
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

	/**
	 * Delete the data from the write provider
	 *
	 * @param resourceIds
	 *
	 * @returns Array of {resourceId?: string, error?: string}.
	 */
	async deleteNodesData(resourceIds: string[]): Promise<Array<DeleteSyncBlockResult>> {
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
	 * Retrieve the source info from the source id
	 *
	 * @param node
	 *
	 * @returns The source info
	 */
	retrieveSyncBlockSourceInfo(node: SyncBlockNode): Promise<SyncBlockSourceInfo | undefined> {
		// with content API, this is the concatenation of the page ARI and the block's localId.
		// with block service, this is the ARI of the block.
		// this can be cleaned up from the specific providers and placed here after platform_synced_blocks_block_service_provider
		const { resourceId } = node.attrs;
		let pageARI;
		let sourceLocalId;
		if (resourceId && typeof resourceId === 'string') {
			try {
				const fetchData = this.fetchProvider.retrieveSourceInfoFetchData(resourceId, this.sourceId);
				pageARI = fetchData.pageARI;
				sourceLocalId = fetchData.sourceLocalId;
			} catch (error) {
				return Promise.reject(error);
			}
		}

		return pageARI ? fetchSourceInfo(pageARI, sourceLocalId) : Promise.resolve(undefined);
	}

	generateResourceId(sourceId: string, localId: string): string {
		return this.writeProvider.generateResourceId(sourceId, localId);
	}

	/**
	 * Get the synced block renderer provider options
	 *
	 * @returns The synced block renderer provider options
	 */
	getSyncedBlockRendererProviderOptions(): SyncedBlockRendererProviderOptions {
		return this.providerOptions;
	}
}

export const useMemoizedSyncedBlockProvider = (
	fetchProvider: ADFFetchProvider,
	writeProvider: ADFWriteProvider,
	sourceId: string,
	providerOptions: SyncedBlockRendererProviderOptions,
) => {
	return useMemo(() => {
		return new SyncBlockProvider(fetchProvider, writeProvider, sourceId, providerOptions);
	}, [fetchProvider, writeProvider, sourceId, providerOptions]);
};
