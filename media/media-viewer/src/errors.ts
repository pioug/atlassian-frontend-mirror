import {
	type MediaClientErrorReason,
	type RequestErrorMetadata,
	isCommonMediaClientError,
} from '@atlaskit/media-client';
import { type ZipEntry } from 'unzipit';

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
	| 'docviewer-content-fetch-failed'
	| 'docviewer-fetch-pdf'
	| 'codeviewer-fetch-src'
	| 'codeviewer-load-src'
	| 'codeviewer-file-size-exceeds'
	| 'codeviewer-parse-email'
	| 'svg-img-error'
	| 'svg-binary-fetch'
	| 'svg-unknown-error'
	| 'svg-blob-to-datauri'
	| 'unsupported'
	| 'custom-viewer-error'
	| 'download';

export type ArchiveViewerErrorReason =
	| 'archiveviewer-bundle-loader'
	| 'archiveviewer-read-binary'
	| 'archiveviewer-create-url'
	| 'archiveviewer-imageviewer-onerror'
	| 'archiveviewer-videoviewer-onerror'
	| 'archiveviewer-audioviewer-onerror'
	| 'archiveviewer-docviewer-onerror'
	| 'archiveviewer-codeviewer-onerror'
	| 'archiveviewer-codeviewer-file-size-exceeds'
	| 'archiveviewer-missing-name-src'
	| 'archiveviewer-unsupported'
	| 'archiveviewer-encrypted-entry'
	| 'archiveviewer-customrenderer-onerror';

export type PrimaryErrorReason = MediaViewerErrorReason | ArchiveViewerErrorReason;

export type SecondaryErrorReason =
	| MediaClientErrorReason
	| 'unknown' // this is because when we use getMediaClientErrorReason() we could get back "unknown"
	| 'nativeError' // a javascript error
	| undefined; // not supplied, so just a primary reason

export function getPrimaryErrorReason(error: MediaViewerError): PrimaryErrorReason {
	return error.primaryReason;
}

export function getSecondaryErrorReason(error: MediaViewerError): SecondaryErrorReason {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.reason;
	} else if (secondaryError) {
		return 'nativeError';
	} else {
		return 'unknown';
	}
}

export function getErrorDetail(error?: MediaViewerError): string {
	const { secondaryError } = error || {};
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.innerError?.message || 'unknown';
	} else if (secondaryError) {
		return secondaryError.message;
	}
	return 'unknown';
}

export function getRequestMetadata(error?: MediaViewerError): RequestErrorMetadata | undefined {
	const { secondaryError } = error || {};
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata;
	}
}
