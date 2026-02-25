/* eslint-disable require-unicode-regexp  */
import { useMemo } from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { generateBlockAri, generateBlockAriFromReference } from '../../clients/block-service/ari';
import {
	batchRetrieveSyncedBlocks,
	BlockError,
	createSyncedBlock,
	deleteSyncedBlock,
	getReferenceSyncedBlocks,
	getReferenceSyncedBlocksByBlockAri,
	getSyncedBlockContent,
	updateReferenceSyncedBlockOnDocument,
	updateSyncedBlock,
	updateSyncedBlocks,
	type ErrorResponse,
	type BlockContentResponse,
	type BatchUpdateSyncedBlockRequest,
} from '../../clients/block-service/blockService';
import { subscribeToBlockUpdates as subscribeToBlockUpdatesWS } from '../../clients/block-service/blockSubscription';
import {
	SyncBlockError,
	type ReferenceSyncBlockData,
	type ResourceId,
	type SyncBlockAttrs,
	type SyncBlockData,
	type SyncBlockProduct,
	type SyncBlockStatus,
} from '../../common/types';
import { stringifyError } from '../../utils/errorHandling';
import { createResourceIdForReference } from '../../utils/resourceId';
import { convertContentUpdatedAt } from '../../utils/utils';
import type {
	ADFFetchProvider,
	ADFWriteProvider,
	BlockNodeIdentifiers,
	DeleteSyncBlockResult,
	SyncBlockInstance,
	UpdateReferenceSyncBlockResult,
	WriteSyncBlockResult,
} from '../types';

const mapBlockError = (error: BlockError): SyncBlockError => {
	switch (error.status) {
		case 400:
		case 401:
			return SyncBlockError.InvalidRequest;
		case 403:
			return SyncBlockError.Forbidden;
		case 404:
			return SyncBlockError.NotFound;
		case 409:
			return SyncBlockError.Conflict;
		case 429:
			return SyncBlockError.RateLimited;
		case 500:
		case 503:
		case 504:
			return SyncBlockError.ServerError;
	}
	return SyncBlockError.Errored;
};

const mapErrorResponseCode = (errorCode: string): SyncBlockError => {
	switch (errorCode) {
		case 'FORBIDDEN':
			return SyncBlockError.Forbidden;
		case 'NOT_FOUND':
			return SyncBlockError.NotFound;
		case 'INVALID_REQUEST':
			return SyncBlockError.InvalidRequest;
		case 'CONFLICT':
			return SyncBlockError.Conflict;
		case 'RATE_LIMITED':
			return SyncBlockError.RateLimited;
		case 'SERVER_ERROR':
			return SyncBlockError.ServerError;
		case 'INVALID_CONTENT':
			return SyncBlockError.InvalidContent;
		default:
			return SyncBlockError.Errored;
	}
};

/**
 * Extracts the ResourceId from a block ARI by returning the full path after synced-block/.
 *
 * Document ARI format from Block Service API:
 * "ari:cloud:blocks:{uuid}:synced-block/{product}/{parentId}/{resourceId}"
 *
 * ResourceId format (extracted from ARI):
 * "{product}/{parentId}/{resourceId}" (the full path after synced-block/)
 *
 * Example in context:
 * Input:  "ari:cloud:blocks:{uuid}:synced-block/confluence-page/{pageId}/{resourceId}"
 * Output: "confluence-page/{pageId}/{resourceId}"
 *
 * @param blockAri - The block ARI string from Block Service API
 * @returns The ResourceId (full path after synced-block/)
 */
export const blockAriToResourceId = (blockAri: string): ResourceId | null => {
	// Validate ARI format and extract resourceId using regex
	// Format: ari:cloud:blocks:{uuid}:synced-block/{product}/{parentId}/{resourceId}
	// The regex captures the full path after synced-block/
	// e.g. ari:cloud:blocks:DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5:synced-block/confluence-page/455232061495/e8cf64e3-1b6e-489b-ad86-8465b0905bb4
	// should return confluence-page/455232061495/e8cf64e3-1b6e-489b-ad86-8465b0905bb4
	const match = blockAri.match(/^ari:cloud:blocks:.*:synced-block\/(.+)$/);
	return match?.[1] || null;
};

