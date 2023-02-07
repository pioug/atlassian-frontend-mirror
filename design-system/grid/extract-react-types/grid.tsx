import { ReactNode } from 'react';

export type GridProps = {
  /**
   * A test id for automated testing
   */
  testId?: string;
  /**
   * If set, will restrict the max-width of the Grid to pre-defined values.
   */
  maxWidth?: 'wide' | 'narrow';
  /**
   * The grid items.
   */
  children?: ReactNode;
};

export default function Grid(_: GridProps) {}
