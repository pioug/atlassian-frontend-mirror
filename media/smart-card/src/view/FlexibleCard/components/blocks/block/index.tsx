/** @jsx jsx */
import React from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';

import { BlockProps } from '../types';
import { SmartLinkDirection, SmartLinkSize } from '../../../../../constants';
import { getBaseStyles, renderChildren } from '../utils';

const getBlockStyles = (
  direction: SmartLinkDirection,
  size: SmartLinkSize,
): SerializedStyles => css`
  ${getBaseStyles(direction, size)}
  justify-content: flex-start;
`;

const Block: React.FC<BlockProps> = ({
  children,
  direction = SmartLinkDirection.Horizontal,
  size = SmartLinkSize.Medium,
  testId = 'smart-block',
}) => (
  <div
    css={getBlockStyles(direction, size)}
    data-smart-block
    data-testid={testId}
  >
    {renderChildren(children, size)}
  </div>
);

export default Block;
