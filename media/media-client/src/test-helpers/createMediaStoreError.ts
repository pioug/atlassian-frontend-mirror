import { MediaStoreError } from '../client/media-store/MediaStoreError';

export const createMediaStoreError = (): MediaStoreError =>
	new MediaStoreError('missingInitialAuth');
