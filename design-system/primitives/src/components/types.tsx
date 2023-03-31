import type { CSSProperties } from 'react';

import type { SafeCSS } from '../internal/xcss';

import type {
  BorderWidth,
  Display,
  Padding,
  PaddingBlock,
  PaddingBlockEnd,
  PaddingBlockStart,
  PaddingInline,
  PaddingInlineEnd,
  PaddingInlineStart,
} from './internal/base-box.partial';

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
   * Defines border width.
   */
  borderWidth?: BorderWidth;

  /**
   * Defines display type and layout. Defaults to `block`.
   */
  display?: Display;

  /**
   * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
   *
   * @see paddingBlock
   * @see paddingInline
   */
  padding?: Padding;
  /**
   * Tokens representing CSS shorthand `paddingBlock`.
   *
   * @see paddingBlockStart
   * @see paddingBlockEnd
   */
  paddingBlock?: PaddingBlock;
  /**
   * Tokens representing CSS `paddingBlockStart`.
   */
  paddingBlockStart?: PaddingBlockStart;
  /**
   * Tokens representing CSS `paddingBlockEnd`.
   */
  paddingBlockEnd?: PaddingBlockEnd;
  /**
   * Tokens representing CSS shorthand `paddingInline`.
   *
   * @see paddingInlineStart
   * @see paddingInlineEnd
   */
  paddingInline?: PaddingInline;
  /**
   * Tokens representing CSS `paddingInlineStart`.
   */
  paddingInlineStart?: PaddingInlineStart;
  /**
   * Tokens representing CSS `paddingInlineEnd`.
   */
  paddingInlineEnd?: PaddingInlineEnd;
  /**
   * Safe subset of styles that can be applied as a classname.
   */
  xcss?: SafeCSS;
};
