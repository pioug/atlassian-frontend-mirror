## API Report File for "@atlaskit/atlassian-navigation"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

````ts
/// <reference types="lodash" />
/// <reference types="react" />

import { AllHTMLAttributes } from 'react';
import { ComponentType } from 'react';
import { CSSObject } from '@emotion/core';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import { CustomThemeButtonProps as CustomThemeButtonProps_2 } from '@atlaskit/button/custom-theme-button';
import { ElementType } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { LogoProps } from '@atlaskit/logo';
import { MouseEvent as MouseEvent_2 } from 'react';
import { Provider } from 'react';
import { default as React_2 } from 'react';
import { ReactChild } from 'react';
import { ReactNode } from 'react';
import { ReactNodeArray } from 'react';
import { RefAttributes } from 'react';
import { ThemeProps } from '@atlaskit/button/custom-theme-button';
import { ThemeProps as ThemeProps_2 } from '@atlaskit/button';
import { ThemeTokens } from '@atlaskit/button/custom-theme-button';
import { ThemeTokens as ThemeTokens_2 } from '@atlaskit/button';

export declare const AppSwitcher: React_2.ForwardRefExoticComponent<
  BaseIconButtonProps & React_2.RefAttributes<any>
>;

export declare type AppSwitcherProps = BaseIconButtonProps;

export declare const AtlassianNavigation: (
  props: AtlassianNavigationProps,
) => JSX.Element;

export declare interface AtlassianNavigationProps {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen
   *  reader. Differentiates from other navigation components on a page.
   */
  label: string;
  /**
   * Slot for the primary actions.
   */
  primaryItems: ReactNodeArray;
  /**
   * Slot for the app switcher.
   */
  renderAppSwitcher?: React_2.ComponentType<{}>;
  /**
   * Slot for the create call to action button.
   */
  renderCreate?: React_2.ComponentType<{}>;
  /**
   * Slot for the help button.
   */
  renderHelp?: React_2.ComponentType<{}>;
  /**
   * Slot for the notification button.
   */
  renderNotifications?: React_2.ComponentType<{}>;
  /**
   * Slot for the product home logo which renders a product's brand.
   */
  renderProductHome: React_2.ComponentType<{}>;
  /**
   * Slot for the profile button.
   */
  renderProfile?: React_2.ComponentType<{}>;
  /**
   * Slot for the search textbox.
   */
  renderSearch?: React_2.ComponentType<{}>;
  /**
   * Slot for the sign in button.
   */
  renderSignIn?: React_2.ComponentType<{}>;
  /**
   * Slot for the settings button.
   */
  renderSettings?: React_2.ComponentType<{}>;
  /**
   * Label used for the overflow menu button tooltip.
   */
  moreLabel?: ReactNode;
  /**
   * __Slow and discouraged custom theme API.__
   */
  theme?: NavigationTheme;
  /**
     A `testId` prop is provided for specified elements,
     which is a unique string that appears as a data attribute `data-testid` in the rendered code,
     serving as a hook for automated tests.

     Will set these elements when defined:

     - Header element - `{testId}-header`
     - Primary actions container - `{testId}-primary-actions`
     - Secondary actions container - `{testId}-secondary-actions`
     - Overflow menu popup - `{testId}-overflow-menu-popup`
     - Overflow menu button - `{testId}-overflow-menu-trigger`
     */
  testId?: string;
}

export declare const atlassianTheme: NavigationTheme;

/**
 * We aren't inheriting the types from button here because it blows up ERT.
 */
