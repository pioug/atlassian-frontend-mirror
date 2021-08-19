// import setimmediate to temporary fix dataloader 2.0.0 bug
// @see https://github.com/graphql/dataloader/issues/249
import 'setimmediate';
import Dataloader from 'dataloader';

import { MediaStore, ResponseFileItem } from '../client/media-store';
import { MediaCollectionItemFullDetails } from '../models/media';

export const MAX_BATCH_SIZE = 100;

export type DataloaderKey = {
  readonly id: string;
  readonly collectionName?: string;
};

export type DataloaderResult = MediaCollectionItemFullDetails | null;

export type BatchLoadingErrorResult = {
  readonly id: string;
  readonly collection?: string;
  readonly error: Error;
};

const isBatchLoadingErrorResult = (
  result: any,
): result is BatchLoadingErrorResult => {
  return result.error instanceof Error;
};

const makeCacheKey = (id: string, collection?: string) =>
  collection ? `${id}-${collection}` : id;

type DataloaderMap = { [id: string]: DataloaderResult | Error };

export const getItemsFromKeys = (
  dataloaderKeys: ReadonlyArray<DataloaderKey>,
  fileItems: Array<ResponseFileItem | BatchLoadingErrorResult>,
): Array<DataloaderResult | Error> => {
  const itemsByKey = fileItems.reduce<DataloaderMap>((prev, fileItem) => {
    const { id, collection } = fileItem;
    const key = makeCacheKey(id, collection);

    prev[key] = isBatchLoadingErrorResult(fileItem)
      ? fileItem.error
      : fileItem.details;

    return prev;
  }, {});

  return dataloaderKeys.map((dataloaderKey) => {
    const { id, collectionName } = dataloaderKey;
    const key = makeCacheKey(id, collectionName);

    return itemsByKey[key] || null;
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
  return async (
    keys: ReadonlyArray<DataloaderKey>,
  ): Promise<Array<DataloaderResult | Error>> => {
    const nonCollectionName = '__media-single-file-collection__';
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
    const items: Array<ResponseFileItem | BatchLoadingErrorResult> = [];

    await Promise.all(
      Object.keys(fileIdsByCollection).map(async (collectionNameKey) => {
        const fileIds = fileIdsByCollection[collectionNameKey];
        const collectionName =
          collectionNameKey === nonCollectionName
            ? undefined
            : collectionNameKey;

        try {
          const response = await mediaStore.getItems(fileIds, collectionName);
          items.push(...response.data.items);
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
  return new Dataloader<DataloaderKey, DataloaderResult>(
    createBatchLoadingFunc(mediaStore),
    {
      maxBatchSize: MAX_BATCH_SIZE,
    },
  );
}
