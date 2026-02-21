import { type MediaSvgProps } from './types';

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

export type MediaSVGErrorReason = 'img-error' | 'binary-fetch' | 'blob-to-datauri' | 'unexpected';

export const createUnexpectedErrorCallback =
	(onError: MediaSvgProps['onError']) =>
	(e: Error): void => {
		onError?.(new MediaSVGError('unexpected', e));
	};
