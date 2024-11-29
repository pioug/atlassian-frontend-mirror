import Dataloader from 'dataloader';

import {
	type MediaStore,
	type ResponseFileItem,
	type EmptyResponseFileItem,
} from '../client/media-store';
import { type NotFoundMediaItemDetails, type MediaItemDetails } from '../models/media';
import { getRandomHex, type MediaTraceContext } from '@atlaskit/media-common';

export const MAX_BATCH_SIZE = 100;

export type DataloaderKey = {
	readonly id: string;
	readonly collectionName?: string;
	readonly includeHashForDuplicateFiles?: boolean;
};

export type DataloaderResult = MediaItemDetails | NotFoundMediaItemDetails;

export type BatchLoadingErrorResult = {
	readonly id: string;
	readonly collection?: string;
	readonly error: Error;
};

const isBatchLoadingErrorResult = (result: any): result is BatchLoadingErrorResult => {
	return result.error instanceof Error;
};

const isResponseFileItem = (fileItem: any): fileItem is ResponseFileItem => {
	return 'details' in fileItem;
};

const makeCacheKey = (id: string, collection?: string) => (collection ? `${id}-${collection}` : id);

type DataloaderMap = { [id: string]: DataloaderResult | Error };

export const getItemsFromKeys = (
	dataloaderKeys: ReadonlyArray<DataloaderKey>,
	fileItems: Array<ResponseFileItem | BatchLoadingErrorResult | EmptyResponseFileItem>,
): Array<DataloaderResult | Error> => {
	const itemsByKey = fileItems.reduce<DataloaderMap>((prev, fileItem) => {
		const { id, collection } = fileItem;
		const key = makeCacheKey(id, collection);

		if (isBatchLoadingErrorResult(fileItem)) {
			prev[key] = fileItem.error;
		} else if (isResponseFileItem(fileItem)) {
			prev[key] = {
				...fileItem.details,
				metadataTraceContext: fileItem.metadataTraceContext,
			};
		} else {
			prev[key] = {
				id,
				collection,
				type: 'not-found',
				metadataTraceContext: fileItem.metadataTraceContext,
			};
		}

		return prev;
	}, {});

	return dataloaderKeys.map((dataloaderKey) => {
		const { id, collectionName } = dataloaderKey;
		const key = makeCacheKey(id, collectionName);

		return itemsByKey[key] || { id, type: 'not-found' };
	});
};

export type FileIdsByCollection = { [collectionName: string]: string[] };

/**
 * Returns a function that, given Array<DataloaderKey>, resolves to an array of same length containing either DataloaderResult or Error.
 * Such contract is formalised by Dataloader 1.0, @see https://github.com/graphql/dataloader
 *
 * If an Error is resolved in the results, it must be at same position then their corresponding key:
 * - Dataloader will re-throw that Error when accessing/loading that particular key
 *
 * @param mediaStore instance of MediaStore
 */
export function createBatchLoadingFunc(mediaStore: MediaStore) {
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
					traceId: getRandomHex(8),
					spanId: getRandomHex(8),
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

export function createFileDataloader(mediaStore: MediaStore) {
	return new Dataloader<DataloaderKey, DataloaderResult>(createBatchLoadingFunc(mediaStore), {
		maxBatchSize: MAX_BATCH_SIZE,
	});
}
