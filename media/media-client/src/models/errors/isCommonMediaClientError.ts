import type { BaseMediaClientError } from './BaseMediaClientError';
import { CommonMediaClientError } from './CommonMediaClientError';
import type {
	MediaClientErrorAttributes,
	MediaClientErrorReason,
	MediaClientErrorMetadata,
} from './types';

export function isCommonMediaClientError(
	error: any,
): error is BaseMediaClientError<
	MediaClientErrorReason,
	MediaClientErrorMetadata | undefined,
	Error | undefined,
	MediaClientErrorAttributes
> {
	if (!error) {
		return false;
	}
	// Check if the error is an instance of Error
	if (error instanceof CommonMediaClientError) {
		return true;
	}

	return (
		typeof error.reason === 'string' &&
		('metadata' in error || error.metadata === undefined) &&
		('innerError' in error || error.innerError === undefined)
	);
}
