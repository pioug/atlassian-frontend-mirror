/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import ImageLoader from 'react-render-image';

import { ImageIconProps } from './types';
import LoadingSkeleton from '../loading-skeleton';

const ImageIcon: React.FC<ImageIconProps> = ({
  defaultIcon,
  testId,
  url,
  onError,
  onLoad,
}) => (
  <ImageLoader
    src={url}
    loading={<LoadingSkeleton testId={`${testId}-loading`} />}
    loaded={<img src={url} data-testid={`${testId}-image`} />}
    errored={defaultIcon}
    onError={onError}
    onLoad={onLoad}
  />
);

export default ImageIcon;
