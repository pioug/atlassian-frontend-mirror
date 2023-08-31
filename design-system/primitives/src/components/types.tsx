import type { CSSProperties } from 'react';

import type { XCSS } from '../xcss/xcss';

export type BasePrimitiveProps = {
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Inline styles to be applied to the primitive. Only apply as a last resort, or where
   * styles cannot otherwise be calculated outside of the runtime of the component they're applied.
   */
  style?: CSSProperties;

  /**
   * Apply a subset of permitted styles, powered by Atlassian Design System tokens.
   */
  xcss?: XCSS | Array<XCSS | false | undefined>;

  /**
   * Accessible role
   */
  role?: string;
};

export type AlignInline = 'start' | 'center' | 'end' | 'stretch';
export type AlignBlock = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type Spread = 'space-between';
export type Grow = 'hug' | 'fill';
