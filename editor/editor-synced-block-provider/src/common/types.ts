import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';

import type { SyncBlockSourceInfo } from '../providers/types';

import type { SYNC_BLOCK_PRODUCTS } from './consts';

export type BlockInstanceId = string;
export type ResourceId = string;
export type SyncBlockProduct = (typeof SYNC_BLOCK_PRODUCTS)[number];
export type SyncBlockStatus = 'active' | 'deleted' | 'unpublished';

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
	Offline = 'offline',
	Unpublished = 'unpublished',
}

export interface SyncBlockData {
	blockInstanceId: BlockInstanceId;
	content: Array<ADFEntity>;
	contentUpdatedAt?: string;
	createdAt?: string;
	createdBy?: string;
	deletionReason?: DeletionReason;
	isSynced?: boolean;
	/**
	 * Whether the block is on the same page as the source block
	 */
    onSameDocument?: boolean;
	product?: SyncBlockProduct;
	/**
	 * The ARI of the block. E.G ari:cloud:blocks:<cloudId>:synced-block/<product>/<pageId>/<resourceId>
	 */
	resourceId: ResourceId;
	sourceAri?: string;
	sourceSubType?: string | null;
	sourceTitle?: string;
	sourceURL?: string;
	status?: SyncBlockStatus;
	updatedAt?: string;
}

export interface ReferenceSyncBlockResponse {
	blockAri: string;
	blockInstanceId?: BlockInstanceId;
	contentUpdatedAt?: string;
	createdAt?: string;
	createdBy?: string;
	documentAri: string;
}

export interface ReferenceSyncBlock extends ReferenceSyncBlockResponse {
	hasAccess: boolean;
    onSameDocument: boolean;
}

export type ReferenceSyncBlockData = {
	error?: SyncBlockError;
	references?: ReferenceSyncBlock[];
};

export type ReferencesSourceInfo = {
	error?: SyncBlockError;
	references?: Array<SyncBlockSourceInfo | undefined>;
};

export type DeletionReason = 'source-block-deleted' | 'source-block-unsynced';
export type DeletionReasonResponse = DeletionReason | 'source-document-deleted';
