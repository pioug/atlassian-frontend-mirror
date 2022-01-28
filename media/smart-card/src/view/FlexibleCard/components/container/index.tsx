/** @jsx jsx */
import React from 'react';

import { N0, N40A, N50A } from '@atlaskit/theme/colors';
import { css, jsx } from '@emotion/core';

import { SmartLinkSize } from '../../../../constants';
import { ContainerProps } from './types';
import { token } from '@atlaskit/tokens';

const getElevationStyles = () => ({
  border: `1px solid transparent`,
  borderRadius: '1.5px',
  boxShadow: token(
    'elevation.shadow.raised',
    `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`,
  ),
  margin: '2px',
});

const getGapSize = (size?: SmartLinkSize) => {
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

const getPaddingSize = (size?: SmartLinkSize) => {
  switch (size) {
    case SmartLinkSize.XLarge:
      return '1.5rem';
    case SmartLinkSize.Large:
      return '1.25rem';
    case SmartLinkSize.Medium:
      return '1rem';
    case SmartLinkSize.Small:
    default:
      return '.5rem';
  }
};

export const getContainerStyles = (
  size: SmartLinkSize,
  hideBackground: boolean,
  hideElevation: boolean,
  hidePadding: boolean,
) => {
  const elevation = hideElevation ? {} : getElevationStyles();
  return css({
    backgroundColor: hideBackground
      ? undefined
      : token('elevation.surface', N0),
    display: 'flex',
    gap: `${getGapSize(size)} 0`,
    flexDirection: 'column' as const,
    minWidth: 0,
    overflow: 'hidden',
    padding: hidePadding ? undefined : getPaddingSize(size),
    ...elevation,
  });
};

const renderChildren = (
  children: React.ReactNode,
  containerSize: SmartLinkSize,
) =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { size: blockSize } = child.props;
      return React.cloneElement(child, { size: blockSize || containerSize });
    }
    return child;
  });

const Container: React.FC<ContainerProps> = ({
  children,
  hideBackground = false,
  hideElevation = false,
  hidePadding = false,
  size = SmartLinkSize.Medium,
  testId = 'smart-links-container',
}) => (
  <div
    css={getContainerStyles(size, hideBackground, hideElevation, hidePadding)}
    data-smart-link-container
    data-testid={testId}
  >
    {renderChildren(children, size)}
  </div>
);

export default Container;
