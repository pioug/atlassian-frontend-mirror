import { Hasher } from './hasher';
import { ChunkHashAlgorithm } from '@atlaskit/media-core';
let hasher: Hasher | null = null;
let sha256Hasher: Hasher | null = null;

export const destroyHasher = () => (hasher = null);

export const createHasher = async (
  algorithm: ChunkHashAlgorithm,
): Promise<Hasher> => {
  const numWorkers = 3;
  if (algorithm === ChunkHashAlgorithm.Sha256) {
    if (!sha256Hasher) {
      // TODO this needs to support worker sha256 hasher as well
      const { SimpleHasher } = await import('./sha256SimpleHasher');
      sha256Hasher = new SimpleHasher();
    }
    return sha256Hasher;
  } else if (!hasher) {
    try {
      const { WorkerHasher } = await import('./workerHasher');
      hasher = new WorkerHasher(numWorkers);
    } catch (error) {
      const { SimpleHasher } = await import('./simpleHasher');
      hasher = new SimpleHasher();
    }
  }

  return hasher;
};
