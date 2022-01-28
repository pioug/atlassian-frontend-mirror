/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import { BlockProps } from '../types';
import { SmartLinkDirection, SmartLinkSize } from '../../../../../constants';

const getDirectionStyles = (direction?: SmartLinkDirection) => {
  switch (direction) {
    case SmartLinkDirection.Vertical:
      return { flexDirection: 'column' as const, alignItems: 'flex-start' };
    case SmartLinkDirection.Horizontal:
    default:
      return { flexDirection: 'row' as const, alignItems: 'center' };
  }
};

const getGapSize = (size: SmartLinkSize) => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return '1.25rem';
    case SmartLinkSize.Large:
      return '1rem';
    case SmartLinkSize.Medium:
      return '.5rem';
    case SmartLinkSize.Small:
    default:
      return '.25rem';
  }
};

export const getBlockStyles = (
  direction: SmartLinkDirection,
  size: SmartLinkSize,
) =>
  css({
    display: 'flex',
    gap: getGapSize(size),
    lineHeight: '1rem',
    minWidth: 0,
    ...getDirectionStyles(direction),
    '& > *': {
      minWidth: 0,
    },
  });

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
    {children}
  </div>
);

export default Block;
