import type { CSSProperties } from 'react';

import {
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

/**
 * Restricted set of inline styles to be applied to the primitive.
 * Should be avoided where possible, in favor of the pre-defined props and values on the primitive itself.
 * Tokens should be used where possible.
 */
export type CustomStyles = Pick<
  CSSProperties,
  | 'flexBasis'
  | 'flex'
  | 'width'
  | 'height'
  | 'minWidth'
  | 'maxWidth'
  | 'minHeight'
  | 'maxHeight'
  | 'insetInlineStart'
  | 'insetInlineEnd'
  | 'insetBlockStart'
  | 'float'
  | 'margin'
  | 'marginInlineStart'
  | 'marginInlineEnd'
  | 'marginBlockStart'
  | 'marginBlockEnd'
  | 'marginInline'
  | 'marginBlock'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop'
  | 'paddingBottom'
>;

export interface BasePrimitiveProps {
  /**
   * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Inline styles to be applied to the primitive.
   * Marked as "unsafe" because any CSS properties can be provided here without any extra control or validation, including those that would be better managed by the primitive itself via props.
   * Effectively equivalent to the standard `style` prop but marked with a special name.
   * Used only internally.
   */
  UNSAFE_style?: CSSProperties;
}

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

  customStyles?: CustomStyles;
};
