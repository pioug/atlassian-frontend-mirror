import type { EditorView } from '@atlaskit/editor-prosemirror/dist/types/view';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { BlockInstanceId, SyncBlockAttrs, SyncBlockNode } from '../common/types';
import type { FetchSyncBlockDataResult, SyncBlockDataProvider } from '../providers/types';

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

	public fetchSyncBlockData(syncBlockNode: PMNode): Promise<FetchSyncBlockDataResult | undefined> {
		if (this.isSourceBlock(syncBlockNode)) {
			return Promise.reject(
				new Error('Invalid sync block node type provided for fetchSyncBlockData'),
			);
		}

		return this.referenceSyncBlockStoreManager.fetchSyncBlockData(syncBlockNode);
	}

	/**
	 * Add/update a sync block node to/from the local cache
	 * @param syncBlockNode - The sync block node to update
	 */
	public updateSyncBlockData(syncBlockNode: PMNode): void {
		if (this.isSourceBlock(syncBlockNode)) {
			this.sourceSyncBlockStoreManager.updateSyncBlockData(syncBlockNode);
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
	 * @param localId - The local ID of the sync block to get the URL for
	 * @returns
	 */
	public getSyncBlockURL(localId: BlockInstanceId): string | undefined {
		// only applicable to reference sync block, for now (will be refactored further)
		return this.referenceSyncBlockStoreManager.getSyncBlockURL(localId);
	}

	public setEditorView(editorView: EditorView | undefined): void {
		// only applicable to source sync block, for now (will be refactored further)
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
}
