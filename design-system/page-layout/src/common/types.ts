import { ElementType, ReactElement, ReactNode } from 'react';

import { ResizeButtonProps } from '../components/resize-control/types';

interface SlotProps {
  isFixed?: boolean;
  testId?: string;
  children: ReactNode;
}

export interface SlotHeightProps extends SlotProps {
  shouldPersistHeight?: boolean;
  height?: number;
}

export interface SlotWidthProps extends SlotProps {
  shouldPersistWidth?: boolean;
  width?: number;
}

export interface LeftSidebarProps extends SlotWidthProps {
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
  onFlyoutCollapse?: () => void;
  onFlyoutExpand?: () => void;
}

export type DimensionNames =
  | 'leftPanelWidth'
  | 'bannerHeight'
  | 'topNavigationHeight'
  | 'leftSidebarWidth'
  | 'rightSidebarWidth'
  | 'rightPanelWidth';

export type Dimensions = Partial<Record<DimensionNames, number>>;
