import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { BlockInstanceId, ResourceId, SyncBlockData, SyncBlockNode } from '../common/types';
import type { FetchSyncBlockDataResult, SyncBlockDataProvider } from '../providers/types';

const createSyncBlockNode = (localId: BlockInstanceId, resourceId: ResourceId): SyncBlockNode => {
	return {
		type: 'syncBlock',
		attrs: {
			localId,
			resourceId,
		},
	};
};

export class ReferenceSyncBlockStoreManager {
	private dataProvider?: SyncBlockDataProvider;

	private syncBlockCache: Map<BlockInstanceId, SyncBlockData>;
	private syncBlockURLRequests: Map<BlockInstanceId, boolean>;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.dataProvider = dataProvider;
		this.syncBlockCache = new Map();
		this.syncBlockURLRequests = new Map();
	}

	/**
	 *
	 * @param localId - The local ID of the sync block to get the source URL for
	 * @param resourceId - The resource ID of the sync block to get the source URL for
	 * Fetches source URl for a sync block and updates sync block data with the source URL asynchronously.
	 */
	private fetchSyncBlockSourceURL({
		localId,
		resourceId,
	}: {
		localId: BlockInstanceId;
		resourceId: ResourceId;
	}) {
		if (!localId || !resourceId || !this.dataProvider) {
			return;
		}

		// if the sync block is a reference block, we need to fetch the URL to the source
		// we could optimise this further by checking if the sync block is on the same page as the source
		if (!this.syncBlockURLRequests.get(localId)) {
			this.syncBlockURLRequests.set(localId, true);
			this.dataProvider
				.retrieveSyncBlockSourceUrl(createSyncBlockNode(localId, resourceId))
				.then((sourceURL) => {
					const existingSyncBlock = this.syncBlockCache.get(localId);
					if (existingSyncBlock) {
						existingSyncBlock.sourceURL = sourceURL;
					}
				})
				.finally(() => {
					this.syncBlockURLRequests.set(localId, false);
				});
		}
	}

	public async fetchSyncBlockData(syncBlockNode: PMNode): Promise<FetchSyncBlockDataResult> {
		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}

		const syncNode: SyncBlockNode = createSyncBlockNode(
			syncBlockNode.attrs.localId,
			syncBlockNode.attrs.resourceId,
		);

		// async fetch source URL if it is not already fetched
		const existingSyncBlock = this.syncBlockCache.get(syncBlockNode.attrs.localId);
		if (!existingSyncBlock?.sourceURL) {
			this.fetchSyncBlockSourceURL({
				localId: syncBlockNode.attrs.localId,
				resourceId: syncBlockNode.attrs.resourceId,
			});
		}

		const data = await this.dataProvider.fetchNodesData([syncNode]);
		if (!data) {
			throw new Error('Failed to fetch sync block node data');
		}

		const fetchSyncBlockDataResult = data[0];
		if (!fetchSyncBlockDataResult.error && fetchSyncBlockDataResult.data) {
			// only adds it to the map if it did not error out
			this.syncBlockCache.set(syncBlockNode.attrs.localId, {
				...existingSyncBlock,
				...fetchSyncBlockDataResult.data,
			});
		}

		return fetchSyncBlockDataResult;
	}

	/**
	 * Get the URL for a sync block.
	 * @param localId - The local ID of the sync block to get the URL for
	 * @returns
	 */
	public getSyncBlockURL(localId: BlockInstanceId): string | undefined {
		const syncBlock = this.syncBlockCache.get(localId);
		return syncBlock?.sourceURL;
	}
}
