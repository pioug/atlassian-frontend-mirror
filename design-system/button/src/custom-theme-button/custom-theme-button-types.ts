import { CSSObject } from '@emotion/core';

import { ThemeModes } from '@atlaskit/theme/types';

import { BaseProps } from '../types';

export type ThemeTokens = {
  buttonStyles: CSSObject;
  spinnerStyles: CSSObject;
};

export type InteractionState =
  | 'disabled'
  | 'focusSelected'
  | 'selected'
  | 'active'
  | 'hover'
  | 'focus'
  | 'default';

export type CustomThemeButtonOwnProps = {
  /* Conditionally show a spinner over the top of a button */
  isLoading?: boolean;
  /** Slow + discouraged custom theme API
   * See custom theme guide for usage details
   */
  theme?: (
    current: (props: ThemeProps) => ThemeTokens,
    props: ThemeProps,
  ) => ThemeTokens;
};

export type CustomThemeButtonProps = Omit<BaseProps, 'overlay'> &
  CustomThemeButtonOwnProps;

export type ThemeProps = Partial<CustomThemeButtonProps> & {
  // state: string;
  state: InteractionState;
  iconIsOnlyChild?: boolean;
  mode?: ThemeModes;
};
