import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BlockInstanceId, ResourceId, SyncBlockNode } from '../common/types';
import type {
	FetchSyncBlockDataResult,
	SubscriptionCallback,
	SyncBlockDataProvider,
} from '../providers/types';
import { resolveFetchSyncBlockDataResult } from '../utils/mergeFetchSyncBlockDataResult';

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
	private syncBlockCache: Map<ResourceId, FetchSyncBlockDataResult>;
	private subscriptions: Map<ResourceId, { [localId: BlockInstanceId]: SubscriptionCallback }>;

	private syncBlockURLRequests: Map<ResourceId, boolean>;
	private editorView?: EditorView;
	private isInitialized: boolean = false;
	private isRefreshingSubscriptions: boolean = false;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.syncBlockCache = new Map();
		this.subscriptions = new Map();
		this.dataProvider = dataProvider;
		this.syncBlockURLRequests = new Map();
	}

	public async init(editorView: EditorView) {
		if (!this.editorView && !this.isInitialized) {
			this.editorView = editorView;

			const syncBlockNodes =
				editorView.state.doc.children
					.filter((node) => node.type.name === 'syncBlock')
					.map((node) => {
						return node.toJSON() as SyncBlockNode;
					}) || [];

			if (syncBlockNodes.length > 0) {
				try {
					const dataResults = await this.fetchSyncBlocksData(syncBlockNodes);

					if (!dataResults) {
						throw new Error('No data results returned when initializing sync block store manager');
					}

					dataResults.forEach((dataResult) => {
						this.updateCache(dataResult);
					});
				} catch (error) {
					// TODO: EDITOR-1921 - add error analytics
				}
			}
		}

		this.isInitialized = true;
	}

	/**
	 * Refreshes the subscriptions for all sync blocks.
	 * @returns {Promise<void>}
	 */
	public async refreshSubscriptions() {
		if (this.isRefreshingSubscriptions || !this.isInitialized) {
			return;
		}

		this.isRefreshingSubscriptions = true;

		const syncBlocks: SyncBlockNode[] = [];

		for (const [resourceId, callbacks] of this.subscriptions.entries()) {
			Object.keys(callbacks).forEach((localId) => {
				syncBlocks.push(createSyncBlockNode(localId, resourceId));
			});
		}

		try {
			// fetch latest data for all subscribed sync blocks
			// this function will update the cache and call the subscriptions
			await this.fetchSyncBlocksData(syncBlocks);
		} catch (error) {
			// TODO: EDITOR-1921 - add error analytics
		} finally {
			this.isRefreshingSubscriptions = false;
		}
	}

	private fetchSyncBlockSourceURL(resourceId: ResourceId) {
		if (!resourceId || !this.dataProvider) {
			return;
		}

		// if the sync block is a reference block, we need to fetch the URL to the source
		// we could optimise this further by checking if the sync block is on the same page as the source
		if (!this.syncBlockURLRequests.get(resourceId)) {
			this.syncBlockURLRequests.set(resourceId, true);
			this.dataProvider
				.retrieveSyncBlockSourceUrl(createSyncBlockNode('', resourceId))
				.then((sourceURL) => {
					const existingSyncBlock = this.getFromCache(resourceId);
					if (existingSyncBlock && existingSyncBlock.data) {
						existingSyncBlock.data = {
							...existingSyncBlock.data,
							sourceURL,
						};
						this.updateCache(existingSyncBlock);
					}
				})
				.finally(() => {
					this.syncBlockURLRequests.set(resourceId, false);
				});
		}
	}

	/**
	 * Fetch sync block data for a given sync block node.
	 * @param syncBlockNode - The sync block node to fetch data for
	 * @returns The fetched sync block data result
	 */
	public async fetchSyncBlockData(syncBlockNode: PMNode): Promise<FetchSyncBlockDataResult> {
		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}

		const syncNode: SyncBlockNode = createSyncBlockNode(
			syncBlockNode.attrs.localId,
			syncBlockNode.attrs.resourceId,
		);

		const data = await this.fetchSyncBlocksData([syncNode]);
		if (!data || data.length === 0) {
			throw new Error('Failed to fetch sync block data');
		}

		return data[0];
	}

	public async fetchSyncBlocksData(
		syncBlockNodes: SyncBlockNode[],
	): Promise<FetchSyncBlockDataResult[]> {
		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}

		const data = await this.dataProvider.fetchNodesData(syncBlockNodes);
		if (!data) {
			throw new Error('Failed to fetch sync block node data');
		}

		const resolvedData: FetchSyncBlockDataResult[] = [];

		data.forEach((fetchSyncBlockDataResult) => {
			if (!fetchSyncBlockDataResult.resourceId) {
				return;
			}

			const existingSyncBlock = this.getFromCache(fetchSyncBlockDataResult.resourceId);

			const resolvedFetchSyncBlockDataResult = existingSyncBlock
				? resolveFetchSyncBlockDataResult(existingSyncBlock, fetchSyncBlockDataResult)
				: fetchSyncBlockDataResult;

			this.updateCache(resolvedFetchSyncBlockDataResult);
			resolvedData.push(resolvedFetchSyncBlockDataResult);

			// fetch source URL if not already present
			if (
				!resolvedFetchSyncBlockDataResult.data?.sourceURL &&
				resolvedFetchSyncBlockDataResult.resourceId
			) {
				this.fetchSyncBlockSourceURL(resolvedFetchSyncBlockDataResult.resourceId);
			}
		});

		return resolvedData;
	}

	private updateCache(syncBlock: FetchSyncBlockDataResult) {
		const { resourceId } = syncBlock;

		if (resourceId) {
			this.syncBlockCache.set(resourceId, syncBlock);
			const callbacks = this.subscriptions.get(resourceId);
			if (callbacks) {
				Object.values(callbacks).forEach((callback) => {
					callback(syncBlock);
				});
			}
		}
	}

	private getFromCache(resourceId: ResourceId): FetchSyncBlockDataResult | undefined {
		return this.syncBlockCache.get(resourceId);
	}

	private deleteFromCache(resourceId: ResourceId) {
		this.syncBlockCache.delete(resourceId);
	}

	public subscribe(node: PMNode, callback: SubscriptionCallback): () => void {
		// check node is a sync block, as we only support sync block subscriptions
		if (node.type.name !== 'syncBlock') {
			return () => {};
		}
		const { resourceId, localId } = node.attrs;

		if (!localId || !resourceId) {
			return () => {};
		}

		// add to subscriptions map
		const resourceSubscriptions = this.subscriptions.get(resourceId) || {};
		this.subscriptions.set(resourceId, { ...resourceSubscriptions, [localId]: callback });

		// call the callback immediately if we have cached data
		const cachedData = this.getFromCache(resourceId);
		if (cachedData) {
			callback(cachedData);
		} else {
			this.fetchSyncBlockData(node).catch(() => {});
		}

		return () => {
			const resourceSubscriptions = this.subscriptions.get(resourceId);
			if (resourceSubscriptions) {
				delete resourceSubscriptions[localId];
				if (Object.keys(resourceSubscriptions).length === 0) {
					this.subscriptions.delete(resourceId);
					this.deleteFromCache(resourceId);
				} else {
					this.subscriptions.set(resourceId, resourceSubscriptions);
				}
			}
		};
	}

	/**
	 * Get the URL for a sync block.
	 * @param resourceId - The resource ID of the sync block
	 * @returns
	 */
	public getSyncBlockURL(resourceId: ResourceId): string | undefined {
		const syncBlock = this.getFromCache(resourceId);

		if (!syncBlock) {
			return undefined;
		}

		return syncBlock.data?.sourceURL;
	}

	destroy() {
		this.syncBlockCache.clear();
		this.subscriptions.clear();
		this.syncBlockURLRequests.clear();
		this.editorView = undefined;
		this.isInitialized = false;
	}
}
