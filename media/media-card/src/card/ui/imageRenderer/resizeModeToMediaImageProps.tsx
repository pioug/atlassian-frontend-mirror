import { ImageResizeMode } from '@atlaskit/media-client';

export function resizeModeToMediaImageProps(resizeMode?: ImageResizeMode) {
  return {
    crop: resizeMode === 'crop',
    stretch: resizeMode === 'stretchy-fit',
  };
}
