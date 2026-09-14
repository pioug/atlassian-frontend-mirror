import type {
	ImageLoadPrimaryReason,
	LocalPreviewPrimaryReason,
	RemotePreviewPrimaryReason,
	SsrPreviewPrimaryReason,
} from './errors';

export class MediaFilePreviewError extends Error {
	constructor(
		readonly primaryReason: MediaFilePreviewErrorPrimaryReason,
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
