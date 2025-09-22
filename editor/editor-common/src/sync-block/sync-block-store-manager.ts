import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SyncBlockDataProvider } from './types';

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
}

type SyncBlockAttrs = {
	localId: string;
	resourceId: ResourceId;
};

type ConfirmationCallback = () => Promise<boolean>;

// A store manager responsible for the lifecycle and state management of sync blocks in an editor instance.
// Supports create, read, update, and delete operations for sync blocks.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Handles caching, debouncing updates, and publish/subscribe for local changes.
// Ensures consistency between local and remote state, and can be used in both editor and renderer contexts.
export class SyncBlockStoreManager {
	private syncBlocks: Map<ResourceId, SyncBlock>;
	private dataProvider?: SyncBlockDataProvider;
	private confirmationCallback?: ConfirmationCallback;
	private editorView?: EditorView;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.syncBlocks = new Map();
		this.dataProvider = dataProvider;
	}

	public setEditorView(editorView: EditorView | undefined) {
		this.editorView = editorView;
	}

	public isSourceBlock(node: PMNode): boolean {
		if (!this.dataProvider || node.type.name !== 'syncBlock') {
			return false;
		}

		const { resourceId, localId } = node.attrs;

		return (
			this.syncBlocks.has(resourceId) && this.syncBlocks.get(resourceId)?.sourceLocalId === localId
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

	public async deleteSyncBlocksWithConfirmation(tr: Transaction, syncBlockIds: SyncBlockAttrs[]) {
		if (this.confirmationCallback) {
			const confirmed = await this.confirmationCallback();
			if (confirmed) {
				// TODO: EDITOR-1779 - "rebase" the transaction to reflect the latest document state
				this.editorView?.dispatch(tr.setMeta('isConfirmedSyncBlockDeletion', true));
				// Need to update the BE on deletion
				syncBlockIds.forEach(({ resourceId }) => this.syncBlocks.delete(resourceId));
			}
		}
	}
}
