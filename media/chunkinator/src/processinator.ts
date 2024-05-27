import { bufferCount } from 'rxjs/operators/bufferCount';
import { concatMap } from 'rxjs/operators/concatMap';

import { type Processinator, type HashedBlob } from './domain';

const processinator: Processinator = (blobs$, options) => {
  const process = (blobs: HashedBlob[]): Promise<HashedBlob[]> => {
    if (options.processor) {
      return options.processor(blobs).then(() => blobs);
    } else {
      return Promise.resolve(blobs);
    }
  };

  return blobs$.pipe(bufferCount(options.batchSize)).pipe(concatMap(process));
};

export { processinator };
