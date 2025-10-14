import uuid from 'uuid';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { resourceIdFromSourceAndLocalId } from '../utils/ari';

import { rebaseTransaction } from './rebase-transaction';
import type { SyncBlockAttrs, SyncBlockDataProvider, SyncBlockNode } from './types';

// Do this typedef to make it clear that
// this is a local identifier for a resource for local use
type ResourceId = string;

export interface SyncBlock {
	/**
	 * The local content of the block,
	 * this might or might not be synced with the server
	 */
	content?: ADFEntity;
	resourceId: string;

	// the id of the source syncBlock
	sourceLocalId: string;
	sourceURL?: string;
}

type ConfirmationCallback = () => Promise<boolean>;

// A store manager responsible for the lifecycle and state management of sync blocks in an editor instance.
// Supports create, read, update, and delete operations for sync blocks.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Handles caching, debouncing updates, and publish/subscribe for local changes.
// Ensures consistency between local and remote state, and can be used in both editor and renderer contexts.
export class SyncBlockStoreManager {
	private syncBlocks: Map<ResourceId, SyncBlock>;
	private confirmationCallback?: ConfirmationCallback;
	private editorView?: EditorView;
	private dataProvider?: SyncBlockDataProvider;
	private confirmationTransaction?: Transaction;
	private syncBlockNestedEditorView?: EditorView;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.syncBlocks = new Map();
		this.dataProvider = dataProvider;
	}

	/**
	 * Add/update a sync block node to the store.
	 * @param node - The sync block node to add
	 * @returns True if the sync block node was added/updated
	 */
	public updateSyncBlockNode(node: PMNode): boolean {
		const { localId, resourceId } = node.attrs;

		if (!localId || !resourceId) {
			return false;
		}

		const existingSyncBlock = this.syncBlocks.get(resourceId);

		const sourceURL = existingSyncBlock?.sourceURL; //avoid fetching the URL again

		// if the sync block is a reference block, we need to fetch the URL to the source
		// we could optimise this further by checking if the sync block is on the same page as the source
		if (!sourceURL && !this.isSourceBlock(node) && this.dataProvider) {
			this.syncBlocks.set(resourceId, {
				resourceId,
				sourceLocalId: localId,
				sourceURL: undefined,
			});

			this.dataProvider
				.retrieveSyncBlockSourceUrl({
					attrs: { localId, resourceId },
					type: 'syncBlock',
				})
				.then((url) => {
					if (this.syncBlocks.has(resourceId)) {
						this.syncBlocks.set(resourceId, {
							resourceId,
							sourceLocalId: localId,
							sourceURL: url,
						});
					}
				}); // prefetch the data for the sync block URL
		}

		return true;
	}

	/**
	 * Get the URL for a sync block.
	 * @param resourceId - The resource ID of the sync block to get the URL for
	 * @returns
	 */
	public getSyncBlockURL(resourceId: ResourceId): string | undefined {
		const syncBlock = this.syncBlocks.get(resourceId);
		return syncBlock?.sourceURL;
	}

	public setEditorView(editorView: EditorView | undefined) {
		this.editorView = editorView;
	}

	public setSyncBlockNestedEditorView(editorView: EditorView | undefined) {
		this.syncBlockNestedEditorView = editorView;
	}

	public getSyncBlockNestedEditorView(): EditorView | undefined {
		return this.syncBlockNestedEditorView;
	}

	public isSourceBlock(node: PMNode): boolean {
		if (node.type.name !== 'syncBlock') {
			return false;
		}

		const { resourceId, localId } = node.attrs;
		const sourceId = this.dataProvider?.getSourceId();

		if (!sourceId) {
			return false;
		}

		return (
			typeof resourceId === 'string' &&
			typeof sourceId === 'string' &&
			typeof localId === 'string' &&
			resourceId === resourceIdFromSourceAndLocalId(sourceId, localId)
		);
	}

	public registerConfirmationCallback(callback: ConfirmationCallback) {
		this.confirmationCallback = callback;

		return () => {
			this.confirmationCallback = undefined;
		};
	}

	public requireConfirmationBeforeDelete(): boolean {
		return !!this.confirmationCallback;
	}

	public createSyncBlockNode(): SyncBlockNode {
		const localId = uuid();
		const sourceId = this.dataProvider?.getSourceId();
		if (!sourceId) {
			throw new Error('Provider of sync block plugin is not set');
		}
		const resourceId = resourceIdFromSourceAndLocalId(sourceId, localId);
		const syncBlockNode: SyncBlockNode = {
			attrs: {
				resourceId,
				localId,
			},
			type: 'syncBlock',
		};
		return syncBlockNode;
	}

	public async deleteSyncBlocksWithConfirmation(tr: Transaction, syncBlockIds: SyncBlockAttrs[]) {
		if (this.confirmationCallback) {
			this.confirmationTransaction = tr;
			const confirmed = await this.confirmationCallback();
			if (confirmed) {
				this.editorView?.dispatch(
					this.confirmationTransaction.setMeta('isConfirmedSyncBlockDeletion', true),
				);
				// Need to update the BE on deletion
				syncBlockIds.forEach(({ resourceId }) => this.syncBlocks.delete(resourceId));
			}
			this.confirmationTransaction = undefined;
		}
	}

	public rebaseTransaction(incomingTr: Transaction, state: EditorState) {
		if (!this.confirmationTransaction) {
			return;
		}

		this.confirmationTransaction = rebaseTransaction(
			this.confirmationTransaction,
			incomingTr,
			state,
		);
	}
}
