import type { ReferenceSyncBlockResponse, SyncBlockProduct, SyncBlockStatus } from '../../common/types';
import { fetchWithRetry } from '../../utils/retry';

export type BlockContentResponse = {
	blockAri: string;
	blockInstanceId: string;
	content: string;
	createdAt: number;
	createdBy: string;
	product: SyncBlockProduct;
	sourceAri: string;
	status: SyncBlockStatus;
	version: number;
};

export type ErrorResponse = {
	blockAri: string;
	code: string;
	documentAri: string;
	reason: string;
};

type ReferenceSyncedBlockResponse = {
	blocks?: Array<BlockContentResponse>;
	errors?: Array<ErrorResponse>;
};

export const isBlockContentResponse = (
	response: BlockContentResponse | ErrorResponse,
): response is BlockContentResponse => {
	const content = (response as BlockContentResponse).content;

	return typeof content === 'string';
};

type GetDocumentReferenceBlocksGraphQLResponse = {
	data?: {
		blockService_getDocumentReferenceBlocks: ReferenceSyncedBlockResponse;
	};
	errors?: Array<{ message: string }>;
};

/**
 * Retrieves all synced blocks referenced in a document.
 *
 * Calls the Block Service GraphQL API: `blockService_getDocumentReferenceBlocks`
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
 */
export const getReferenceSyncedBlocks = async (
	documentAri: string,
): Promise<ReferenceSyncedBlockResponse> => {
	const bodyData = {
		query: buildGetDocumentReferenceBlocksQuery(documentAri),
		operationName: GET_DOCUMENT_REFERENCE_BLOCKS_OPERATION_NAME,
	};

	const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: COMMON_HEADERS,
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	const result = (await response.json()) as GetDocumentReferenceBlocksGraphQLResponse;

	if (result.errors && result.errors.length > 0) {
		throw new Error(result.errors.map((e) => e.message).join(', '));
	}

	if (!result.data) {
		throw new Error('No data returned from GraphQL query');
	}

	return result.data.blockService_getDocumentReferenceBlocks;
};

export type GetSyncedBlockContentRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
	documentAri?: string; // optional document ARI to pass as query parameter
};

export type DeleteSyncedBlockRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
};

export type UpdateSyncedBlockRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
	content: string;
	stepVersion?: number; // the current NCS step version number
};

export type CreateSyncedBlockRequest = {
	blockAri: string; // the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
	blockInstanceId: string; // the instance ID of the block (the localId of the synced block node)
	content: string;
	product: SyncBlockProduct;
	sourceAri: string; // the ARI of the source document (the ARI of the page or blog post)
	stepVersion?: number; // the current NCS step version number
};

type ReferenceSyncedBlockIDs = {
	blockAri: string;
	blockInstanceId: string;
};

type UpdateReferenceSyncedBlockOnDocumentRequest = {
	blocks: ReferenceSyncedBlockIDs[];
	documentAri: string; // the ARI of the document to update the synced block on
	noContent?: boolean;
};

export type BatchRetrieveSyncedBlocksRequest = {
	blockIdentifiers: BlockIdentifier[]; // array of block identifiers to retrieve
	documentAri: string; // the ARI of the document to retrieve the synced blocks for
};

type BlockIdentifier = {
	blockAri: string;
	blockInstanceId: string;
};

export type BatchRetrieveSyncedBlocksResponse = {
	error?: Array<ErrorResponse>;
	success?: Array<BlockContentResponse>;
};

type GetReferenceSyncedBlocksByBlockAriRequest = {
	blockAri: string; // the ARI of the block
};

type GetReferenceSyncedBlocksByBlockAriResponse = {
	blockAri?: string;
	errors: Array<ErrorResponse>;
	references: Array<ReferenceSyncBlockResponse>;
};

const COMMON_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

const BLOCK_SERVICE_API_URL = '/gateway/api/blocks/v1';
const GRAPHQL_ENDPOINT = '/gateway/api/graphql';

const GET_DOCUMENT_REFERENCE_BLOCKS_OPERATION_NAME =
	'EDITOR_SYNCED_BLOCK_GET_DOCUMENT_REFERENCE_BLOCKS';

const buildGetDocumentReferenceBlocksQuery = (
	documentAri: string,
) => `query ${GET_DOCUMENT_REFERENCE_BLOCKS_OPERATION_NAME} {
	blockService_getDocumentReferenceBlocks(documentAri: "${documentAri}") {
		blocks {
			blockAri
			blockInstanceId
			content
			createdAt
			createdBy
			product
			sourceAri
			status
			version
		}
		errors {
			blockAri
			code
			reason
		}
	}
}`;

export class BlockError extends Error {
	constructor(public readonly status: number) {
		super(`Block error`);
	}
}

