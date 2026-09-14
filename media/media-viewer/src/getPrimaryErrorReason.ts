import type { PrimaryErrorReason } from './errors';
import type { MediaViewerError } from './MediaViewerError';

// not supplied, so just a primary reason
export function getPrimaryErrorReason(error: MediaViewerError): PrimaryErrorReason {
	return error.primaryReason;
}
