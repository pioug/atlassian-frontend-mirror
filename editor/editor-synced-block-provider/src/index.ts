/* eslint-disable @atlaskit/editor/no-re-export */

// common
export { rebaseTransaction } from './common/rebase-transaction';
export { SyncBlockError } from './common/types';
export type {
	SyncBlockData,
	SyncBlockNode,
	SyncBlockProduct,
	BlockInstanceId,
	SyncBlockAttrs,
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
	generateBlockAri,
	generateBlockAriFromReference,
	getLocalIdFromBlockResourceId,
} from './clients/block-service/ari';
export {
	getConfluencePageAri,
	getPageIdAndTypeFromConfluencePageAri,
} from './clients/confluence/ari';
export { fetchMediaToken } from './clients/confluence/fetchMediaToken';
export { getJiraWorkItemAri, getJiraWorkItemIdFromAri } from './clients/jira/ari';

// providers
export {
	useMemoizedBlockServiceAPIProviders,
	useMemoizedBlockServiceFetchOnlyAPIProvider,
} from './providers/block-service/blockServiceAPI';
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
	SyncedBlockRendererDataProviders,
	UpdateReferenceSyncBlockResult,
	WriteSyncBlockResult,
	SyncBlockParentInfo,
} from './providers/types';

// store managers
export { type ReferenceSyncBlockStoreManager } from './store-manager/referenceSyncBlockStoreManager';
export {
	SyncBlockStoreManager,
	useMemoizedSyncBlockStoreManager,
} from './store-manager/syncBlockStoreManager';

// utils
export { resolveSyncBlockInstance } from './utils/resolveSyncBlockInstance';
export { parseResourceId } from './utils/parseResourceId';
export {
	createSyncBlockNode,
	convertSyncBlockPMNodeToSyncBlockData,
	convertSyncBlockJSONNodeToSyncBlockNode,
	convertPMNodesToSyncBlockNodes,
	getContentIdAndProductFromResourceId,
} from './utils/utils';
export { fetchErrorPayload } from './utils/errorHandling';

export { fetchReferences } from './providers/block-service/blockServiceAPI';
