import { type ButtonHTMLAttributes, type ElementType, type ReactElement } from 'react';

import { type LeftSidebarState } from '../../controllers/sidebar-resize-context';

export type ResizeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLeftSidebarCollapsed: boolean;
  label: string;
  testId?: string;
};

export type ResizeControlProps = {
  testId?: string;
  // eslint-disable-next-line @repo/internal/react/consistent-props-definitions
  overrides?: {
    ResizeButton?: {
      render?: (
        Component: ElementType<ResizeButtonProps>,
        props: ResizeButtonProps,
      ) => ReactElement;
    };
  };
  valueTextLabel?: string;
  resizeGrabAreaLabel?: string;
  resizeButtonLabel?: string;
  onCollapse?: (leftSidebarState: LeftSidebarState) => void;
  onExpand?: (leftSidebarState: LeftSidebarState) => void;
  onResizeStart?: (leftSidebarState: LeftSidebarState) => void;
  onResizeEnd?: (leftSidebarState: LeftSidebarState) => void;
  onFlyoutCollapse?: () => void;
  onFlyoutExpand?: () => void;
};
