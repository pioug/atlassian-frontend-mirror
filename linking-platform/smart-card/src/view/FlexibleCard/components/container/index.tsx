/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx, SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import {
  MediaPlacement,
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../../../constants';
import { ChildrenOptions, ContainerProps } from './types';
import {
  isFlexibleUiBlock,
  isFlexibleUiPreviewBlock,
  isFlexibleUiTitleBlock,
} from '../../../../utils/flexible';
import { RetryOptions } from '../../types';
import { tokens } from '../../../../utils/token';
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import LayeredLink from './layered-link';
import { FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { TitleBlockProps } from '../blocks/title-block/types';
import HoverCardControl from './hover-card-control';
import { isFlexUiPreviewPresent } from '../../../../state/flexible-ui-context/utils';
import { N40 } from '@atlaskit/theme/colors';

const elevationStyles: SerializedStyles = css`
  border: 1px solid ${token('color.border', N40)};
  border-radius: ${token('border.radius.200', '8px')};
  margin: ${token('space.025', '2px')};
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

const getContainerPaddingStyles = (
  size: SmartLinkSize,
  hidePadding: boolean,
  childrenOptions: ChildrenOptions,
) => {
  const padding = hidePadding ? '0rem' : getPadding(size);
  const gap = getGap(size);
  const { previewOnLeft, previewOnRight } = childrenOptions;

  return css`
    // Set variables for PreviewBlock to use.
    --container-padding: ${padding};
    --container-gap-left: ${previewOnLeft ? gap : padding};
    --container-gap-right: ${previewOnRight ? gap : padding};
    --preview-block-width: 30%;

    padding: ${padding};
    ${previewOnLeft
      ? `padding-left: calc(var(--preview-block-width) + ${gap});`
      : ''}
    ${previewOnRight
      ? `padding-right: calc(var(--preview-block-width) + ${gap});`
      : ''}
  `;
};

const getChildrenOptions = (
  children: React.ReactNode,
  context?: FlexibleUiDataContext,
): ChildrenOptions => {
  let options: ChildrenOptions = {};
  if (isFlexUiPreviewPresent(context)) {
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (isFlexibleUiPreviewBlock(child)) {
          const { placement } = child.props;
          if (placement === MediaPlacement.Left) {
            options.previewOnLeft = true;
          }
          if (placement === MediaPlacement.Right) {
            options.previewOnRight = true;
          }
        }
      }
    });
  }
  return options;
};

export const getContainerStyles = (
  size: SmartLinkSize,
  hideBackground: boolean,
  hideElevation: boolean,
  hidePadding: boolean,
  clickableContainer: boolean,
  childrenOptions: ChildrenOptions,
): SerializedStyles => {
  const paddingCss = getContainerPaddingStyles(
    size,
    hidePadding,
    childrenOptions,
  );

  return css`
    display: flex;
    gap: ${getGap(size)} 0;
    flex-direction: column;
    min-width: 0;
    overflow-x: hidden;
    position: relative;
    ${hideBackground ? '' : `background-color: ${tokens.background};`}
    ${paddingCss}
    ${hideElevation ? '' : elevationStyles}
    ${clickableContainer ? clickableContainerStyles : ''}
    &:hover ~ .actions-button-group {
      opacity: 1;
    }
    a:focus,
    .has-action:focus {
      outline-offset: -2px;
    }
  `;
};

const renderChildren = (
  children: React.ReactNode,
  containerSize: SmartLinkSize,
  containerTheme: SmartLinkTheme,
  status?: SmartLinkStatus,
  retry?: RetryOptions,
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
): React.ReactNode =>
  React.Children.map(children, (child) => {
    // TODO: EDM-6468: Use useFlexibleUiOptionContext for rendering options inside block/element instead
    if (React.isValidElement(child) && isFlexibleUiBlock(child)) {
      const { size: blockSize } = child.props;
      const size = blockSize || containerSize;
      if (isFlexibleUiTitleBlock(child)) {
        return React.cloneElement(child, {
          // @ts-expect-error
          onClick,
          retry,
          size,
          status,
          theme: containerTheme,
        });
      }
      // @ts-expect-error
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
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
): React.ReactNode => {
  const { title, url = '' } = context || {};
  const { anchorTarget: target, text } = getTitleBlockProps(children) || {};
  return (
    <LayeredLink
      onClick={onClick}
      target={target}
      testId={testId}
      text={text || title}
      url={url}
    />
  );
};

/**
 * A container is a hidden component that build the Flexible Smart Link.
 * All the Flexible UI components are wrapped inside the container.
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
  hideHoverCardPreviewButton = false,
  hidePadding = false,
  onClick,
  retry,
  showAuthTooltip = false,
  showHoverPreview = false,
  showServerActions = false,
  size = SmartLinkSize.Medium,
  status,
  testId = 'smart-links-container',
  theme = SmartLinkTheme.Link,
}) => {
  const context = useContext(FlexibleUiContext);
  const childrenOptions = getChildrenOptions(children, context);
  const canShowHoverPreview = showHoverPreview && status === 'resolved';
  // `retry` object contains action that can be performed on
  // unresolved link (unauthorized, forbidden, not found, etc.)
  const canShowAuthTooltip =
    showAuthTooltip && status === 'unauthorized' && retry !== undefined;

  const container = (
    <div
      css={getContainerStyles(
        size,
        hideBackground,
        hideElevation,
        hidePadding,
        clickableContainer,
        childrenOptions,
      )}
      data-smart-link-container
      data-testid={testId}
    >
      {clickableContainer
        ? getLayeredLink(testId, context, children, onClick)
        : null}
      {renderChildren(children, size, theme, status, retry, onClick)}
    </div>
  );

  if (context?.url && (canShowHoverPreview || canShowAuthTooltip)) {
    return (
      <HoverCardControl
        hideHoverCardPreviewButton={hideHoverCardPreviewButton}
        isHoverPreview={canShowHoverPreview}
        isAuthTooltip={canShowAuthTooltip}
        showServerActions={showServerActions}
        testId={testId}
        url={context.url}
      >
        {container}
      </HoverCardControl>
    );
  }

  return container;
};

export default Container;
