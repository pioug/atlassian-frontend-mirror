import type { CSSProperties } from 'react';

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
