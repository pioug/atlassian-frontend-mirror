import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

export enum FLAG_ID {
	CANNOT_DELETE_WHEN_OFFLINE = 'cannot-delete-when-offline',
	CANNOT_EDIT_WHEN_OFFLINE = 'cannot-edit-when-offline',
	CANNOT_CREATE_WHEN_OFFLINE = 'cannot-create-when-offline',
	FAIL_TO_DELETE = 'fail-to-delete',
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
	 * The current sync block store manager, used to manage fetching and updating sync block data
	 */
	syncBlockStore: SyncBlockStoreManager;
};

export type SyncBlockAttrs = {
	localId: string;
	resourceId: string;
};
export type SyncBlockInfo = { attrs: SyncBlockAttrs; from?: number; to?: number };
export type SyncBlockMap = {
	[key: string]: SyncBlockInfo;
};
