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
};

// Some redeclaration needed until responsive props graduate to the public API
export type PublicBoxPropsBase = {
  /**
   * Safe subset of styles that can be applied as a classname.
   */
  xcss?: BoxXCSS | Array<BoxXCSS | false | undefined>;
};
