import React from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type Appearance =
  | 'default'
  | 'danger'
  | 'link'
  | 'primary'
  | 'subtle'
  | 'subtle-link'
  | 'warning';

export type Spacing = 'compact' | 'default' | 'none';

// Similar to {...A, ...B}
// 1. Remove all overlapping types from First
// 2. Add properties from Second
// https://codesandbox.io/s/native-button-with-nested-elementsclick-bnpjg?file=/src/index.ts
/* This type is intentionally not exported to prevent it from being explicitly referenced in the resulting button types. The alternative would
 * be making this public API and re-exporting from the root */
type Combine<First, Second> = Omit<First, keyof Second> & Second;

export type CommonButtonProps<TagName extends HTMLElement> = {
  /**
   * The button style variation
   */
  appearance?: Appearance;
  /**
   * Set the button to autofocus on mount
   */
  autoFocus?: boolean;
  /**
   * Used to 'overlay' something over a button. This is commonly used to display a loading spinner
   */
  overlay?: React.ReactNode;
  /**
   * Disable the button to prevent user interaction
   */
  isDisabled?: boolean;
  /**
   * Indicates that the button is selected
   */
  isSelected?: boolean;
  /**
   * Handler to be called on blur
   */
  onBlur?: React.FocusEventHandler<TagName>;
  /**
   * Handler to be called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details
   */
  onClick?: (
    e: React.MouseEvent<TagName>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * Handler to be called on focus
   */
  onFocus?: React.FocusEventHandler<TagName>;
  /**
   * Controls the amount of padding in the button
   */
  spacing?: Spacing;
  /**
   * Text content to be rendered in the button. Required so that screen readers always have an accessible label provided for the button.
   */
  children: React.ReactNode;
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * An optional name used to identify this component to press listeners. For example, interaction tracing. For more information,
   * see [UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration)
   */
  interactionName?: string;
  /**
   * Additional information to be included in the `context` of analytics events that come from button
   */
  analyticsContext?: Record<string, any>;
};

export type SupportedElements = HTMLButtonElement | HTMLAnchorElement;

type SupportedElementAttributes =
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type AdditionalHTMLElementPropsExtender<
  Props extends SupportedElementAttributes,
> = Combine<
  Omit<
    Props,
    | 'className'
    | 'style'
    // There is no reason the default role should be overridden.
    | 'role'
    // Handled by `isDisabled`
    | 'disabled'
  >,
  {
    // `data-testid` is controlled through the `testId` prop
    // Being super safe and letting consumers know that this data attribute will not be applied
    'data-testid'?: never;
  }
>;

/**
 * Common additional props for button `<button>` variants
 */
export type AdditionalButtonVariantProps = {};

/**
 * Combines common button props with additional HTML attributes.
 */
export type CombinedButtonProps<
  TagName extends HTMLElement,
  HTMLAttributes extends SupportedElementAttributes,
> = Combine<HTMLAttributes, CommonButtonProps<TagName>>;

/**
 * Common props for Button `<button>` variants
 */
export type CommonButtonVariantProps = AdditionalButtonVariantProps &
  CombinedButtonProps<
    HTMLButtonElement,
    AdditionalHTMLElementPropsExtender<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >
  >;

/**
 * Common additional props for Link `<a>` Button variants
 */
export type AdditionalLinkVariantProps<
  RouterLinkConfig extends Record<string, any> = never,
> = {
  /**
   * Provides a URL for link buttons. When using an AppProvider with a configured router link component, a `RouterLinkConfig` object type can be provided for advanced usage. See the [Link Button routing example](https://atlassian.design/components/button/button-new/examples#routing) for more details.
   */
  href: string | RouterLinkConfig;
};

/**
 * Common props for Link `<a>` Button variants
 */
export type CommonLinkVariantProps<
  RouterLinkConfig extends Record<string, any> = never,
> = AdditionalLinkVariantProps<RouterLinkConfig> &
  CombinedButtonProps<
    HTMLAnchorElement,
    AdditionalHTMLElementPropsExtender<
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
    >
  >;
