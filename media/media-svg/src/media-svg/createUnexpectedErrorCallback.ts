import { MediaSVGError } from './MediaSVGError';
import { type MediaSvgProps } from './types';

export const createUnexpectedErrorCallback =
	(onError: MediaSvgProps['onError']) =>
	(e: Error): void => {
		onError?.(new MediaSVGError('unexpected', e));
	};
