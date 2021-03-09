import {
  MediaClientErrorReason,
  getMediaClientErrorReason,
  isMediaClientError,
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
    reason: ArchiveViewerErrorReason,
    innerError?: Error,
    readonly zipEntry?: ZipEntry,
  ) {
    super(reason, innerError);
  }
}

export function isArchiveViewerError(err: Error): err is ArchiveViewerError {
  return err instanceof ArchiveViewerError;
}

export type MediaViewerErrorReason =
  | 'collection-fetch-metadata'
  | 'header-fetch-metadata'
  | 'itemviewer-file-error-status'
  | 'itemviewer-file-failed-processing-status'
  | 'imageviewer-onerror'
  | 'imageviewer-fetch-url'
  | 'imageviewer-src-onerror'
  | 'audioviewer-onerror'
  | 'audioviewer-fetch-url'
  | 'audioviewer-missing-artefact'
  | 'audioviewer-playback'
  | 'videoviewer-onerror'
  | 'videoviewer-fetch-url'
  | 'videoviewer-missing-artefact'
  | 'videoviewer-playback'
  | 'docviewer-onerror'
  | 'docviewer-fetch-url'
  | 'docviewer-fetch-pdf'
  | 'codeviewer-onerror'
  | 'codeviewer-fetch-src'
  | 'codeviewer-load-src'
  | 'codeviewer-parse-email'
  | 'archiveviewer-onerror'
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

export type AvailableErrorReason =
  | MediaClientErrorReason
  | MediaViewerErrorReason
  | ArchiveViewerErrorReason
  | 'unknown'
  | 'nativeError';

export function getErrorReason(error: Error): AvailableErrorReason {
  if (isMediaViewerError(error)) {
    return error.primaryReason;
  } else if (isMediaClientError(error)) {
    return getMediaClientErrorReason(error);
  }
  return 'nativeError';
}

export function getPrimaryErrorReason(error: Error): AvailableErrorReason {
  if (isMediaViewerError(error)) {
    return error.primaryReason;
  }
  return 'nativeError';
}

export function getSecondaryErrorReason(error: Error): string | undefined {
  if (isMediaViewerError(error) && error.secondaryError) {
    return getErrorReason(error.secondaryError);
  } else if (isMediaClientError(error)) {
    return getMediaClientErrorReason(error);
  }
  return 'nativeError';
}

export function getErrorDetail(error?: Error): string | undefined {
  if (
    error &&
    isMediaViewerError(error) &&
    getSecondaryErrorReason(error) === 'nativeError'
  ) {
    return error.secondaryError?.message;
  }
}
