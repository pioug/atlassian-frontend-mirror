import { isMediaClientError } from './isMediaClientError';
import { type MediaClientErrorReason } from './types';

export function getMediaClientErrorReason(err: Error): MediaClientErrorReason | 'unknown' {
	return isMediaClientError(err) ? err.attributes.reason : 'unknown';
}
