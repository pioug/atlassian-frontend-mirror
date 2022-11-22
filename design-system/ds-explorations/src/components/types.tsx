import type { CSSProperties } from 'react';

export interface BasePrimitiveProps {
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Inline styles to be applied to the primitive.
   * Marked as "unsafe" because any CSS properties can be provided here without any extra control or validation, including those that would be better managed by the primitive itself via props.
   * Effectively equivalent to the standard `style` prop but marked with a special name so we can rationalise its usage IN THE FUTURE.
   */
  UNSAFE_style?: CSSProperties;
}
