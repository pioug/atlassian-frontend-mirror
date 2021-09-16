import React, { CSSProperties } from 'react';

const imgStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  objectFit: 'contain',
  imageOrientation: 'none',
};

/*
This image component falls back to using the native React CSS in JS styling because
in Styled Components 3.6.2 the additinoal loading property is stripped from the final html.
This is not the case when using the JSX <img> tag, it is also fixed in the latest versionm of
styled-components.
*/
export const ImageComponent: React.FC<
  React.ClassAttributes<HTMLImageElement> &
    React.ImgHTMLAttributes<HTMLImageElement> & {
      loading?: 'auto' | 'lazy' | 'eager';
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
