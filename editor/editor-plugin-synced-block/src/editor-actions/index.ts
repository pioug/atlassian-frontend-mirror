import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

export const flushBodiedSyncBlocks = (syncBlockStore: SyncBlockStoreManager): Promise<boolean> => {
	return syncBlockStore.sourceManager.flush();
};

export const flushSyncBlocks = (syncBlockStore: SyncBlockStoreManager): Promise<boolean> => {
	return syncBlockStore.referenceManager.flush();
};
