import { ImageMetadata } from '@atlaskit/media-client';
import { Preview, ImagePreview } from '../types';

export const isImagePreview = (preview: Preview): preview is ImagePreview =>
  !!(preview as ImagePreview).dimensions;

export const getPreviewFromMetadata = (metadata: ImageMetadata): Preview => {
  // It could happen when the file type is not image. This is the way we communicate it to integrators
  if (
    !metadata.original ||
    !metadata.original.width ||
    !metadata.original.height
  ) {
    return {};
  }

  const preview: ImagePreview = {
    dimensions: {
      width: metadata.original.width,
      height: metadata.original.height,
    },
    scaleFactor: 1,
  };

  return preview;
};
