import { MediaStoreError } from './MediaStoreError';

export function isMediaStoreError(err: Error): err is MediaStoreError {
	return err instanceof MediaStoreError;
}
