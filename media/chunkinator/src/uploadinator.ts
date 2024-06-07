import { asyncMap } from './utils';

import { type HashedBlob, type Uploadinator } from './domain';

const uploadinator: Uploadinator = (blobs$, options) => {
	const upload = (blob: HashedBlob) => {
		return options.uploader(blob).then(() => blob);
	};

	return blobs$.pipe(asyncMap(upload, options.concurrency));
};

export { uploadinator };
