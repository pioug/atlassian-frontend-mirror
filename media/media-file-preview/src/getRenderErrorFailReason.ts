import type { MediaFilePreviewError } from './MediaFilePreviewError';
import type { FailedErrorFailReason } from './analytics';

export const getRenderErrorFailReason = (error: MediaFilePreviewError): FailedErrorFailReason => {
	return error.primaryReason || 'nativeError';
};
