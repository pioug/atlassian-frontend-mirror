import { fg } from '@atlaskit/platform-feature-flags';

import type {
	ReferenceSyncBlockResponse,
	SyncBlockProduct,
	SyncBlockStatus,
	DeletionReason,
} from '../../common/types';
import { fetchWithRetry } from '../../utils/retry';

export type BlockContentResponse = {
	blockAri: string;
	blockInstanceId: string;
	content: string;
	contentUpdatedAt: number;
	createdAt: number;
	createdBy: string;
	deletionReason: DeletionReason;
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

type UpdateBlockGraphQLResponse = {
	data?: {
		blockService_updateBlock: void;
	};
	errors?: Array<{ message: string }>;
};

type DeleteBlockGraphQLResponse = {
	data?: {
		blockService_deleteBlock: {
			deleted: boolean;
		};
	};
	errors?: Array<{ message: string }>;
};

type CreateBlockGraphQLResponse = {
	data?: {
		blockService_createBlock: BlockContentResponse;
	};
	errors?: Array<{ message: string }>;
};

type UpdateDocumentReferencesGraphQLResponse = {
	data?: {
		blockService_updateDocumentReferences: ReferenceSyncedBlockResponse;
	};
	errors?: Array<{ message: string }>;
};

type BatchRetrieveBlocksGraphQLResponse = {
	data?: {
		blockService_batchRetrieveBlocks: {
			success?: Array<BlockContentResponse>;
			error?: Array<ErrorResponse>;
		};
	};
	errors?: Array<{ message: string }>;
};

type GetBlockReferencesGraphQLResponse = {
	data?: {
		blockService_getReferences: {
			references?: Array<ReferenceSyncBlockResponse>;
			errors?: Array<ErrorResponse>;
		};
	};
	errors?: Array<{ message: string }>;
};

type GetBlockGraphQLResponse = {
	data?: {
		blockService_getBlock: BlockContentResponse;
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
 *       "contentUpdatedAt": "2025-10-08T10:30:00.000Z"
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
	deleteReason: string | undefined; // the reason for the deletion, e.g. 'source-block-unsynced', 'source-block-deleted'
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
	status?: SyncBlockStatus; // the status of the block. 'unpublished' if the page is unpublished, 'active' otherwise
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
const UPDATE_BLOCK_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_UPDATE_BLOCK';
const DELETE_BLOCK_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_DELETE_BLOCK';
const CREATE_BLOCK_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_CREATE_BLOCK';
const UPDATE_DOCUMENT_REFERENCES_OPERATION_NAME =
	'EDITOR_SYNCED_BLOCK_UPDATE_DOCUMENT_REFERENCES';
const BATCH_RETRIEVE_BLOCKS_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_BATCH_RETRIEVE_BLOCKS';
const GET_BLOCK_REFERENCES_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_GET_REFERENCES';
const GET_BLOCK_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_GET_BLOCK';

const buildGetDocumentReferenceBlocksQuery = (
	documentAri: string,
) => `query ${GET_DOCUMENT_REFERENCE_BLOCKS_OPERATION_NAME} {
	blockService_getDocumentReferenceBlocks(documentAri: "${documentAri}") {
		blocks {
			blockAri
			blockInstanceId
			content
			contentUpdatedAt
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

const buildGetBlockQuery = (blockAri: string) => `query ${GET_BLOCK_OPERATION_NAME} {
	blockService_getBlock(blockAri: ${JSON.stringify(blockAri)}) {
		blockAri
		blockInstanceId
		content
		contentUpdatedAt
		createdAt
		createdBy
		deletionReason
		product
		sourceAri
		status
		version
	}
}`;

const buildUpdateBlockMutation = (
	blockAri: string,
	content: string,
	stepVersion?: number,
) => {
	const inputParts = [
		`blockAri: ${JSON.stringify(blockAri)}`,
		`content: ${JSON.stringify(content)}`,
	];
	if (stepVersion !== undefined) {
		inputParts.push(`stepVersion: ${stepVersion}`);
	}
	const inputArgs = inputParts.join(', ');
	return `mutation ${UPDATE_BLOCK_OPERATION_NAME} {
	blockService_updateBlock(input: { ${inputArgs} }) {
		__typename
	}
}`;
};

const buildDeleteBlockMutation = (
	blockAri: string,
	deletionReason?: string,
) => {
	const inputParts = [`blockAri: ${JSON.stringify(blockAri)}`];
	if (deletionReason !== undefined) {
		inputParts.push(`deletionReason: ${JSON.stringify(deletionReason)}`);
	}
	const inputArgs = inputParts.join(', ');
	return `mutation ${DELETE_BLOCK_OPERATION_NAME} {
	blockService_deleteBlock(input: { ${inputArgs} }) {
		deleted
	}
}`;
};

/**
 * Converts product string to GraphQL enum format
 * 'confluence-page' -> 'CONFLUENCE_PAGE'
 * 'jira-work-item' -> 'JIRA_WORK_ITEM'
 */
const convertProductToGraphQLEnum = (product: SyncBlockProduct): string => {
	if (product === 'confluence-page') {
		return 'CONFLUENCE_PAGE';
	}
	// product must be 'jira-work-item' at this point
	return 'JIRA_WORK_ITEM';
};

const buildCreateBlockMutation = (
	blockAri: string,
	blockInstanceId: string,
	content: string,
	product: SyncBlockProduct,
	sourceAri: string,
	stepVersion?: number,
	status?: SyncBlockStatus,
) => {
	const inputParts = [
		`blockAri: ${JSON.stringify(blockAri)}`,
		`blockInstanceId: ${JSON.stringify(blockInstanceId)}`,
		`content: ${JSON.stringify(content)}`,
		`product: ${convertProductToGraphQLEnum(product)}`,
		`sourceAri: ${JSON.stringify(sourceAri)}`,
	];
	if (stepVersion !== undefined) {
		inputParts.push(`stepVersion: ${stepVersion}`);
	}
	if (status !== undefined) {
		inputParts.push(`status: ${JSON.stringify(status)}`);
	}
	const inputArgs = inputParts.join(', ');
	return `mutation ${CREATE_BLOCK_OPERATION_NAME} {
	blockService_createBlock(input: { ${inputArgs} }) {
		blockAri
		blockInstanceId
		content
		contentUpdatedAt
		createdAt
		createdBy
		deletionReason
		product
		sourceAri
		status
		version
	}
}`;
};

const buildUpdateDocumentReferencesMutation = (
	documentAri: string,
	blocks: Array<{ blockAri: string; blockInstanceId: string }>,
	noContent: boolean,
) => {
	const blocksArray = blocks
		.map(
			(block) =>
				`{ blockAri: ${JSON.stringify(block.blockAri)}, blockInstanceId: ${JSON.stringify(block.blockInstanceId)} }`,
		)
		.join(', ');
	const inputArgs = `documentAri: ${JSON.stringify(documentAri)}, blocks: [${blocksArray}], noContent: ${noContent}`;
	return `mutation ${UPDATE_DOCUMENT_REFERENCES_OPERATION_NAME} {
	blockService_updateDocumentReferences(input: { ${inputArgs} }) {
		blocks {
			blockAri
			blockInstanceId
			content
			contentUpdatedAt
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
};

const buildBatchRetrieveBlocksQuery = (blockAris: string[]) => {
	const blockArisArray = blockAris.map((ari) => JSON.stringify(ari)).join(', ');
	const inputArgs = `blockAris: [${blockArisArray}]`;
	return `query ${BATCH_RETRIEVE_BLOCKS_OPERATION_NAME} {
	blockService_batchRetrieveBlocks(input: { ${inputArgs} }) {
		success {
			blockAri
			blockInstanceId
			content
			contentUpdatedAt
			createdAt
			createdBy
			deletionReason
			product
			sourceAri
			status
			version
		}
		error {
			blockAri
			code
			reason
		}
	}
}`;
};

const buildGetBlockReferencesQuery = (blockAri: string) => {
	return `query ${GET_BLOCK_REFERENCES_OPERATION_NAME} {
	blockService_getReferences(blockAri: ${JSON.stringify(blockAri)}) {
		references {
			blockAri
			blockInstanceId
			createdAt
			createdBy
			documentAri
		}
		errors {
			blockAri
			code
			reason
		}
	}
}`;
};

export class BlockError extends Error {
	constructor(public readonly status: number) {
		super(`Block error`);
	}
}

export const getSyncedBlockContent = async ({
	blockAri,
}: GetSyncedBlockContentRequest): Promise<BlockContentResponse> => {
	if (fg('platform_synced_block_patch_1')) {
		const bodyData = {
			query: buildGetBlockQuery(blockAri),
			operationName: GET_BLOCK_OPERATION_NAME,
		};

		const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: COMMON_HEADERS,
			body: JSON.stringify(bodyData),
		});

		if (!response.ok) {
			throw new BlockError(response.status);
		}

		const result = (await response.json()) as GetBlockGraphQLResponse;

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors.map((e) => e.message).join(', '));
		}

		if (!result.data?.blockService_getBlock) {
			throw new Error('No data returned from GraphQL query');
		}

		return result.data.blockService_getBlock;
	}

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
 * or GraphQL query `blockService_batchRetrieveBlocks` when feature flag is enabled
 *
 * @param blockAris - Array of block ARIs to retrieve
 * @returns A promise containing arrays of successfully fetched blocks and any errors encountered
 */
export const batchRetrieveSyncedBlocks = async ({
	blockIdentifiers,
	documentAri,
}: BatchRetrieveSyncedBlocksRequest): Promise<BatchRetrieveSyncedBlocksResponse> => {
	if (fg('platform_synced_block_patch_1')) {
		const blockAris = blockIdentifiers.map((blockIdentifier) => blockIdentifier.blockAri);
		const bodyData = {
			query: buildBatchRetrieveBlocksQuery(blockAris),
			operationName: BATCH_RETRIEVE_BLOCKS_OPERATION_NAME,
		};

		const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: COMMON_HEADERS,
			body: JSON.stringify(bodyData),
		});

		if (!response.ok) {
			throw new BlockError(response.status);
		}

		const result: BatchRetrieveBlocksGraphQLResponse = await response.json();

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors.map((e) => e.message).join(', '));
		}

		if (!result.data?.blockService_batchRetrieveBlocks) {
			throw new Error('No data returned from GraphQL query');
		}

		const graphqlResponse = result.data.blockService_batchRetrieveBlocks;
		return {
			success: graphqlResponse.success,
			error: graphqlResponse.error,
		};
	}

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

