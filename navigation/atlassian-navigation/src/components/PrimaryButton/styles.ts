import { CSSObject } from '@emotion/core';

import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { skeletonCSS } from '../../common/styles';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const buttonHeight = gridSize * 4;

export const margin = {
  left: gridSize / 2,
};

export const padding = {
  all: gridSize / 2,
};

export const getPrimaryButtonTheme = ({
  mode: { primaryButton },
}: NavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, spinnerStyles } = current(props);

  return {
    buttonStyles: {
      ...buttonStyles,
      ...primaryButton.default,
      ...(props.isSelected && primaryButton.active),
      fontWeight: 500,
      padding: '0 4px',
      marginLeft: 0,
      marginRight: 0,
      ':hover': primaryButton.hover,
      ':focus': primaryButton.focus,
      // :active doesn't work in FF, becasue we do a
      // e.preventDefault() on mouse down in Button.
      // '&&' is required to add more CSS specificity
      // && it not a valid CSSObject property
      // @ts-ignore
      '&&': {
        ...(props.state === 'active' && primaryButton.active),
      },
    },
    spinnerStyles,
  };
};

export const primaryButtonSkeletonCSS = (theme: NavigationTheme) => ({
  borderRadius: `${gridSize / 2}px`,
  display: 'inline-flex',
  height: `${buttonHeight - padding.all * 2.5}px`,
  width: '68px',
  ...skeletonCSS(theme),
});

export const isHighlightedCSS = (
  { mode: { primaryButton } }: NavigationTheme,
  isHighlighted?: boolean,
): CSSObject => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  position: 'relative',

  ...(isHighlighted && {
    '&& > *': {
      color: primaryButton.selected.color,
    },

    '&:after': {
      position: 'absolute',
      bottom: 0,
      left: gridSize / 2,
      right: gridSize / 2,
      content: '""',
      height: 3,
      backgroundColor: primaryButton.selected.borderColor,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
    },
  }),
});
