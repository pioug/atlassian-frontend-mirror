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
}

export interface DefaultProgressBarProps extends CustomProgressBarProps {
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}
