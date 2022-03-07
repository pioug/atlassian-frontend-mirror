import { ThemeProp } from '@atlaskit/theme/components';

export type ThemeProps = {
  value: string | number;
};

/**
 * @deprecated This allows for users to customize the theme. This is being deprecated, please consider
 * migrating to one of progress bar's variants.
 */
export type ThemeTokens = {
  container: any;
  bar: any;
  determinateBar: any;
  increasingBar: any;
  decreasingBar: any;
};

export interface CustomProgressBarProps {
  /**
   * Current progress, a number between 0 and 1.
   */
  value: number;
  /**
   * When true the component is in indeterminate state.
   */
  isIndeterminate: boolean;
  /**
   * The aria-label attribute associated with the progress bar.
   */
  ariaLabel?: string;
}

export interface DefaultProgressBarProps extends CustomProgressBarProps {
  /**
   * The theme the component should use. NOTE: This is being deprecated and will be removed after 13 May 2022. Please consider migrating to
   * one of progress bar's variants.
   */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}
