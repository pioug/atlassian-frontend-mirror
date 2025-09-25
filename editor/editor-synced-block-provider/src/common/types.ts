import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import { NodeDataProvider } from '@atlaskit/node-data-provider';

export type SyncBlockNode = {
	attrs: {
		localId: string; // this is the local id of the sync block
		resourceId: string; // this is the source sync block id (original content)
	};
	content?: Array<JSONNode>;
	type: 'syncBlock';
};

export type SyncBlockData = {
	content: ADFEntity | undefined;
};

export interface ADFFetchProvider {
	fetchData: (resourceId: string) => Promise<SyncBlockData>;
}

export interface ADFWriteProvider {
	writeData: (
		sourceId: string,
		localId: string,
		data: ADFEntity,
		resourceId?: string,
	) => Promise<string>;
}
export abstract class SyncBlockDataProvider extends NodeDataProvider<SyncBlockNode, SyncBlockData> {
	abstract writeNodesData: (
		nodes: SyncBlockNode[],
		data: SyncBlockData[],
	) => Promise<Array<string | undefined>>;
}
