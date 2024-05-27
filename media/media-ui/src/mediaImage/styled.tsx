/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
import React, { type CSSProperties } from 'react';

/*
  TODO: https://product-fabric.atlassian.net/browse/CXP-3132

  We need to revisit omitting percentage values for Design Token since the parent applies transform(-50%, -50%) on it (packages/media/media-ui/src/mediaImage/index.tsx). This styling is complex and may potentially cause a bug if not treaded carefully.
*/

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
