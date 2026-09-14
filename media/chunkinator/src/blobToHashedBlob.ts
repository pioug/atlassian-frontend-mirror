import { type HashedBlob, type HashingFunction, type SlicedBlob } from './domain';

export const blobToHashedBlob: any =
	(hasher: HashingFunction) =>
	(slicedBlob: SlicedBlob): Promise<HashedBlob> =>
		hasher(slicedBlob.blob).then((hash) => ({
			blob: slicedBlob.blob,
			hash: `${hash}-${slicedBlob.blob.size}`,
			partNumber: slicedBlob.partNumber,
		}));
