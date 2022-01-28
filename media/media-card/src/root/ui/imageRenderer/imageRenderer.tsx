import React, { useEffect } from 'react';
import { MediaType, ImageResizeMode } from '@atlaskit/media-client';
import { MediaImage } from '@atlaskit/media-ui';
import { resizeModeToMediaImageProps } from '../../../utils/resizeModeToMediaImageProps';
import styled from 'styled-components';

export type ImageRendererProps = {
  readonly dataURI: string;
  readonly mediaType: MediaType;
  readonly previewOrientation?: number;
  readonly alt?: string;
  readonly resizeMode?: ImageResizeMode;
  readonly onDisplayImage?: () => void;
  readonly onImageError?: () => void;
  readonly onImageLoad?: () => void;
  readonly nativeLazyLoad?: boolean;
  readonly forceSyncDisplay?: boolean;
  readonly isImageVisible?: boolean;
  readonly className?: string;
};

export const ImageRendererBase: React.FC<ImageRendererProps> = ({
  dataURI,
  previewOrientation,
  alt,
  resizeMode,
  onImageLoad,
  onImageError,
  onDisplayImage,
  mediaType,
  nativeLazyLoad,
  forceSyncDisplay,
  className = 'media-card-image-renderer',
}) => {
  useEffect(() => {
    // TODO: trigger accordingly with the succeeded event. This could be a breaking change
    if (mediaType === 'image' && onDisplayImage) {
      onDisplayImage();
    }
  }, [mediaType, onDisplayImage]);

  return (
    <MediaImage
      className={className}
      dataURI={dataURI}
      alt={alt}
      previewOrientation={previewOrientation}
      onImageLoad={onImageLoad}
      onImageError={onImageError}
      loading={nativeLazyLoad ? 'lazy' : undefined}
      forceSyncDisplay={forceSyncDisplay}
      {...resizeModeToMediaImageProps(resizeMode)}
    />
  );
};

export const ImageRenderer = styled(ImageRendererBase)`
  ${({ isImageVisible }: { isImageVisible?: boolean }) => `
    visibility: ${isImageVisible ? 'visible' : 'hidden'};
`}
`;
