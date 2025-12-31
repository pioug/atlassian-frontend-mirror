import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { MediaProvider, ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type { EmojiProvider } from '@atlaskit/emoji';
import type { MentionProvider } from '@atlaskit/mention/types';
import { NodeDataProvider } from '@atlaskit/node-data-provider';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type {
	SyncBlockData,
	ResourceId,
	SyncBlockError,
	SyncBlockNode,
	SyncBlockProduct,
	BlockInstanceId,
	SyncBlockAttrs,
} from '../common/types';

/**
 * The instance of a sync block, containing its data and metadata.
 * Mainly used for representing the state of a sync block after fetching from a data provider.
 * This will be used in both data processing and rendering contexts.
 */
export type SyncBlockInstance = {
	/*
	 * The data of the sync block
	 */
	data?: SyncBlockData;
	/*
	 * Current state/error of the sync block, if any
	 */
	error?: SyncBlockError;
	/**
	 *  The resourceId in the attrs of the block
	 */
	resourceId: ResourceId;
};

export type DeleteSyncBlockResult = {
	error?: string;
	resourceId: ResourceId;
	success: boolean;
};

export type SyncBlockSourceInfo = {
	title?: string;
	url?: string;
};

export type SyncBlockParentInfo = {
	contentId: string;
	contentProduct: SyncBlockProduct;
};

export type WriteSyncBlockResult = {
	error?: string;
	resourceId?: ResourceId;
};

export type SourceInfoFetchData = {
	pageARI: string;
	sourceLocalId?: string;
};

export type UpdateReferenceSyncBlockResult = {
	error?: string;
	success: boolean;
}

export interface ADFFetchProvider {
	batchFetchData: (resourceIds: ResourceId[]) => Promise<SyncBlockInstance[]>;
	fetchData: (resourceId: ResourceId) => Promise<SyncBlockInstance>;
}
export interface ADFWriteProvider {
	createData: (data: SyncBlockData) => Promise<WriteSyncBlockResult>;
	/**
	 * Delete source block.
	 * @param resourceId the resourceId of the block to be deleted
	 * @returns Object representing the result of the deletion. {resourceId: string, success: boolean, error?: string}.
	 * User should not be blocked by not_found error when deleting, so successful result should be returned for 404 error
	 */
	deleteData: (resourceId: ResourceId) => Promise<DeleteSyncBlockResult>;
	generateResourceIdForReference: (sourceId: ResourceId) => ResourceId;
	product: SyncBlockProduct;
	updateReferenceData: (
		blocks: SyncBlockAttrs[],
		noContent?: boolean,
	) => Promise<UpdateReferenceSyncBlockResult>;
	writeData: (data: SyncBlockData) => Promise<WriteSyncBlockResult>;
}

export type MediaEmojiProviderOptions = {
	contentId: string;
	contentProduct: SyncBlockProduct;
};

export type SyncedBlockRendererDataProviders = {
	mentionProvider?: Promise<MentionProvider>;
	profilecardProvider?: Promise<ProfilecardProvider>;
	taskDecisionProvider?: Promise<TaskDecisionProvider>;
};

export type SyncBlockRendererProviderCreator = {
	createEmojiProvider: ((options: MediaEmojiProviderOptions) => Promise<EmojiProvider>) | undefined;
	createMediaProvider: ((options: MediaEmojiProviderOptions) => Promise<MediaProvider>) | undefined;
};

export type SyncedBlockRendererProviderOptions = {
	parentDataProviders?: SyncedBlockRendererDataProviders;
	providerCreator?: SyncBlockRendererProviderCreator;
};

export abstract class SyncBlockDataProvider extends NodeDataProvider<
	SyncBlockNode,
	SyncBlockInstance
> {
	abstract writeNodesData(
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	): Promise<Array<WriteSyncBlockResult>>;
	abstract createNodeData(data: SyncBlockData): Promise<WriteSyncBlockResult>;
	abstract deleteNodesData(resourceIds: string[]): Promise<Array<DeleteSyncBlockResult>>;
	abstract fetchSyncBlockSourceInfo(
		localId: BlockInstanceId,
		sourceAri: string,
		sourceProduct: SyncBlockProduct,
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	): Promise<SyncBlockSourceInfo | undefined>;
	abstract setProviderOptions(providerOptions: SyncedBlockRendererProviderOptions): void;
	abstract getSyncedBlockRendererProviderOptions(): SyncedBlockRendererProviderOptions;
	abstract retrieveSyncBlockParentInfo(
		sourceAri: string,
		sourceProduct: SyncBlockProduct,
	): SyncBlockParentInfo | undefined;
	/**
	 * Generates a resource ID for source synced block.
	 * @returns The generated resource ID
	 */
	abstract generateResourceId(): { localId: BlockInstanceId; resourceId: ResourceId };
	/**
	 * Generates a resource ID for reference synced block.
	 * @param sourceId - The source document ID (e.g., page ARI)
	 * @returns The generated resource ID
	 */
	abstract generateResourceIdForReference(sourceId: ResourceId): ResourceId;
	abstract updateReferenceData(
		blocks: SyncBlockAttrs[],
		noContent?: boolean,
	): Promise<UpdateReferenceSyncBlockResult>;
}

export type SubscriptionCallback = (data: SyncBlockInstance) => void;

export type TitleSubscriptionCallback = (title: string) => void;
