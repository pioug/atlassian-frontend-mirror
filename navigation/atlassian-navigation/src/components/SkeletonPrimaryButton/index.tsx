/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import { SkeletonPrimaryButtonProps } from './types';

const VAR_PRIMARY_BUTTON_BEFORE_HIGHLIGHTED_BACKGROUND_COLOR =
  '--primary-button-before-highlighted-background-color';
const VAR_PRIMARY_BUTTON_AFTER_DROPDOWN_BORDER_COLOR =
  '--primary-button-after-dropdown-border-color';

const primaryButtonSkeletonStyles = css({
  margin: '0 6px',
  padding: '0 4px',
  position: 'relative',
  appearance: 'none',
  border: 0,
  fontSize: 14,
  fontWeight: 500,
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
    bottom: 0,
    left: 2,
    backgroundColor: `var(${VAR_PRIMARY_BUTTON_BEFORE_HIGHLIGHTED_BACKGROUND_COLOR})`,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    content: '""',
  },
});

const isHighlightedAndDropdownButtonStyles = css({
  '&:before': {
    right: -10,
  },
});

const isHighlightedNotDropdownButtonStyles = css({
  '&:before': {
    right: 2,
  },
});

const isDropdownButtonStyles = css({
  marginRight: 18,

  '&:after': {
    display: 'inline-block',
    width: 4,
    height: 4,
    marginLeft: 4,
    position: 'absolute',
    top: 'calc(50% - 4px)',
    left: 'calc(100% - 3px)',
    borderBottom: '2px solid',
    borderColor: `var(${VAR_PRIMARY_BUTTON_AFTER_DROPDOWN_BORDER_COLOR})`,
    borderRadius: 1,
    borderRight: '2px solid',
    content: '""',
    opacity: 0.51,
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
