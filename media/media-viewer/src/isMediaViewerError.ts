import { MediaViewerError } from './MediaViewerError';

export function isMediaViewerError(err: Error): err is MediaViewerError {
	return err instanceof MediaViewerError;
}
