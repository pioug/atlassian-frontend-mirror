export type MediaCardErrorPrimaryReason =
  | 'upload'
  | 'metadata-fetch'
  | 'local-preview-get'
  | 'remote-preview-fetch'
  | 'error-file-state'
  // Reasons below are used to wrap unexpected/unknown errors with ensureMediaCardError
  | 'preview-fetch';

export class MediaCardError extends Error {
  constructor(
    readonly primaryReason: MediaCardErrorPrimaryReason,
    readonly secondaryError?: Error,
  ) {
    super(primaryReason);

    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    Object.setPrototypeOf(this, new.target.prototype);

    // https://v8.dev/docs/stack-trace-api
    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, new.target);
    }
  }
}

export function isMediaCardError(err: Error): err is MediaCardError {
  return err instanceof MediaCardError;
}

export const isLocalPreviewError = (err: Error) =>
  isMediaCardError(err) && err.primaryReason === 'local-preview-get';

// In a try/catch statement, the error caught is the type of any.
// We can use this helper to ensure that the error handled is the type of MediaCardError if unsure
export const ensureMediaCardError = (
  primaryReason: MediaCardErrorPrimaryReason,
  error: Error,
) =>
  isMediaCardError(error) ? error : new MediaCardError(primaryReason, error);
