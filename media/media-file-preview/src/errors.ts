import { type MediaClientErrorReason } from '@atlaskit/media-client';
import { MediaFileStateError } from '@atlaskit/media-client-react';

import { type MediaFilePreview } from './types';

/**
 * Primary reason is logged through Data Portal.
 * Make sure all the values are whitelisted in Measure -> Event Regitry -> "mediaCardRender failed" event
 */
export type MediaFilePreviewErrorPrimaryReason =
	| 'upload'
	| 'metadata-fetch'
	| 'error-file-state'
	| 'failed-processing'
	| RemotePreviewPrimaryReason
	| LocalPreviewPrimaryReason
	| ImageLoadPrimaryReason
	| SsrPreviewPrimaryReason
	| 'missing-error-data'
	// Reasons below are used to wrap unexpected/unknown errors with ensureMediaFilePreviewError
	| 'preview-fetch';

export type ImageLoadPrimaryReason =
	| 'cache-remote-uri'
	| 'cache-local-uri'
	| 'local-uri'
	| 'remote-uri'
	| 'external-uri'
	| 'ssr-client-uri'
	| 'ssr-server-uri'
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

export class MediaFilePreviewError extends Error {
	constructor(
		readonly primaryReason: MediaFilePreviewErrorPrimaryReason,
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
export class LocalPreviewError extends MediaFilePreviewError {
	constructor(
		readonly primaryReason: LocalPreviewPrimaryReason,
		readonly secondaryError?: Error,
	) {
		super(primaryReason, secondaryError);
	}
}

export class RemotePreviewError extends MediaFilePreviewError {
	constructor(
		readonly primaryReason: RemotePreviewPrimaryReason,
		readonly secondaryError?: Error,
	) {
		super(primaryReason, secondaryError);
	}
}

export class SsrPreviewError extends MediaFilePreviewError {
	constructor(
		readonly primaryReason: SsrPreviewPrimaryReason,
		readonly secondaryError?: Error,
	) {
		super(primaryReason, secondaryError);
	}
}

const getImageLoadPrimaryReason = (source?: MediaFilePreview['source']): ImageLoadPrimaryReason => {
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
		case 'ssr-client':
			return 'ssr-client-uri';
		case 'ssr-server':
		case 'ssr-data':
			return 'ssr-server-uri';
		// This fail reason will come from a bug, most likely.
		default:
			return `unknown-uri`;
	}
};
export class ImageLoadError extends MediaFilePreviewError {
	constructor(source?: MediaFilePreview['source']) {
		super(getImageLoadPrimaryReason(source));
	}
}

export function isMediaFilePreviewError(err: Error): err is MediaFilePreviewError {
	return err instanceof MediaFilePreviewError;
}

export const isLocalPreviewError = (err: Error): err is LocalPreviewError =>
	err instanceof LocalPreviewError;

export const isRemotePreviewError = (err: Error): err is RemotePreviewError =>
	err instanceof RemotePreviewError;

export const isUnsupportedLocalPreviewError = (err: Error) =>
	isMediaFilePreviewError(err) && err.primaryReason === 'local-preview-unsupported';

// In a try/catch statement, the error caught is the type of unknown.
// We can use this helper to ensure that the error handled is the type of MediaFilePreviewError if unsure
// If updatePrimaryReason is true, if it's a MediaFilePreviewError already, it will update it's primary reason
export const ensureMediaFilePreviewError = (
	primaryReason: MediaFilePreviewErrorPrimaryReason,
	error: Error,
	updatePrimaryReason?: boolean,
) => {
	if (isMediaFilePreviewError(error)) {
		if (updatePrimaryReason && error.primaryReason !== primaryReason) {
			return new MediaFilePreviewError(primaryReason, error.secondaryError);
		}
		return error;
	}
	return new MediaFilePreviewError(primaryReason, error);
};

export function isMediaFileStateError(err: Error): err is MediaFileStateError {
	return err instanceof MediaFileStateError;
}

export function getFileStateErrorReason(
	err: MediaFileStateError,
): MediaClientErrorReason | 'unknown' {
	return err.details?.reason ?? 'unknown';
}
