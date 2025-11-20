import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

export enum FLAG_ID {
	CANNOT_DELETE_WHEN_OFFLINE = 'cannot-delete-when-offline',
	CANNOT_EDIT_WHEN_OFFLINE = 'cannot-edit-when-offline',
	CANNOT_CREATE_WHEN_OFFLINE = 'cannot-create-when-offline',
}

export type SyncedBlockSharedState = {
	/**
	 * Whether to show a flag (usually for errors, e.g. fail to delete)
	 */
	showFlag: FLAG_ID | false;
	/**
	 * The current sync block store manager, used to manage fetching and updating sync block data
	 */
	syncBlockStore: SyncBlockStoreManager;
};
