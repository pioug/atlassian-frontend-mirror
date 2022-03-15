/** @jsx jsx */
import React from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';

import { BlockProps } from '../types';
import { SmartLinkDirection, SmartLinkSize } from '../../../../../constants';
import { getBaseStyles, getGapSize, renderChildren } from '../utils';

const getBlockStyles = (
  direction: SmartLinkDirection,
  size: SmartLinkSize,
): SerializedStyles => css`
  ${getBaseStyles(direction, size)}
  justify-content: flex-start;
  [data-separator] + [data-separator]:before {
    content: '•';
    margin-right: ${getGapSize(size)}rem;
  }
`;

const Block: React.FC<BlockProps> = ({
  children,
  direction = SmartLinkDirection.Horizontal,
  size = SmartLinkSize.Medium,
  testId = 'smart-block',
  extraCss,
}) => (
  <div
    css={[getBlockStyles(direction, size), extraCss]}
    data-smart-block
    data-testid={testId}
  >
    {renderChildren(children, size)}
  </div>
);

export default Block;
