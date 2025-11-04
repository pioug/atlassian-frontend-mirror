import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { ResourceId, SyncBlockAttrs, SyncBlockNode } from '../common/types';
import type {
	SubscriptionCallback,
	SyncBlockDataProvider,
	SyncBlockInstance,
	TitleSubscriptionCallback,
} from '../providers/types';
import { createSyncBlockNode } from '../utils/createSyncBlock';

import { ReferenceSyncBlockStoreManager } from './referenceSyncBlockStoreManager';
import {
	SourceSyncBlockStoreManager,
	type ConfirmationCallback,
} from './sourceSyncBlockStoreManager';

// A store manager responsible for the lifecycle and state management of sync blocks in an editor instance.
// Supports create, read, update, and delete operations for sync blocks.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Handles caching, debouncing updates, and publish/subscribe for local changes.
// Ensures consistency between local and remote state, and can be used in both editor and renderer contexts.
export class SyncBlockStoreManager {
	private referenceSyncBlockStoreManager: ReferenceSyncBlockStoreManager;
	private sourceSyncBlockStoreManager: SourceSyncBlockStoreManager;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.referenceSyncBlockStoreManager = new ReferenceSyncBlockStoreManager(dataProvider);
		this.sourceSyncBlockStoreManager = new SourceSyncBlockStoreManager(dataProvider);
	}

	/**
	 * Fetch sync block data for a given array of sync block nodes.
	 * @param nodes - The array of sync block nodes to fetch data for
	 * @returns The fetched sync block data results
	 */
	public fetchSyncBlocksData(nodes: PMNode[]): Promise<SyncBlockInstance[]> {
		const syncBlockNodes =
			nodes
				.filter((node) => {
					return node.type.name === 'syncBlock' && node.attrs.resourceId && node.attrs.localId;
				})
				.map((node) => {
					return createSyncBlockNode(node.attrs.localId, node.attrs.resourceId);
				}) || [];

		if (syncBlockNodes.length === 0) {
			return Promise.resolve([]);
		}

		return this.referenceSyncBlockStoreManager.fetchSyncBlocksData(syncBlockNodes);
	}

	/**
	 * Add/update a sync block node to/from the local cache
	 * @param syncBlockNode - The sync block node to update
	 */
	public updateSyncBlockData(syncBlockNode: PMNode): boolean {
		if (this.isSourceBlock(syncBlockNode)) {
			return this.sourceSyncBlockStoreManager.updateSyncBlockData(syncBlockNode);
		} else {
			throw new Error('Invalid sync block node type provided for updateSyncBlockData');
		}
	}

	/**
	 * Save content of bodiedSyncBlock nodes in local cache to backend
	 *
	 * @returns true if saving all nodes successfully, false if fail to save some/all nodes
	 */
	public flushBodiedSyncBlocks(): Promise<boolean> {
		// only applicable to source sync block, for now (will be refactored further)
		return this.sourceSyncBlockStoreManager.flushBodiedSyncBlocks();
	}

	/**
	 * Get the URL for a sync block.
	 * @param resourceId - The resource ID of the sync block to get the URL for
	 * @returns
	 */
	public getSyncBlockURL(resourceId: ResourceId): string | undefined {
		// only applicable to reference sync block, for now (will be refactored further)
		return this.referenceSyncBlockStoreManager.getSyncBlockURL(resourceId);
	}

	public setEditorView(editorView: EditorView | undefined): void {
		this.sourceSyncBlockStoreManager.setEditorView(editorView);
	}

	public isSourceBlock(node: PMNode): boolean {
		return node.type.name === 'bodiedSyncBlock';
	}

	public registerConfirmationCallback(callback: ConfirmationCallback): () => void {
		// only applicable to source sync block, for now (will be refactored further)
		return this.sourceSyncBlockStoreManager.registerConfirmationCallback(callback);
	}

	public requireConfirmationBeforeDelete(): boolean {
		// only applicable to source sync block, for now (will be refactored further)
		return this.sourceSyncBlockStoreManager.requireConfirmationBeforeDelete();
	}

	public createSyncBlockNode(): SyncBlockNode {
		// only applicable to source sync block, for now (will be refactored further)
		return this.sourceSyncBlockStoreManager.createSyncBlockNode();
	}

	public subscribeToSyncBlockData(node: PMNode, callback: SubscriptionCallback): () => void {
		return this.referenceSyncBlockStoreManager.subscribe(node, callback);
	}

	public subscribeToSyncBlockSourceTitle(
		node: PMNode,
		callback: TitleSubscriptionCallback,
	): () => void {
		return this.referenceSyncBlockStoreManager.subscribeToSourceTitle(node, callback);
	}

	public refreshSubscriptions(): void {
		this.referenceSyncBlockStoreManager.refreshSubscriptions();
	}

	public deleteSyncBlocksWithConfirmation(
		tr: Transaction,
		syncBlockIds: SyncBlockAttrs[],
	): Promise<void> {
		// only applicable to source sync block, for now (will be refactored further)
		return this.sourceSyncBlockStoreManager.deleteSyncBlocksWithConfirmation(tr, syncBlockIds);
	}

	public rebaseTransaction(incomingTr: Transaction, state: EditorState): void {
		// only applicable to source sync block, for now (will be refactored further)
		this.sourceSyncBlockStoreManager.rebaseTransaction(incomingTr, state);
	}

	destroy() {
		this.referenceSyncBlockStoreManager.destroy();
	}
}