// convert BlockContentResponse to SyncBlockData
// throws exception if JSON parsing fails
// what's missing from BlockContentResponse to SyncBlockData:
// - sourceURL
// - sourceTitle
// - isSynced
export const convertToSyncBlockData = (
	data: BlockContentResponse,
	resourceId: ResourceId,
): SyncBlockData => {
	let createdAt: string | undefined;
	if (data.createdAt !== undefined && data.createdAt !== null) {
		try {
			createdAt = new Date(data.createdAt).toISOString();
		} catch {
			// fallback to undefined
			// as we don't want to block the whole process due to invalid date
			createdAt = undefined;
		}
	}

	return {
		blockInstanceId: data.blockInstanceId,
		content: JSON.parse(data.content),
		contentUpdatedAt: convertContentUpdatedAt(data.contentUpdatedAt),
		createdAt,
		createdBy: data.createdBy,
		product: data.product,
		resourceId,
		sourceAri: data.sourceAri,
		status: data.status,
	};
};

export const fetchReferences = async (
	documentAri: string,
): Promise<SyncBlockInstance[] | SyncBlockError> => {
	let response: {
		blocks?: BlockContentResponse[] | undefined;
		errors?: Array<ErrorResponse>;
	};

	try {
		response = await getReferenceSyncedBlocks(documentAri);
	} catch (error) {
		if (error instanceof BlockError) {
			return mapBlockError(error);
		}

		return SyncBlockError.Errored;
	}

	const { blocks, errors } = response || {};

	const blocksInstances = (blocks || []).map((blockContentResponse) => {
		try {
			const resourceId = blockAriToResourceId(blockContentResponse.blockAri);
			if (!resourceId) {
				// could not extract resourceId from blockAri, return InvalidContent error
				return {
					error: { type: SyncBlockError.InvalidContent },
					resourceId: blockContentResponse.blockAri,
				} as SyncBlockInstance;
			}

			return {
				data: convertToSyncBlockData(blockContentResponse, resourceId),
				resourceId,
			} as SyncBlockInstance;
		} catch {
			// JSON parsing error, return InvalidContent error
			return {
				error: { type: SyncBlockError.InvalidContent },
				resourceId: blockContentResponse.blockAri,
			} as SyncBlockInstance;
		}
	});

	const errorInstances = (errors || []).map(
		(errorBlock) =>
			({
				error: { type: SyncBlockError.Errored },
				resourceId: errorBlock.blockAri,
			}) as SyncBlockInstance,
	);

	return [...blocksInstances, ...errorInstances];
};

/**
 * Extracts the resourceId from a block ARI.
 * Block ARI format: ari:cloud:blocks:<cloudId>:synced-block/<resourceId>
 */
export const extractResourceIdFromBlockAri = (blockAri: string): string | undefined => {
	const match = blockAri.match(/ari:cloud:blocks:[^:]+:synced-block\/(.+)$/);
	return match?.[1];
};

/**
 * Batch fetches multiple synced blocks by their resource IDs.
 * @param cloudId - The cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
 * @param parentAri - The ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
 * @param blockNodeIdentifiers - Array of block node identifiers to fetch
 * @returns Array of SyncBlockInstance results
 */
