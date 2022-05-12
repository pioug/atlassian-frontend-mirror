/** @jsx jsx */
import React, { useContext } from 'react';
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
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import LayeredLink from './layered-link';
import { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { TitleBlockProps } from '../blocks/title-block/types';

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

const clickableContainerStyles = css`
  // Position any interactive elements at the top of the z-index stack.
  a,
  button,
  .has-action {
    position: relative;
    z-index: 1;
  }
`;

export const getContainerStyles = (
  size: SmartLinkSize,
  hideBackground: boolean,
  hideElevation: boolean,
  hidePadding: boolean,
  clickableContainer: boolean,
): SerializedStyles => css`
  display: flex;
  gap: ${getGap(size)} 0;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;
  position: relative;
  ${hideBackground ? '' : `background-color: ${tokens.background};`}
  ${hidePadding ? '' : `padding: ${getPadding(size)};`}
  ${hideElevation
    ? ''
    : elevationStyles}
  ${clickableContainer
    ? clickableContainerStyles
    : ''}
  &:hover ~ .actions-button-group {
    opacity: 1;
  }
  a:focus,
  .has-action:focus {
    outline-offset: -2px;
  }
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
      const size = blockSize || containerSize;
      if (isFlexibleUiTitleBlock(child)) {
        return React.cloneElement(child, {
          onClick,
          retry,
          size,
          status,
          theme: containerTheme,
        });
      }
      return React.cloneElement(child, { size, status });
    }
  });

const getTitleBlockProps = (
  children: React.ReactNode,
): TitleBlockProps | undefined => {
  const block = React.Children.toArray(children).find((child) =>
    isFlexibleUiTitleBlock(child),
  );

  if (React.isValidElement(block)) {
    return block.props;
  }
};

const getLayeredLink = (
  testId: string,
  context?: FlexibleUiDataContext,
  children?: React.ReactNode,
): React.ReactNode => {
  const { title, url = '' } = context || {};
  const { anchorTarget: target, text } = getTitleBlockProps(children) || {};
  return (
    <LayeredLink
      target={target}
      testId={testId}
      text={text || title}
      url={url}
    />
  );
};

/**
 * A container is a hidden component that build the Flexible Smart Link.
 * All of the Flexible UI components are wrapped inside the container.
 * It inherits the ui props from Card component and applies the custom styling
 * accordingly.
 * @internal
 * @see Block
 */
const Container: React.FC<ContainerProps> = ({
  children,
  clickableContainer = false,
  hideBackground = false,
  hideElevation = false,
  hidePadding = false,
  onClick,
  retry,
  size = SmartLinkSize.Medium,
  status,
  testId = 'smart-links-container',
  theme = SmartLinkTheme.Link,
}) => {
  const context = useContext(FlexibleUiContext);

  return (
    <div
      css={getContainerStyles(
        size,
        hideBackground,
        hideElevation,
        hidePadding,
        clickableContainer,
      )}
      data-smart-link-container
      data-testid={testId}
    >
      {clickableContainer ? getLayeredLink(testId, context, children) : null}
      {renderChildren(children, size, theme, status, retry, onClick)}
    </div>
  );
};

export default Container;
