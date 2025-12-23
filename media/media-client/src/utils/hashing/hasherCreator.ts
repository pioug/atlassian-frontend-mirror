import { type Hasher } from './hasher';
import { ChunkHashAlgorithm } from '@atlaskit/media-core';
let hasher: Hasher | null = null;
let sha256Hasher: Hasher | null = null;

export const destroyHashers = (): void => {
	hasher = null;
	sha256Hasher = null;
};

export const createHasher = async (algorithm: ChunkHashAlgorithm): Promise<Hasher> => {
	try {
		if (algorithm === ChunkHashAlgorithm.Sha256) {
			if (!sha256Hasher) {
				// TODO this needs to support worker sha256 hasher as well
				const { SimpleHasher } = await import('./sha256SimpleHasher');
				sha256Hasher = new SimpleHasher();
			}

			return sha256Hasher;
		}
	} catch (error) {}

	const { SimpleHasher } = await import('./simpleHasher');
	hasher = new SimpleHasher();

	return hasher;
};