export const batchFetchData = async (
	cloudId: string,
	parentAri: string | undefined,
	blockNodeIdentifiers: BlockNodeIdentifiers[],
): Promise<SyncBlockInstance[]> => {
	const blockIdentifiers = blockNodeIdentifiers.map((blockIdentifier) => ({
		blockAri: generateBlockAriFromReference({
			cloudId,
			resourceId: blockIdentifier.resourceId,
		}),
		blockInstanceId: blockIdentifier.blockInstanceId,
	}));

	// Create a set of valid resourceIds for validation
	const validResourceIds = new Set(
		blockNodeIdentifiers.map((blockNodeIdentifier) => blockNodeIdentifier.resourceId),
	);

	// Track which resourceIds have been processed
	const processedResourceIds = new Set<string>();

	if (!parentAri) {
		return blockNodeIdentifiers.map(
			(blockNodeIdentifier) =>
				({
					error: { type: SyncBlockError.Errored },
					resourceId: blockNodeIdentifier.resourceId,
				}) as SyncBlockInstance,
		);
	}

	try {
		const response = await batchRetrieveSyncedBlocks({
			blockIdentifiers,
		});
		const results: SyncBlockInstance[] = [];

		// Process successful blocks
		if (response.success) {
			for (const blockContentResponse of response.success) {
				// Extract resourceId from the returned blockAri
				const resourceId = extractResourceIdFromBlockAri(blockContentResponse.blockAri);
				if (!resourceId || !validResourceIds.has(resourceId)) {
					continue;
				}

				processedResourceIds.add(resourceId);

				const {
					content,
					deletionReason,
					sourceAri,
					blockAri,
					contentUpdatedAt,
					blockInstanceId,
					product,
					status,
				} = blockContentResponse;
				if (!content) {
					results.push({
						error: {
							type: SyncBlockError.NotFound,
							reason: deletionReason,
							sourceAri,
						},
						resourceId,
					});
					continue;
				}

				try {
					const syncedBlockData = JSON.parse(content) as Array<ADFEntity>;

					results.push({
						data: {
							content: syncedBlockData,
							resourceId: blockAri,
							contentUpdatedAt: convertContentUpdatedAt(contentUpdatedAt),
							blockInstanceId: blockInstanceId,
							sourceAri: sourceAri,
							product: product,
							status: status,
							deletionReason: deletionReason,
						},
						resourceId,
					});
				} catch {
					if (fg('platform_synced_block_patch_3')) {
						results.push({
							error: {
								type: SyncBlockError.Errored,
								reason: `parsing JSON content response failed for resourceId: ${resourceId} localId: ${blockAri}`,
							},
							resourceId,
						});
					} else {
						results.push({ error: { type: SyncBlockError.Errored }, resourceId });
					}
				}
			}
		}

		// Process errors
		if (response.error) {
			for (const errorResponse of response.error) {
				// Extract resourceId from the returned blockAri
				const resourceId = extractResourceIdFromBlockAri(errorResponse.blockAri);
				if (!resourceId || !validResourceIds.has(resourceId)) {
					continue;
				}

				processedResourceIds.add(resourceId);

				results.push({
					error: fg('platform_synced_block_patch_3')
						? { type: mapErrorResponseCode(errorResponse.code), reason: errorResponse.reason }
						: { type: mapErrorResponseCode(errorResponse.code) },
					resourceId,
				});
			}
		}

		// Ensure all resourceIds have a result - return NotFound for any missing ones
		for (const blockNodeIdentifier of blockNodeIdentifiers) {
			if (!processedResourceIds.has(blockNodeIdentifier.resourceId)) {
				results.push({
					error: { type: SyncBlockError.NotFound },
					resourceId: blockNodeIdentifier.resourceId,
				});
			}
		}

		return results;
	} catch (error) {
		// If batch request fails, return error for all resourceIds
		return blockNodeIdentifiers.map((blockNodeIdentifier) => ({
			error: {
				type: error instanceof BlockError ? mapBlockError(error) : SyncBlockError.Errored,
				reason: fg('platform_synced_block_patch_3') ? (error as Error).message : undefined,
			},
			resourceId: blockNodeIdentifier.resourceId,
		}));
	}
};

/**
 * Batch writes multiple synced blocks.
 * @param cloudId - The cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
 * @param parentAri - The ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
 * @param parentId - The parentId of the block. E.G the pageId for a confluence page, or the issueId for a Jira work item
 * @param product - The product of the block. E.G 'confluence-page', 'jira-work-item'
 * @param data - Array of SyncBlockData to write
 * @param stepVersion - Optional version number
 * @returns Array of WriteSyncBlockResult results
 */
