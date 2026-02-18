import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type {
	CardProvider,
	MediaProvider,
	ProfilecardProvider,
} from '@atlaskit/editor-common/provider-factory';
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
	ReferenceSyncBlockData,
	DeletionReason,
} from '../common/types';

type SyncBlockErrorInfo = { reason?: string; sourceAri?: string; type: SyncBlockError };

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
	error?: SyncBlockErrorInfo;
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
	hasAccess?: boolean;
	/**
	 * Whether the source info is for a source synced block
	 */
	isSource?: boolean;
	onSameDocument?: boolean;
	productType?: SyncBlockProduct;
	sourceAri: string;
	subType?: string | null;
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
};

export type BlockNodeIdentifiers = {
	blockInstanceId: string;
	resourceId: string;
};
export type BlockUpdateCallback = (data: SyncBlockInstance) => void;
export type BlockSubscriptionErrorCallback = (error: Error) => void;
export type Unsubscribe = () => void;

export interface ADFFetchProvider {
	batchFetchData: (blockNodeIdentifiers: BlockNodeIdentifiers[]) => Promise<SyncBlockInstance[]>;
	fetchData: (resourceId: ResourceId) => Promise<SyncBlockInstance>;
	fetchReferences: (referenceResourceId: string) => Promise<ReferenceSyncBlockData>;
	/**
	 * Subscribes to real-time updates for a specific block.
	 */
	subscribeToBlockUpdates?: (
		resourceId: ResourceId,
		onUpdate: BlockUpdateCallback,
		onError?: BlockSubscriptionErrorCallback,
	) => Unsubscribe;
}
export interface ADFWriteProvider {
	createData: (data: SyncBlockData) => Promise<WriteSyncBlockResult>;
	/**
	 * Delete source block.
	 * @param resourceId the resourceId of the block to be deleted
	 * @param deleteReason the reason for the deletion, e.g. 'source-block-unsynced', 'source-block-deleted'
	 * @returns Object representing the result of the deletion. {resourceId: string, success: boolean, error?: string}.
	 * User should not be blocked by not_found error when deleting, so successful result should be returned for 404 error
	 */
	deleteData: (resourceId: ResourceId, deleteReason: string) => Promise<DeleteSyncBlockResult>;
	generateResourceIdForReference: (sourceId: ResourceId) => ResourceId;
	parentAri?: string;
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
	createEmojiProvider:
		| ((options: MediaEmojiProviderOptions) => Promise<EmojiProvider> | undefined)
		| undefined;
	createMediaProvider:
		| ((options: MediaEmojiProviderOptions) => Promise<MediaProvider> | undefined)
		| undefined;
	createSmartLinkProvider: (() => Promise<CardProvider>) | undefined;
	createSSRMediaProvider?:
		| ((options: MediaEmojiProviderOptions) => MediaProvider | undefined)
		| undefined;
};

export type SyncedBlockRendererProviderOptions = {
	parentDataProviders?: SyncedBlockRendererDataProviders;
	providerCreator?: SyncBlockRendererProviderCreator;
};

export abstract class SyncBlockDataProviderInterface extends NodeDataProvider<
	SyncBlockNode,
	SyncBlockInstance
> {
	abstract writeNodesData(
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	): Promise<Array<WriteSyncBlockResult>>;
	abstract createNodeData(data: SyncBlockData): Promise<WriteSyncBlockResult>;
	abstract deleteNodesData(
		resourceIds: string[],
		deleteReason: DeletionReason,
	): Promise<Array<DeleteSyncBlockResult>>;
	abstract fetchSyncBlockSourceInfo(
		localId?: BlockInstanceId,
		sourceAri?: string,
		sourceProduct?: SyncBlockProduct,
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
		hasAccess?: boolean,
		urlType?: 'view' | 'edit',
		isUnpublished?: boolean,
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
	abstract fetchReferences(resourceId: string, isSource: boolean): Promise<ReferenceSyncBlockData>;
	/**
	 * Subscribes to real-time updates for a specific block.
	 * Returns undefined if subscriptions are not supported.
	 * @param resourceId - The resource ID of the block to subscribe to
	 * @param onUpdate - Callback function invoked when the block is updated
	 * @param onError - Optional callback function invoked on subscription errors
	 * @returns Unsubscribe function to stop receiving updates, or undefined if not supported
	 */
	subscribeToBlockUpdates?(
		resourceId: ResourceId,
		onUpdate: BlockUpdateCallback,
		onError?: BlockSubscriptionErrorCallback,
	): Unsubscribe | undefined;
}

export type SubscriptionCallback = (data: SyncBlockInstance) => void;

export type TitleSubscriptionCallback = (title: string) => void;
