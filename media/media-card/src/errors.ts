import {
	type MediaClientErrorReason,
	isPollingError as isMediaClientPollingError,
	isRateLimitedError as isMediaClientRateLimitedError,
	type PollingErrorReason,
} from '@atlaskit/media-client';
import { type CardPreview } from './types';

import { MediaFileStateError } from '@atlaskit/media-client-react';
import { isMediaFilePreviewError } from '@atlaskit/media-file-preview';
/**
 * Primary reason is logged through Data Portal.
 * Make sure all the values are whitelisted in Measure -> Event Regitry -> "mediaCardRender failed" event
 */
export type MediaCardErrorPrimaryReason =
	| 'upload'
	| 'metadata-fetch'
	| 'error-file-state'
	| 'failed-processing'
	| RemotePreviewPrimaryReason
	| LocalPreviewPrimaryReason
	| ImageLoadPrimaryReason
	| SsrPreviewPrimaryReason
	| SvgPrimaryReason
	| 'missing-error-data'
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
	| 'remote-preview-not-ready'
	| 'remote-preview-fetch-ssr';

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

export type SvgPrimaryReason = 'svg-img-error' | 'svg-binary-fetch' | 'svg-unknown-error';

export function isMediaFileStateError(err: Error): err is MediaFileStateError {
	return err instanceof MediaFileStateError;
}

export function getFileStateErrorReason(
	err: MediaFileStateError,
): MediaClientErrorReason | 'unknown' {
	return err.details?.reason ?? 'unknown';
}

const POLLING_REASON: PollingErrorReason = 'pollingMaxAttemptsExceeded';

export function isPollingError(err?: Error) {
	if (!err) {
		return false;
	}

	return (
		isMediaClientPollingError(err) || (isMediaFileStateError(err) && err.reason === POLLING_REASON)
	);
}

export function isRateLimitedError(error?: Error) {
	if (!error) {
		return false;
	}

	if (isMediaClientRateLimitedError(error)) {
		return true;
	}

	if (isMediaFileStateError(error)) {
		return error.details?.statusCode === 429 || error.message?.includes('429');
	}

	return false;
}

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

export function isKnownErrorType(err: Error) {
	return isMediaCardError(err) || isMediaFilePreviewError(err);
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

// In a try/catch statement, the error caught is the type of unknown.
// We can use this helper to ensure that the error handled is the type of MediaCardError if unsure
// If updatePrimaryReason is true, if it's a MediaCardError already, it will update it's primary reason
export const ensureMediaCardError = (
	primaryReason: MediaCardErrorPrimaryReason,
	error: Error,
	updatePrimaryReason?: boolean,
) => {
	if (isMediaCardError(error)) {
		if (updatePrimaryReason && error.primaryReason !== primaryReason) {
			return new MediaCardError(primaryReason, error.secondaryError);
		}
		return error;
	}
	return new MediaCardError(primaryReason, error);
};

export const isUploadError = (error?: MediaCardError) => error && error.primaryReason === 'upload';
