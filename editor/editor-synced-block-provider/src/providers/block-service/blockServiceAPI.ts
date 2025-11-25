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
	getSyncedBlockContent,
	updateSyncedBlock,
} from '../../clients/block-service/blockService';
import { SyncBlockError, type SyncBlockData } from '../../common/types';
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
		case 403:
			return SyncBlockError.Forbidden;
		case 404:
			return SyncBlockError.NotFound;
	}
	return SyncBlockError.Errored;
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
	// it will first try to update and if it can't (404) then it will try to create
	async writeData(data: SyncBlockData): Promise<WriteSyncBlockResult> {
		const { resourceId } = data;

		try {
			// Try update existing block's content
			await updateSyncedBlock({ blockAri: resourceId, content: JSON.stringify(data.content) });
			return { resourceId };
		} catch (error) {
			if (error instanceof BlockError) {
				if (error.status === 404) {
					// Create the block
					await createSyncedBlock({
						blockAri: resourceId,
						blockInstanceId: data.blockInstanceId,
						sourceAri: resourceId,
						product: 'confluence-page',
						content: JSON.stringify(data.content),
					});
				} else {
					return { error: mapBlockError(error), resourceId };
				}
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

	generateResourceId(sourceId: string, localId: string): string {
		return blockResourceIdFromSourceAndLocalId(sourceId, localId);
	}
}

/**
 * Factory function to create both providers with shared configuration
 */
const createBlockServiceAPIProviders = () => {
	const fetchProvider = new BlockServiceADFFetchProvider();
	const writeProvider = new BlockServiceADFWriteProvider();

	return {
		fetchProvider,
		writeProvider,
	};
};

export const useMemoizedBlockServiceAPIProviders = () => {
	return useMemo(createBlockServiceAPIProviders, []);
};
