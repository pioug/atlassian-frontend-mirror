import { type SvgPrimaryReason } from '../../errors';

export type MediaSVGErrorReason = 'img-error' | 'binary-fetch' | 'unexpected';

export const getErrorReason = (svgReason: MediaSVGErrorReason): SvgPrimaryReason => {
	switch (svgReason) {
		case 'img-error':
			return 'svg-img-error';
		case 'binary-fetch':
			return 'svg-binary-fetch';
		default:
			return 'svg-unknown-error';
	}
};

export class MediaSVGError extends Error {
	constructor(
		readonly primaryReason: MediaSVGErrorReason,
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

export const createUnexpectedErrorCallback =
	(onError: (error: MediaSVGError) => void) => (e: Error) => {
		onError?.(new MediaSVGError('unexpected', e));
	};
