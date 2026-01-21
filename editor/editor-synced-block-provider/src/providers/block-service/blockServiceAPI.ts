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
	type ErrorResponse,
	type BlockContentResponse,
} from '../../clients/block-service/blockService';
import {
	SyncBlockError,
	type ReferenceSyncBlockData,
	type ResourceId,
	type SyncBlockAttrs,
	type SyncBlockData,
	type SyncBlockProduct,
} from '../../common/types';
import { stringifyError } from '../../utils/errorHandling';
import { createResourceIdForReference } from '../../utils/resourceId';
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
// - updatedAt
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
			// BE returns microseconds, convert to milliseconds
			// BE should fix this in the future
			createdAt = new Date(data.createdAt / 1000).toISOString();
		} catch (e) {
			// fallback to undefined
			// as we don't want to block the whole process due to invalid date
			createdAt = undefined;
		}
	}

	return {
		blockInstanceId: data.blockInstanceId,
		content: JSON.parse(data.content),
		createdAt,
		createdBy: data.createdBy,
		product: data.product,
		resourceId,
		sourceAri: data.sourceAri,
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
					error: SyncBlockError.InvalidContent,
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
				error: SyncBlockError.InvalidContent,
				resourceId: blockContentResponse.blockAri,
			} as SyncBlockInstance;
		}
	});

	const errorInstances = (errors || []).map(
		(errorBlock) =>
			({
				error: SyncBlockError.Errored,
				resourceId: errorBlock.blockAri,
			}) as SyncBlockInstance,
	);

	return [...blocksInstances, ...errorInstances];
};

interface BlockServiceADFFetchProviderProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	parentAri?: string; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
}

/**
 * ADFFetchProvider implementation that fetches synced block data from Block Service API
 */
