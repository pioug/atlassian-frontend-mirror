import type {
	SyncedBlockRendererDataProviders,
	MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import type { EmojiProvider } from '@atlaskit/emoji';
import { NodeDataProvider } from '@atlaskit/node-data-provider';

import type { SyncBlockData, ResourceId, SyncBlockError, SyncBlockNode } from '../common/types';

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
	resourceId: string;
};

export type DeleteSyncBlockResult = {
	error?: string;
	resourceId: string;
	success: boolean;
};

export type SyncBlockSourceInfo = {
	title?: string;
	url?: string;
};

export type WriteSyncBlockResult = {
	error?: string;
	resourceId?: string;
};

export type SourceInfoFetchData = {
	pageARI: string;
	sourceLocalId?: string;
};

export interface ADFFetchProvider {
	fetchData: (resourceId: ResourceId) => Promise<SyncBlockInstance>;
	retrieveSourceInfoFetchData: (resourceId: ResourceId, pageAri: string) => SourceInfoFetchData;
}
export interface ADFWriteProvider {
	deleteData: (resourceId: string) => Promise<DeleteSyncBlockResult>;
	generateResourceId: (sourceId: string, localId: string) => ResourceId;
	writeData: (data: SyncBlockData) => Promise<WriteSyncBlockResult>;
}

export type MediaEmojiProviderOptions = {
	contentId: string;
	contentType: string;
	spaceKey?: string | null;
};

export type SyncedBlockRendererProviderOptions = {
	parentDataProviders?: SyncedBlockRendererDataProviders;
	providerCreator?: {
		// TODO: EDITOR-2771 - In follow up PR, create emoji & media providers per ref sync block
		// For now the below are not used, but I want to plug in the interface through
		createEmojiProvider:
			| ((options: MediaEmojiProviderOptions) => Promise<EmojiProvider>)
			| undefined;
		createMediaProvider:
			| ((options: MediaEmojiProviderOptions) => Promise<MediaProvider>)
			| undefined;
	};
};

export abstract class SyncBlockDataProvider extends NodeDataProvider<
	SyncBlockNode,
	SyncBlockInstance
> {
	abstract writeNodesData(
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	): Promise<Array<WriteSyncBlockResult>>;
	abstract deleteNodesData(resourceIds: string[]): Promise<Array<DeleteSyncBlockResult>>;
	abstract getSourceId(): ResourceId;
	abstract retrieveSyncBlockSourceInfo(
		node: SyncBlockNode,
	): Promise<SyncBlockSourceInfo | undefined>;
	abstract getSyncedBlockRendererProviderOptions(): SyncedBlockRendererProviderOptions;
	/**
	 * Generates a resource ID from a source ID and local ID.
	 * @param sourceId - The source document ID (e.g., page ARI)
	 * @param localId - The local block ID (usually a UUID)
	 * @returns The generated resource ID
	 */
	abstract generateResourceId(sourceId: ResourceId, localId: string): ResourceId;
}

export type SubscriptionCallback = (data: SyncBlockInstance) => void;

export type TitleSubscriptionCallback = (title: string) => void;
