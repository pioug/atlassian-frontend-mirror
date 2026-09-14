import { type MediaClientErrorReason } from '@atlaskit/media-client';

import { isMediaFileStateError } from './isMediaFileStateError';

export function getFileStateErrorReason(err: Error): MediaClientErrorReason | 'unknown' {
	if (isMediaFileStateError(err) && typeof err.details?.reason !== 'undefined') {
		return err.details.reason;
	}

	return 'unknown';
}