class BlockServiceADFFetchProvider implements ADFFetchProvider {
	private cloudId: string;
	private parentAri?: string;

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
				documentAri: this.parentAri,
			});
			const value = blockContentResponse.content;

			if (!value) {
				return { error: SyncBlockError.NotFound, resourceId };
			}

			// Parse the synced block content from the response's content
			const syncedBlockData = JSON.parse(value) as Array<ADFEntity>;

			return {
				data: {
					content: syncedBlockData,
					resourceId: blockAri,
					blockInstanceId: blockContentResponse.blockInstanceId, // this was the node's localId, but has become the resourceId.
					sourceAri: blockContentResponse.sourceAri,
					product: blockContentResponse.product,
				},
				resourceId,
			};
		} catch (error) {
			if (error instanceof BlockError) {
				return { error: mapBlockError(error), resourceId };
			}
			return { error: SyncBlockError.Errored, resourceId };
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
					onSamePage: this.parentAri === reference.documentAri,
				});
			});
			response.errors.forEach((reference) => {
				if (reference.code === 'FORBIDDEN') {
					references.push({
						blockAri: reference.blockAri,
						documentAri: reference.documentAri,
						hasAccess: false,
						onSamePage: false,
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
	 * Extracts the resourceId from a block ARI.
	 * Block ARI format: ari:cloud:blocks:<cloudId>:synced-block/<resourceId>
	 */
	private extractResourceIdFromBlockAri(blockAri: string): string | undefined {
		const match = blockAri.match(/ari:cloud:blocks:[^:]+:synced-block\/(.+)$/);
		return match?.[1];
	}

	/**
	 * Batch fetches multiple synced blocks by their resource IDs.
	 * @param resourceIds - Array of resource IDs to fetch
	 * @returns Array of SyncBlockInstance results
	 */
	async batchFetchData(blockNodeIdentifiers: BlockNodeIdentifiers[]): Promise<SyncBlockInstance[]> {
		const blockIdentifiers = blockNodeIdentifiers.map((blockIdentifier) => ({
			blockAri: generateBlockAriFromReference({ cloudId: this.cloudId, resourceId: blockIdentifier.resourceId }),
			blockInstanceId: blockIdentifier.blockInstanceId,
		}));

		// Create a set of valid resourceIds for validation
		const validResourceIds = new Set(blockNodeIdentifiers.map((blockNodeIdentifier) => blockNodeIdentifier.resourceId));

		// Track which resourceIds have been processed
		const processedResourceIds = new Set<string>();

		if (!this.parentAri) {
			return blockNodeIdentifiers.map((blockNodeIdentifier) => ({
				error: SyncBlockError.Errored,
				resourceId: blockNodeIdentifier.resourceId,
			}) as SyncBlockInstance);
		}

		try {
			const response = await batchRetrieveSyncedBlocks({ documentAri: this.parentAri, blockIdentifiers });
			const results: SyncBlockInstance[] = [];

			// Process successful blocks
			if (response.success) {
				for (const blockContentResponse of response.success) {
					// Extract resourceId from the returned blockAri
					const resourceId = this.extractResourceIdFromBlockAri(blockContentResponse.blockAri);
					if (!resourceId || !validResourceIds.has(resourceId)) {
						continue;
					}

					processedResourceIds.add(resourceId);

					const value = blockContentResponse.content;
					if (!value) {
						results.push({ error: SyncBlockError.NotFound, resourceId });
						continue;
					}

					try {
						const syncedBlockData = JSON.parse(value) as Array<ADFEntity>;
						results.push({
							data: {
								content: syncedBlockData,
								resourceId: blockContentResponse.blockAri,
								blockInstanceId: blockContentResponse.blockInstanceId,
								sourceAri: blockContentResponse.sourceAri,
								product: blockContentResponse.product,
							},
							resourceId,
						});
					} catch {
						results.push({ error: SyncBlockError.Errored, resourceId });
					}
				}
			}

			// Process errors
			if (response.error) {
				for (const errorResponse of response.error) {
					// Extract resourceId from the returned blockAri
					const resourceId = this.extractResourceIdFromBlockAri(errorResponse.blockAri);
					if (!resourceId || !validResourceIds.has(resourceId)) {
						continue;
					}

					processedResourceIds.add(resourceId);

					results.push({
						error: mapErrorResponseCode(errorResponse.code),
						resourceId,
					});
				}
			}

			// Ensure all resourceIds have a result - return NotFound for any missing ones
			for (const blockNodeIdentifier of blockNodeIdentifiers) {
				if (!processedResourceIds.has(blockNodeIdentifier.resourceId)) {
					results.push({
						error: SyncBlockError.NotFound,
						resourceId: blockNodeIdentifier.resourceId,
					});
				}
			}

			return results;
		} catch (error) {
			// If batch request fails, return error for all resourceIds
			return blockNodeIdentifiers.map((blockNodeIdentifier) => ({
				error: error instanceof BlockError ? mapBlockError(error) : SyncBlockError.Errored,
				resourceId: blockNodeIdentifier.resourceId,
			}));
		}
	}
}

interface BlockServiceADFWriteProviderProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	getVersion?: () => number | undefined; // get the version of the block. E.G the version of the confluence page, or the version of the Jira work item
	parentAri?: string; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
	parentId?: string; // the parentId of the block. E.G the pageId for a confluence page, or the issueId for a Jira work item
	product: SyncBlockProduct; // the product of the block. E.G 'confluence-page', 'jira-work-item'
}

/**
 * ADFWriteProvider implementation that writes synced block data to Block Service API
 */
class BlockServiceADFWriteProvider implements ADFWriteProvider {
	private cloudId: string;
	private parentId?: string;
	private getVersion?: () => number | undefined;

	product: SyncBlockProduct;
	parentAri?: string;

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
		const stepVersion = this.getVersion ? this.getVersion() : undefined;

		try {
			// Try update existing block's content
			await updateSyncedBlock({ blockAri, content: JSON.stringify(data.content), stepVersion });
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
		const stepVersion = this.getVersion ? this.getVersion() : undefined;

		try {
			await createSyncedBlock({
				blockAri,
				blockInstanceId: data.blockInstanceId,
				sourceAri: this.parentAri,
				product: this.product,
				content: JSON.stringify(data.content),
				stepVersion,
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
	async deleteData(resourceId: string): Promise<DeleteSyncBlockResult> {
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
			await deleteSyncedBlock({ blockAri });
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
}

interface BlockServiceAPIProvidersProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	getVersion?: () => number | undefined; // get the version of the block. E.G the version of the confluence page, or the version of the Jira work item
	parentAri?: string; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
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
			parentAri: fg('platform_synced_block_dogfooding') ? parentAri : undefined,
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
		return createBlockServiceAPIProviders({ cloudId, parentAri, parentId, product, getVersion });
	}, [cloudId, parentAri, parentId, product, getVersion]);
};

interface BlockServiceFetchOnlyAPIProviderProps {
	cloudId: string; // the cloudId of the block. E.G the cloudId of the confluence page, or the cloudId of the Jira instance
	parentAri?: string; // the ARI of the parent of the block. E.G the ARI of the confluence page, or the ARI of the Jira work item
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
