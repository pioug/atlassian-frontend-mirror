import { CardPreview } from '.';

export type MediaCardErrorPrimaryReason =
  | 'upload'
  | 'metadata-fetch'
  | 'error-file-state'
  | RemotePreviewPrimaryReason
  | LocalPreviewPrimaryReason
  | ImageLoadPrimaryReason
  | SsrPreviewPrimaryReason
  // Reasons below are used to wrap unexpected/unknown errors with ensureMediaCardError
  | 'preview-fetch';

export type ImageLoadPrimaryReason =
  | 'cache-remote-uri'
  | 'cache-local-uri'
  | 'local-uri'
  | 'remote-uri'
  | 'external-uri'
  | 'unknown-uri';

export type RemotePreviewPrimaryReason =
  | 'remote-preview-fetch'
  | 'remote-preview-not-ready';

export type LocalPreviewPrimaryReason =
  | 'local-preview-get'
  | 'local-preview-unsupported'
  | 'local-preview-rejected'
  | 'local-preview-image'
  | 'local-preview-video';

export type SsrPreviewPrimaryReason =
  | 'ssr-client-uri'
  | 'ssr-client-load'
  | 'ssr-server-uri'
  | 'ssr-server-load';

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

export class SsrPreviewError extends MediaCardError {
  constructor(
    readonly primaryReason: SsrPreviewPrimaryReason,
    readonly secondaryError?: Error,
  ) {
    super(primaryReason, secondaryError);
  }
}

export const getImageLoadPrimaryReason = (
  source?: CardPreview['source'],
): ImageLoadPrimaryReason => {
  switch (source) {
    case 'cache-remote':
      return 'cache-remote-uri';
    case 'cache-local':
      return 'cache-local-uri';
    case 'external':
      return 'external-uri';
    case 'local':
      return 'local-uri';
    case 'remote':
      return 'remote-uri';
    // This fail reason will come from a bug, most likely.
    default:
      return `unknown-uri`;
  }
};
export class ImageLoadError extends MediaCardError {
  constructor(source?: CardPreview['source']) {
    super(getImageLoadPrimaryReason(source));
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

export function isImageLoadError(err: Error): err is ImageLoadError {
  return err instanceof ImageLoadError;
}

// In a try/catch statement, the error caught is the type of any.
// We can use this helper to ensure that the error handled is the type of MediaCardError if unsure
export const ensureMediaCardError = (
  primaryReason: MediaCardErrorPrimaryReason,
  error: Error,
) =>
  isMediaCardError(error) ? error : new MediaCardError(primaryReason, error);

export const isUploadError = (error?: MediaCardError) =>
  error && error.primaryReason === 'upload';
