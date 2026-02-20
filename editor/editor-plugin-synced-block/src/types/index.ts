import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

export enum FLAG_ID {
	CANNOT_DELETE_WHEN_OFFLINE = 'cannot-delete-when-offline',
	CANNOT_EDIT_WHEN_OFFLINE = 'cannot-edit-when-offline',
	CANNOT_CREATE_WHEN_OFFLINE = 'cannot-create-when-offline',
	FAIL_TO_DELETE = 'fail-to-delete',
	SYNC_BLOCK_COPIED = 'sync-block-copied',
	UNPUBLISHED_SYNC_BLOCK_PASTED = 'unpublished-sync-block-pasted',
	CANNOT_CREATE_SYNC_BLOCK = 'cannot-create-sync-block',
	INLINE_EXTENSION_IN_SYNC_BLOCK = 'inline-extension-in-sync-block',
}

type FlagConfig = {
	id: FLAG_ID;
	// Called when the flag is closed
	onDismissed?: (tr: Transaction) => Transaction | void;
	// Called when retry button in flag is clicked
	onRetry?: () => void;
};

export type BodiedSyncBlockDeletionStatus = 'none' | 'processing' | 'completed';
export type ActiveFlag = FlagConfig | false;

type RetryCreationPos = { from: number; to: number };
export type RetryCreationPosMap = Map<string, RetryCreationPos>;
export type RetryCreationPosEntry = {
	pos?: RetryCreationPos;
	resourceId: string;
};

export type SyncedBlockSharedState = {
	/**
	 * Whether to show a flag (usually for errors, e.g. fail to delete)
	 */
	activeFlag: ActiveFlag;
	/**
	 * Whether the plugin is currently saving bodiedSyncBlock deletion to backend
	 */
	bodiedSyncBlockDeletionStatus?: BodiedSyncBlockDeletionStatus;
	/**
	 * Positions of pending creations keyed by resourceId, used for retry/revert flow.
	 * When a new bodiedSyncBlock is added, a new entry is added to map for mapping. The entry is removed when creation succeeds or retry option is dismissed.
	 *
	 */
	retryCreationPosMap?: RetryCreationPosMap;
	/**
	 * The current sync block store manager, used to manage fetching and updating sync block data
	 */
	syncBlockStore: SyncBlockStoreManager;
};

export type SyncBlockAttrs = {
	localId: string;
	resourceId: string;
};
export type SyncBlockInfo = {
	attrs: SyncBlockAttrs;
	from?: number;
	node?: PMNode;
	to?: number;
};
export type SyncBlockMap = {
	[key: string]: SyncBlockInfo;
};

export const SYNCED_BLOCK_BUTTON_TEST_ID = {
	primaryToolbarCreate: 'create-synced-block-toolbar-btn',
	blockMenuCreate: 'create-synced-block-block-menu-btn',
	quickInsertCreate: 'create-synced-block-quick-insert-btn',
	syncedBlockToolbarReferenceDelete: 'reference-synced-block-delete-btn',
	syncedBlockToolbarSourceDelete: 'source-synced-block-delete-btn',
	syncedBlockToolbarReferenceUnsync: 'reference-synced-block-unsync-btn',
	syncedBlockToolbarSourceUnsync: 'source-synced-block-unsync-btn',
	syncedBlockToolbarSyncedLocationsTrigger: 'synced-block-synced-locations-dropdown--trigger',
} as const;
