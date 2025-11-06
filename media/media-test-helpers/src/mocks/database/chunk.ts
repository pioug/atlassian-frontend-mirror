// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

export type ChunkId = string;

export type Chunk = {
	readonly id: ChunkId;
	readonly blob: Blob;
};

export function createChunk(): Chunk {
	return {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		id: uuid(),
		blob: new Blob(),
	};
}
