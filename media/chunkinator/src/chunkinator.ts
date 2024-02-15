import { tap } from 'rxjs/operators/tap';
import { concatMap } from 'rxjs/operators/concatMap';
import { bufferCount } from 'rxjs/operators/bufferCount';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import {
  Chunkinator,
  ChunkinatorFile,
  Options,
  Callbacks,
  HashedBlob,
} from './domain';
import { slicenator } from './slicenator';
import { hashinator } from './hashinator';
import { uploadinator } from './uploadinator';
import { processinator } from './processinator';
import { fetchBlob } from './utils';
import { from } from 'rxjs/observable/from';

export const getObservableFromFile = (
  file: ChunkinatorFile,
  options: Options,
  callbacks: Callbacks,
): Observable<HashedBlob[]> =>
  fromPromise(fetchBlob(file)).pipe(
    concatMap((blob) => {
      const { chunkSize } = options;
      const { onProgress } = callbacks;
      const totalChunks = Math.ceil(blob.size / chunkSize);
      const slicenatedBlobs = slicenator(blob, { size: chunkSize });
      const hashinatedBlobs = hashinator(slicenatedBlobs, {
        concurrency: options.hashingConcurrency,
        hasher: options.hashingFunction,
      });

      let uploadedChunks = 0;

      let uploadedBlobs = uploadinator(hashinatedBlobs, {
        concurrency: options.uploadingConcurrency,
        uploader: options.uploadingFunction,
      });

      if (onProgress) {
        uploadedBlobs = uploadedBlobs.pipe(
          tap(() => {
            uploadedChunks += 1;
            onProgress(uploadedChunks / totalChunks);
          }),
        );
      }
      return processinator(uploadedBlobs, {
        batchSize: options.processingBatchSize,
        processor: options.processingFunction,
      }).pipe(
        concatMap((batchedChunks) => {
          return from(batchedChunks);
        }),
        bufferCount(totalChunks),
      );
    }),
  );

export const chunkinator: Chunkinator = (file, options, callbacks) => {
  return getObservableFromFile(file, options, callbacks);
};