export const getSyncedBlockContent = async ({
	blockAri,
	documentAri,
}: GetSyncedBlockContentRequest): Promise<BlockContentResponse> => {
	// Disable sending documentAri for now. We'll add it back if we find a way to update references that follows the save & refresh principle.
	// Slack discussion here: https://atlassian.slack.com/archives/C09DZT1TBNW/p1767836775552099?thread_ts=1767836754.024889&cid=C09DZT1TBNW
	// const queryParams = documentAri ? `?documentAri=${encodeURIComponent(documentAri)}` : '';
	const queryParams = '';
	const response = await fetchWithRetry(
		`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}` + queryParams,
		{
			method: 'GET',
			headers: COMMON_HEADERS,
		},
	);

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as BlockContentResponse;
};

/**
 * Batch retrieves multiple synced blocks by their ARIs.
 *
 * Calls the Block Service API endpoint: `POST /v1/block/batch-retrieve`
 *
 * @param blockAris - Array of block ARIs to retrieve
 * @returns A promise containing arrays of successfully fetched blocks and any errors encountered
 */
export const batchRetrieveSyncedBlocks = async ({
	blockIdentifiers,
	documentAri,
}: BatchRetrieveSyncedBlocksRequest): Promise<BatchRetrieveSyncedBlocksResponse> => {
	const response = await fetchWithRetry(`${BLOCK_SERVICE_API_URL}/block/batch-retrieve`, {
		method: 'POST',
		headers: COMMON_HEADERS,
		body: JSON.stringify({ 
			documentAri,
			blockIdentifiers,
			blockAris: blockIdentifiers.map((blockIdentifier) => blockIdentifier.blockAri),
		 }),
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as BatchRetrieveSyncedBlocksResponse;
};

export const deleteSyncedBlock = async ({ blockAri }: DeleteSyncedBlockRequest): Promise<void> => {
	const response = await fetchWithRetry(
		`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`,
		{
			method: 'DELETE',
			headers: COMMON_HEADERS,
		},
	);

	if (!response.ok) {
		throw new BlockError(response.status);
	}
};

export const updateSyncedBlock = async ({
	blockAri,
	content,
	stepVersion,
}: UpdateSyncedBlockRequest): Promise<void> => {
	const requestBody: { content: string; stepVersion?: number } = { content };
	if (stepVersion !== undefined) {
		requestBody.stepVersion = stepVersion;
	}

	const response = await fetchWithRetry(
		`${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`,
		{
			method: 'PUT',
			headers: COMMON_HEADERS,
			body: JSON.stringify(requestBody),
		},
	);

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
	stepVersion,
}: CreateSyncedBlockRequest): Promise<BlockContentResponse> => {
	const requestBody: {
		blockAri: string;
		blockInstanceId: string;
		content: string;
		product: SyncBlockProduct;
		sourceAri: string;
		stepVersion?: number;
	} = {
		blockAri,
		blockInstanceId,
		sourceAri,
		product,
		content,
	};

	if (stepVersion !== undefined) {
		requestBody.stepVersion = stepVersion;
	}

	const response = await fetchWithRetry(`${BLOCK_SERVICE_API_URL}/block`, {
		method: 'POST',
		headers: COMMON_HEADERS,
		body: JSON.stringify(requestBody),
	});

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as BlockContentResponse;
};

export const updateReferenceSyncedBlockOnDocument = async ({
	documentAri,
	blocks,
	noContent = true,
}: UpdateReferenceSyncedBlockOnDocumentRequest): Promise<ReferenceSyncedBlockResponse | void> => {
	const response = await fetchWithRetry(
		`${BLOCK_SERVICE_API_URL}/block/document/${encodeURIComponent(documentAri)}/references?noContent=${noContent}`,
		{
			method: 'PUT',
			headers: COMMON_HEADERS,
			body: JSON.stringify({ blocks }),
		},
	);

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	if (!noContent) {
		return (await response.json()) as {
			blocks?: Array<BlockContentResponse>;
			errors?: Array<ErrorResponse>;
		};
	}
};

export const getReferenceSyncedBlocksByBlockAri = async ({
	blockAri,
}: GetReferenceSyncedBlocksByBlockAriRequest): Promise<GetReferenceSyncedBlocksByBlockAriResponse> => {
	const response = await fetchWithRetry(
		`${BLOCK_SERVICE_API_URL}/reference/batch-retrieve/${encodeURIComponent(blockAri)}`,
		{
			method: 'GET',
			headers: COMMON_HEADERS,
		},
	);

	if (!response.ok) {
		throw new BlockError(response.status);
	}

	return (await response.json()) as GetReferenceSyncedBlocksByBlockAriResponse;
};
