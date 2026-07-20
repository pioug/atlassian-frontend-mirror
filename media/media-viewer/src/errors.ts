import { type SyntheticEvent } from 'react';

import {
	type FileState,
	type MediaClientErrorReason,
	type RequestErrorMetadata,
	isCommonMediaClientError,
	isErrorFileState,
} from '@atlaskit/media-client';
import {
	isImageMimeTypeSupportedByBrowser,
	isVideoMimeTypeSupportedByBrowser,
} from '@atlaskit/media-common/isMimeTypeSupportedByBrowser';
import { type ZipEntry } from 'unzipit';

export class MediaViewerError extends Error {
	constructor(
		readonly primaryReason: MediaViewerErrorReason | ArchiveViewerErrorReason,
		readonly secondaryError?: Error | undefined,
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
		readonly secondaryError?: Error | undefined,
		readonly zipEntry?: ZipEntry | undefined,
	) {
		super(primaryReason, secondaryError);
	}
}

export function isArchiveViewerError(err: Error): err is ArchiveViewerError {
	return err instanceof ArchiveViewerError;
}

type srcType = 'blob' | 'remote' | 'data' | 'unknown';

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
	| 'imageviewer-unsupported-mime'
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
	| 'archiveviewer-not-zip'
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

/**
 * Classifies the failed `<img>` source into a coarse, non-sensitive enum so we can
 * tell which kind of source failed without leaking the (potentially signed) url.
 */
export function classifyFailedSrc(currentSrc?: string): srcType {
	if (!currentSrc) {
		return 'unknown';
	}
	if (currentSrc.startsWith('blob:')) {
		return 'blob';
	}
	if (currentSrc.startsWith('data:')) {
		return 'data';
	}
	if (currentSrc.startsWith('http:') || currentSrc.startsWith('https:')) {
		return 'remote';
	}
	return 'unknown';
}

/**
 * Builds a descriptive `secondaryError` for an `<img>` onerror so the downstream
 * `loadFailed` analytics event reports a meaningful `error`/`errorDetail` instead of
 * the opaque `unknown`/`unknown`. The returned Error's `message` captures decode
 * diagnostics as a comma-separated `key=value` string (undefined fields are omitted):
 * - whether the browser decoded any pixels (`naturalWidth`/`naturalHeight === 0`)
 * - the file MIME type and whether it is natively browser-decodable
 * - which source failed (preview blob vs. original-binary/HD url)
 *
 * @example
 * // message:
 * "mimeType=image/png, isBrowserDecodable=true, naturalWidth=0, naturalHeight=0, failedSrcType=blob"
 */
export function buildImgErrorDiagnostics(
	item: FileState | undefined,
	event?: SyntheticEvent<HTMLImageElement, Event>,
): Error {
	const img = event?.currentTarget;

	const mimeType = item && !isErrorFileState(item) ? item.mimeType : undefined;
	const isBrowserDecodable = !!mimeType && isImageMimeTypeSupportedByBrowser(mimeType);
	const naturalWidth = img?.naturalWidth;
	const naturalHeight = img?.naturalHeight;
	const failedSrcType = classifyFailedSrc(img?.currentSrc);

	const diagnostics: Record<string, string | number | boolean | undefined> = {
		mimeType,
		isBrowserDecodable,
		naturalWidth,
		naturalHeight,
		failedSrcType,
	};

	const detail = Object.entries(diagnostics)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${value}`)
		.join(', ');

	return new Error(detail);
}

/**
 * Human-readable names for the four standard `MediaError.code` values, so the
 * downstream analytics `error`/`errorDetail` report a meaningful cause instead of
 * a bare numeric code.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
 */
const MEDIA_ERROR_CODE_NAMES: Record<number, string> = {
	1: 'MEDIA_ERR_ABORTED',
	2: 'MEDIA_ERR_NETWORK',
	3: 'MEDIA_ERR_DECODE',
	4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
};

/**
 * Builds a descriptive `secondaryError` for a `<video>` onerror so the downstream
 * `loadFailed` analytics event reports a meaningful `error`/`errorDetail` instead of
 * the opaque `unknown`/`unknown`. The returned Error's `message` captures playback
 * diagnostics as a comma-separated `key=value` string (undefined fields are omitted):
 * - the native `MediaError.code` and its readable name (e.g. `MEDIA_ERR_DECODE`)
 * - the native `MediaError.message` (browser-provided detail, often empty)
 * - the file MIME type and whether it is natively browser-playable
 * - the file size in bytes (helps distinguish large-file/streaming failures)
 *
 * @example
 * // message:
 * "mediaErrorCode=3, mediaErrorName=MEDIA_ERR_DECODE, mimeType=video/quicktime, isBrowserPlayable=false, fileSize=734003200"
 */
export function buildVideoErrorDiagnostics(
	item: FileState | undefined,
	mediaError?: MediaError | null,
): Error {
	const mimeType = item && !isErrorFileState(item) ? item.mimeType : undefined;
	const isBrowserPlayable = mimeType ? isVideoMimeTypeSupportedByBrowser(mimeType) : undefined;
	const fileSize = item && !isErrorFileState(item) ? item.size : undefined;
	const mediaErrorCode = mediaError?.code;
	const mediaErrorName =
		mediaErrorCode !== undefined ? MEDIA_ERROR_CODE_NAMES[mediaErrorCode] : undefined;
	// A native MediaError.message can be empty; only include it when present.
	const mediaErrorMessage = mediaError?.message || undefined;

	const diagnostics: Record<string, string | number | boolean | undefined> = {
		mediaErrorCode,
		mediaErrorName,
		mediaErrorMessage,
		mimeType,
		isBrowserPlayable,
		fileSize,
	};

	const detail = Object.entries(diagnostics)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}=${value}`)
		.join(', ');

	return new Error(detail);
}