declare interface BaseIconButtonProps {
  /**
   * Unique id for the button.
   */
  id?: string;
  /**
   * On click handler.
   * Second argument is the instrumented analytics event.
   * See @atlaskit/analytics-next for analyticsEvent type information
   */
  onClick?: (event: React.MouseEvent<HTMLElement>, analyticsEvent: any) => void;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Text that will be displayed in the tooltip when hovered or focused on the button.
   */
  tooltip: React.ReactNode;
  /**
   * Called when the mouse is initially clicked on the element.
   */
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  /**
   * Called when the mouse enters the element container.
   */
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  /**
   * Called when the mouse leaves the element container.
   */
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  /**
   * Causes the button to be disabled.
   */
  isDisabled?: boolean;
  /**
   * If wanting to link to another page you can define the href.
   */
  href?: string;
  /**
   * If defining `href` you may want to define `target` as well.
   */
  target?: string;
  /**
     Allows for overriding the component used to render the button.

     This is primarily intended for compatibility with custom
     routing libraries when using the `href` prop.

     For further usage information, refer to the [documentation for button](https://atlassian.design/components/button/code).

     @example
     ```tsx
     <Settings
     component={CustomRouterLink}
     href="/path/to/url"
     />
     ```
     */
  component?: CustomThemeButtonProps['component'];
  /**
   * Handler for the mouse up event.
   */
  onMouseUp?: React.MouseEventHandler<HTMLElement>;
  /**
   * Handler called when the button gains focus.
   */
  onFocus?: React.FocusEventHandler<HTMLElement>;
  /**
   * Handler called when the button loses focus.
   */
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /**
   * Makes the element appear selected.
   */
  isSelected?: boolean;
}

declare type ButtonCSSContext = {
  default: ButtonCSSProperties;
  hover: ButtonCSSProperties;
  focus: ButtonFocusCSSProperties;
  active: ButtonCSSProperties;
  selected: ButtonCSSProperties;
};

declare type ButtonCSSProperties = CSSProperties & {
  boxShadow: string;
};

declare type ButtonFocusCSSProperties = {
  boxShadow: string;
  color: string;
  backgroundColor: string;
};

export declare type Colors = {
  backgroundColor: string;
  color: string;
};

export declare const Create: ({
  onClick,
  href,
  text,
  buttonTooltip,
  iconButtonTooltip,
  testId,
}: CreateProps) => JSX.Element;

export declare type CreateCSS = ButtonCSSContext;

export declare interface CreateProps {
  /**
   * Primary text for the call to action.
   */
  text: string;
  /**
   * Text for the button tooltip when seen on large viewports.
   */
  buttonTooltip?: React_2.ReactNode;
  /**
   * Text for the icon button tooltip when seen on small viewports.
   */
  iconButtonTooltip?: React_2.ReactNode;
  /**
   * Click handler.
   * See @atlaskit/analytics-next for analyticsEvent type information
   */
  onClick?: (e: React_2.MouseEvent<HTMLElement>, analyticsEvent: any) => void;
  /**
   * Causes the Create action to be rendered as a link. This is suitable for when the Create action is handled as a full page rather than in a modal-dialog.
   */
  href?: string;
  /**
     * A `testId` prop is provided for specified elements,
     * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
     * serving as a hook for automated tests.

     * Will set these elements when defined:

     * - Create button shown on large screen sizes - `{testId}-button`
     * - Create icon button shown on small screen sizes - `{testId}-icon-button`
     */
  testId?: string;
}

declare type CSSProperties = CSSObject & {
  backgroundColor: string;
  color: string;
};

export declare const CustomProductHome: (
  props: CustomProductHomeProps,
) => JSX.Element;

export declare interface CustomProductHomeProps {
  /**
   * Alt text for the icon that is displayed on small viewports.
   */
  iconAlt: string;
  /**
   * Url for the icon that is displayed on small viewports.
   */
  iconUrl: string;
  /**
   * Alt text for the icon that is displayed on large viewports.
   */
  logoAlt: string;
  /**
   * Url for the icon that is displayed on large viewports.
   */
  logoUrl: string;
  /**
   * Maximum width of the logo, in pixels. Defaults to 260px.
   */
  logoMaxWidth?: number;
  /**
   * Optional onClick handler.
   */
  onClick?: (event: MouseEvent_2<HTMLElement>) => void;
  /**
   * Optional mouseDown handler.
   */
  onMouseDown?: (event: MouseEvent_2<HTMLElement>) => void;
  /**
   * Href to be passed to product home.
   * Will add an interactive look and feel when defined.
   */
  href?: string;
  /**
   * Name of the site that appears next to the logo
   */
  siteTitle?: string;
  /**
     A `testId` prop is provided for specified elements,
     which is a unique string that appears as a data attribute `data-testid` in the rendered code,
     serving as a hook for automated tests.

     Will set these elements when defined:

     - Root element of the component - `{testId}-container`
     - Product logo shown at large screen sizes - `{testId}-logo`
     - Product icon shown at small screen sizes - `{testId}-icon`
     - Site title - `{testId}-site-title`
     */
  testId?: string;
}

