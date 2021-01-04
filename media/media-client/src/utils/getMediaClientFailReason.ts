import { MediaClientFailReason } from '../models/analytics';

import { isFileFetcherError, isMediaStoreError } from '../models/errors';
import { isRequestError, isRateLimitedError } from './request/errors';

import { isPollingError } from './polling/errors';

export function getMediaClientFailReason(err: Error): MediaClientFailReason {
  if (isFileFetcherError(err) && err.attributes.reason === 'invalidFileId') {
    return 'invalidFileId';
  }

  if (
    isMediaStoreError(err) &&
    err.attributes.reason === 'failedAuthProvider'
  ) {
    return 'failedAuthProvider';
  }

  if (isRequestError(err)) {
    if (isRateLimitedError(err)) {
      return 'serverRateLimitedError';
    }

    switch (err.attributes.reason) {
      case 'clientAbortedRequest':
        return 'clientAbortedRequest';
      case 'clientExhaustedRetries':
        return 'clientExhaustedRetries';
      case 'clientOffline':
        return 'clientOffline';
      case 'clientTimeoutRequest':
        return 'clientTimeoutRequest';
      case 'serverError':
        return 'serverError';
      case 'serverInvalidBody':
        return 'serverInvalidBody';
    }
  }

  if (isPollingError(err)) {
    return 'clientFailedPolling';
  }

  return 'unknown';
}
