import { chunkinator, Chunk, ChunkinatorFile } from '@atlaskit/chunkinator';
import { from } from 'rxjs/observable/from';
import { concatMap } from 'rxjs/operators/concatMap';
import { MediaStore } from '../client/media-store';
import { createHasher } from '../utils/hashing/hasherCreator';
import { UploaderError } from './error';
import { CHUNK_SIZE, PROCESSING_BATCH_SIZE } from '../constants';
import { calculateChunkSize, fileSizeError } from './calculateChunkSize';
import { MediaTraceContext } from '@atlaskit/media-common';

// TODO: Allow to pass multiple files
export type UploadableFile = {
  content: ChunkinatorFile;
  name?: string;
  mimeType?: string;
  collection?: string;
};

export type UploadableFileUpfrontIds = {
  id: string;
  deferredUploadId: Promise<string>;
  occurrenceKey?: string;
};

export type UploadFileCallbacks = {
  onProgress: (progress: number) => void;
  onUploadFinish: (error?: any) => void;
};

export interface UploadFileResult {
  cancel: () => void;
}

const hashingFunction = async (blob: Blob): Promise<string> => {
  const hasher = await createHasher();

  return hasher.hash(blob);
};

const createProbingFunction =
  (
    store: MediaStore,
    deferredUploadId: Promise<string>,
    collectionName?: string,
    traceContext?: MediaTraceContext,
  ) =>
  async (chunks: Chunk[]): Promise<boolean[]> => {
    const response = await store.probeChunks(
      hashedChunks(chunks),
      await deferredUploadId,
      collectionName,
      traceContext,
    );
    const results = response.data.results;

    return (Object as any).values(results).map((result: any) => result.exists);
  };

const createUploadingFunction =
  (
    store: MediaStore,
    deferredUploadId: Promise<string>,
    collectionName?: string,
    traceContext?: MediaTraceContext,
  ) =>
  async (chunk: Chunk) => {
    return await store.uploadChunk(
      chunk.hash,
      chunk.blob,
      await deferredUploadId,
      chunk.partNumber,
      collectionName,
      traceContext,
    );
  };

const createProcessingFunction = (
  store: MediaStore,
  deferredUploadId: Promise<string>,
  collection?: string,
  traceContext?: MediaTraceContext,
) => {
  let offset = 0;
  return async (chunks: Chunk[]) => {
    await store.appendChunksToUpload(
      await deferredUploadId,
      {
        chunks: hashedChunks(chunks),
        offset,
      },
      collection,
      traceContext,
    );
    offset += chunks.length;
  };
};

const createFileFromUpload = async (
  file: UploadableFile,
  store: MediaStore,
  uploadableFileUpfrontIds: UploadableFileUpfrontIds,
  uploadId: string,
  traceContext?: MediaTraceContext,
) => {
  const { collection, name, mimeType } = file;
  const { id, occurrenceKey } = uploadableFileUpfrontIds;

  return store.createFileFromUpload(
    { uploadId, name, mimeType },
    {
      occurrenceKey,
      collection,
      replaceFileId: id,
    },
    traceContext,
  );
};

export const uploadFile = (
  file: UploadableFile,
  store: MediaStore,
  uploadableFileUpfrontIds: UploadableFileUpfrontIds,
  callbacks?: UploadFileCallbacks,
  traceContext?: MediaTraceContext,
): UploadFileResult => {
  const { content, collection } = file;
  const { deferredUploadId, id, occurrenceKey } = uploadableFileUpfrontIds;
  let chunkSize = CHUNK_SIZE;
  try {
    if (content instanceof Blob) {
      chunkSize = calculateChunkSize(content.size);
    }
  } catch (err) {
    if (err instanceof Error && err.message === fileSizeError) {
      callbacks?.onUploadFinish(
        new UploaderError(err.message, id, {
          collectionName: collection,
          occurrenceKey: occurrenceKey,
        }),
      );
    }

    return {
      cancel: () => {
        callbacks?.onUploadFinish('canceled');
      },
    };
  }

  const chunkinatorObservable = chunkinator(
    content,
    {
      hashingFunction,
      hashingConcurrency: 5,
      probingBatchSize: 100,
      chunkSize,
      uploadingConcurrency: 3,
      uploadingFunction: createUploadingFunction(
        store,
        deferredUploadId,
        collection,
        traceContext,
      ),
      probingFunction: createProbingFunction(
        store,
        deferredUploadId,
        collection,
        traceContext,
      ),
      processingBatchSize: PROCESSING_BATCH_SIZE,
      processingFunction: createProcessingFunction(
        store,
        deferredUploadId,
        collection,
        traceContext,
      ),
    },
    {
      onProgress(progress: number) {
        if (callbacks) {
          callbacks.onProgress(progress);
        }
      },
    },
  );

  const onUploadFinish = (callbacks && callbacks.onUploadFinish) || (() => {});

  const subscription = from(deferredUploadId)
    .pipe(
      concatMap((uploadId) =>
        chunkinatorObservable.pipe(
          concatMap(() =>
            from(
              createFileFromUpload(
                file,
                store,
                uploadableFileUpfrontIds,
                uploadId,
                traceContext,
              ),
            ),
          ),
        ),
      ),
    )
    .subscribe({
      error: (err) => onUploadFinish(err),
      complete: () => onUploadFinish(),
    });

  return {
    cancel: () => {
      subscription.unsubscribe();
      onUploadFinish('canceled');
    },
  };
};

const hashedChunks = (chunks: Chunk[]) => chunks.map((chunk) => chunk.hash);