export declare const generateTheme: (
  themeColors: GenerateThemeArgs,
) => NavigationTheme;

export declare type GenerateThemeArgs = {
  /**
   * Name of the theme.
   * If you pass in "atlassian" will return the default atlassian theme and not
   * use any of the colors you pass in.
   */
  name?: string;
  /**
   * Main background color of the horizontal navigation bar.
   */
  backgroundColor: string;
  /**
   * Highlight color for the navigation actions.
   */
  highlightColor: string;
};

export declare const Help: React_2.ForwardRefExoticComponent<
  BaseIconButtonProps & {
    badge?: React_2.ComponentType<{}> | undefined;
  } & React_2.RefAttributes<any>
>;

export declare type HelpProps = BaseIconButtonProps & {
  /**
   * Component to be used for the badge.
   * Generally you'll want to use `NotificationIndicator` from [`@atlaskit/notification-indicator`](/packages/notifications/notification-indicator).
   */
  badge?: ComponentType<{}>;
};

export declare const HORIZONTAL_GLOBAL_NAV_HEIGHT = 56;

export declare const IconButton: React_2.ForwardRefExoticComponent<
  BaseIconButtonProps & {
    icon: React_2.ReactChild | undefined;
    theme?:
      | ((
          current: (props: ThemeProps) => ThemeTokens,
          props: ThemeProps,
        ) => ThemeTokens)
      | undefined;
  } & React_2.RefAttributes<HTMLElement>
>;

export declare type IconButtonCSS = ButtonCSSContext;

export declare type IconButtonProps = BaseIconButtonProps & {
  /**
   * Icon for the button.
   */
  icon: CustomThemeButtonProps['iconBefore'];
  /**
   * Theme for the icon button.
   */
  theme?: CustomThemeButtonProps['theme'];
};

declare type LogoStyleProps = {
  iconGradientStart?: string;
  iconGradientStop?: string;
  iconColor?: string;
  textColor?: string;
};

export declare type Mode = {
  create: CreateCSS;
  iconButton: IconButtonCSS;
  navigation: NavigationCSS;
  primaryButton: PrimaryButtonCSS;
  productHome: ProductHomeCSS;
  search: SearchCSS;
  skeleton: SkeletonCSS;
};

export declare type NavigationCSS = CSSProperties;

export declare type NavigationTheme = {
  mode: Mode;
};

export declare const Notifications: React_2.ForwardRefExoticComponent<
  BaseIconButtonProps & {
    badge: React_2.ComponentType<{}>;
  } & React_2.RefAttributes<any>
>;

export declare type NotificationsProps = BaseIconButtonProps & {
  /**
   * Component to be used for the badge.
   * Generally you'll want to use `NotificationIndicator` from [`@atlaskit/notification-indicator`](/packages/notifications/notification-indicator).
   */
  badge: ComponentType<{}>;
};

export declare const PrimaryButton: ForwardRefExoticComponent<
  Omit<CustomThemeButtonProps_2, 'appearance' | 'onClick'> & {
    component?:
      | ComponentType<AllHTMLAttributes<HTMLElement>>
      | ElementType<any>
      | undefined;
    isHighlighted?: boolean | undefined;
    testId?: string | undefined;
    tooltip?: ReactNode;
    onClick?:
      | ((
          event: MouseEvent_2<HTMLElement, MouseEvent>,
          analyticsEvent: any,
        ) => void)
      | undefined;
  } & RefAttributes<HTMLElement>
>;

export declare type PrimaryButtonCSS = ButtonCSSContext;

export declare type PrimaryButtonProps = Omit<
  CustomThemeButtonProps,
  'appearance' | 'onClick'
> & {
  /**
     Allows for overriding the component used to render the button.

     This is primarily intended for compatibility with custom
     routing libraries when using the `href` prop.

     For further usage information, refer to the [documentation for button](https://atlassian.design/components/button/code).

     @example
     ```tsx
     <Settings
     component={CustomRouterLink}
     href="/path/to/url"
     />
     ```
     */
  component?: ComponentType<AllHTMLAttributes<HTMLElement>> | ElementType<any>;
  /**
   * Will set the appearance of the button to look highlighted.
   */
  isHighlighted?: boolean;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Optional text to show when the button is focused or hovered.
   */
  tooltip?: React.ReactNode;
  /**
   * On click handler.
   * See @atlaskit/analytics-next for analyticsEvent type information
   */
  onClick?: (event: React.MouseEvent<HTMLElement>, analyticsEvent: any) => void;
};

