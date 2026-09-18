import type { FailedErrorFailReason } from './analytics';
import type { MediaFilePreviewError } from './MediaFilePreviewError';

export const getRenderErrorFailReason = (error: MediaFilePreviewError): FailedErrorFailReason => {
	return error.primaryReason || 'nativeError';
};
