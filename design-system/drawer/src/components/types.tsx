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
  /** A unique hook to be used for testing */
  testId?: string;
  /** The content of the drawer */
  children?: ReactNode;
  /** Icon to be rendered in your drawer as a component, if available */
  icon?: ComponentType<any>;
  /** Available drawer sizes */
  width?: DrawerWidth;
  /** A callback function that will be called when the drawer has finished its opening transition. */
  onOpenComplete?: (node: HTMLElement) => void;
  /** A callback function that will be called when the drawer has finished its close transition. */
  onCloseComplete?: (node: HTMLElement) => void;
  /** Boolean that controls if drawer should be retained/discarded */
  shouldUnmountOnExit?: boolean;
  /**
   * A prop for adding targeted customisations to the Drawer component
   * For a detailed explanation of how to use this prop,
   * please see the overrides section of the @atlaskit/drawer documentation.
   */
  overrides?: OverridesType;
}

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

export type OverridesType = {
  Sidebar?: {
    component?: React.ComponentType<SidebarProps>;
    cssFn?: (defaultStyles: CSSObject) => CSSObject;
  };
  Content?: {
    component?: React.ComponentType<ContentProps>;
    cssFn?: (defaultStyles: CSSObject) => CSSObject;
  };
};

export type DrawerPrimitiveDefaults = Pick<DefaultsType, 'Sidebar' | 'Content'>;
export type DrawerPrimitiveOverrides = Pick<
  OverridesType,
  'Sidebar' | 'Content'
>;

export interface SidebarProps extends React.HTMLProps<HTMLDivElement> {
  cssFn: (defaultStyles: CSSObject) => CSSObject;
}

export type SidebarCSSProps = Omit<SidebarProps, 'cssFn'>;

export interface ContentProps extends React.HTMLProps<HTMLDivElement> {
  cssFn: (defaultStyles: CSSObject) => CSSObject;
}

export type ContentCSSProps = Omit<ContentProps, 'cssFn'>;

export interface DrawerPrimitiveProps extends BaseProps {
  in: boolean;
  onClose: (event: SyntheticEvent<HTMLElement>) => void;
}

export type DrawerProps = BaseProps &
  FocusLockProps &
  WithAnalyticsEventsProps & {
    /**
      Callback function that will be called when the drawer is displayed and `keydown` event is triggered.
    */
    onKeyDown?: (event: SyntheticEvent) => void;
    /**
    Callback function to be called when the drawer will be closed.
  */
    onClose?: (event: SyntheticEvent<HTMLElement>, analyticsEvent: any) => void;
    /** Controls if the drawer is open or close */
    isOpen: boolean;
  };

export interface FocusLockProps {
  /**
    Boolean indicating whether to focus on the first tabbable element inside the focus lock.
  */
  autoFocusFirstElem?: boolean | (() => HTMLElement | null);
  /**
    Content inside the focus lock.
  */
  children?: ReactNode;
  /**
    Whether the focus lock is active or not.
  */
  isFocusLockEnabled?: boolean;
  /**
    Whether to return the focus to the previous active element on closing the drawer
  */
  shouldReturnFocus?: boolean;
}

/**
  Type of keyboard event that triggers which key will should close the drawer.
*/
export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
