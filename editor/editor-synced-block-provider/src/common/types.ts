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

export type SyncBlockData = {
	content: ADFEntity | undefined;
	resourceId?: string;
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
	abstract getSourceId: () => string;
}