export const writeDataBatch = async (
	cloudId: string,
	parentAri: string | undefined,
	parentId: string | undefined,
	product: SyncBlockProduct,
	data: SyncBlockData[],
	stepVersion?: number,
): Promise<WriteSyncBlockResult[]> => {
	if (!parentAri || !parentId) {
		return data.map((block) => ({ error: SyncBlockError.Errored, resourceId: block.resourceId }));
	}

	try {
		// Create a map from blockAri to original resourceId for matching responses
		const blockAriToResourceIdMap = new Map<string, string>();

		const blocks: BatchUpdateSyncedBlockRequest[] = data.map((block) => {
			const blockAri = generateBlockAri({
				cloudId,
				parentId,
				product,
				resourceId: block.resourceId,
			});

			blockAriToResourceIdMap.set(blockAri, block.resourceId);

			return {
				blockAri,
				content: JSON.stringify(block.content),
				status: block.status,
				stepVersion,
			};
		});

		const response = await updateSyncedBlocks({ blocks });

		const results: WriteSyncBlockResult[] = [];

		// Process successful updates
		if (response.success) {
			const successResourceIds = new Set(
				response.success.map((block) => blockAriToResourceIdMap.get(block.blockAri)),
			);

			for (const block of data) {
				if (successResourceIds.has(block.resourceId)) {
					results.push({ resourceId: block.resourceId });
				}
			}
		}

		if (response.error) {
			const errorResourceIds = new Map<string, SyncBlockError>(
				response.error.map((err) => [
					// Use the map to get the original resourceId
					blockAriToResourceIdMap.get(err.blockAri) || '',
					mapErrorResponseCode(err.code),
				]),
			);

			for (const block of data) {
				const error = errorResourceIds.get(block.resourceId);
				if (error) {
					results.push({ error, resourceId: block.resourceId });
				} else if (!results.some((r) => r.resourceId === block.resourceId)) {
					// If not in success or error lists, mark as errored
					results.push({ error: SyncBlockError.Errored, resourceId: block.resourceId });
				}
			}
		}

		return results;
	} catch (error) {
		if (error instanceof BlockError) {
			return data.map((block) => ({
				error: mapBlockError(error),
				resourceId: block.resourceId,
			}));
		}
		return data.map((block) => ({ error: stringifyError(error), resourceId: block.resourceId }));
	}
};

interface BlockServiceADFFetchProviderProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	parentAri: string | undefined; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
}

/**
 * ADFFetchProvider implementation that fetches synced block data from Block Service API
 */
class BlockServiceADFFetchProvider implements ADFFetchProvider {
	private cloudId: string;
	private parentAri: string | undefined;

	constructor({ cloudId, parentAri }: BlockServiceADFFetchProviderProps) {
		this.cloudId = cloudId;
		this.parentAri = parentAri;
	}

	// resourceId of the reference synced block.
	// the ARI must be constructed to call the block service API
	async fetchData(resourceId: string): Promise<SyncBlockInstance> {
		const blockAri = generateBlockAriFromReference({ cloudId: this.cloudId, resourceId });

		try {
			const blockContentResponse = await getSyncedBlockContent({
				blockAri,
			});

			const {
				content,
				sourceAri,
				deletionReason,
				blockInstanceId,
				contentUpdatedAt,
				product,
				status,
			} = blockContentResponse;

			if (!content) {
				return {
					error: { type: SyncBlockError.NotFound, reason: deletionReason, sourceAri },
					resourceId,
				};
			}

			// Parse the synced block content from the response's content
			const syncedBlockData = JSON.parse(content) as Array<ADFEntity>;

			return {
				data: {
					content: syncedBlockData,
					resourceId: blockAri,
					blockInstanceId: blockInstanceId, // this was the node's localId, but has become the resourceId.
					contentUpdatedAt: convertContentUpdatedAt(contentUpdatedAt),
					sourceAri: sourceAri,
					product: product,
					status: status,
					deletionReason: deletionReason,
				},
				resourceId,
			};
		} catch (error) {
			if (error instanceof BlockError) {
				return {
					error: fg('platform_synced_block_patch_3')
						? { type: mapBlockError(error), reason: error.message }
						: { type: mapBlockError(error) },
					resourceId,
				};
			}
			return {
				error: fg('platform_synced_block_patch_3')
					? { type: SyncBlockError.Errored, reason: (error as Error).message }
					: { type: SyncBlockError.Errored },
				resourceId,
			};
		}
	}

