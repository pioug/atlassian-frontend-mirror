import React, { ReactNode, ReactNodeArray } from 'react';

import { NavigationTheme } from '../../theme';

export interface AtlassianNavigationProps {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen
   *  reader. Differentiates from other navigation components on a page.
   */
  label: string;
  /**
   * Slot for the primary actions.
   * Refer to [primary actions](atlassian-navigation/docs/primary-actions) docs for more information.
   */
  primaryItems: ReactNodeArray;

  /**
   * Slot for the app switcher.
   * Refer to [app switcher](atlassian-navigation/docs/app-switcher) docs for more information.
   */
  renderAppSwitcher?: React.ComponentType<{}>;

  /**
   * Slot for the create call to action button.
   * Refer to [create](atlassian-navigation/docs/create) docs for more information.
   */
  renderCreate?: React.ComponentType<{}>;

  /**
   * Slot for the help button.
   * Refer to [secondary actions](atlassian-navigation/docs/secondary-actions) docs for more information.
   */
  renderHelp?: React.ComponentType<{}>;

  /**
   * Slot for the notification button.
   * Refer to [secondary actions](atlassian-navigation/docs/secondary-actions) docs for more information.
   */
  renderNotifications?: React.ComponentType<{}>;

  /**
   * Slot for the product home logo,
   * this will render your product brand.
   * Refer to [product home](atlassian-navigation/docs/product home) docs for more information.
   */
  renderProductHome: React.ComponentType<{}>;

  /**
   * Slot for the profile button.
   * Refer to [secondary actions](atlassian-navigation/docs/secondary-actions) docs for more information.
   */
  renderProfile?: React.ComponentType<{}>;

  /**
   * Slot for the search textbox.
   * Refer to [secondary actions](atlassian-navigation/docs/secondary-actions) docs for more information.
   */
  renderSearch?: React.ComponentType<{}>;

  /**
   * Slot for the sign in button.
   * Refer to [secondary actions](atlassian-navigation/docs/secondary-actions) docs for more information.
   */
  renderSignIn?: React.ComponentType<{}>;

  /**
   * Slot for the settings button.
   * Refer to [secondary actions](atlassian-navigation/docs/secondary-actions) docs for more information.
   */
  renderSettings?: React.ComponentType<{}>;

  /**
   * Label used for the overflow menu button tooltip.
   * Refer to [overflow menu](atlassian-navigation/docs/overflow-menu) docs for more information.
   */
  moreLabel?: ReactNode;

  /**
   * Custom theme for the component.
   * Refer to [theming](atlassian-navigation/docs/theming) docs for more information.
   */
  theme?: NavigationTheme;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.

   * Will set these elements when defined:

   * - Header element - `{testId}-header`
   * - Primary actions container - `{testId}-primary-actions`
   * - Secondary actions container - `{testId}-secondary-actions`
   * - Overflow menu popup - `{testId}-overflow-menu-popup`
   * - Overflow menu button - `{testId}-overflow-menu-trigger`
   */
  testId?: string;
}

export interface NavigationSkeletonProps {
  primaryItemsCount?: number;
  secondaryItemsCount?: number;
  showSiteName?: boolean;
  shouldShowSearch?: boolean;
  theme?: NavigationTheme;
}
