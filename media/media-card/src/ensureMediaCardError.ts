import { isMediaCardError } from './isMediaCardError';
import type { MediaCardErrorPrimaryReason } from './MediaCardError';
import { MediaCardError } from './MediaCardError';

// In a try/catch statement, the error caught is the type of unknown.
// We can use this helper to ensure that the error handled is the type of MediaCardError if unsure
// If updatePrimaryReason is true, if it's a MediaCardError already, it will update it's primary reason
export const ensureMediaCardError = (
	primaryReason: MediaCardErrorPrimaryReason,
	error: Error,
	updatePrimaryReason?: boolean,
): MediaCardError => {
	if (isMediaCardError(error)) {
		if (updatePrimaryReason && error.primaryReason !== primaryReason) {
			return new MediaCardError(primaryReason, error.secondaryError);
		}
		return error;
	}
	return new MediaCardError(primaryReason, error);
};
