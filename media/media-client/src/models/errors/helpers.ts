export type { MediaClientError, MediaClientErrorReason } from './types';

import { MediaClientError, MediaClientErrorReason } from './types';

export function isMediaClientError(
  error: any,
): error is MediaClientError<{
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

export function getMediaClientErrorReason(
  err: Error,
): MediaClientErrorReason | 'unknown' {
  return isMediaClientError(err) ? err.attributes.reason : 'unknown';
}
