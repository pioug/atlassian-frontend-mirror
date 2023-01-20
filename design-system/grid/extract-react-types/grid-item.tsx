import { ReactNode } from 'react';

type ResponsiveColumn = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
};

export type GridItemProps = {
  /**
   * A test id for automated testing.
   */
  testId?: string;
  /**
   * Content of the Grid item.
   */
  children?: ReactNode;
  /**
   * Offset in columns from the start of the row.
   */
  offset?: ResponsiveColumn;
  /**
   * Number of columns the item is meant to span.
   */
  span?: ResponsiveColumn;
};

export default function GridItem(_: GridItemProps) {}
