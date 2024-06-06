import { type ImageResizeMode } from '@atlaskit/media-client';
import { type MediaSvgProps } from '@atlaskit/media-svg';

export const calculateSvgDimensions = (
  img: HTMLImageElement,
  resizeMode?: ImageResizeMode,
): MediaSvgProps['dimensions'] => {
  const { naturalWidth, naturalHeight } = img;
  const isLadscape = naturalWidth / naturalHeight > 1;

  return resizeMode === 'crop'
    ? isLadscape
      ? { height: '100%' }
      : { width: '100%' }
    : {};
};
