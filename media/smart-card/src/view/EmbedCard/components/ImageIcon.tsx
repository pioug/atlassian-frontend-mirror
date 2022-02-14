import React, { FC } from 'react';
import ImageLoader from 'react-render-image';
import { Image } from './styled';

export interface ImageIconProps {
  alt?: string;
  size?: number;
  src?: string;
  title?: string;
  default?: React.ReactElement;
}

export const ImageIcon: FC<ImageIconProps> = ({
  alt = '',
  src,
  size = 16,
  title,
  default: defaultIcon,
}) => {
  // TODO: do we need this?
  if (!src) {
    return defaultIcon || null;
  }
  return (
    <ImageLoader
      src={src}
      loading={defaultIcon}
      loaded={
        <Image
          className="smart-link-icon"
          src={src}
          alt={alt}
          size={size}
          title={title}
        />
      }
      errored={defaultIcon}
    />
  );
};
