/** @jsx jsx */
import { Fragment } from 'react';

import { ClassNames, css, jsx } from '@emotion/core';

import FocusRing from '@atlaskit/focus-ring';
import { N20, N200, N30 } from '@atlaskit/theme/colors';
import {
  fontSize as fontSizeFn,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import type { MenuItemPrimitiveProps, RenderFunction } from '../../types';

const defaultRender: RenderFunction = (Component, props) => (
  <Component {...props} />
);

const gridSize = gridSizeFn();
const fontSize = fontSizeFn();
const itemTopBottomPadding = gridSize;
const itemSidePadding = gridSize * 2.5;
const itemElemSpacing = gridSize * 1.5;
const itemDescriptionSpacing = gridSize * 0.375;
const itemMinHeight = gridSize * 5;

const beforeElementStyles = css({
  display: 'flex',
  marginRight: itemElemSpacing,
  alignItems: 'center',
  flexShrink: 0,
});

const afterElementStyles = css({
  display: 'flex',
  marginLeft: itemElemSpacing,
  alignItems: 'center',
  flexShrink: 0,
});

const contentStyles = css({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  // Fix - avoid clipped text descenders when using standard 16px line-height
  lineHeight: 1.22,
  outline: 'none',
  overflow: 'hidden',
  textAlign: 'left',
});

const truncateStyles = css({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const wordBreakStyles = css({
  wordBreak: 'break-word',
});

const descriptionStyles = css({
  marginTop: itemDescriptionSpacing,
  color: token('color.text.lowEmphasis', N200),
  fontSize: headingSizes.h200.size,
});

const primitiveStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: itemMinHeight,
  margin: 0,
  padding: `${itemTopBottomPadding}px ${itemSidePadding}px`,
  alignItems: 'center',
  border: 0,
  fontSize: fontSize,
  outline: 0,
  textDecoration: 'none',
  userSelect: 'none',
  '::-moz-focus-inner': {
    border: 0,
  },
  ':hover': {
    textDecoration: 'none',
  },
});

const interactiveStyles = css({
  cursor: 'pointer',
});

const unselectedStyles = css({
  backgroundColor: 'transparent',
  color: 'currentColor',
  ':visited': {
    color: 'currentColor',
  },
  ':hover': {
    backgroundColor: token('color.background.transparentNeutral.hover', N20),
    color: 'currentColor',
  },
  ':active': {
    backgroundColor: token('color.background.transparentNeutral.pressed', N30),
    boxShadow: 'none',
    color: 'currentColor',
  },
});

const disabledStyles = css({
  cursor: 'not-allowed',
  '&, :hover, :active': {
    backgroundColor: 'transparent',
    color: token('color.text.disabled', N200),
  },
});

const selectedStyles = css({
  backgroundColor: token('color.background.selected.resting', N20),
  // Fallback set as babel plugin inserts one otherwise
  color: token('color.text.selected', 'currentColor'),
  ':visited': {
    color: token('color.text.selected', 'currentColor'),
  },
  ':hover': {
    backgroundColor: token('color.background.selected.hover', N20),
    color: token('color.text.selected', 'currentColor'),
  },
  ':active': {
    backgroundColor: token('color.background.selected.pressed', N30),
    color: token('color.text.selected', 'currentColor'),
  },
});

/**
 * __Menu item primitive__
 *
 * Menu item primitive contains all the styles for menu items,
 * including support for selected, disabled, and interaction states.
 *
 * Using children as function prop you wire up this to your own host element.
 *
 * ```jsx
 * <MenuItemPrimitive>
 *   {({ children, ...props }) => <button {...props}>{children}</button>}
 * </MenuItemPrimitive>
 * ```
 */
const MenuItemPrimitive = ({
  children,
  title,
  description,
  iconAfter,
  iconBefore,
  overrides,
  className,
  shouldTitleWrap = false,
  shouldDescriptionWrap = false,
  isDisabled = false,
  isSelected = false,
}: MenuItemPrimitiveProps) => {
  const renderTitle =
    (overrides && overrides.Title && overrides.Title.render) || defaultRender;

  return (
    <ClassNames>
      {({ css: cn, cx }) => {
        return (
          <FocusRing isInset>
            {children({
              className: cx([
                cn([
                  primitiveStyles,
                  !isDisabled && !isSelected && unselectedStyles,
                  !isDisabled && isSelected && selectedStyles,
                  isDisabled ? disabledStyles : interactiveStyles,
                ]),
                className,
              ]),
              children: (
                <Fragment>
                  {iconBefore && (
                    <span data-item-elem-before css={beforeElementStyles}>
                      {iconBefore}
                    </span>
                  )}
                  {title && (
                    <span css={contentStyles}>
                      {renderTitle('span', {
                        children: title,
                        className: cn(
                          shouldTitleWrap ? wordBreakStyles : truncateStyles,
                        ),
                        'data-item-title': true,
                      })}
                      {description && (
                        <span
                          data-item-description
                          css={[
                            descriptionStyles,
                            shouldDescriptionWrap
                              ? wordBreakStyles
                              : truncateStyles,
                          ]}
                        >
                          {description}
                        </span>
                      )}
                    </span>
                  )}
                  {iconAfter && (
                    <span data-item-elem-after css={afterElementStyles}>
                      {iconAfter}
                    </span>
                  )}
                </Fragment>
              ),
            })}
          </FocusRing>
        );
      }}
    </ClassNames>
  );
};

export default MenuItemPrimitive;