export declare const PrimaryDropdownButton: ForwardRefExoticComponent<
  Omit<PrimaryButtonProps, 'iconAfter'> & {
    isHighlighted?: boolean | undefined;
    testId?: string | undefined;
    tooltip?: ReactNode;
  } & RefAttributes<HTMLElement>
>;

export declare type PrimaryDropdownButtonProps = Omit<
  PrimaryButtonProps,
  'iconAfter'
> & {
  /**
   * Will set the appearance of the button to look highlighted.
   */
  isHighlighted?: boolean;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
  /**
   * Optional text to show when the button is focused or hovered.
   */
  tooltip?: React.ReactNode;
};

export declare const ProductHome: ({
  icon: Icon,
  logo: Logo,
  siteTitle,
  onClick,
  href,
  onMouseDown,
  testId,
  logoMaxWidth,
  ...rest
}: ProductHomeProps) => JSX.Element;

declare type ProductHomeCSS = CSSProperties & LogoStyleProps;

export declare interface ProductHomeProps {
  /**
   * The product icon.
   * Expected to be an Icon from the Atlaskit Logo package. Visible on smaller screen sizes
   */
  icon: ComponentType<Partial<LogoProps>>;
  /**
   * The product logo,
   * visible on larger screen sizes
   */
  logo: ComponentType<Partial<LogoProps>>;
  /**
   * Maximum width in pixel, that logo can acquire. Defaults to 260px.
   */
  logoMaxWidth?: number;
  /**
   * Optional onClick handler.
   */
  onClick?: (event: MouseEvent_2<HTMLElement>) => void;
  /**
   * Optional mouseDown handler.
   */
  onMouseDown?: (event: MouseEvent_2<HTMLElement>) => void;
  /**
   * Href to be passed to product home.
   * Will add an interactive look and feel when defined.
   */
  href?: string;
  /**
   * Name of the site that appears next to the logo.
   */
  siteTitle?: string;
  /**
     A `testId` prop is provided for specified elements,
     which is a unique string that appears as a data attribute `data-testid` in the rendered code,
     serving as a hook for automated tests.

     Will set these elements when defined:

     - Root element of the component - `{testId}-container`
     - Product logo shown at large screen sizes - `{testId}-logo`
     - Product icon shown at small screen sizes - `{testId}-icon`
     - Site title - `{testId}-site-title`
     */
  testId?: string;
}

export declare const Profile: ForwardRefExoticComponent<
  BaseIconButtonProps & {
    icon: ReactChild | undefined;
    theme?:
      | ((
          current: (props: ThemeProps_2) => ThemeTokens_2,
          props: ThemeProps_2,
        ) => ThemeTokens_2)
      | undefined;
  } & RefAttributes<HTMLElement>
>;

export declare type ProfileProps = IconButtonProps;

export declare const Search: (props: SearchProps) => JSX.Element;

export declare type SearchCSS = {
  default: CSSProperties;
  focus: CSSObject;
  hover: CSSObject;
};

export declare type SearchProps = BaseIconButtonProps & {
  /**
   * Placeholder text for the search textbox.
   */
  placeholder: string;
  /**
   * Used to describe the search icon and text field for users viewing the
   * page with a screen reader
   */
  label: string;
  /**
   * Value of search field.
   */
  value?: string;
};

export declare const Settings: React_2.ForwardRefExoticComponent<
  BaseIconButtonProps & React_2.RefAttributes<any>
>;

export declare type SettingsProps = BaseIconButtonProps;

export declare const SignIn: (props: SignInProps) => JSX.Element;

export declare type SignInProps = BaseIconButtonProps;

export declare type SkeletonCSS = CSSObject & {
  backgroundColor: string;
  opacity: number;
};

export declare const ThemeProvider: Provider<NavigationTheme>;

export declare const useOverflowStatus: () => {
  isVisible: boolean;
  openOverflowMenu: () => void;
  closeOverflowMenu: () => void;
};

export {};
````