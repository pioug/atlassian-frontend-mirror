import React from 'react';
import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { InterpolationWithTheme } from '@emotion/core';

export type ButtonAppearances =
  | 'default'
  | 'danger'
  | 'link'
  | 'primary'
  | 'subtle'
  | 'subtle-link'
  | 'warning';

// HtmlAttributes = AllHTMLAttributes - OnlyButtonProps
// We do this so onClick, and other props that overlap with html attributes,
// have the type defined in OnlyButtonProps.
type HtmlAttributes = Pick<
  React.AllHTMLAttributes<HTMLElement>,
  Exclude<
    keyof React.AllHTMLAttributes<HTMLElement>,
    keyof OnlyButtonProps | 'css'
  >
> & { css?: InterpolationWithTheme<any> };

export type OnlyButtonProps = {
  /** The base styling to apply to the button */
  appearance?: ButtonAppearances;
  /** Set the button to autofocus on mount */
  autoFocus?: boolean;
  /** Add a classname to the button */
  className?: string;
  /** A custom component to use instead of the default button */
  component?: React.ElementType<any>;
  /** Internal use only. Please use `ref` to forward refs */
  consumerRef?: React.Ref<HTMLElement>;
  /** Provides a url for buttons being used as a link */
  href?: string;
  /** Places an icon within the button, after the button's text */
  iconAfter?: React.ReactChild;
  /** Places an icon within the button, before the button's text */
  iconBefore?: React.ReactChild;
  /** Set if the button is disabled */
  isDisabled?: boolean;
  /**
   * Set if the button is loading. When isLoading is true, text is hidden, and
   * a spinner is shown in its place. The button maintains the width that it
   * would have if the text were visible.
   */
  isLoading?: boolean;
  /** Change the style to indicate the button is selected */
  isSelected?: boolean;
  /** Handler to be called on blur */
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /** Handler to be called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details */
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onMouseUp?: React.MouseEventHandler<HTMLElement>;
  /** Handler to be called on focus */
  onFocus?: React.FocusEventHandler<HTMLElement>;
  /** Set the amount of padding in the button */
  spacing?: Spacing;
  /** Pass target down to a link within the button component, if a href is provided */
  target?: string;
  /** Option to fit button width to its parent width */
  shouldFitContainer?: boolean;
  /** Pass in a custom theme */
  theme?: (
    current: (props: ThemeProps) => ThemeTokens,
    props: ThemeProps,
  ) => ThemeTokens;

  children?: React.ReactNode;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
};

export interface ButtonProps
  extends HtmlAttributes,
    OnlyButtonProps,
    WithAnalyticsEventsProps {}

export type Spacing = 'compact' | 'default' | 'none';

export type ThemeMode = 'dark' | 'light';

export type ThemeTokens = {
  buttonStyles: Object;
  spinnerStyles: Object;
};

export interface ThemeProps extends Partial<ButtonProps> {
  state: string;
  iconIsOnlyChild?: boolean;
  mode?: ThemeMode;
}

export type ThemeFallbacks = {
  [index: string]: { [index: string]: string };
};

export type AppearanceStates = {
  default: { light: string; dark?: string };
  hover?: { light: string; dark?: string };
  active?: { light: string; dark?: string };
  disabled?: { light: string; dark?: string };
  selected?: { light: string; dark?: string };
  focusSelected?: { light: string; dark?: string };
};
