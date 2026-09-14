import { type MediaClientError, type MediaClientErrorReason } from './types';

export function isMediaClientError(error: any): error is MediaClientError<{
	reason: MediaClientErrorReason;
}> {
	return (
		error instanceof Object &&
		'attributes' in error &&
		error.attributes instanceof Object &&
		'reason' in error.attributes &&
		error instanceof Error
	);
}
