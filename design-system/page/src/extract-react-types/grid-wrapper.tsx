import type { BaseGridProps } from '../types';

type GridSpacing = 'cosy' | 'comfortable' | 'compact';

type GridProps = BaseGridProps & {
  /**
   * The amount of space between each grid column. Refer to
   * [this example](/packages/design-system/page/example/spacing-example)
   * for a visualization of the different spacing options.
   */
  spacing?: GridSpacing;
  /**
   * The total number of columns available in each row of the grid.
   */
  columns?: number;
};

export default function _(__: GridProps) {
  return null;
}
