import type { ImageResizeMode } from '@atlaskit/media-client/image-resize-mode-to-file-image-mode';

export function resizeModeToMediaImageProps(resizeMode?: ImageResizeMode): {
	crop: boolean;
	stretch: boolean;
} {
	return {
		crop: resizeMode === 'crop',
		stretch: resizeMode === 'stretchy-fit',
	};
}
