import type { CSSProperties } from 'react';

import { type BoxXCSS } from '../xcss/xcss';

export type BasePrimitiveProps = {
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Inline styles to be applied to the primitive.
   */
  style?: CSSProperties;

  /**
   * Apply a subset of permitted styles, powered by Atlassian Design System tokens.
   */
  xcss?: BoxXCSS | BoxXCSS[];

  /**
   * Accessible role
   */
  role?: string;
};
