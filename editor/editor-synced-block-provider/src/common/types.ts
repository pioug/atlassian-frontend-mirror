import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

export type BlockInstanceId = string;
export type ResourceId = string;

export type SyncBlockAttrs = {
	localId: BlockInstanceId;
	resourceId: ResourceId;
};

export interface SyncBlockNode extends JSONNode {
	attrs: SyncBlockAttrs;
	content?: Array<JSONNode | undefined>;
	type: 'syncBlock' | 'bodiedSyncBlock';
}

export enum SyncBlockError {
	Errored = 'errored',
	NotFound = 'not_found',
	Forbidden = 'forbidden',
}

export interface SyncBlockData {
	blockInstanceId: BlockInstanceId;
	content: Array<ADFEntity>;
	createdAt?: string;
	createdBy?: string;
	isSynced?: boolean;
	resourceId: ResourceId;
	sourceDocumentAri?: string;
	sourceURL?: string;
	updatedAt?: string;
}
