/* eslint-disable @atlaskit/editor/no-re-export */

// common
export { rebaseTransaction } from './common/rebase-transaction';
export { SyncBlockError } from './common/types';
export type {
	SyncBlockData,
	SyncBlockNode,
	SyncBlockProduct,
	BlockInstanceId,
} from './common/types';

// hooks
export {
	useFetchSyncBlockData,
	type UseFetchSyncBlockDataResult,
} from './hooks/useFetchSyncBlockData';
export { useFetchSyncBlockTitle } from './hooks/useFetchSyncBlockTitle';
export { useHandleContentChanges } from './hooks/useHandleContentChanges';

// clients
export {
	blockResourceIdFromSourceAndLocalId,
	getLocalIdFromBlockResourceId,
} from './clients/block-service/ari';
export {
	getConfluencePageAri,
	getLocalIdFromConfluencePageAri,
	getPageARIFromContentPropertyResourceId,
	getPageIdAndTypeFromConfluencePageAri,
	resourceIdFromConfluencePageSourceIdAndLocalId,
} from './clients/confluence/ari';

// providers
export { useMemoizedBlockServiceAPIProviders } from './providers/block-service/blockServiceAPI';
export {
	createContentAPIProvidersWithDefaultKey,
	useMemoizedContentAPIProviders,
} from './providers/confluence/confluenceContentAPI';
export { fetchConfluencePageInfo } from './clients/confluence/sourceInfo';

export {
	SyncBlockProvider as SyncedBlockProvider,
	useMemoizedSyncedBlockProvider,
} from './providers/syncBlockProvider';
export type {
	ADFFetchProvider,
	ADFWriteProvider,
	SyncBlockDataProvider,
	SyncBlockInstance,
	MediaEmojiProviderOptions,
	SyncedBlockRendererProviderOptions,
	SyncBlockRendererProviderCreator,
} from './providers/types';

// store managers
export { ReferenceSyncBlockStoreManager } from './store-manager/referenceSyncBlockStoreManager';
export { SyncBlockStoreManager } from './store-manager/syncBlockStoreManager';

// utils
export { resolveSyncBlockInstance } from './utils/resolveSyncBlockInstance';
export {
	createSyncBlockNode,
	convertSyncBlockPMNodeToSyncBlockData,
	convertSyncBlockJSONNodeToSyncBlockNode,
	convertPMNodesToSyncBlockNodes,
} from './utils/utils';

export { fetchReferences } from './providers/block-service/blockServiceAPI';
