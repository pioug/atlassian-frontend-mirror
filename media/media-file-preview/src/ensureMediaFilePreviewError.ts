import { isMediaFilePreviewError } from './isMediaFilePreviewError';
import type { MediaFilePreviewErrorPrimaryReason } from './MediaFilePreviewError';
import { MediaFilePreviewError } from './MediaFilePreviewError';

// In a try/catch statement, the error caught is the type of unknown.
// We can use this helper to ensure that the error handled is the type of MediaFilePreviewError if unsure
// If updatePrimaryReason is true, if it's a MediaFilePreviewError already, it will update it's primary reason
export const ensureMediaFilePreviewError = (
	primaryReason: MediaFilePreviewErrorPrimaryReason,
	error: Error,
	updatePrimaryReason?: boolean,
): MediaFilePreviewError => {
	if (isMediaFilePreviewError(error)) {
		if (updatePrimaryReason && error.primaryReason !== primaryReason) {
			return new MediaFilePreviewError(primaryReason, error.secondaryError);
		}
		return error;
	}
	return new MediaFilePreviewError(primaryReason, error);
};
