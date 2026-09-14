import type { MediaCardError } from './MediaCardError';

export const isUploadError = (error?: MediaCardError): boolean | undefined =>
	error && error.primaryReason === 'upload';
