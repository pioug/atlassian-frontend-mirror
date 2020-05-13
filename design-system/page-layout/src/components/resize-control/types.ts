import { ButtonHTMLAttributes, ElementType, ReactElement } from 'react';

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
  resizeButtonLabel?: string;
  resetFlyout: () => void;
  onCollapse?: () => void;
  onExpand?: () => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  onFlyoutCollapse?: () => void;
  onFlyoutExpand?: () => void;
};
