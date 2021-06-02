import { chunkinator, Chunk, ChunkinatorFile } from '@atlaskit/chunkinator';
import { from } from 'rxjs/observable/from';
import { concatMap } from 'rxjs/operators/concatMap';

import { MediaStore } from './client/media-store';
import { createHasher } from './utils/hashing/hasherCreator';

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

const createProbingFunction = (
  store: MediaStore,
  collection?: string,
) => async (chunks: Chunk[]): Promise<boolean[]> => {
  const response = await store.probeChunks(hashedChunks(chunks), collection);
  const results = response.data.results;

  return (Object as any).values(results).map((result: any) => result.exists);
};

const createUploadingFunction = (store: MediaStore, collection?: string) => {
  return (chunk: Chunk) =>
    store.uploadChunk(chunk.hash, chunk.blob, collection);
};

const createProcessingFunction = (
  store: MediaStore,
  deferredUploadId: Promise<string>,
  collection?: string,
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
    );
    offset += chunks.length;
  };
};

const createFileFromUpload = async (
  file: UploadableFile,
  store: MediaStore,
  uploadableFileUpfrontIds: UploadableFileUpfrontIds,
  uploadId: string,
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
  );
};

export const uploadFile = (
  file: UploadableFile,
  store: MediaStore,
  uploadableFileUpfrontIds: UploadableFileUpfrontIds,
  callbacks?: UploadFileCallbacks,
): UploadFileResult => {
  const { content, collection } = file;
  const { deferredUploadId } = uploadableFileUpfrontIds;

  const chunkinatorObservable = chunkinator(
    content,
    {
      hashingFunction,
      hashingConcurrency: 5,
      probingBatchSize: 100,
      chunkSize: 4 * 1024 * 1024,
      uploadingConcurrency: 3,
      uploadingFunction: createUploadingFunction(store, collection),
      probingFunction: createProbingFunction(store, collection),
      processingBatchSize: 1000,
      processingFunction: createProcessingFunction(
        store,
        deferredUploadId,
        collection,
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
