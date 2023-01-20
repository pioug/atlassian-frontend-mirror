import { ReactNode } from 'react';

export type GridProps = {
  /**
   * A test id for automated testing
   */
  testId?: string;
  /**
   * If set to `fluid` the grid will fill all available whitespace.
   */
  width?: 'fluid' | 'wide' | 'narrow';
  /**
   * The grid items.
   */
  children?: ReactNode;
};

export default function Grid(_: GridProps) {}
