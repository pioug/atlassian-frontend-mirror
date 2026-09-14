import type { MediaStoreGetFileImageParams } from '../client/media-store/types';

export type ImageResizeMode = 'crop' | 'fit' | 'full-fit' | 'stretchy-fit';

export const imageResizeModeToFileImageMode = (
	resizeMode?: ImageResizeMode,
): MediaStoreGetFileImageParams['mode'] =>
	resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode;
