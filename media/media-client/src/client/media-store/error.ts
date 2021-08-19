import { BaseMediaClientError } from '../../models/errors';

export type MediaStoreErrorReason =
  | 'failedAuthProvider'
  | 'tokenExpired'
  | 'missingInitialAuth'
  | 'emptyAuth'
  | 'authProviderTimedOut';

export type MediaStoreErrorAttributes = {
  readonly reason: MediaStoreErrorReason;
  readonly innerError?: Error;
};
export class MediaStoreError extends BaseMediaClientError<
  MediaStoreErrorAttributes
> {
  constructor(
    readonly reason: MediaStoreErrorReason,
    readonly innerError?: Error,
  ) {
    super(reason);
  }

  get attributes() {
    const { reason, innerError } = this;
    return {
      reason,
      innerError,
    };
  }
}

export function isMediaStoreError(err: Error): err is MediaStoreError {
  return err instanceof MediaStoreError;
}
