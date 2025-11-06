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
	type WriteSyncBlockResult,
} from '../providers/types';
import { getLocalIdFromAri, getPageARIFromResourceId } from '../utils/ari';
import { fetchSourceInfo } from '../utils/sourceInfo';

export class SyncBlockProvider extends SyncBlockDataProvider {
	name = 'syncBlockProvider';
	private fetchProvider: ADFFetchProvider;
	private writeProvider: ADFWriteProvider;
	private sourceId: string;

	constructor(fetchProvider: ADFFetchProvider, writeProvider: ADFWriteProvider, sourceId: string) {
		super();
		this.fetchProvider = fetchProvider;
		this.writeProvider = writeProvider;
		this.sourceId = sourceId;
	}
	isNodeSupported(node: JSONNode): node is SyncBlockNode {
		return node.type === 'syncBlock';
	}
	nodeDataKey(node: SyncBlockNode) {
		return node.attrs.localId;
	}
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

	getSourceId() {
		return this.sourceId;
	}

	retrieveSyncBlockSourceInfo(
		node: SyncBlockNode,
	): Promise<SyncBlockSourceInfo | undefined> {
		const { resourceId } = node.attrs;
		let pageARI;
		let sourceLocalId;
		if (resourceId && typeof resourceId === 'string') {
			try {
				pageARI = getPageARIFromResourceId(resourceId);
			} catch (error) {
				return Promise.reject(error);
			}

			try {
				sourceLocalId = getLocalIdFromAri(resourceId);
			} catch (error) {
				// EDITOR-1921: log analytic here, safe to continue
			}
		}

		return pageARI ? fetchSourceInfo(pageARI, sourceLocalId) : Promise.resolve(undefined);
	}
}

export const useMemoizedSyncedBlockProvider = (
	fetchProvider: ADFFetchProvider,
	writeProvider: ADFWriteProvider,
	sourceId: string,
) => {
	return useMemo(() => {
		return new SyncBlockProvider(fetchProvider, writeProvider, sourceId);
	}, [fetchProvider, writeProvider, sourceId]);
};
