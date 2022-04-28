/** @jsx jsx */
import React from 'react';
import { css, jsx, SerializedStyles } from '@emotion/core';

import {
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../../../constants';
import { ContainerProps } from './types';
import {
  isFlexibleUiBlock,
  isFlexibleUiTitleBlock,
} from '../../../../utils/flexible';
import { RetryOptions } from '../../types';
import { tokens } from '../../../../utils/token';

const elevationStyles: SerializedStyles = css`
  border: 1px solid transparent;
  border-radius: 1.5px;
  box-shadow: ${tokens.elevation};
  margin: 2px;
`;

const getGap = (size?: SmartLinkSize): string => {
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

const getPadding = (size?: SmartLinkSize): string => {
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
): SerializedStyles => css`
  display: flex;
  gap: ${getGap(size)} 0;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  ${hideBackground ? '' : `background-color: ${tokens.background};`}
  ${hidePadding ? '' : `padding: ${getPadding(size)};`}
  ${hideElevation
    ? ''
    : elevationStyles}
`;

const renderChildren = (
  children: React.ReactNode,
  containerSize: SmartLinkSize,
  containerTheme: SmartLinkTheme,
  status?: SmartLinkStatus,
  retry?: RetryOptions,
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child) && isFlexibleUiBlock(child)) {
      const { size: blockSize } = child.props;
      return React.cloneElement(child, {
        onClick,
        retry: isFlexibleUiTitleBlock(child) ? retry : undefined,
        size: blockSize || containerSize,
        status,
        theme: containerTheme,
      });
    }
  });

/**
 * This represents the container in which all Flexible UI Smart Links are rendered.
 * @see Block
 */
const Container: React.FC<ContainerProps> = ({
  children,
  hideBackground = false,
  hideElevation = false,
  hidePadding = false,
  retry,
  size = SmartLinkSize.Medium,
  status,
  testId = 'smart-links-container',
  theme = SmartLinkTheme.Link,
  onClick,
}) => (
  <div
    css={getContainerStyles(size, hideBackground, hideElevation, hidePadding)}
    data-smart-link-container
    data-testid={testId}
  >
    {renderChildren(children, size, theme, status, retry, onClick)}
  </div>
);

export default Container;
