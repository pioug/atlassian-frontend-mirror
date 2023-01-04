/** @jsx jsx */
import { Fragment } from 'react';

import { ClassNames, css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { N20, N200, N30 } from '@atlaskit/theme/colors';
import { fontSize as fontSizeFn } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import type { MenuItemPrimitiveProps, RenderFunction } from '../../types';

const defaultRender: RenderFunction = (Component, props) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <Component {...props} />
);

const fontSize = fontSizeFn();
const itemMinHeight = token('spacing.scale.500', '40px');

const beforeElementStyles = css({
  display: 'flex',
  marginRight: token('spacing.scale.150', '12px'),
  alignItems: 'center',
  flexShrink: 0,
});

const afterElementStyles = css({
  display: 'flex',
  marginLeft: token('spacing.scale.150', '12px'),
  alignItems: 'center',
  flexShrink: 0,
});

const contentStyles = css({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  // Fix - avoid clipped text descenders when using standard 16px line-height
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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
  marginTop: token('spacing.scale.050', '3px'),
  color: token('color.text.subtlest', N200),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  fontSize: headingSizes.h200.size,
});

const disabledDescriptionStyles = css({
  color: token('color.text.disabled', N200),
});

const primitiveStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: itemMinHeight,
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  margin: token('spacing.scale.0', '0px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  padding: `${token('spacing.scale.100', '8px')} ${token(
    'spacing.scale.250',
    '20px',
  )}`,
  alignItems: 'center',
  border: 0,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
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
  backgroundColor: token('color.background.neutral.subtle', 'transparent'),
  color: 'currentColor',
  ':visited': {
    color: 'currentColor',
  },
  ':hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N20),
    color: 'currentColor',
  },
  ':active': {
    backgroundColor: token('color.background.neutral.subtle.pressed', N30),
    boxShadow: 'none',
    color: 'currentColor',
  },
});

const disabledStyles = css({
  cursor: 'not-allowed',
  '&, :hover, :active': {
    backgroundColor: token('color.background.neutral.subtle', 'transparent'),
    color: token('color.text.disabled', N200),
  },
});

const selectedStyles = css({
  backgroundColor: token('color.background.selected', N20),
  // Fallback set as babel plugin inserts one otherwise
  color: token('color.text.selected', 'currentColor'),
  ':visited': {
    color: token('color.text.selected', 'currentColor'),
  },
  ':hover': {
    backgroundColor: token('color.background.selected.hovered', N20),
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
                            isDisabled && disabledDescriptionStyles,
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
