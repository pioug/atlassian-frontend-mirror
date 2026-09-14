import { isMediaCardError } from './isMediaCardError';

export const isUnsupportedLocalPreviewError = (err: Error): boolean =>
	isMediaCardError(err) && err.primaryReason === 'local-preview-unsupported';
