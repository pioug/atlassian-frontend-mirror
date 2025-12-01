import type { SyncBlockProduct } from '../../common/types';

export type BlockContentResponse = {
	blockAri: string;
	blockInstanceId: string;
	content: string;
	createdAt: number;
	createdBy: string;
	product: SyncBlockProduct;
	sourceAri: string;
	status: 'active' | 'deleted';
	version: number;
};

export type GetSyncedBlockContentRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
};

export type DeleteSyncedBlockRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
};

export type UpdateSyncedBlockRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
	content: string;
};

export type CreateSyncedBlockRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
	blockInstanceId: string; // the instance ID of the block (the localId of the synced block node)
	content: string;
	product: SyncBlockProduct;
	sourceAri: string; // the ARI of the source document (the ARI of the page or blog post)
};

const COMMON_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

const BLOCK_SERVICE_API_URL = '/gateway/api/blocks/v1';

export class BlockError extends Error {
	constructor(public readonly status: number) {
		super(`Block error`);
	}
}

export const getSyncedBlockContent = async ({
	blockAri,
}: GetSyncedBlockContentRequest): Promise<BlockContentResponse> => {
	const response = await fetch(`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`, {
		method: 'GET',
		headers: COMMON_HEADERS,
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as BlockContentResponse;
};

export const deleteSyncedBlock = async ({ blockAri }: DeleteSyncedBlockRequest): Promise<void> => {
	const response = await fetch(`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`, {
		method: 'DELETE',
		headers: COMMON_HEADERS,
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}
};

export const updateSyncedBlock = async ({
	blockAri,
	content,
}: UpdateSyncedBlockRequest): Promise<void> => {
	const response = await fetch(`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`, {
		method: 'PUT',
		headers: COMMON_HEADERS,
		body: JSON.stringify({ content }),
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}
};

export const createSyncedBlock = async ({
	blockAri,
	blockInstanceId,
	sourceAri,
	product,
	content,
}: CreateSyncedBlockRequest): Promise<BlockContentResponse> => {
	const response = await fetch(`${BLOCK_SERVICE_API_URL}/block`, {
		method: 'POST',
		headers: COMMON_HEADERS,
		body: JSON.stringify({ blockAri, blockInstanceId, sourceAri, product, content }),
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as BlockContentResponse;
};
