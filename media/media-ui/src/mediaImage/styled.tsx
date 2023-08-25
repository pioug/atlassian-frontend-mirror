import React, { CSSProperties } from 'react';

const imgStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  objectFit: 'contain',
  imageOrientation: 'none',
};

export const ImageComponent: React.FC<
  React.ClassAttributes<HTMLImageElement> &
    React.ImgHTMLAttributes<HTMLImageElement> & {
      loading?: 'lazy' | 'eager';
      imageRef?:
        | ((instance: HTMLImageElement | null) => void)
        | React.RefObject<HTMLImageElement>
        | null;
    }
> = (props) => {
  const { style, imageRef, ...otherProps } = props;
  return (
    <img {...otherProps} ref={imageRef} style={{ ...imgStyle, ...style }} />
  );
};