	async fetchReferences(referenceResourceId: string): Promise<ReferenceSyncBlockData> {
		try {
			const blockAri = generateBlockAriFromReference({
				cloudId: this.cloudId,
				resourceId: referenceResourceId,
			});
			const response = await getReferenceSyncedBlocksByBlockAri({ blockAri });

			const references: ReferenceSyncBlockData['references'] = [];
			response.references.forEach((reference) => {
				references.push({
					...reference,
					hasAccess: true,
					onSameDocument: this.parentAri === reference.documentAri,
				});
			});
			response.errors.forEach((reference) => {
				if (reference.code === 'FORBIDDEN') {
					references.push({
						blockAri: reference.blockAri,
						documentAri: reference.documentAri,
						hasAccess: false,
						onSameDocument: false,
					});
				}
			});

			return { references };
		} catch (error) {
			if (error instanceof BlockError) {
				return { error: mapBlockError(error) };
			}
			return { error: SyncBlockError.Errored };
		}
	}

	/**
	 * Batch fetches multiple synced blocks by their resource IDs.
	 * @param blockNodeIdentifiers - Array of block node identifiers to fetch
	 * @returns Array of SyncBlockInstance results
	 */
	async batchFetchData(blockNodeIdentifiers: BlockNodeIdentifiers[]): Promise<SyncBlockInstance[]> {
		return await batchFetchData(this.cloudId, this.parentAri, blockNodeIdentifiers);
	}

	/**
	 * Subscribes to real-time updates for a specific block using GraphQL WebSocket subscriptions.
	 * @param resourceId - The resource ID of the block to subscribe to
	 * @param onUpdate - Callback function invoked when the block is updated
	 * @param onError - Optional callback function invoked on subscription errors
	 * @returns Unsubscribe function to stop receiving updates
	 */
	subscribeToBlockUpdates(
		resourceId: ResourceId,
		onUpdate: (data: SyncBlockInstance) => void,
		onError?: (error: Error) => void,
	): () => void {
		const blockAri = generateBlockAriFromReference({ cloudId: this.cloudId, resourceId });

		return subscribeToBlockUpdatesWS(
			blockAri,
			(parsedData) => {
				// Convert ParsedBlockSubscriptionData to SyncBlockInstance
				const syncBlockInstance: SyncBlockInstance = {
					data: {
						content: parsedData.content,
						resourceId: parsedData.blockAri,
						blockInstanceId: parsedData.blockInstanceId,
						sourceAri: parsedData.sourceAri,
						product: parsedData.product,
						createdAt: parsedData.createdAt,
						contentUpdatedAt: parsedData.contentUpdatedAt,
						createdBy: parsedData.createdBy,
						status: parsedData.status as SyncBlockStatus,
					},
					resourceId: parsedData.resourceId,
				};
				onUpdate(syncBlockInstance);
			},
			onError,
		);
	}
}

interface BlockServiceADFWriteProviderProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	getVersion?: () => Promise<number | undefined>; // get the version of the block. E.G the version of the confluence page, or the version of the Jira work item
	parentAri: string | undefined; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
	parentId?: string; // the parentId of the block. E.G the pageId for a confluence page, or the issueId for a Jira work item
	product: SyncBlockProduct; // the product of the block. E.G 'confluence-page', 'jira-work-item'
}

/**
 * ADFWriteProvider implementation that writes synced block data to Block Service API
 */
class BlockServiceADFWriteProvider implements ADFWriteProvider {
	private cloudId: string;
	private parentId?: string;
	private getVersion?: () => Promise<number | undefined>;

	product: SyncBlockProduct;
	parentAri: string | undefined;

	constructor({
		cloudId,
		parentAri,
		parentId,
		product,
		getVersion,
	}: BlockServiceADFWriteProviderProps) {
		this.cloudId = cloudId;
		this.parentAri = parentAri;
		this.parentId = parentId;
		this.product = product;
		this.getVersion = getVersion;
	}

