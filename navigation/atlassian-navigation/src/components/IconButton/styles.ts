import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { skeletonCSS } from '../../common/styles';
import { NavigationTheme } from '../../theme';

import { IconButtonSkeletonProps } from './types';

const gridSize = gridSizeFn();

export const margin = {
  left: gridSize / 2,
};

export const padding = {
  all: gridSize / 2,
};

export const getIconButtonTheme = ({
  mode: { iconButton },
}: NavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, spinnerStyles } = current(props);

  return {
    buttonStyles: {
      ...buttonStyles,
      borderRadius: '100%',
      display: 'flex',
      margin: '0 2px',
      padding: 4,
      height: 'auto',
      fontWeight: 500,
      ...iconButton.default,
      ':hover': iconButton.hover,
      ':focus': iconButton.focus,
      // :active doesn't work in FF, becasue we do a
      // e.preventDefault() on mouse down in Button.
      // '&&' is required to add more CSS specificity
      // && it not a valid CSSObject property
      // @ts-ignore
      '&&': {
        ...(props.state === 'active' && iconButton.active),
      },
      ...(props.state === 'selected' && iconButton.active),
      '> span': {
        margin: 0,
      },
    },
    spinnerStyles,
  };
};

const buttonHeight = gridSize * 4;

export const iconButtonSkeletonCSS = (
  theme: NavigationTheme,
  { marginLeft, marginRight, size }: IconButtonSkeletonProps,
) => ({
  borderRadius: '50%',
  marginLeft: typeof marginLeft === 'number' ? marginLeft : margin.left,
  marginRight: typeof marginRight === 'number' ? marginRight : 0,
  width: typeof size === 'number' ? size : buttonHeight,
  height: typeof size === 'number' ? size : buttonHeight,
  ...skeletonCSS(theme),
});
