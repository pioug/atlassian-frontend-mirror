import { asyncMap } from './utils';

import { HashedBlob, Uploadinator } from './domain';

const uploadinator: Uploadinator = (blobs$, options) => {
  const upload = (blob: HashedBlob) => {
    return options.uploader(blob).then(() => blob);
  };

  return blobs$.pipe(asyncMap(upload, options.concurrency));
};

export { uploadinator };
