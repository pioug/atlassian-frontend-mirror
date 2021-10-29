import React, { useEffect } from 'react';
import {
  MediaType,
  ImageResizeMode,
  MediaItemType,
} from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import { resizeModeToMediaImageProps } from '../../../utils/resizeModeToMediaImageProps';

export type ImageRendererProps = {
  readonly dataURI: string;
  readonly mediaType: MediaType;
  readonly mediaItemType: MediaItemType;
  readonly previewOrientation?: number;
  readonly alt?: string;
  readonly resizeMode?: ImageResizeMode;
  readonly onDisplayImage?: () => void;
  readonly onImageError?: () => void;
  readonly onImageLoad?: () => void;
};

export const ImageRenderer: React.FC<ImageRendererProps> = ({
  dataURI,
  previewOrientation,
  alt,
  resizeMode,
  onImageLoad,
  onImageError,
  onDisplayImage,
  mediaType,
}) => {
  useEffect(() => {
    // TODO: trigger accordingly with the succeeded event. This could be a breaking change
    if (mediaType === 'image' && onDisplayImage) {
      onDisplayImage();
    }
  }, [mediaType, onDisplayImage]);

  return (
    <MediaImage
      dataURI={dataURI}
      alt={alt}
      previewOrientation={previewOrientation}
      onImageLoad={onImageLoad}
      onImageError={onImageError}
      {...resizeModeToMediaImageProps(resizeMode)}
    />
  );
};
