import { getRandomTelemetryId, type MediaTraceContext } from '@atlaskit/media-common';

import type { MediaStore } from '../client/media-store/MediaStore';
import type { ResponseFileItem, EmptyResponseFileItem } from '../client/media-store/types';
import type {
	BatchLoadingErrorResult,
	DataloaderKey,
	DataloaderResult,
	FileIdsByCollection,
} from './createFileDataLoader';
import { getItemsFromKeys } from './getItemsFromKeys';

/**
 * Returns a function that, given Array<DataloaderKey>, resolves to an array of same length containing either DataloaderResult or Error.
 * Such contract is formalised by Dataloader 1.0, @see https://github.com/graphql/dataloader
 *
 * If an Error is resolved in the results, it must be at same position then their corresponding key:
 * - Dataloader will re-throw that Error when accessing/loading that particular key
 *
 * @param mediaStore instance of MediaStore
 */
export function createBatchLoadingFunc(mediaStore: MediaStore): any {
	return async (keys: ReadonlyArray<DataloaderKey>): Promise<Array<DataloaderResult | Error>> => {
		const nonCollectionName = '__media-single-file-collection__';

		const includeHashByCollection = keys.reduce<Record<string, boolean>>((acc, key) => {
			const collectionName = key.collectionName || nonCollectionName;

			if (key.includeHashForDuplicateFiles) {
				acc[collectionName] = key.includeHashForDuplicateFiles;
			}

			return acc;
		}, {});

		const fileIdsByCollection = keys.reduce<FileIdsByCollection>((acc, key) => {
			const collectionName = key.collectionName || nonCollectionName;
			const fileIds = acc[collectionName] || [];

			// de-duplicate ids in collection
			if (fileIds.indexOf(key.id) === -1) {
				fileIds.push(key.id);
			}
			acc[collectionName] = fileIds;

			return acc;
		}, {});
		const items: Array<ResponseFileItem | BatchLoadingErrorResult | EmptyResponseFileItem> = [];

		await Promise.all(
			Object.keys(fileIdsByCollection).map(async (collectionNameKey) => {
				const metadataTraceContext: MediaTraceContext = {
					traceId: getRandomTelemetryId(),
					spanId: getRandomTelemetryId(),
				};
				const fileIds = fileIdsByCollection[collectionNameKey];
				const includeHashForDuplicateFiles = includeHashByCollection[collectionNameKey];
				const collectionName =
					collectionNameKey === nonCollectionName ? undefined : collectionNameKey;

				try {
					const response = await mediaStore.getItems(
						fileIds,
						collectionName,
						metadataTraceContext,
						includeHashForDuplicateFiles,
					);

					const itemsWithMetadataTraceContext = response.data.items.map((item) => ({
						...item,
						metadataTraceContext,
					}));
					items.push(...itemsWithMetadataTraceContext);

					// add EmptyResponseFileItem for each file ID not included in /items response
					const itemsIds = itemsWithMetadataTraceContext.map((item) => item.id);
					const fileIdsNotFound = fileIds.filter((id) => !itemsIds.includes(id));
					fileIdsNotFound.forEach((fileId) => {
						items.push({
							id: fileId,
							collection: collectionName,
							type: 'not-found',
							metadataTraceContext,
						});
					});
				} catch (error) {
					fileIds.forEach((fileId) => {
						items.push({
							id: fileId,
							collection: collectionName,
							error: error as Error,
						});
					});
				}
			}),
		);

		return getItemsFromKeys(keys, items);
	};
}
