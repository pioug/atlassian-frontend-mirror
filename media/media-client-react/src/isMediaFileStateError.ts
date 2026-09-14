import type { MediaFileStateError } from './MediaFileStateError';

export function isMediaFileStateError(err: Error): err is MediaFileStateError {
	return err instanceof Error && 'id' in err;
}
