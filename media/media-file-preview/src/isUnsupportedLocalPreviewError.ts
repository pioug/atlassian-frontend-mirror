import { isMediaFilePreviewError } from './isMediaFilePreviewError';

export const isUnsupportedLocalPreviewError = (err: Error): boolean =>
	isMediaFilePreviewError(err) && err.primaryReason === 'local-preview-unsupported';