	// it will first try to update and if it can't (404) then it will try to create
	async writeData(data: SyncBlockData): Promise<WriteSyncBlockResult> {
		if (!this.parentAri || !this.parentId) {
			return { error: SyncBlockError.Errored };
		}
		const { resourceId } = data;
		const blockAri = generateBlockAri({
			cloudId: this.cloudId,
			parentId: this.parentId,
			product: this.product,
			resourceId,
		});
		const stepVersion = this.getVersion ? await this.getVersion() : undefined;

		try {
			const status = data.status;
			await updateSyncedBlock({
				blockAri,
				content: JSON.stringify(data.content),
				stepVersion,
				status,
			});
			return { resourceId };
		} catch (error) {
			if (error instanceof BlockError) {
				return { error: mapBlockError(error), resourceId };
			}
			return { error: stringifyError(error), resourceId };
		}
	}

	async createData(data: SyncBlockData): Promise<WriteSyncBlockResult> {
		if (!this.parentAri || !this.parentId) {
			return { error: SyncBlockError.Errored };
		}
		const { resourceId } = data;
		const blockAri = generateBlockAri({
			cloudId: this.cloudId,
			parentId: this.parentId,
			product: this.product,
			resourceId,
		});
		const stepVersion = this.getVersion ? await this.getVersion() : undefined;
		const status = 'unpublished';

		try {
			await createSyncedBlock({
				blockAri,
				blockInstanceId: data.blockInstanceId,
				sourceAri: this.parentAri,
				product: this.product,
				content: JSON.stringify(data.content),
				stepVersion,
				status,
			});

			return { resourceId };
		} catch (error) {
			if (error instanceof BlockError) {
				return { error: mapBlockError(error), resourceId };
			}
			return { error: stringifyError(error), resourceId };
		}
	}

	// soft deletes the source synced block
	async deleteData(
		resourceId: string,
		deleteReason: string | undefined,
	): Promise<DeleteSyncBlockResult> {
		if (!this.parentId) {
			return { resourceId, success: false, error: SyncBlockError.Errored };
		}
		const blockAri = generateBlockAri({
			cloudId: this.cloudId,
			parentId: this.parentId,
			product: this.product,
			resourceId,
		});
		try {
			await deleteSyncedBlock({ blockAri, deleteReason });
			return { resourceId, success: true, error: undefined };
		} catch (error) {
			if (error instanceof BlockError) {
				if (error.status === 404) {
					// User should not be blocked by not_found error when deleting,
					// hence returns successful result for 404 error
					return { resourceId, success: true };
				}
				return { resourceId, success: false, error: mapBlockError(error) };
			}
			return { resourceId, success: false, error: stringifyError(error) };
		}
	}

	// the sourceId is the resourceId of the source synced block.
	generateResourceIdForReference(sourceId: ResourceId): ResourceId {
		return createResourceIdForReference(this.product, this.parentId || '', sourceId);
	}

	generateResourceId(): ResourceId {
		return crypto.randomUUID();
	}

	generateBlockAri(resourceId: ResourceId): string {
		return generateBlockAri({
			cloudId: this.cloudId,
			parentId: this.parentId || '',
			product: this.product,
			resourceId,
		});
	}

	async updateReferenceData(
		blocks: SyncBlockAttrs[],
		noContent?: boolean,
	): Promise<UpdateReferenceSyncBlockResult> {
		if (!this.parentAri) {
			return { success: false, error: SyncBlockError.Errored };
		}
		try {
			await updateReferenceSyncedBlockOnDocument({
				documentAri: this.parentAri,
				blocks: blocks.map((block) => ({
					blockAri: generateBlockAriFromReference({
						cloudId: this.cloudId,
						resourceId: block.resourceId,
					}),
					blockInstanceId: block.localId,
				})),
				noContent,
			});
			return { success: true };
		} catch (error) {
			if (error instanceof BlockError) {
				return { success: false, error: mapBlockError(error) };
			}
			return { success: false, error: stringifyError(error) };
		}
	}

