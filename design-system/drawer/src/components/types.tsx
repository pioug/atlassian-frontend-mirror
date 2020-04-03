import { ComponentType, SyntheticEvent, ReactNode } from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { CSSObject } from '@emotion/core';

export type Widths = {
  extended: string;
  full: string;
  medium: number;
  narrow: number;
  wide: number;
};
export type DrawerWidth = 'extended' | 'full' | 'medium' | 'narrow' | 'wide';

export interface BaseProps {
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
   A prop for adding targeted customisations to the Drawer component
   For a detailed explanation of how to use this prop,
   please see the overrides section of the @atlaskit/drawer documentation.
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

interface DnDType {
  draggableProps: Object;
  dragHandleProps: Object | null;
  innerRef: (ref: HTMLElement | null) => void;
  placeholder?: Node;
}

export interface ItemProps {
  /** Whether the Item should attempt to gain browser focus when mounted */
  autoFocus?: boolean;
  /** Main content to be shown inside the item. */
  children?: ReactNode;
  /** Secondary text to be shown underneath the main content. */
  description?: string;
  /** Drag and drop props provided by react-beautiful-dnd. Please do not use
   * this unless using react-beautiful-dnd */
  dnd?: DnDType;
  /** Content to be shown after the main content. Shown to the right of content (or to the left
   * in RTL mode). */
  elemAfter?: ReactNode;
  /** Content to be shown before the main content. Shown to the left of content (or to the right
   * in RTL mode). */
  elemBefore?: Node;
  /** Link that the user will be redirected to when the item is clicked. If omitted, a
   *  non-hyperlink component will be rendered. */
  href?: string;
  /** Causes the item to be rendered with reduced spacing. */
  isCompact?: boolean;
  /** Causes the item to appear in a disabled state and click behaviours will not be triggered. */
  isDisabled?: boolean;
  /** Used to apply correct dragging styles when also using react-beautiful-dnd. */
  isDragging?: boolean;
  /** Causes the item to still be rendered, but with `display: none` applied. */
  isHidden?: boolean;
  /** Causes the item to appear with a persistent selected background state. */
  isSelected?: boolean;
  /** Function to be called when the item is clicked, Receives the MouseEvent. */
  onClick?: Function;
  /** Function to be called when the item is pressed with a keyboard,
   * Receives the KeyboardEvent. */
  onKeyDown?: Function;
  /** Standard onmouseenter event */
  onMouseEnter?: Function;
  /** Standard onmouseleave event */
  onMouseLeave?: Function;
  /** Allows the role attribute of the item to be altered from it's default of
   *  `role="button"` */
  role?: string;
  /** Target frame for item `href` link to be aimed at. */
  target?: string;
  /** Standard browser title to be displayed on the item when hovered. */
  title?: string;
}

/**
  Type of keyboard event that triggers which key will should close the drawer.
*/
export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
