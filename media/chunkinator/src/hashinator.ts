import { asyncMap } from './utils';

import { type HashedBlob, type Hashinator, type HashingFunction, type SlicedBlob } from './domain';

export const blobToHashedBlob =
  (hasher: HashingFunction) =>
  (slicedBlob: SlicedBlob): Promise<HashedBlob> =>
    hasher(slicedBlob.blob).then((hash) => ({
      blob: slicedBlob.blob,
      hash: `${hash}-${slicedBlob.blob.size}`,
      partNumber: slicedBlob.partNumber,
    }));

export const hashinator: Hashinator = (blobs$, { hasher, concurrency }) =>
  asyncMap(blobToHashedBlob(hasher), concurrency)(blobs$);
