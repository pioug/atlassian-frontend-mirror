import { MediaFilePreviewError } from './MediaFilePreviewError';

export function isMediaFilePreviewError(err: Error): err is MediaFilePreviewError {
	return err instanceof MediaFilePreviewError;
}
