import { DIMENSIONS } from './constants';
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

export type Dimensions = { [dimension in typeof DIMENSIONS[number]]: number };
