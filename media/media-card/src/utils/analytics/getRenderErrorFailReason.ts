import type { MediaCardError } from '../../MediaCardError';
import type { FailedErrorFailReason } from './analytics';

export const getRenderErrorFailReason = (error: MediaCardError): FailedErrorFailReason => {
	return error.primaryReason || 'nativeError';
};
