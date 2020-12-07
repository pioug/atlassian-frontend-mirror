import { isRequestError } from '@atlaskit/media-client';

export function isRateLimitedError(error: Error | undefined) {
  return (
    !!error && isRequestError(error) && error.attributes.statusCode === 429
  );
}
