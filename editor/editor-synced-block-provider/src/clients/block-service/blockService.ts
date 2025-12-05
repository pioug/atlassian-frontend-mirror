import type { SyncBlockProduct } from '../../common/types';
import { fetchWithRetry } from '../../utils/retry';

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

export type BlockContentErrorResponse = {
	blockAri: string;
	code: string;
	reason: string;
};

export const isBlockContentResponse = (
	response: BlockContentResponse | BlockContentErrorResponse,
): response is BlockContentResponse => {
	const content = (response as BlockContentResponse).content;

	return typeof content === 'string';
};

/**
 * Retrieves all synced blocks referenced in a document.
 *
 * Calls the Block Service API endpoint: `/v1/block/document/reference/{documentAri}`
 *
 * @param documentAri - The ARI of the document to fetch synced blocks for
 * @returns A promise containing arrays of successfully fetched blocks and any errors encountered
 *
 * @example
 * ```typescript
 * const { blocks, errors } = await getReferenceSyncedBlocks(
 *   'ari:cloud:confluence:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx:page/88888888'
 * );
 * ```
 *
 * Example response:
 * ```json
 * {
 *   "blocks": [
 *     {
 *       "blockAri": "ari:cloud:blocks:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx:synced-block/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
 *       "version": 1,
 *       "sourceDocumentAri": "ari:cloud:confluence:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx:page/88888888",
 *       "blockInstanceId": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
 *       "content": "string",
 *       "status": "active",
 *       "createdAt": "2025-10-08T10:30:00.000Z",
 *       "createdBy": "557058:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
 *       "updatedAt": "2025-10-08T10:30:00.000Z"
 *     }
 *   ],
 *   "errors": [
 *     {
 *       "blockAri": "ari:cloud:blocks:xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx:synced-block/xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
 *       "code": "error",
 *       "reason": "some error reason"
 *     }
 *   ]
 * }
 * ```
 * Check https://block-service.dev.atl-paas.net/ for latest API documentation.
 */
export const getReferenceSyncedBlocks = async (
	documentAri: string,
): Promise<{
	blocks?: Array<BlockContentResponse>;
	errors?: Array<BlockContentErrorResponse>;
}> => {
	const response = await fetchWithRetry(
		`${BLOCK_SERVICE_API_URL}/block/document/reference/${encodeURIComponent(documentAri)}`,
		{
			method: 'GET',
			headers: COMMON_HEADERS,
		},
	);

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return await response.json();
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
	const response = await fetchWithRetry(`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`, {
		method: 'GET',
		headers: COMMON_HEADERS,
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as BlockContentResponse;
};

export const deleteSyncedBlock = async ({ blockAri }: DeleteSyncedBlockRequest): Promise<void> => {
	const response = await fetchWithRetry(`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`, {
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
	const response = await fetchWithRetry(`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`, {
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
	const response = await fetchWithRetry(`${BLOCK_SERVICE_API_URL}/block`, {
		method: 'POST',
		headers: COMMON_HEADERS,
		body: JSON.stringify({ blockAri, blockInstanceId, sourceAri, product, content }),
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as BlockContentResponse;
};
