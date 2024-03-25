/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useTheme } from '../../theme';

import { SkeletonPrimaryButtonProps } from './types';

const VAR_PRIMARY_BUTTON_BEFORE_HIGHLIGHTED_BACKGROUND_COLOR =
  '--primary-button-before-highlighted-background-color';
const VAR_PRIMARY_BUTTON_AFTER_DROPDOWN_BORDER_COLOR =
  '--primary-button-after-dropdown-border-color';

const primaryButtonSkeletonStyles = css({
  margin: `0 ${token('space.075', '6px')}`,
  padding: `0 ${token('space.050', '4px')}`,
  position: 'relative',
  appearance: 'none',
  border: 0,
  fontSize: token('font.size.100', '14px'),
  fontWeight: token('font.weight.medium', '500'),
  lineHeight: 1,
  pointerEvents: 'none',
  ':focus, :active, :hover': {
    appearance: 'none',
    border: 0,
    outline: 0,
  },
  '::-moz-focus-inner': {
    border: 0,
  },
});

const isHighlightedStyles = css({
  '&:before': {
    height: 3,
    position: 'absolute',
    backgroundColor: `var(${VAR_PRIMARY_BUTTON_BEFORE_HIGHLIGHTED_BACKGROUND_COLOR})`,
    borderStartEndRadius: token('border.radius.050', '1px'),
    borderStartStartRadius: token('border.radius.050', '1px'),
    content: '""',
    insetBlockEnd: 0,
    insetInlineStart: token('space.025', '2px'),
  },
});

const isHighlightedAndDropdownButtonStyles = css({
  '&:before': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    insetInlineEnd: -10,
  },
});

const isHighlightedNotDropdownButtonStyles = css({
  '&:before': {
    insetInlineEnd: token('space.025', '2px'),
  },
});

const isDropdownButtonStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space
  marginInlineEnd: 18,

  '&:after': {
    display: 'inline-block',
    width: 4,
    height: 4,
    position: 'absolute',
    borderBlockEnd: '2px solid',
    borderColor: `var(${VAR_PRIMARY_BUTTON_AFTER_DROPDOWN_BORDER_COLOR})`,
    borderInlineEnd: '2px solid',
    borderRadius: token('border.radius.050', '1px'),
    content: '""',
    insetBlockStart: 'calc(50% - 4px)',
    insetInlineStart: 'calc(100% - 3px)',
    marginInlineStart: token('space.050', '4px'),
    transform: 'rotate(45deg) scale(1.05)',
    verticalAlign: 'middle',
  },
});

/**
 * __Skeleton primary button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents a primary button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonPrimaryButton = ({
  isDropdownButton = false,
  isHighlighted = false,
  text,
  children,
  testId,
}: SkeletonPrimaryButtonProps) => {
  const theme = useTheme();
  const primaryButton = theme.mode.primaryButton;

  const dynamicStyles = {
    ...primaryButton.default,
    ...(isHighlighted && { color: primaryButton.selected.color }),
    [VAR_PRIMARY_BUTTON_BEFORE_HIGHLIGHTED_BACKGROUND_COLOR]:
      primaryButton.selected.borderColor,
    [VAR_PRIMARY_BUTTON_AFTER_DROPDOWN_BORDER_COLOR]: isHighlighted
      ? primaryButton.default.borderColor
      : primaryButton.default.color,
  };

  return (
    <button
      type="button"
      style={dynamicStyles as React.CSSProperties}
      css={[
        primaryButtonSkeletonStyles,
        isHighlighted && isHighlightedStyles,
        isDropdownButton && isDropdownButtonStyles,
        isHighlighted &&
          (isDropdownButton
            ? isHighlightedAndDropdownButtonStyles
            : isHighlightedNotDropdownButtonStyles),
      ]}
      data-testid={testId}
    >
      {text || children}
    </button>
  );
};
