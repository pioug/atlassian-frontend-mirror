import { asyncMap } from 'rxjs-async-map';

import { ProbedBlob, Uploadinator } from './domain';

const uploadinator: Uploadinator = (probedBlobs$, options) => {
  const upload = (probedBlob: ProbedBlob) => {
    if (!probedBlob.exists) {
      return options.uploader(probedBlob).then(() => probedBlob);
    } else {
      return Promise.resolve(probedBlob);
    }
  };

  return probedBlobs$.pipe(asyncMap(upload, options.concurrency));
};

export { uploadinator };
