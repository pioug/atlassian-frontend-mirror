/* eslint-disable @atlaskit/editor/no-re-export */

// common
export { rebaseTransaction } from './common/rebase-transaction';
export { SyncBlockError } from './common/types';
export type {
	ResourceId,
	SyncBlockData,
	SyncBlockNode,
	SyncBlockProduct,
	SyncBlockStatus,
	BlockInstanceId,
	SyncBlockAttrs,
	ReferenceSyncBlockData,
	ReferencesSourceInfo,
	DeletionReason,
	SyncBlockPrefetchData,
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
export type {
	BlockContentResponse,
	BatchRetrieveSyncedBlocksResponse,
	ErrorResponse,
} from './clients/block-service/blockService';
export { BlockError } from './clients/block-service/blockService';
export {
	getConfluencePageAri,
	getPageIdAndTypeFromConfluencePageAri,
} from './clients/confluence/ari';
export {
	fetchMediaToken,
	type TokenData,
	type ConfigData,
} from './clients/confluence/fetchMediaToken';
export { getJiraWorkItemAri, getJiraWorkItemIdFromAri } from './clients/jira/ari';

// providers
export {
	useMemoizedBlockServiceAPIProviders,
	useMemoizedBlockServiceFetchOnlyAPIProvider,
	fetchReferences,
	batchFetchData,
	blockAriToResourceId,
	convertToSyncBlockData,
	extractResourceIdFromBlockAri,
} from './providers/block-service/blockServiceAPI';
export { fetchConfluencePageInfo } from './clients/confluence/sourceInfo';

export { SyncedBlockProvider, useMemoizedSyncedBlockProvider } from './providers/syncBlockProvider';
export type {
	ADFFetchProvider,
	ADFWriteProvider,
	BlockNodeIdentifiers,
	BlockSubscriptionErrorCallback,
	BlockUpdateCallback,
	SyncBlockDataProviderInterface,
	SyncBlockInstance,
	MediaEmojiProviderOptions,
	SyncedBlockRendererProviderOptions,
	SyncBlockRendererProviderCreator,
	SyncedBlockRendererDataProviders,
	Unsubscribe,
	UpdateReferenceSyncBlockResult,
	WriteSyncBlockResult,
	SyncBlockParentInfo,
	SyncBlockSourceInfo,
} from './providers/types';

// store managers
export { ReferenceSyncBlockStoreManager } from './store-manager/referenceSyncBlockStoreManager';
export {
	SyncBlockStoreManager,
	useMemoizedSyncBlockStoreManager,
} from './store-manager/syncBlockStoreManager';

// utils
export { resolveSyncBlockInstance } from './utils/resolveSyncBlockInstance';
export { parseResourceId, createResourceIdForReference } from './utils/resourceId';
export {
	createSyncBlockNode,
	convertSyncBlockPMNodeToSyncBlockData,
	convertSyncBlockJSONNodeToSyncBlockNode,
	convertPMNodesToSyncBlockNodes,
	getContentIdAndProductFromResourceId,
} from './utils/utils';
export { fetchErrorPayload } from './utils/errorHandling';
export { normaliseSyncBlockProduct, normaliseSyncBlockStatus } from './utils/validValue';
