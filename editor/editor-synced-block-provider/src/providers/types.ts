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

export interface ADFFetchProvider {
	fetchData: (resourceId: ResourceId) => Promise<SyncBlockInstance>;
}
export interface ADFWriteProvider {
	deleteData: (resourceId: string) => Promise<DeleteSyncBlockResult>;
	writeData: (data: SyncBlockData) => Promise<WriteSyncBlockResult>;
}
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
}

export type SubscriptionCallback = (data: SyncBlockInstance) => void;

export type TitleSubscriptionCallback = (title: string) => void;
