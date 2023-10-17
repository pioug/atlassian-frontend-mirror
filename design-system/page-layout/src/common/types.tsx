import { ElementType, ReactElement, ReactNode } from 'react';

import { ResizeButtonProps } from '../components/resize-control/types';
import { LeftSidebarState } from '../controllers/sidebar-resize-context';

interface SlotProps {
  /**
   * Sets positon to fixed.
   */
  isFixed?: boolean;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests .
   */
  testId?: string;
  /**
   * React Children!
   */
  children: ReactNode;
  /* HTML id attribute. It also used as a target for skip links to land on. If missing, skip link for that Slot will not be generated */
  id?: string;
  /* Title of the skip link for the Slot.  If missing, skip link for that Slot will not be generated */
  skipLinkTitle?: string;
}

export interface SlotHeightProps extends SlotProps {
  /**
   * It save height in local storage.
   */
  shouldPersistHeight?: boolean;
  /**
   * Height!
   */
  height?: number;
}

export interface SlotWidthProps extends SlotProps {
  /**
   * It save width in local storage.
   */
  shouldPersistWidth?: boolean;
  /**
   * Width!
   */
  width?: number;
}

export interface LeftSidebarProps extends SlotWidthProps {
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * The `aria-valuetext` allows users relying on assistive technologies,
   * particularly screen readers, to determine the purpose of the slider.
   * The default value is "Width".
   * The aria-valuenow property is automatically appended to the valueTextLabel.
   * For Example, valueTextLabel="Width" will render aria-valuetext="Width 62%”.
   */
  valueTextLabel?: string;

  /**
   * You can override prop(s) for the mentioned component(s).
   */
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  overrides?: {
    ResizeButton?: {
      render?: (
        Component: ElementType<ResizeButtonProps>,
        props: ResizeButtonProps,
      ) => ReactElement;
    };
  };
  /**
   * Display label for grab area/slider to resize the left side bar. This will be rendered through assistive technologies.
   */
  resizeGrabAreaLabel?: string;
  /**
   * Display label for expand/collapse button for the left sidebar.
   */
  resizeButtonLabel?: string;
  /**
   * Called when left-sidebar is collapsed.
   */
  onCollapse?: () => void;
  /**
   * Called when left-sidebar is expanded.
   */
  onExpand?: () => void;
  /**
   * Called when left-sidebar resize starts using mouse or touch.
   */
  onResizeStart?: (leftSidebarState: LeftSidebarState) => void;
  /**
   * Called when left-sidebar resize ends using mouse or touch.
   */
  onResizeEnd?: (leftSidebarState: LeftSidebarState) => void;
  /**
   * Called when left-sidebar is collapsed and mouse leaves the area.
   */
  onFlyoutCollapse?: () => void;
  /**
   * Called after flyout delay when left-sidebar is collapsed and mouse enters the area.
   */
  onFlyoutExpand?: () => void;
  /**
   * Controls whether the LeftSidebar mounts in a collapsed state, this will override the setting in localStorage
   */
  collapsedState?: 'collapsed' | 'expanded';
  /**
   * Controls the width when LeftSidebar mounts, this will override the setting in localStorage
   */
  width?: number;
}

export type SidebarResizeControllerProps = {
  /**
   * React children!
   */
  children: ReactNode;
  /**
   * Called when left-sidebar expanded.
   */
  onLeftSidebarExpand?: (leftSidebarState: LeftSidebarState) => void;
  /**
   * Called when left-sidebar collapsed.
   */
  onLeftSidebarCollapse?: (leftSidebarState: LeftSidebarState) => void;
};

export type DimensionNames =
  | 'leftPanelWidth'
  | 'bannerHeight'
  | 'topNavigationHeight'
  | 'leftSidebarWidth'
  | 'leftSidebarFlyoutWidth'
  | 'rightSidebarWidth'
  | 'rightPanelWidth';

export type Dimensions = Partial<Record<DimensionNames, number>>;

export interface PageLayoutProps extends SidebarResizeControllerProps {
  /* This prop is used to label the skip links container. Defaults to "Skip to:" */
  skipLinksLabel?: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
}

export type { LeftSidebarState } from '../controllers/sidebar-resize-context';
