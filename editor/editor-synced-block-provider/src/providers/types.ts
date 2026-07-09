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
	SyncBlockStatus,
	ResourceId,
	SyncBlockError,
	SyncBlockNode,
	SyncBlockProduct,
	BlockInstanceId,
	SyncBlockAttrs,
	ReferenceSyncBlockData,
	DeletionReason,
} from '../common/types';

type SyncBlockErrorInfo = {
	/**
	 * PII-safe `Error.name` from the upstream catch, used to de-opaque `errored`
	 * failures. Only ever `Error.name` — never node content, titles, or any UGC.
	 */
	originalName?: string;
	/**
	 * PII-safe `Error.message` from the upstream catch, so the classifier can bucket
	 * the real cause. Distinct from `reason` (may be synthetic/enum): carries the raw
	 * framework/HTTP text. Only ever `Error.message` — never node content or UGC.
	 */
	originalMessage?: string;
	reason?: string;
	sourceAri?: string;
	/**
	 * HTTP status code from the backend (Block Service) when a fetch/subscribe failure
	 * originated from a `BlockError`. Surfaced so fetch failure analytics can break down
	 * read-path failures by status code (EDITOR-7862). Undefined for non-HTTP failures
	 * (e.g. JSON parse errors, missing-content NotFound, or backend error responses that
	 * only carry a string `code`).
	 */
	statusCode?: number;
	type: SyncBlockError;
};

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
	/**
	 * HTTP status code from the backend (Block Service) when the failure originated
	 * from a `BlockError`. Surfaced so failure analytics can break down delete/update
	 * failures by status code (EDITOR-7796). Undefined for non-HTTP failures.
	 */
	statusCode?: number;
	success: boolean;
};

/**
 * Lightweight metadata for a Jira issue's type, surfaced so consumers can render the
 * correct ADS issue-type icon (Task / Bug / Story / Epic / Subtask) or fall back to the
 * AGG-provided `iconUrl` for custom types. Optional throughout — Confluence references
 * leave it `undefined`.
 */
export type SyncBlockJiraIssueType = {
	/** AGG-served icon URL (from `avatar.xsmall`) — used as the fallback when no ADS icon matches `name`. */
	iconUrl?: string;
	/** Display name of the issue type, e.g. `"Task"`, `"Bug"`, `"Story"`. */
	name: string;
};

export type SyncBlockSourceInfo = {
	hasAccess?: boolean;
	/**
	 * Whether the source info is for a source synced block
	 */
	isSource?: boolean;
	/**
	 * Issue-type metadata for `productType === 'jira-work-item'` references. Always
	 * `undefined` for Confluence references.
	 */
	issueType?: SyncBlockJiraIssueType;
	onSameDocument?: boolean;
	productType?: SyncBlockProduct;
	sourceAri: string;
	subType?: string | null;
	title?: string;
	url?: string;
};

export type SyncBlockParentInfo = {
	contentAri: string;
	contentId: string;
	contentProduct: SyncBlockProduct;
};

export type WriteSyncBlockResult = {
	error?: string;
	resourceId?: ResourceId;
	status?: SyncBlockStatus;
	/**
	 * HTTP status code from the backend (Block Service) when the failure originated
	 * from a `BlockError`. Surfaced so failure analytics can break down update
	 * failures by status code (EDITOR-7796). Undefined for non-HTTP failures.
	 */
	statusCode?: number;
};

export type SourceInfoFetchData = {
	pageARI: string;
	sourceLocalId?: string;
};

export type UpdateReferenceSyncBlockResult = {
	error?: string;
	/**
	 * HTTP status code from the backend when the failure originated from a `BlockError`.
	 * Surfaced so reference-update failure analytics can break down failures by status
	 * code (EDITOR-7796). Undefined for non-HTTP failures.
	 */
	statusCode?: number;
	success: boolean;
};

export type BlockNodeIdentifiers = {
	blockInstanceId: string;
	resourceId: string;
};

/**
 * Configuration options for batch fetch operations
 */
export type BatchFetchConfig = {
	/** Whether the batch fetch is being performed in a server-side rendering context */
	isSSR?: boolean;
	/** Maximum number of blocks to fetch in a single batch request */
	maxBatchSize?: number;
	/** Timeout in milliseconds for batch fetch requests */
	timeoutMs?: number;
};

export type BlockUpdateCallback = (data: SyncBlockInstance) => void;
export type BlockSubscriptionErrorCallback = (error: Error) => void;
export type BlockSubscriptionCompleteCallback = () => void;
export type Unsubscribe = () => void;

export interface ADFFetchProvider {
	batchFetchData: (
		blockNodeIdentifiers: BlockNodeIdentifiers[],
		config?: BatchFetchConfig,
	) => Promise<SyncBlockInstance[]>;
	fetchData: (resourceId: ResourceId) => Promise<SyncBlockInstance>;
	fetchReferences: (referenceResourceId: string) => Promise<ReferenceSyncBlockData>;
	/**
	 * Subscribes to real-time updates for a specific block.
	 */
	subscribeToBlockUpdates?: (
		resourceId: ResourceId,
		onUpdate: BlockUpdateCallback,
		onError?: BlockSubscriptionErrorCallback,
		onComplete?: BlockSubscriptionCompleteCallback,
	) => Unsubscribe;
}
export interface ADFWriteProvider {
	createData: (data: SyncBlockData) => Promise<WriteSyncBlockResult>;
	/**
	 * Delete source block.
	 * @param resourceId the resourceId of the block to be deleted
	 * @param deleteReason the reason for the deletion, e.g. 'source-block-unsynced', 'source-block-deleted', 'source-block-unpublished'
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
	/**
	 * Batch write multiple synced blocks.
	 * @param data Array of SyncBlockData to write
	 * @returns Array of write results, one for each block
	 */
	writeDataBatch?: (data: SyncBlockData[]) => Promise<WriteSyncBlockResult[]>;
}

export type MediaEmojiProviderOptions = {
	contentAri: string;
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
		hasAccess?: boolean,
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
	 * @param onComplete - Optional callback function invoked when the subscription completes
	 * @returns Unsubscribe function to stop receiving updates, or undefined if not supported
	 */
	subscribeToBlockUpdates?(
		resourceId: ResourceId,
		onUpdate: BlockUpdateCallback,
		onError?: BlockSubscriptionErrorCallback,
		onComplete?: BlockSubscriptionCompleteCallback,
	): Unsubscribe | undefined;
}

export type SubscriptionCallback = (data: SyncBlockInstance) => void;

export type TitleSubscriptionCallback = (title: string) => void;
