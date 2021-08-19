export type MediaCardErrorPrimaryReason =
  | 'upload'
  | 'metadata-fetch'
  | 'error-file-state'
  | RemotePreviewPrimaryReason
  | LocalPreviewPrimaryReason
  // Reasons below are used to wrap unexpected/unknown errors with ensureMediaCardError
  | 'preview-fetch';

export type RemotePreviewPrimaryReason =
  | 'remote-preview-fetch'
  | 'remote-preview-not-ready';

export type LocalPreviewPrimaryReason =
  | 'local-preview-get'
  | 'local-preview-unsupported'
  | 'local-preview-rejected'
  | 'local-preview-image'
  | 'local-preview-video';

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
export class LocalPreviewError extends MediaCardError {
  constructor(
    readonly primaryReason: LocalPreviewPrimaryReason,
    readonly secondaryError?: Error,
  ) {
    super(primaryReason, secondaryError);
  }
}

export class RemotePreviewError extends MediaCardError {
  constructor(
    readonly primaryReason: RemotePreviewPrimaryReason,
    readonly secondaryError?: Error,
  ) {
    super(primaryReason, secondaryError);
  }
}

export function isMediaCardError(err: Error): err is MediaCardError {
  return err instanceof MediaCardError;
}

export const isLocalPreviewError = (err: Error): err is LocalPreviewError =>
  err instanceof LocalPreviewError;

export const isRemotePreviewError = (err: Error): err is LocalPreviewError =>
  err instanceof RemotePreviewError;

export const isUnsupportedLocalPreviewError = (err: Error) =>
  isMediaCardError(err) && err.primaryReason === 'local-preview-unsupported';

// In a try/catch statement, the error caught is the type of any.
// We can use this helper to ensure that the error handled is the type of MediaCardError if unsure
export const ensureMediaCardError = (
  primaryReason: MediaCardErrorPrimaryReason,
  error: Error,
) =>
  isMediaCardError(error) ? error : new MediaCardError(primaryReason, error);
