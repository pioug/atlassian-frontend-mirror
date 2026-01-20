import type { MediaCardError } from '../errors';
import { isCommonMediaClientError } from '@atlaskit/media-client';

export function isNetworkError(error: MediaCardError | undefined): boolean {
	if (!error) {
		return false;
	}

	const { secondaryError } = error;

	// Check if secondaryError is directly a TypeError (fetch API throws TypeError for network errors)
	if (secondaryError instanceof TypeError) {
		return true;
	}

	// Check if secondaryError is a CommonMediaClientError with nested TypeError in innerError
	if (isCommonMediaClientError(secondaryError) && secondaryError.innerError instanceof TypeError) {
		return true;
	}

	return false;
}