	async writeDataBatch(data: SyncBlockData[]): Promise<WriteSyncBlockResult[]> {
		if (!this.parentAri || !this.parentId) {
			return data.map((block) => ({ error: SyncBlockError.Errored, resourceId: block.resourceId }));
		}

		const stepVersion = this.getVersion ? await this.getVersion() : undefined;

		try {
			// Create a map from blockAri to original resourceId for matching responses
			const blockAriToResourceIdMap = new Map<string, string>();

			const blocks: BatchUpdateSyncedBlockRequest[] = data.map((block) => {
				const blockAri = this.generateBlockAri(block.resourceId);

				blockAriToResourceIdMap.set(blockAri, block.resourceId);

				return {
					blockAri,
					content: JSON.stringify(block.content),
					status: block.status,
					stepVersion,
				};
			});

			const response = await updateSyncedBlocks({ blocks });

			const results: WriteSyncBlockResult[] = [];

			// Process successful updates
			if (response.success) {
				const successResourceIds = new Set(
					response.success.map((block) => blockAriToResourceIdMap.get(block.blockAri)),
				);

				for (const block of data) {
					if (successResourceIds.has(block.resourceId)) {
						results.push({ resourceId: block.resourceId });
					}
				}
			}

			if (response.error) {
				const errorResourceIds = new Map<string, SyncBlockError>(
					response.error.map((err) => [
						// Use the map to get the original resourceId
						blockAriToResourceIdMap.get(err.blockAri) || '',
						mapErrorResponseCode(err.code),
					]),
				);

				for (const block of data) {
					const error = errorResourceIds.get(block.resourceId);
					if (error) {
						results.push({ error, resourceId: block.resourceId });
					} else if (!results.some((r) => r.resourceId === block.resourceId)) {
						// If not in success or error lists, mark as errored
						results.push({ error: SyncBlockError.Errored, resourceId: block.resourceId });
					}
				}
			}

			return results;
		} catch (error) {
			if (error instanceof BlockError) {
				return data.map((block) => ({
					error: mapBlockError(error),
					resourceId: block.resourceId,
				}));
			}
			return data.map((block) => ({ error: stringifyError(error), resourceId: block.resourceId }));
		}
	}
}

interface BlockServiceAPIProvidersProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	getVersion?: () => Promise<number | undefined>; // get the version of the block. E.G the version of the confluence page, or the version of the Jira work item
	parentAri: string | undefined; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
	parentId?: string; // the parentId of the block. E.G the pageId for a confluence page, or the issueId for a Jira work item
	product: SyncBlockProduct; // the product of the block. E.G 'confluence-page', 'jira-work-item'
}

const createBlockServiceAPIProviders = ({
	cloudId,
	parentAri,
	parentId,
	product,
	getVersion,
}: BlockServiceAPIProvidersProps): {
	fetchProvider: BlockServiceADFFetchProvider;
	writeProvider: BlockServiceADFWriteProvider;
} => {
	return {
		fetchProvider: new BlockServiceADFFetchProvider({
			cloudId,
			parentAri,
		}),
		writeProvider: new BlockServiceADFWriteProvider({
			cloudId,
			parentAri,
			parentId,
			product,
			getVersion,
		}),
	};
};

export const useMemoizedBlockServiceAPIProviders = ({
	cloudId,
	parentAri,
	parentId,
	product,
	getVersion,
}: BlockServiceAPIProvidersProps): {
	fetchProvider: BlockServiceADFFetchProvider;
	writeProvider: BlockServiceADFWriteProvider;
} => {
	return useMemo(() => {
		return createBlockServiceAPIProviders({
			cloudId,
			parentAri,
			parentId,
			product,
			getVersion,
		});
	}, [cloudId, parentAri, parentId, product, getVersion]);
};

interface BlockServiceFetchOnlyAPIProviderProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	parentAri: string | undefined; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
}

const createBlockServiceFetchOnlyAPIProvider = ({
	cloudId,
	parentAri,
}: BlockServiceFetchOnlyAPIProviderProps): {
	fetchProvider: BlockServiceADFFetchProvider;
	writeProvider: undefined;
} => {
	return {
		fetchProvider: new BlockServiceADFFetchProvider({ cloudId, parentAri }),
		writeProvider: undefined,
	};
};

/**
 * If the parentAri is not a valid ARI, pass in an empty string.
 */
export const useMemoizedBlockServiceFetchOnlyAPIProvider = ({
	cloudId,
	parentAri,
}: BlockServiceFetchOnlyAPIProviderProps): {
	fetchProvider: BlockServiceADFFetchProvider;
	writeProvider: undefined;
} =>
	useMemo(
		() => createBlockServiceFetchOnlyAPIProvider({ cloudId, parentAri }),
		[cloudId, parentAri],
	);
