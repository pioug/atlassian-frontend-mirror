import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import {
  actionSectionDesktopCSS,
  actionSectionMobileCSS,
  skeletonCSS,
} from '../../common/styles';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

const buttonHeight = gridSize * 4;

export const createButtonCSS = actionSectionDesktopCSS;

export const createButtonSkeletonCSS = (theme: NavigationTheme) => ({
  height: `${buttonHeight}px`,
  width: '68px',
  borderRadius: '3px',
  marginLeft: 12,
  ...createButtonCSS,
  ...skeletonCSS(theme),
});

export const createIconCSS = actionSectionMobileCSS;
export const createIconSkeletonCSS = createIconCSS;

export const getCreateButtonTheme = ({ mode: { create } }: NavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...create.default,
      margin: 0,
      fontWeight: 500,
      ':hover': create.hover,
      ':focus': create.focus,
      // :active doesn't work in FF, becasue we do a
      // e.preventDefault() on mouse down in Button.
      // '&&' is required to add more CSS specificity
      // && it not a valid CSSObject property
      // @ts-ignore
      '&&': {
        ...(props.state === 'active' && create.active),
      },
    },
    spinnerStyles,
  };
};
