/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import ImageLoader from 'react-render-image';

import { ImageIconProps } from './types';

const ImageIcon: React.FC<ImageIconProps> = ({ defaultIcon, testId, url }) => (
  <ImageLoader
    src={url}
    loaded={<img src={url} data-testid={`${testId}-image`} />}
    errored={defaultIcon}
  />
);
export default ImageIcon;
