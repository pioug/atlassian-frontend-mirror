import { ReactNode } from 'react';

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

export type DimensionNames =
  | 'leftPanelWidth'
  | 'bannerHeight'
  | 'topNavigationHeight'
  | 'leftSidebarWidth'
  | 'rightSidebarWidth'
  | 'rightPanelWidth';

export type Dimensions = Partial<Record<DimensionNames, number>>;
