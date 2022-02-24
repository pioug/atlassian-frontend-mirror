import { ThemeProp } from '@atlaskit/theme/components';

export type ThemeProps = {
  value: string | number;
};

export type ThemeTokens = {
  container: any;
  bar: any;
  determinateBar: any;
  increasingBar: any;
  decreasingBar: any;
};

export interface CustomProgressBarProps {
  /** Current progress, a number between 0 and 1. */
  value: number;
  /** When true the component is in indeterminate state. */
  isIndeterminate: boolean;
  /** The aria-label attribute associated with the progress bar. */
  ariaLabel?: string;
}

export interface DefaultProgressBarProps extends CustomProgressBarProps {
  /**
   * The theme the component should use.
   * NOTE: `theme` is being deprecated, and will be deleted after May 13 2022. If you depend on `theme`, we recommend migrating to one of its variants.
   */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}
