import {
  ButtonHTMLAttributes,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react';

interface SlotProps {
  isFixed?: boolean;
  testId?: string;
  children: ReactNode;
}

export interface SlotHeightProps extends SlotProps {
  shouldPersistHeight?: boolean;
  height?: number;
}

export type ResizeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLeftSidebarCollapsed: boolean;
  label: string;
  testId?: string;
};

export interface SlotWidthProps extends SlotProps {
  shouldPersistWidth?: boolean;
  width?: number;
}

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
  onCollapse?: () => void;
  onExpand?: () => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
};

export interface LeftSidebarProps extends SlotWidthProps, ResizeControlProps {}

export type DimensionNames =
  | 'leftPanelWidth'
  | 'bannerHeight'
  | 'topNavigationHeight'
  | 'leftSidebarWidth'
  | 'rightSidebarWidth'
  | 'rightPanelWidth';

export type Dimensions = Partial<Record<DimensionNames, number>>;
