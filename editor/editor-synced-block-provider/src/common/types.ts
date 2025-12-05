import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

export type BlockInstanceId = string;
export type ResourceId = string;
export type SyncBlockProduct = 'confluence-page' | 'jira-work-item';

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
	InvalidRequest = 'invalid_request',
	RateLimited = 'rate_limited',
	Conflict = 'conflict', // attempt to create block that already exists
	ServerError = 'server_error',
	InvalidContent = 'invalid_content', // content is not a valid JSON
}

export interface SyncBlockData {
	blockInstanceId: BlockInstanceId;
	content: Array<ADFEntity>;
	createdAt?: string;
	createdBy?: string;
	isSynced?: boolean;
	product?: SyncBlockProduct;
	resourceId: ResourceId;
	sourceAri?: string;
	sourceTitle?: string;
	sourceURL?: string;
	updatedAt?: string;
}
