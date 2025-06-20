/**
 * A symbol to collapse the `elemBefore` slot.
 * This should be placed in the `elemBefore` prop of supported menu items.
 */
export const COLLAPSE_ELEM_BEFORE: unique symbol = Symbol('collapse-elem-before');
export type COLLAPSE_ELEM_BEFORE_TYPE = typeof COLLAPSE_ELEM_BEFORE;
