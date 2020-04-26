import { bufferCount } from 'rxjs/operators/bufferCount';
import { concatMap } from 'rxjs/operators/concatMap';

import { Processinator, ProbedBlob } from './domain';

const processinator: Processinator = (probedBlobs$, options) => {
  const process = (probedBlobs: ProbedBlob[]): Promise<ProbedBlob[]> => {
    if (options.processor) {
      return options.processor(probedBlobs).then(() => probedBlobs);
    } else {
      return Promise.resolve(probedBlobs);
    }
  };

  return probedBlobs$
    .pipe(bufferCount(options.batchSize))
    .pipe(concatMap(process));
};

export { processinator };
