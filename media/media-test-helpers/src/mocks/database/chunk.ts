import uuid from 'uuid/v4';

export type ChunkId = string;

export type Chunk = {
  readonly id: ChunkId;
  readonly blob: Blob;
};

export function createChunk(): Chunk {
  return {
    id: uuid(),
    blob: new Blob(),
  };
}
