import {
  MediaClientErrorReason,
  getMediaClientErrorReason,
  isMediaClientError,
  RequestMetadata,
  isRequestError,
} from '@atlaskit/media-client';
import { ZipEntry } from 'unzipit';

export class MediaViewerError extends Error {
  constructor(
    readonly primaryReason: MediaViewerErrorReason | ArchiveViewerErrorReason,
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

export function isMediaViewerError(err: Error): err is MediaViewerError {
  return err instanceof MediaViewerError;
}

export class ArchiveViewerError extends MediaViewerError {
  constructor(
    readonly primaryReason: ArchiveViewerErrorReason,
    readonly secondaryError?: Error,
    readonly zipEntry?: ZipEntry,
  ) {
    super(primaryReason, secondaryError);
  }
}

export function isArchiveViewerError(err: Error): err is ArchiveViewerError {
  return err instanceof ArchiveViewerError;
}

export type MediaViewerErrorReason =
  | 'collection-fetch-metadata'
  | 'header-fetch-metadata'
  | 'itemviewer-onerror'
  | 'itemviewer-fetch-metadata'
  | 'itemviewer-file-error-status'
  | 'itemviewer-file-failed-processing-status'
  | 'imageviewer-external-onerror'
  | 'imageviewer-fetch-url'
  | 'imageviewer-src-onerror'
  | 'audioviewer-fetch-url'
  | 'audioviewer-missing-artefact'
  | 'audioviewer-playback'
  | 'videoviewer-fetch-url'
  | 'videoviewer-missing-artefact'
  | 'videoviewer-playback'
  | 'docviewer-fetch-url'
  | 'docviewer-fetch-pdf'
  | 'codeviewer-fetch-src'
  | 'codeviewer-load-src'
  | 'codeviewer-parse-email'
  | 'unsupported';

export type ArchiveViewerErrorReason =
  | 'archiveviewer-bundle-loader'
  | 'archiveviewer-read-binary'
  | 'archiveviewer-create-url'
  | 'archiveviewer-imageviewer-onerror'
  | 'archiveviewer-videoviewer-onerror'
  | 'archiveviewer-audioviewer-onerror'
  | 'archiveviewer-docviewer-onerror'
  | 'archiveviewer-missing-name-src'
  | 'archiveviewer-unsupported'
  | 'archiveviewer-encrypted-entry';

export type PrimaryErrorReason =
  | MediaViewerErrorReason
  | ArchiveViewerErrorReason;

export type SecondaryErrorReason =
  | MediaClientErrorReason
  | 'unknown' // this is because when we use getMediaClientErrorReason() we could get back "unknown"
  | 'nativeError' // a javascript error
  | undefined; // not supplied, so just a primary reason

export function getPrimaryErrorReason(
  error: MediaViewerError,
): PrimaryErrorReason {
  return error.primaryReason;
}

export function getSecondaryErrorReason(
  error: MediaViewerError,
): SecondaryErrorReason {
  const { secondaryError } = error;
  if (secondaryError) {
    if (isMediaClientError(secondaryError)) {
      return getMediaClientErrorReason(secondaryError);
    }
    return 'nativeError';
  }
}

export function getErrorDetail(error?: Error): string | undefined {
  // when the secondaryReason is "nativeError" we extract the error message for debugging
  if (
    error &&
    isMediaViewerError(error) &&
    getSecondaryErrorReason(error) === 'nativeError'
  ) {
    // pls don't send stack traces, they can get polluted and blow out payload sizes
    return error.secondaryError && error.secondaryError.message;
  }
}

export function getRequestMetadata(error?: Error): RequestMetadata | undefined {
  if (
    error &&
    isMediaViewerError(error) &&
    error.secondaryError &&
    isRequestError(error.secondaryError)
  ) {
    return error.secondaryError.metadata;
  }
}
