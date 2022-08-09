import { ThemeProp } from '@atlaskit/theme/components';

/**
 * @deprecated
 */
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
   * Sets the value of the progress bar, between `0` and `1` inclusive.
   */
  value?: number;
  /**
   * Shows the progress bar in an indeterminate state when `true`.
   */
  isIndeterminate?: boolean;
  /**
   * Label associated with the progress bar,
   * read by screen readers.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  ariaLabel?: string;
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

export interface DefaultProgressBarProps extends CustomProgressBarProps {
  /**
   * @deprecated
   * Theme prop is deprecated and will be removed in the future.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme?: ThemeProp<ThemeTokens, ThemeProps>;

  /**
   * Visual style of the progress bar.
   */
  appearance?: 'default' | 'success' | 'inverse';
}
