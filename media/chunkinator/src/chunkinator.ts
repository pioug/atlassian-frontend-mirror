import { tap } from 'rxjs/operators/tap';
import { concatMap } from 'rxjs/operators/concatMap';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import {
  Chunkinator,
  ProbedBlob,
  ChunkinatorFile,
  Options,
  Callbacks,
} from './domain';
import { slicenator } from './slicenator';
import { hashinator } from './hashinator';
import { probinator } from './probinator';
import { uploadinator } from './uploadinator';
import { processinator } from './processinator';
import { fetchBlob } from './utils';

export const getObservableFromFile = (
  file: ChunkinatorFile,
  options: Options,
  callbacks: Callbacks,
): Observable<ProbedBlob[]> =>
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
      const probinatedBlobs = probinator(hashinatedBlobs, {
        batchSize: options.probingBatchSize,
        prober: options.probingFunction,
      });

      let uploadedChunks = 0;

      let uploadedBlobs = uploadinator(probinatedBlobs, {
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
      });
    }),
  );

export const chunkinator: Chunkinator = (file, options, callbacks) => {
  return getObservableFromFile(file, options, callbacks);
};
