/** @jsx jsx */
import { useContext } from 'react';

import { ClassNames, css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import FocusRing from '@atlaskit/focus-ring';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Inline, { InlineProps } from '@atlaskit/primitives/inline';
import { N20, N200, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { MenuItemPrimitiveProps, RenderFunction } from '../../types';

import {
  SELECTION_STYLE_CONTEXT_DO_NOT_USE,
  SpacingContext,
  SpacingMode,
} from './menu-context';

const defaultRender: RenderFunction = (Component, props) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <Component {...props} />
);

const beforeAfterElementStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const contentStyles = css({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  lineHeight: token('font.lineHeight.100', '16px'),
  outline: 'none',
  textAlign: 'left',
  // Use "clip" overflow to allow ellipses on x-axis without clipping descenders
  '@supports not (overflow-x: clip)': {
    overflow: 'hidden',
  },
  '@supports (overflow-x: clip)': {
    overflowX: 'clip',
  },
});

const truncateStyles = css({
  display: 'block',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  // Use "clip" overflow to allow ellipses on x-axis without clipping descenders
  '@supports not (overflow-x: clip)': {
    overflow: 'hidden',
  },
  '@supports (overflow-x: clip)': {
    overflowX: 'clip',
  },
});

const wordBreakStyles = css({
  wordBreak: 'break-word',
});

const descriptionStyles = css({
  marginTop: token('space.050', '4px'),
  color: token('color.text.subtlest', N200),
  fontSize: token('font.size.075', '12px'),
});

const disabledDescriptionStyles = css({
  color: token('color.text.disabled', N200),
});

const positionRelativeStyles = css({
  position: 'relative',
});

const primitiveStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: 40,
  margin: token('space.0', '0px'),
  alignItems: 'center',
  border: 0,
  fontSize: token('font.size.100', '14px'),
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

const spacingMapStyles = {
  cozy: css({
    // 8 * 2 (16) + icon (24) === 40
    paddingBlock: token('space.100', '8px'),
    paddingInline: token('space.200', '16px'),
  }),
  compact: css({
    minHeight: 32,
    // 4 * 2 (8) + icon (24) === 32
    paddingBlock: token('space.050', '4px'),
    paddingInline: token('space.150', '12px'),
  }),
} as const;

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

const selectedBorderStyles = css({
  '&::before': {
    width: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    background: token('color.border.selected', 'transparent'),
    content: '""',
  },
});

const selectedNotchStyles = css({
  '&::before': {
    width: 4,
    position: 'absolute',
    top: token('space.150', '12px'),
    bottom: token('space.150', '12px'),
    left: 0,
    background: token('color.border.selected', 'transparent'),
    borderRadius: `0 ${token('border.radius', '4px')} ${token(
      'border.radius',
      '4px',
    )} 0`,
    content: '""',
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

const gapMap: Record<SpacingMode, InlineProps['space']> = {
  compact: 'space.100',
  cozy: 'space.150',
};

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
  propDeprecationWarning(
    process.env._PACKAGE_NAME_,
    'overrides',
    overrides !== undefined,
    '', // TODO: Create DAC post when primitives/xcss are available as alternatives
  );

  const spacing = useContext(SpacingContext);
  const selectionStyle = useContext(SELECTION_STYLE_CONTEXT_DO_NOT_USE);
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
                  getBooleanFF(
                    'platform.design-system-team.menu-selected-state-change_0see9',
                  ) && positionRelativeStyles,
                  primitiveStyles,
                  spacingMapStyles[spacing],
                  !isDisabled && !isSelected && unselectedStyles,
                  !isDisabled &&
                    isSelected && [
                      selectedStyles,
                      getBooleanFF(
                        'platform.design-system-team.menu-selected-state-change_0see9',
                      ) && [
                        selectionStyle === 'border' && selectedBorderStyles,
                        selectionStyle === 'notch' && selectedNotchStyles,
                      ],
                    ],
                  isDisabled ? disabledStyles : interactiveStyles,
                ]),
                className,
              ]),
              children: (
                <Inline
                  as="span"
                  spread="space-between"
                  alignBlock="center"
                  space={gapMap[spacing]}
                  grow="fill"
                >
                  {iconBefore && (
                    <span data-item-elem-before css={beforeAfterElementStyles}>
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
                    <span data-item-elem-after css={beforeAfterElementStyles}>
                      {iconAfter}
                    </span>
                  )}
                </Inline>
              ),
            })}
          </FocusRing>
        );
      }}
    </ClassNames>
  );
};

export default MenuItemPrimitive;
