/** @jsx jsx */
import React from 'react';

import { css, jsx, keyframes } from '@emotion/core';
import ImageLoader from 'react-render-image';

import { ImageIconProps } from './types';
import { token } from '@atlaskit/tokens';

const placeholderShimmer = keyframes`
  0% { background-position: -20px 0; }
  100% { background-position: 20px 0; }
`;

const shimmer = css`
  border-radius: 2px;
  user-select: none;
  background: ${token('color.skeleton.subtle', '#f6f7f8')};
  // TODO: https://product-fabric.atlassian.net/browse/DSP-4236
  background-image: linear-gradient(
    to right,
    ${token('color.skeleton.subtle', '#f6f7f8')} 0%,
    ${token('color.skeleton', '#edeef1')} 20%,
    ${token('color.skeleton.subtle', '#f6f7f8')} 40%,
    ${token('color.skeleton.subtle', '#f6f7f8')}100%
  );
  background-repeat: no-repeat;
  background-size: 280% 100%;
  display: inline-block;

  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${placeholderShimmer};
  animation-timing-function: linear;
`;

const ImageIcon: React.FC<ImageIconProps> = ({ defaultIcon, testId, url }) => (
  <ImageLoader
    src={url}
    loading={<span css={shimmer} data-testid={`${testId}-loading`} />}
    loaded={<img src={url} data-testid={`${testId}-image`} />}
    errored={defaultIcon}
  />
);
export default ImageIcon;
