/* eslint-disable @atlaskit/editor/no-re-export */

export { rebaseTransaction } from './common/rebase-transaction';
export { SyncBlockError } from './common/types';
export type { SyncBlockData, SyncBlockNode } from './common/types';
export {
	useFetchSyncBlockData,
	type UseFetchSyncBlockDataResult,
} from './hooks/useFetchSyncBlockData';
export { useFetchSyncBlockTitle } from './hooks/useFetchSyncBlockTitle';
export { useHandleContentChanges } from './hooks/useHandleContentChanges';
export { useMemoizedBlockServiceAPIProviders } from './providers/block-service/blockServiceAPI';
export {
	createContentAPIProvidersWithDefaultKey,
	useMemoizedContentAPIProviders,
} from './providers/confluence/confluenceContentAPI';
export {
	SyncBlockProvider as SyncedBlockProvider,
	useMemoizedSyncedBlockProvider,
} from './providers/syncBlockProvider';
export type {
	ADFFetchProvider,
	ADFWriteProvider,
	SyncBlockDataProvider,
	SyncBlockInstance,
} from './providers/types';
export { ReferenceSyncBlockStoreManager } from './store-manager/referenceSyncBlockStoreManager';
export { SyncBlockStoreManager } from './store-manager/syncBlockStoreManager';
export {
	blockResourceIdFromSourceAndLocalId,
	getConfluencePageAri,
	getLocalIdFromAri,
	getLocalIdFromResourceId,
	getPageARIFromResourceId,
	getPageIdAndTypeFromAri,
	resourceIdFromSourceAndLocalId,
} from './utils/ari';
export {
	createSyncBlockNode,
	convertSyncBlockPMNodeToSyncBlockData,
	convertSyncBlockJSONNodeToSyncBlockNode,
} from './utils/utils';
export { resolveSyncBlockInstance } from './utils/resolveSyncBlockInstance';
