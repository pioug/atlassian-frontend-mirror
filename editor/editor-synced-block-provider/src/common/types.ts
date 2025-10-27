import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import { NodeDataProvider } from '@atlaskit/node-data-provider';

export type SyncBlockAttrs = {
	localId: string;
	resourceId: string;
};

export type SyncBlockNode = {
	attrs: SyncBlockAttrs;
	content?: Array<JSONNode>;
	type: 'syncBlock';
};

export enum SyncBlockStatus {
	Errored = 'errored',
	NotFound = 'not_found',
	Unauthorized = 'unauthorized',
}

export type SyncBlockData = {
	blockInstanceId: string;
	content: Array<ADFEntity>;
	createdAt?: string;
	createdBy?: string;
	isSynced?: boolean;
	resourceId: string;
	sourceDocumentAri?: string;
	updatedAt?: string;
};

export type FetchSyncBlockDataResult =
	| SyncBlockData
	| {
			resourceId?: string;
			status: SyncBlockStatus;
	  };

export interface ADFFetchProvider {
	fetchData: (resourceId: string) => Promise<FetchSyncBlockDataResult>;
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
	): Promise<Array<string | undefined>>;
	abstract getSourceId(): string;
	abstract retrieveSyncBlockSourceUrl(node: SyncBlockNode): Promise<string | undefined>;
}
