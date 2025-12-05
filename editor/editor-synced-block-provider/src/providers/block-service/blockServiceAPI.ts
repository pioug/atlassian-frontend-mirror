import { useMemo } from 'react';

import type { ADFEntity } from '@atlaskit/adf-utils/types';

import {
	blockResourceIdFromSourceAndLocalId,
	getLocalIdFromBlockResourceId,
} from '../../clients/block-service/ari';
import {
	BlockError,
	createSyncedBlock,
	deleteSyncedBlock,
	getReferenceSyncedBlocks,
	getSyncedBlockContent,
	updateSyncedBlock,
	type BlockContentErrorResponse,
	type BlockContentResponse,
} from '../../clients/block-service/blockService';
import { SyncBlockError, type SyncBlockData, type SyncBlockProduct } from '../../common/types';
import { stringifyError } from '../../utils/errorHandling';
import type {
	ADFFetchProvider,
	ADFWriteProvider,
	DeleteSyncBlockResult,
	SyncBlockInstance,
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

// convert BlockContentResponse to SyncBlockData
// throws exception if JSON parsing fails
// what's missing from BlockContentResponse to SyncBlockData:
// - updatedAt
// - sourceURL
// - sourceTitle
// - isSynced
const convertToSyncBlockData = (data: BlockContentResponse): SyncBlockData => {
	return {
		blockInstanceId: data.blockInstanceId,
		content: JSON.parse(data.content),
		createdAt: new Date(data.createdAt).toISOString(),
		createdBy: data.createdBy,
		product: data.product,
		resourceId: data.blockAri,
		sourceAri: data.sourceAri,
	};
};

export const fetchReferences = async (
	documentAri: string,
): Promise<SyncBlockInstance[] | SyncBlockError> => {
	let response: {
		blocks?: BlockContentResponse[] | undefined;
		errors?: Array<BlockContentErrorResponse>;
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
			return {
				data: convertToSyncBlockData(blockContentResponse),
				resourceId: blockContentResponse.blockAri,
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

/**
 * ADFFetchProvider implementation that fetches synced block data from Block Service API
 */
class BlockServiceADFFetchProvider implements ADFFetchProvider {
	// resourceId is the ARI of the block. E.G ari:cloud:blocks:site-123:synced-block/uuid-456
	// in the content API provider, this was the concatenation of the source document's ARI and the local ID. E.G ari:cloud:confluence:site-123:page/pageId/uuid-456
	async fetchData(resourceId: string): Promise<SyncBlockInstance> {
		const localId = getLocalIdFromBlockResourceId(resourceId);

		try {
			const blockContentResponse = await getSyncedBlockContent({ blockAri: resourceId });
			const value = blockContentResponse.content;

			if (!value) {
				return { error: SyncBlockError.NotFound, resourceId };
			}

			// Parse the synced block content from the response's content
			const syncedBlockData = JSON.parse(value) as Array<ADFEntity>;

			return {
				data: {
					content: syncedBlockData,
					resourceId,
					blockInstanceId: localId,
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
}

/**
 * ADFWriteProvider implementation that writes synced block data to Block Service API
 */
class BlockServiceADFWriteProvider implements ADFWriteProvider {
	private sourceAri: string;
	private product: SyncBlockProduct;

	constructor(sourceAri: string, product: SyncBlockProduct) {
		this.sourceAri = sourceAri;
		this.product = product;
	}

	// it will first try to update and if it can't (404) then it will try to create
	async writeData(data: SyncBlockData): Promise<WriteSyncBlockResult> {
		const { resourceId } = data;

		try {
			// Try update existing block's content
			await updateSyncedBlock({ blockAri: resourceId, content: JSON.stringify(data.content) });
			return { resourceId };
		} catch (error) {
			if (error instanceof BlockError) {
				return { error: mapBlockError(error), resourceId };
			}
			return { error: stringifyError(error), resourceId };
		}
	}

	async createData(data: SyncBlockData): Promise<WriteSyncBlockResult> {
		const { resourceId } = data;

		try {
			await createSyncedBlock({
				blockAri: resourceId,
				blockInstanceId: data.blockInstanceId,
				sourceAri: this.sourceAri,
				product: this.product,
				content: JSON.stringify(data.content),
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
		try {
			await deleteSyncedBlock({ blockAri: resourceId });
			return { resourceId, success: true, error: undefined };
		} catch (error) {
			if (error instanceof BlockError) {
				return { resourceId, success: false, error: mapBlockError(error) };
			}
			return { resourceId, success: false, error: stringifyError(error) };
		}
	}

	generateResourceId(sourceAri: string, localId: string): string {
		return blockResourceIdFromSourceAndLocalId(sourceAri, localId);
	}
}

/**
 * Factory function to create both providers with shared configuration
 */
const createBlockServiceAPIProviders = (sourceAri: string, product: SyncBlockProduct) => {
	const fetchProvider = new BlockServiceADFFetchProvider();
	const writeProvider = new BlockServiceADFWriteProvider(sourceAri, product);

	return {
		fetchProvider,
		writeProvider,
	};
};

export const useMemoizedBlockServiceAPIProviders = (
	sourceAri: string,
	product: SyncBlockProduct,
) => {
	return useMemo(() => createBlockServiceAPIProviders(sourceAri, product), [sourceAri, product]);
};