export const deleteSyncedBlock = async ({
	blockAri,
	deleteReason,
}: DeleteSyncedBlockRequest): Promise<void> => {
	if (fg('platform_synced_block_patch_1')) {
		const bodyData = {
			query: buildDeleteBlockMutation(blockAri, deleteReason),
			operationName: DELETE_BLOCK_OPERATION_NAME,
		};

		const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: COMMON_HEADERS,
			body: JSON.stringify(bodyData),
		});

		if (!response.ok) {
			throw new BlockError(response.status);
		}

		const result: DeleteBlockGraphQLResponse = await response.json();

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors.map((e) => e.message).join(', '));
		}

		if (!result.data?.blockService_deleteBlock.deleted) {
			throw new Error('Block deletion failed; deleted flag is false');
		}

		return;
	}

	const url = deleteReason
		? `${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}?deletionReason=${encodeURIComponent(deleteReason)}`
		: `${BLOCK_SERVICE_API_URL}/block/${encodeURIComponent(blockAri)}`;
	const response = await fetchWithRetry(url, {
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
	stepVersion,
}: UpdateSyncedBlockRequest): Promise<void> => {
	if (fg('platform_synced_block_patch_1')) {
		const bodyData = {
			query: buildUpdateBlockMutation(blockAri, content, stepVersion),
			operationName: UPDATE_BLOCK_OPERATION_NAME,
		};

		const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: COMMON_HEADERS,
			body: JSON.stringify(bodyData),
		});

		if (!response.ok) {
			throw new BlockError(response.status);
		}

		const result: UpdateBlockGraphQLResponse = await response.json();

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors.map((e) => e.message).join(', '));
		}

		return;
	}

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
	status,
}: CreateSyncedBlockRequest): Promise<BlockContentResponse> => {
	if (fg('platform_synced_block_patch_1')) {
		const bodyData = {
			query: buildCreateBlockMutation(
				blockAri,
				blockInstanceId,
				content,
				product,
				sourceAri,
				stepVersion,
				status,
			),
			operationName: CREATE_BLOCK_OPERATION_NAME,
		};

		const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: COMMON_HEADERS,
			body: JSON.stringify(bodyData),
		});

		if (!response.ok) {
			throw new BlockError(response.status);
		}

		const result: CreateBlockGraphQLResponse = await response.json();

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors.map((e) => e.message).join(', '));
		}

		if (!result.data?.blockService_createBlock) {
			throw new Error('No data returned from GraphQL mutation');
		}

		return result.data.blockService_createBlock;
	}

	const requestBody: {
		blockAri: string;
		blockInstanceId: string;
		content: string;
		product: SyncBlockProduct;
		sourceAri: string;
		status?: SyncBlockStatus;
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

	if (status !== undefined) {
		requestBody.status = status;
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
	if (fg('platform_synced_block_patch_1')) {
		const bodyData = {
			query: buildUpdateDocumentReferencesMutation(documentAri, blocks, noContent),
			operationName: UPDATE_DOCUMENT_REFERENCES_OPERATION_NAME,
		};

		const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: COMMON_HEADERS,
			body: JSON.stringify(bodyData),
			keepalive: true,
		});

		if (!response.ok) {
			throw new BlockError(response.status);
		}

		const result: UpdateDocumentReferencesGraphQLResponse = await response.json();

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors.map((e) => e.message).join(', '));
		}

		if (!noContent) {
			if (!result.data?.blockService_updateDocumentReferences) {
				throw new Error('No data returned from GraphQL mutation');
			}
			return result.data.blockService_updateDocumentReferences;
		}
		return;
	}

	const response = await fetchWithRetry(
		`${BLOCK_SERVICE_API_URL}/block/document/${encodeURIComponent(documentAri)}/references?noContent=${noContent}`,
		{
			method: 'PUT',
			headers: COMMON_HEADERS,
			body: JSON.stringify({ blocks }),
			keepalive: true,
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
	if (fg('platform_synced_block_patch_1')) {
		const bodyData = {
			query: buildGetBlockReferencesQuery(blockAri),
			operationName: GET_BLOCK_REFERENCES_OPERATION_NAME,
		};

		const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: COMMON_HEADERS,
			body: JSON.stringify(bodyData),
		});

		if (!response.ok) {
			throw new BlockError(response.status);
		}

		const result: GetBlockReferencesGraphQLResponse = await response.json();

		if (result.errors && result.errors.length > 0) {
			throw new Error(result.errors.map((e) => e.message).join(', '));
		}

		if (!result.data?.blockService_getReferences) {
			throw new Error('No data returned from GraphQL query');
		}

		const graphqlResponse = result.data.blockService_getReferences;
		return {
			blockAri,
			references: graphqlResponse.references || [],
			errors: graphqlResponse.errors || [],
		};
	}

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
