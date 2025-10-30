import { NodeDataProvider } from '@atlaskit/node-data-provider';

import type { SyncBlockData, ResourceId, SyncBlockError, SyncBlockNode } from '../common/types';

export type FetchSyncBlockDataResult = {
	data?: SyncBlockData;
	error?: SyncBlockError;
	resourceId?: string;
};

export interface ADFFetchProvider {
	fetchData: (resourceId: ResourceId) => Promise<FetchSyncBlockDataResult>;
}
export interface ADFWriteProvider {
	writeData: (data: SyncBlockData) => Promise<string>;
}
export abstract class SyncBlockDataProvider extends NodeDataProvider<
	SyncBlockNode,
	FetchSyncBlockDataResult
> {
	abstract writeNodesData(
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	): Promise<Array<ResourceId | undefined>>;
	abstract getSourceId(): ResourceId;
	abstract retrieveSyncBlockSourceUrl(node: SyncBlockNode): Promise<string | undefined>;
}

export type SubscriptionCallback = (data: FetchSyncBlockDataResult) => void;
