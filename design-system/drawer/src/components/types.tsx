import { ComponentType, ReactElement, ReactNode, SyntheticEvent } from 'react';

import { CSSObject } from '@emotion/react';

import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type Widths = {
  extended: { width: string };
  full: { width: string };
  medium: { width: number };
  narrow: { width: number };
  wide: { width: number };
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
   * Use this to render an icon for the drawer close/back control, if it's available.
   */
  icon?: ComponentType<any>;
  /**
   * Provides an accessible name for the close/back control of the drawer. Default is "Close drawer".
   */
  closeLabel?: string;
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

export interface DrawerLabel {
  /**
   * Refers to an aria-label attribute. Sets an accessible name for drawer wrapper to announce it to users of assistive technology.
   * Usage of either this, or the `titleId` attribute is strongly recommended.
   */
  label?: string;
  /**
   * Id referenced by the drawer wrapper's aria-labelledby attribute. This id should be assigned to the drawer title element.
   * Usage of either this, or the `label` attribute is strongly recommended.
   */
  titleId?: string;
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

export interface DrawerPrimitiveProps
  extends BaseProps,
    FocusLockSettings,
    DrawerLabel {
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  in: boolean;
  onClose: (event: SyntheticEvent<HTMLElement>) => void;
}

export type DrawerProps = BaseProps &
  FocusLockSettings &
  WithAnalyticsEventsProps &
  DrawerLabel & {
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
    /**
     * Z-index that the popup should be displayed in.
     * This is passed to the portal component.
     * Defaults to `unset`.
     */
    zIndex?: number;
  };

export interface FocusLockSettings {
  /**
   * Controls whether to focus the first tabbable element inside the focus lock. Set to `true` by default.
   */
  autoFocusFirstElem?: boolean | (() => HTMLElement | null);
  /**
   * Whether the focus lock is active or not.
   */
  isFocusLockEnabled?: boolean;
  /**
   * Controls whether to return the focus to the previous active element on closing the drawer. Set to `true` by default.
   */
  shouldReturnFocus?: boolean;
}

export interface FocusLockProps extends FocusLockSettings {
  /**
   * Content inside the focus lock.
   * Must strictly be a ReactElement and it *must* be implemented to take a `ref` passed from `react-scrollock` to enable Touch Scrolling.
   */
  children?: ReactElement;
}

/**
 * Type of keyboard event that triggers which key will should close the drawer.
 */
export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
