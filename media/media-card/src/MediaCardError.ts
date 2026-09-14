import type {
	ImageLoadPrimaryReason,
	LocalPreviewPrimaryReason,
	RemotePreviewPrimaryReason,
	SsrPreviewPrimaryReason,
	SvgPrimaryReason,
} from './errors';

export class MediaCardError extends Error {
	constructor(
		readonly primaryReason: MediaCardErrorPrimaryReason,
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
	| 'preview-fetch'
	| 'download';
