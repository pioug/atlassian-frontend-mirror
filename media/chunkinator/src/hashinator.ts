import { asyncMap } from './asyncMap';
import { blobToHashedBlob } from './blobToHashedBlob';
import { type HashedBlob, type Hashinator } from './domain';

export const hashinator: Hashinator = (blobs$, { hasher, concurrency }) =>
	asyncMap<unknown, HashedBlob>(blobToHashedBlob(hasher), concurrency)(blobs$);
