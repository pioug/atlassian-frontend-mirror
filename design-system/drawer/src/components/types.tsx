import { ComponentType, ReactNode, SyntheticEvent } from 'react';

import { CSSObject } from '@emotion/core';

import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type Widths = {
  extended: string;
  full: string;
  medium: number;
  narrow: number;
  wide: number;
};

export type DrawerWidth = 'extended' | 'full' | 'medium' | 'narrow' | 'wide';

export interface BaseProps {
  /**
   * A unique hook to be used for testing.
   */
  testId?: string;
  /**
   * The content of the drawer.
   */
  children?: ReactNode;
  /**
   * Icon to be rendered in your drawer as a component, if available.
   */
  icon?: ComponentType<any>;
  /**
   * Available drawer sizes.
   */
  width?: DrawerWidth;
  /**
   * A callback function that will be called when the drawer has finished its opening transition.
   */
  onOpenComplete?: (node: HTMLElement | null) => void;
  /**
   * A callback function that will be called when the drawer has finished its close transition.
   */
  onCloseComplete?: (node: HTMLElement | null) => void;
  /**
   * @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release.
   * Boolean that controls if drawer should be retained/discarded
   */
  shouldUnmountOnExit?: boolean;
  /**
   * Override drawer components.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  overrides?: OverridesType;
}

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type DefaultsType = {
  Sidebar: {
    component: React.ComponentType<SidebarProps>;
    cssFn: (defaultStyles: CSSObject) => CSSObject;
  };
  Content: {
    component: React.ComponentType<ContentProps>;
    cssFn: (defaultStyles: CSSObject) => CSSObject;
  };
};

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type OverridesType = {
  Sidebar?: {
    component?: React.ComponentType<SidebarProps>;
    /**
     * @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-2673 for more information.
     */
    cssFn?: (defaultStyles: CSSObject) => CSSObject;
  };
  Content?: {
    component?: React.ComponentType<ContentProps>;
    /**
     * @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-2673 for more information.
     */
    cssFn?: (defaultStyles: CSSObject) => CSSObject;
  };
};

export type DrawerPrimitiveDefaults = Pick<DefaultsType, 'Sidebar' | 'Content'>;
export type DrawerPrimitiveOverrides = Pick<
  OverridesType,
  'Sidebar' | 'Content'
>;

export interface SidebarProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-2673 for more information.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  cssFn: (defaultStyles: CSSObject) => CSSObject;
}

export type SidebarCSSProps = Omit<SidebarProps, 'cssFn'>;

export interface ContentProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * @deprecated Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-2673 for more information.
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  cssFn: (defaultStyles: CSSObject) => CSSObject;
}

export type ContentCSSProps = Omit<ContentProps, 'cssFn'>;

export interface DrawerPrimitiveProps extends BaseProps {
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  in: boolean;
  onClose: (event: SyntheticEvent<HTMLElement>) => void;
}

export type DrawerProps = BaseProps &
  FocusLockProps &
  WithAnalyticsEventsProps & {
    /**
     * Callback function called while the drawer is displayed and `keydown` event is triggered.
     */
    onKeyDown?: (event: SyntheticEvent) => void;
    /**
     * Callback function called when the drawer is closed.
     */
    onClose?: (event: SyntheticEvent<HTMLElement>, analyticsEvent: any) => void;
    /**
     * Controls if the drawer is open or closed.
     */
    isOpen: boolean;
  };

export interface FocusLockProps {
  /**
   * Controls whether to focus the first tabbable element inside the focus lock.
   */
  autoFocusFirstElem?: boolean | (() => HTMLElement | null);
  /**
   * Content inside the focus lock.
   */
  children?: ReactNode;
  /**
   *  Whether the focus lock is active or not.
   */
  isFocusLockEnabled?: boolean;
  /**
   * Whether to return the focus to the previous active element on closing the drawer.
   */
  shouldReturnFocus?: boolean;
}

/**
 * Type of keyboard event that triggers which key will should close the drawer.
 */
export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
