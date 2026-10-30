/**
 * Restricts which focusable elements count. It is called for each focusable
 * element in `container`. Return `true` to include the element, or `false` to
 * skip it.
 */
export type TFocusableFilter = (element: HTMLElement, container: HTMLElement) => boolean;
