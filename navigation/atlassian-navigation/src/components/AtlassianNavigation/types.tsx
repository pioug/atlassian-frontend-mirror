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
   */
  primaryItems: ReactNodeArray;

  /**
   * Slot for the app switcher.
   */
  renderAppSwitcher?: React.ComponentType<{}>;

  /**
   * Slot for the create call to action button.
   */
  renderCreate?: React.ComponentType<{}>;

  /**
   * Slot for the help button.
   */
  renderHelp?: React.ComponentType<{}>;

  /**
   * Slot for the notification button.
   */
  renderNotifications?: React.ComponentType<{}>;

  /**
   * Slot for the product home logo which renders a product's brand.
   */
  renderProductHome: React.ComponentType<{}>;

  /**
   * Slot for the profile button.
   */
  renderProfile?: React.ComponentType<{}>;

  /**
   * Slot for the search textbox.
   */
  renderSearch?: React.ComponentType<{}>;

  /**
   * Slot for the sign in button.
   */
  renderSignIn?: React.ComponentType<{}>;

  /**
   * Slot for the settings button.
   */
  renderSettings?: React.ComponentType<{}>;

  /**
   * Label used for the overflow menu button tooltip.
   */
  moreLabel?: ReactNode;

  /**
   * __Slow and discouraged custom theme API.__
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme?: NavigationTheme;

  // eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
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

export interface NavigationSkeletonProps {
  /**
   * How many skeleton primary items to display.
   */
  primaryItemsCount?: number;

  /**
   * How many skeleton secondary items to display.
   */
  secondaryItemsCount?: number;

  /**
   * Whether to display a skeleton for the site name.
   */
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  showSiteName?: boolean;

  /**
   * Whether to display a skeleton for the search bar.
   */
  shouldShowSearch?: boolean;

  /**
   * __Slow and discouraged custom theme API.__
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  theme?: NavigationTheme;

  // eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
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
