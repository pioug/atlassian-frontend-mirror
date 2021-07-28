import type { CSSProperties, ReactNode } from 'react';

type ThemeAppearance =
  | 'added'
  | 'default'
  | 'important'
  | 'primary'
  | 'primaryInverted'
  | 'removed';

export interface BadgeProps {
  /**
   * Affects the visual style of the badge.
   */
  appearance?: ThemeAppearance;

  /**
   * The value displayed within the badge. A `ReactNode` can be provided for
   * custom-formatted numbers, however, badge should only be used in cases where you want to represent
   * a number.
   * Use a [lozenge](/packages/design-system/lozenge) for non-numeric information.
   */
  children?: number | ReactNode;

  /**
   * The maximum value to display. Defaults to `99`. If the value is 100, and max is 50, "50+" will be displayed.
   * This value should be greater than 0.
   */
  max?: number;

  /**
   * Style customization to apply to the badge. Only `backgroundColor` and `color` are supported.
   */
  style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
}
