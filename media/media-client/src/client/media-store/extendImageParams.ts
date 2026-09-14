import { FILE_CACHE_MAX_AGE, MAX_RESOLUTION } from '../../constants';
import type { MediaStoreGetFileImageParams } from './types';

export const extendImageParams = (
	params?: MediaStoreGetFileImageParams,
	fetchMaxRes: boolean = false,
): MediaStoreGetFileImageParams => {
	return {
		...params,
		'max-age': params?.['max-age'] ?? FILE_CACHE_MAX_AGE,
		allowAnimated: params?.allowAnimated ?? true,
		mode: params?.mode ?? 'crop',
		...(fetchMaxRes ? { width: MAX_RESOLUTION, height: MAX_RESOLUTION } : {}),
	};
};
