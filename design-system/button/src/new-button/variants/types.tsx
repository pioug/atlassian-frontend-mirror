import type React from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type IconProps } from '@atlaskit/icon/types';

export type ButtonAppearance =
  | 'default'
  | 'danger'
  | 'primary'
  | 'subtle'
  | 'warning'
  | 'discovery';

export type LinkButtonAppearance =
  | 'default'
  | 'danger'
  | 'link'
  | 'primary'
  | 'subtle'
  | 'subtle-link'
  | 'warning'
  | 'discovery';

export type IconButtonAppearance =
  | 'default'
  | 'primary'
  | 'discovery'
  | 'subtle';

export type Appearance =
  | ButtonAppearance
  | LinkButtonAppearance
  | IconButtonAppearance;

export type ButtonSpacing = 'compact' | 'default' | 'none';

export type IconButtonSpacing = 'compact' | 'default';

export type Spacing = ButtonSpacing | IconButtonSpacing;

export type IconProp = React.ComponentType<IconProps>;

export type IconSize = 'small' | 'large' | 'xlarge';

// Similar to {...A, ...B}
// 1. Remove all overlapping types from First
// 2. Add properties from Second
// https://codesandbox.io/s/native-button-with-nested-elementsclick-bnpjg?file=/src/index.ts
/* This type is intentionally not exported to prevent it from being explicitly referenced in the resulting button types. The alternative would
 * be making this public API and re-exporting from the root */
type Combine<First, Second> = Omit<First, keyof Second> & Second;

export type CommonButtonProps<TagName extends HTMLElement> = {
  /**
   * Set the button to autofocus on mount.
   */
  autoFocus?: boolean;
  /**
   * Used to 'overlay' something over a button. This is commonly used to display a loading spinner.
   */
  overlay?: React.ReactNode;
  /**
   * Disable the button to prevent user interaction.
   */
  isDisabled?: boolean;
  /**
   * Indicates that the button is selected.
   */
  isSelected?: boolean;
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * Handler called on blur.
   */
  onBlur?: React.FocusEventHandler<TagName>;
  /**
   * Handler called on focus.
   */
  onFocus?: React.FocusEventHandler<TagName>;
  /**
   * Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).
   */
  onClick?: (
    e: React.MouseEvent<TagName>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * Additional information to be included in the `context` of Atlaskit analytics events that come from button. See [the pressable or anchor primitive code examples](https://atlassian.design/components/primitives/anchor/examples#atlaskit-analytics) for more information.
   */
  analyticsContext?: Record<string, any>;
  /**
   * An optional name used to identify the button to interaction content listeners. By default, button fires React UFO (Unified Frontend Observability) press interactions for available listeners. This helps Atlassian measure performance and reliability. See [the pressable or anchor primitive code examples](https://atlassian.design/components/primitives/anchor/examples#react-ufo-press-interactions) for more information.
   */
  interactionName?: string;
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
export type AdditionalButtonVariantProps = {
  /**
   * The button style variation.
   */
  appearance?: ButtonAppearance;
  /**
   * Conditionally show a spinner over the top of a button
   */
  isLoading?: boolean;
};

/**
 * Combines common button props with additional HTML attributes
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
      Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
    >
  >;

/**
 * Common additional props for Link `<a>` Button variants, including icon and default buttons
 */
export type AdditionalCommonLinkVariantProps<
  RouterLinkConfig extends Record<string, any> = never,
> = {
  /**
   * Provides a URL for link buttons. When using an AppProvider with a configured router link component, a `RouterLinkConfig` object type can be provided for advanced usage. See the [Link Button routing example](/components/button/button-new/examples#routing) for more details.
   */
  href: string | RouterLinkConfig;
};

/**
 * Additional props for default Link `<a>` Button variants
 */
export type AdditionalDefaultLinkVariantProps = {
  /**
   * The button style variation.
   */
  appearance?: LinkButtonAppearance;
};

/**
 * Common props for Link `<a>` Button variants
 */
export type CommonLinkVariantProps<
  RouterLinkConfig extends Record<string, any> = never,
> = AdditionalCommonLinkVariantProps<RouterLinkConfig> &
  CombinedButtonProps<
    HTMLAnchorElement,
    AdditionalHTMLElementPropsExtender<
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>
    >
  >;
