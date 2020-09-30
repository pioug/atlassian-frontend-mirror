import { ButtonHTMLAttributes, ElementType, ReactElement } from 'react';

import { LeftSidebarState } from '../../controllers/sidebar-resize-context';

export type ResizeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLeftSidebarCollapsed: boolean;
  label: string;
  testId?: string;
};

export type ResizeControlProps = {
  testId?: string;
  overrides?: {
    ResizeButton?: {
      render?: (
        Component: ElementType<ResizeButtonProps>,
        props: ResizeButtonProps,
      ) => ReactElement;
    };
  };
  resizeGrabAreaLabel?: string;
  resizeButtonLabel?: string;
  onCollapse?: (leftSidebarState: LeftSidebarState) => void;
  onExpand?: (leftSidebarState: LeftSidebarState) => void;
  onResizeStart?: (leftSidebarState: LeftSidebarState) => void;
  onResizeEnd?: (leftSidebarState: LeftSidebarState) => void;
  onFlyoutCollapse?: () => void;
  onFlyoutExpand?: () => void;
  leftSidebarState: LeftSidebarState;
  setLeftSidebarState: (leftSidebarState: LeftSidebarState) => void;
};
