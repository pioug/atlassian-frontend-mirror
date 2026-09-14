import { MobileUploadError } from './MobileUploadError';

export function isMobileUploadError(err: Error): err is MobileUploadError {
	return err instanceof MobileUploadError;
}
